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

class StringSchema implements Schema<string> {
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

class NumberSchema implements Schema<number> {
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

class ObjectSchema<T extends Record<string, unknown>> implements Schema<T> {
  constructor (readonly shape: { [K in keyof T]: Schema<T[K]> }) {}

  parse (value: unknown): T {
    const res = this.safeParse(value)
    if (res.isLeft()) throw new Error((res.value as ValidationIssue[]).map((i) => `${i.path}: ${i.message}`).join('; '))
    return res.value as T
  }

  safeParse (value: unknown): ValidationResult<T> {
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
    return issues.length > 0 ? fail(issues) : ok(out as T)
  }
}

class ArraySchema<T> implements Schema<T[]> {
  constructor (readonly item: Schema<T>) {}

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

export const _Validation = {
  string: () => new StringSchema(),
  number: () => new NumberSchema(),
  object: <T extends Record<string, unknown>>(shape: { [K in keyof T]: Schema<T[K]> }) => new ObjectSchema<T>(shape),
  array: <T>(item: Schema<T>) => new ArraySchema<T>(item)
}
