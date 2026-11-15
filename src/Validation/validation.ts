import { left, right } from '@funcio/Monads/Either/index.js'
import type { IEither } from '@funcio/@Types/index.js'

export type ValidationIssue = { path: string, message: string }
export type ValidationResult<T> = IEither.Either<ValidationIssue[], T>

export interface Schema<T> {
  parse: (value: unknown) => T
  safeParse: (value: unknown) => ValidationResult<T>
  parseAsync?: (value: unknown) => Promise<T>
  safeParseAsync?: (value: unknown) => Promise<ValidationResult<T>>
}

const ok = <T>(value: T): ValidationResult<T> => right<ValidationIssue[], T>(value)
const fail = <T>(issues: ValidationIssue[]): ValidationResult<T> => left<ValidationIssue[], T>(issues)

export type Infer<S extends Schema<unknown>> = S extends Schema<infer T> ? T : never
type OptionalObject<T> = { [K in keyof T as undefined extends T[K] ? never : K]: T[K] } &
{ [K in keyof T as undefined extends T[K] ? K : never]?: T[K] }

abstract class BaseSchema<T> implements Schema<T> {
  abstract safeParse (value: unknown): ValidationResult<T>

  async safeParseAsync (value: unknown): Promise<ValidationResult<T>> {
    return this.safeParse(value)
  }

  async parseAsync (value: unknown): Promise<T> {
    const result = await this.safeParseAsync(value)
    if (result.isLeft()) throw new Error((result.value as ValidationIssue[]).map((i) => i.path ? `${i.path}: ${i.message}` : i.message).join('; '))
    return result.value as T
  }

  transform<R>(fn: (value: T) => R): BaseSchema<R> {
    const apply = (result: ValidationResult<T>): ValidationResult<R> => {
      if (result.isLeft()) return fail(result.value as ValidationIssue[])
      try { return ok(fn(result.value as T)) } catch (error) { return fail([{ path: '', message: error instanceof Error ? error.message : String(error) }]) }
    }
    return new WrappedSchema((value) => apply(this.safeParse(value)), async (value) => apply(await this.safeParseAsync(value)))
  }

  transformAsync<R>(fn: (value: T) => Promise<R> | R): BaseSchema<R> {
    return new AsyncSchema(async (value) => {
      const result = await this.safeParseAsync(value)
      if (result.isLeft()) return fail(result.value as ValidationIssue[])
      try { return ok(await fn(result.value as T)) } catch (error) { return fail([{ path: '', message: error instanceof Error ? error.message : String(error) }]) }
    })
  }

  refineAsync (predicate: (value: T) => Promise<boolean> | boolean, message = 'Invalid value'): BaseSchema<T> {
    return new AsyncSchema(async (value) => {
      const result = await this.safeParseAsync(value)
      if (result.isLeft()) return result
      try { return await predicate(result.value as T) ? result : fail([{ path: '', message }]) } catch (error) {
        return fail([{ path: '', message: error instanceof Error ? error.message : String(error) }])
      }
    })
  }

  parse (value: unknown): T {
    const result = this.safeParse(value)
    if (result.isLeft()) {
      throw new Error((result.value as ValidationIssue[]).map((i) => i.path ? `${i.path}: ${i.message}` : i.message).join('; '))
    }
    return result.value as T
  }

  optional (): BaseSchema<T | undefined> {
    return new WrappedSchema((value) => value === undefined ? ok(undefined) : this.safeParse(value),
      async (value) => value === undefined ? ok(undefined) : await this.safeParseAsync(value))
  }

  nullable (): BaseSchema<T | null> {
    return new WrappedSchema((value) => value === null ? ok(null) : this.safeParse(value),
      async (value) => value === null ? ok(null) : await this.safeParseAsync(value))
  }

  default (fallback: Exclude<T, undefined>): BaseSchema<Exclude<T, undefined>> {
    return new WrappedSchema((value) => this.safeParse(value === undefined ? fallback : value) as ValidationResult<Exclude<T, undefined>>,
      async (value) => await this.safeParseAsync(value === undefined ? fallback : value) as ValidationResult<Exclude<T, undefined>>)
  }

  refine (predicate: (value: T) => boolean, message = 'Invalid value'): BaseSchema<T> {
    const check = (result: ValidationResult<T>): ValidationResult<T> => {
      if (result.isLeft()) return result
      return predicate(result.value as T) ? result : fail([{ path: '', message }])
    }
    return new WrappedSchema((value) => check(this.safeParse(value)), async (value) => check(await this.safeParseAsync(value)))
  }
}

class WrappedSchema<T> extends BaseSchema<T> {
  constructor (
    private readonly validate: (value: unknown) => ValidationResult<T>,
    private readonly validateAsync?: (value: unknown) => Promise<ValidationResult<T>>
  ) { super() }

