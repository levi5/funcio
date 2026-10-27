import { left, right } from '../Monads/Either/index.js'
import { type IEither } from '../@Types/index.js'

export type ValidationIssue = { path: string, message: string }
export type ValidationResult<T> = IEither.Either<ValidationIssue[], T>

export interface Schema<T> {
  parse: (value: unknown) => T
  safeParse: (value: unknown) => ValidationResult<T>
}

const ok = <T>(value: T): ValidationResult<T> => right<ValidationIssue[], T>(value)
const fail = <T>(issues: ValidationIssue[]): ValidationResult<T> => left<ValidationIssue[], T>(issues)

export type Infer<S extends Schema<unknown>> = S extends Schema<infer T> ? T : never
type OptionalObject<T> = { [K in keyof T as undefined extends T[K] ? never : K]: T[K] } &
{ [K in keyof T as undefined extends T[K] ? K : never]?: T[K] }

abstract class BaseSchema<T> implements Schema<T> {
  abstract safeParse(value: unknown): ValidationResult<T>

  parse (value: unknown): T {
    const result = this.safeParse(value)
    if (result.isLeft()) {
      throw new Error((result.value as ValidationIssue[]).map((i) => i.path ? `${i.path}: ${i.message}` : i.message).join('; '))
    }
    return result.value as T
  }

  optional (): BaseSchema<T | undefined> {
    return new WrappedSchema((value) => value === undefined ? ok(undefined) : this.safeParse(value))
  }

  nullable (): BaseSchema<T | null> {
    return new WrappedSchema((value) => value === null ? ok(null) : this.safeParse(value))
  }

  default (fallback: Exclude<T, undefined>): BaseSchema<Exclude<T, undefined>> {
    return new WrappedSchema((value) => this.safeParse(value === undefined ? fallback : value) as ValidationResult<Exclude<T, undefined>>)
  }

  refine (predicate: (value: T) => boolean, message = 'Invalid value'): BaseSchema<T> {
    return new WrappedSchema((value) => {
      const result = this.safeParse(value)
      if (result.isLeft()) return result
      return predicate(result.value as T) ? result : fail([{ path: '', message }])
    })
  }
}

class WrappedSchema<T> extends BaseSchema<T> {
  constructor (private readonly validate: (value: unknown) => ValidationResult<T>) { super() }

  safeParse (value: unknown): ValidationResult<T> {
    return this.validate(value)
  }
}

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
  constructor (readonly shape: { [K in keyof T]: Schema<T[K]> }) { super() }

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
        out[key as string] = res.value as T[keyof T]
      }
    }
    return issues.length > 0 ? fail(issues) : ok(out as OptionalObject<T>)
  }
}

class ArraySchema<T> extends BaseSchema<T[]> {
  constructor (readonly item: Schema<T>) { super() }

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

export interface Validation {
  string: () => StringSchema
  number: () => NumberSchema
  boolean: () => BaseSchema<boolean>
  enum: <T extends string>(values: readonly [T, ...T[]]) => BaseSchema<T>
  union: <S extends readonly [Schema<unknown>, ...Array<Schema<unknown>>]>(schemas: S) => BaseSchema<Infer<S[number]>>
  object: <T extends Record<string, unknown>>(shape: { [K in keyof T]: Schema<T[K]> }) => ObjectSchema<T>
  array: <T>(item: Schema<T>) => ArraySchema<T>
}

export const _Validation: Validation = {
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
  }),
  object: <T extends Record<string, unknown>>(shape: { [K in keyof T]: Schema<T[K]> }) => new ObjectSchema<T>(shape),
  array: <T>(item: Schema<T>) => new ArraySchema<T>(item)
}
