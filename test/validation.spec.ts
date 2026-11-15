import { describe, expect, expectTypeOf, it } from 'vitest'
import { _Validation as v, type Infer } from '@funcio/main.js'

describe('_Validation extensions', () => {
  it('validates booleans without coercion', () => {
    expect(v.boolean().parse(false)).toBe(false)
    for (const value of [0, 'true', null, undefined]) expect(v.boolean().safeParse(value).isLeft()).toBe(true)
  })

  it('distinguishes optional and nullable, with composable wrappers', () => {
    const optional = v.string().optional()
    expect(optional.parse(undefined)).toBeUndefined()
    expect(optional.safeParse(null).isLeft()).toBe(true)
    const nullable = v.string().nullable()
    expect(nullable.parse(null)).toBeNull()
    expect(nullable.safeParse(undefined).isLeft()).toBe(true)
    expect(nullable.optional().parse(undefined)).toBeUndefined()
    expect(nullable.optional().parse(null)).toBeNull()
    expectTypeOf(optional.parse('x')).toEqualTypeOf<string | undefined>()
  })

  it('uses defaults only for undefined and validates them', () => {
    const schema = v.number().positive().default(10)
    expect(schema.parse(undefined)).toBe(10)
    expect(schema.parse(2)).toBe(2)
    expect(schema.safeParse(null).isLeft()).toBe(true)
    expect(v.number().positive().default(-1).safeParse(undefined).isLeft()).toBe(true)
    const optionalDefault = v.string().optional().default('guest')
    expect(optionalDefault.parse(undefined)).toBe('guest')
    expectTypeOf(optionalDefault.parse(undefined)).toEqualTypeOf<string>()
  })

  it('validates enums and infers literal values', () => {
    const schema = v.enum(['admin', 'user'])
    expect(schema.parse('admin')).toBe('admin')
    expect(schema.safeParse('other').isLeft()).toBe(true)
    expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<'admin' | 'user'>()
  })

  it('tries union alternatives and accumulates failures', () => {
    const schema = v.union([v.string().min(2), v.number().positive()])
    expect(schema.parse('ok')).toBe('ok')
    expect(schema.parse(3)).toBe(3)
    expectTypeOf(schema.parse(3)).toEqualTypeOf<string | number>()
    expect(schema.safeParse(false).value).toHaveLength(2)
  })

  it('refines parsed values and preserves nested error paths', () => {
    let calls = 0
    const even = v.number().refine((n) => { calls++; return n % 2 === 0 }, 'Must be even')
    expect(even.safeParse('bad').isLeft()).toBe(true)
    expect(calls).toBe(0)
    const schema = v.object({ items: v.array(v.object({ count: even })) })
    expect(schema.safeParse({ items: [{ count: 3 }] }).value).toEqual([{ path: 'items.[0].count', message: 'Must be even' }])
    expect(() => schema.parse({ items: [{ count: 3 }] })).toThrow('Must be even')
    expect(even.parse(4)).toBe(4)
  })

  it('supports optional object fields, defaults and object-level refinement', () => {
    const schema = v.object({ name: v.string().optional(), active: v.boolean().default(true) })
    const input: Infer<typeof schema> = { active: true }
    expect(schema.parse({})).toEqual({ name: undefined, active: true })
    expect(schema.parse(input).active).toBe(true)
    const pair = v.object({ min: v.number(), max: v.number() }).refine((p) => p.min <= p.max, 'Invalid bounds')
    expect(pair.safeParse({ min: 3, max: 1 }).isLeft()).toBe(true)
  })
})