  safeParse (value: unknown): ValidationResult<T> {
    return this.validate(value)
  }

  async safeParseAsync (value: unknown): Promise<ValidationResult<T>> {
    return this.validateAsync ? await this.validateAsync(value) : this.safeParse(value)
  }
}

class AsyncSchema<T> extends BaseSchema<T> {
  constructor (private readonly validate: (value: unknown) => Promise<ValidationResult<T>>) { super() }

  safeParse (_value: unknown): ValidationResult<T> {
    throw new Error('Async schema requires safeParseAsync() or parseAsync()')
  }

  async safeParseAsync (value: unknown): Promise<ValidationResult<T>> {
    return await this.validate(value)
  }
}

const parseAsync = async <T>(schema: Schema<T>, value: unknown): Promise<ValidationResult<T>> =>
  schema.safeParseAsync ? await schema.safeParseAsync(value) : schema.safeParse(value)

class StringSchema extends BaseSchema<string> {
  checks: Array<{ test: (v: string) => boolean, message: string }> = []

  min (n: number, message?: string): this {
    this.checks.push({ test: (v) => v.length >= n, message: message ?? `Must have at least ${n} characters` })
    return this
  }

  max (n: number, message?: string): this {
    this.checks.push({ test: (v) => v.length <= n, message: message ?? `Must have at most ${n} characters` })
    return this
  }

  email (message = 'Invalid email'): this {
    this.checks.push({ test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message })
    return this
  }

  regex (re: RegExp, message = 'Invalid format'): this {
    this.checks.push({ test: (v) => re.test(v), message })
    return this
  }

  parse (value: unknown): string {
    const res = this.safeParse(value)
    if (res.isLeft()) throw new Error((res.value as ValidationIssue[]).map((i) => i.message).join('; '))
    return res.value as string
  }

  safeParse (value: unknown): ValidationResult<string> {
    if (typeof value !== 'string') return fail([{ path: '', message: 'Expected string' }])
    const issues = this.checks.filter((c) => !c.test(value)).map((c) => ({ path: '', message: c.message }))
    return issues.length > 0 ? fail(issues) : ok(value)
  }
}

class NumberSchema extends BaseSchema<number> {
  checks: Array<{ test: (v: number) => boolean, message: string }> = []

  min (n: number, message?: string): this {
    this.checks.push({ test: (v) => v >= n, message: message ?? `Must be >= ${n}` })
    return this
  }

  max (n: number, message?: string): this {
    this.checks.push({ test: (v) => v <= n, message: message ?? `Must be <= ${n}` })
    return this
  }

  int (message = 'Must be an integer'): this {
    this.checks.push({ test: (v) => Number.isInteger(v), message })
    return this
  }

  positive (message = 'Must be positive'): this {
    this.checks.push({ test: (v) => v > 0, message })
    return this
  }

  parse (value: unknown): number {
    const res = this.safeParse(value)
    if (res.isLeft()) throw new Error((res.value as ValidationIssue[]).map((i) => i.message).join('; '))
    return res.value as number
  }

  safeParse (value: unknown): ValidationResult<number> {
    if (typeof value !== 'number' || Number.isNaN(value)) return fail([{ path: '', message: 'Expected number' }])
    const issues = this.checks.filter((c) => !c.test(value)).map((c) => ({ path: '', message: c.message }))
    return issues.length > 0 ? fail(issues) : ok(value)
  }
}

class ObjectSchema<T extends Record<string, unknown>> extends BaseSchema<OptionalObject<T>> {
  constructor (readonly shape: { [K in keyof T]: Schema<T[K]> }, private readonly unknownKeys: 'strip' | 'strict' | 'passthrough' = 'strip') { super() }

  strict (): ObjectSchema<T> { return new ObjectSchema(this.shape, 'strict') }
  strip (): ObjectSchema<T> { return new ObjectSchema(this.shape, 'strip') }
  passthrough (): ObjectSchema<T> { return new ObjectSchema(this.shape, 'passthrough') }

  private finish (input: Record<string, unknown>, out: Record<string, unknown>, issues: ValidationIssue[]): ValidationResult<OptionalObject<T>> {
    for (const key of Object.keys(input)) {
      if (Object.getOwnPropertyDescriptor(this.shape, key) !== undefined) continue
      if (this.unknownKeys === 'strict') issues.push({ path: key, message: 'Unknown key' })
      if (this.unknownKeys === 'passthrough') Object.defineProperty(out, key, { value: input[key], enumerable: true, writable: true, configurable: true })
    }
    return issues.length > 0 ? fail(issues) : ok(out as OptionalObject<T>)
  }

  async safeParseAsync (value: unknown): Promise<ValidationResult<OptionalObject<T>>> {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return fail([{ path: '', message: 'Expected object' }])
    const out: Record<string, unknown> = {}
    const issues: ValidationIssue[] = []
    for (const key of Object.keys(this.shape)) {
      const result = await parseAsync(this.shape[key], (value as Record<string, unknown>)[key])
      if (result.isLeft()) {
        for (const issue of result.value as ValidationIssue[]) issues.push({ path: issue.path ? `${key}.${issue.path}` : key, message: issue.message })
      } else Object.defineProperty(out, key, { value: result.value, enumerable: true, writable: true, configurable: true })
    }
    return this.finish(value as Record<string, unknown>, out, issues)
  }

  parse (value: unknown): OptionalObject<T> {
    const res = this.safeParse(value)
    if (res.isLeft()) throw new Error((res.value as ValidationIssue[]).map((i) => `${i.path}: ${i.message}`).join('; '))
    return res.value as OptionalObject<T>
  }

  safeParse (value: unknown): ValidationResult<OptionalObject<T>> {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return fail([{ path: '', message: 'Expected object' }])
    }
    const out: Record<string, unknown> = {}
    const issues: ValidationIssue[] = []
    for (const key of Object.keys(this.shape) as Array<keyof T>) {
      const schema = this.shape[key]
      const res = schema.safeParse((value as Record<string, unknown>)[key as string])
      if (res.isLeft()) {
        (res.value as ValidationIssue[]).forEach((i) => {
          issues.push({ path: i.path ? `${String(key)}.${i.path}` : String(key), message: i.message })
        })
      } else {
        Object.defineProperty(out, key, { value: res.value, enumerable: true, writable: true, configurable: true })
      }
    }
    return this.finish(value as Record<string, unknown>, out, issues)
  }
}

class ArraySchema<T> extends BaseSchema<T[]> {
  constructor (readonly item: Schema<T>) { super() }

  async safeParseAsync (value: unknown): Promise<ValidationResult<T[]>> {
    if (!Array.isArray(value)) return fail([{ path: '', message: 'Expected array' }])
    const out: T[] = []
    const issues: ValidationIssue[] = []
    for (let index = 0; index < value.length; index++) {
      if (!(index in value)) continue
      const result = await parseAsync(this.item, value[index])
      if (result.isLeft()) {
        for (const issue of result.value as ValidationIssue[]) issues.push({ path: issue.path ? `[${index}].${issue.path}` : `[${index}]`, message: issue.message })
      } else out.push(result.value as T)
    }
    return issues.length > 0 ? fail(issues) : ok(out)
  }

  parse (value: unknown): T[] {
    const res = this.safeParse(value)
    if (res.isLeft()) throw new Error((res.value as ValidationIssue[]).map((i) => `${i.path}: ${i.message}`).join('; '))
    return res.value as T[]
  }

  safeParse (value: unknown): ValidationResult<T[]> {
    if (!Array.isArray(value)) return fail([{ path: '', message: 'Expected array' }])
    const out: T[] = []
    const issues: ValidationIssue[] = []
    value.forEach((v, idx) => {
      const res = this.item.safeParse(v)
      if (res.isLeft()) {
        (res.value as ValidationIssue[]).forEach((i) => {
          issues.push({ path: i.path ? `[${idx}].${i.path}` : `[${idx}]`, message: i.message })
        })
      } else {
        out.push(res.value as T)
      }
    })
    return issues.length > 0 ? fail(issues) : ok(out)
  }
}

type TupleOutput<S extends ReadonlyArray<Schema<unknown>>> = { -readonly [K in keyof S]: S[K] extends Schema<infer T> ? T : never }

const tuple = <const S extends ReadonlyArray<Schema<unknown>>>(schemas: S): BaseSchema<TupleOutput<S>> => {
  const finish = (results: Array<ValidationResult<unknown>>): ValidationResult<TupleOutput<S>> => {
    const issues: ValidationIssue[] = []
    results.forEach((result, index) => {
      if (result.isLeft()) {
        for (const issue of result.value as ValidationIssue[]) {
          issues.push({ path: issue.path ? `[${index}].${issue.path}` : `[${index}]`, message: issue.message })
        }
      }
    })
    return issues.length > 0 ? fail(issues) : ok(results.map((result) => result.value) as TupleOutput<S>)
  }
  const invalid = (value: unknown): boolean => !Array.isArray(value) || value.length !== schemas.length
  const wrongLength = (): ValidationResult<TupleOutput<S>> => fail([{ path: '', message: `Expected tuple of length ${schemas.length}` }])
  return new WrappedSchema(
    (value) => invalid(value) ? wrongLength() : finish(schemas.map((schema, index) => schema.safeParse((value as unknown[])[index]))),
    async (value) => invalid(value) ? wrongLength() : finish(await Promise.all(schemas.map(async (schema, index) => await parseAsync(schema, (value as unknown[])[index]))))
  )
}

const record = <T>(schema: Schema<T>): BaseSchema<Record<string, T>> => {
  const valid = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
  const finish = (keys: string[], results: Array<ValidationResult<T>>): ValidationResult<Record<string, T>> => {
    const out: Record<string, T> = {}
    const issues: ValidationIssue[] = []
    results.forEach((result, index) => {
      const key = keys[index]
      if (result.isLeft()) {
        for (const issue of result.value as ValidationIssue[]) {
          issues.push({ path: issue.path ? `${key}.${issue.path}` : key, message: issue.message })
        }
      } else Object.defineProperty(out, key, { value: result.value, enumerable: true, configurable: true, writable: true })
    })
    return issues.length > 0 ? fail(issues) : ok(out)
  }
  return new WrappedSchema(
    (value) => valid(value) ? finish(Object.keys(value), Object.keys(value).map((key) => schema.safeParse(value[key]))) : fail([{ path: '', message: 'Expected record' }]),
    async (value) => valid(value) ? finish(Object.keys(value), await Promise.all(Object.keys(value).map(async (key) => await parseAsync(schema, value[key])))) : fail([{ path: '', message: 'Expected record' }])
  )
}

const date = (): BaseSchema<Date> => new WrappedSchema((value) =>
  value instanceof Date && !Number.isNaN(value.getTime()) ? ok(new Date(value.getTime())) : fail([{ path: '', message: 'Expected valid date' }]))

export interface Validation {
  string: () => StringSchema
  number: () => NumberSchema
  boolean: () => BaseSchema<boolean>
  enum: <T extends string>(values: readonly [T, ...T[]]) => BaseSchema<T>
  union: <S extends readonly [Schema<unknown>, ...Array<Schema<unknown>>]>(schemas: S) => BaseSchema<Infer<S[number]>>
  object: <T extends Record<string, unknown>>(shape: { [K in keyof T]: Schema<T[K]> }) => ObjectSchema<T>
  array: <T>(item: Schema<T>) => ArraySchema<T>
  literal: <const T extends string | number | boolean | null | undefined>(value: T) => BaseSchema<T>
  tuple: typeof tuple
  record: typeof record
  date: typeof date
  coerce: {
    string: () => BaseSchema<string>
    number: () => BaseSchema<number>
    boolean: () => BaseSchema<boolean>
    date: () => BaseSchema<Date>
  }
}

export const _Validation: Validation = {
  literal: <const T extends string | number | boolean | null | undefined>(expected: T) => new WrappedSchema<T>((value) =>
    Object.is(value, expected) ? ok(expected) : fail([{ path: '', message: `Expected literal ${String(expected)}` }])),
  tuple,
  record,
  date,
  coerce: {
    string: () => new WrappedSchema((value) => ok(String(value))),
    number: () => new WrappedSchema((value) => {
      try { return new NumberSchema().safeParse(Number(value)) } catch { return fail([{ path: '', message: 'Cannot coerce to number' }]) }
    }),
    boolean: () => new WrappedSchema((value) => ok(Boolean(value))),
    date: () => new WrappedSchema((value) => {
      try { return date().safeParse(new Date(value as string)) } catch { return fail([{ path: '', message: 'Cannot coerce to date' }]) }
    })
  },
  string: () => new StringSchema(),
  number: () => new NumberSchema(),
  boolean: () => new WrappedSchema<boolean>((value) => typeof value === 'boolean' ? ok(value) : fail([{ path: '', message: 'Expected boolean' }])),
  enum: <T extends string>(values: readonly [T, ...T[]]) => new WrappedSchema<T>((value) =>
    typeof value === 'string' && values.includes(value as T) ? ok(value as T) : fail([{ path: '', message: `Expected one of: ${values.join(', ')}` }])),
  union: <S extends readonly [Schema<unknown>, ...Array<Schema<unknown>>]>(schemas: S) => new WrappedSchema<Infer<S[number]>>((value) => {
    const issues: ValidationIssue[] = []
    for (const schema of schemas) {
      const result = schema.safeParse(value)
      if (result.isRight()) return ok(result.value as Infer<S[number]>)
      issues.push(...result.value as ValidationIssue[])
    }
    return fail(issues)
  }, async (value) => {
    const issues: ValidationIssue[] = []
    for (const schema of schemas) {
      const result = await parseAsync(schema, value)
      if (result.isRight()) return ok(result.value as Infer<S[number]>)
      issues.push(...result.value as ValidationIssue[])
    }
    return fail(issues)
  }),
  object: <T extends Record<string, unknown>>(shape: { [K in keyof T]: Schema<T[K]> }) => new ObjectSchema<T>(shape),
  array: <T>(item: Schema<T>) => new ArraySchema<T>(item)
}
