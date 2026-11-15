import { describe, expect, expectTypeOf, it } from 'vitest'
import { _Array, _curry, _Either, _Maybe, _match, _pipe, _placeholder, _Validation, type Infer } from '@funcio/main.js'

describe('typed async pipelines', () => {
  it('infers mixed sync/async steps and awaits the input', async () => {
    const result = _pipe.async(Promise.resolve(2), (x) => x + 1, async (x) => String(x), (x) => x.length)
    expectTypeOf(result).toEqualTypeOf<Promise<number>>()
    expect(await result).toBe(1)
    expect(await _pipe.async(Promise.resolve(7))).toBe(7)
  })

  it('preserves rejection and stops subsequent steps', async () => {
    const error = new Error('stop')
    let ran = false
    await expect(_pipe.async(1, () => { throw error }, () => { ran = true })).rejects.toBe(error)
    expect(ran).toBe(false)
  })

  it('supports long annotated pipelines and function arrays', async () => {
    const result = _pipe.async(1,
      (x: number) => x + 1,
      (x: number) => x + 1,
      (x: number) => x + 1,
      (x: number) => x + 1,
      (x: number) => x + 1,
      async (x: number) => String(x))
    expectTypeOf(result).toEqualTypeOf<Promise<string>>()
    expect(await result).toBe('6')
    const functions: Array<(value: number) => number> = [(x) => x + 1, (x) => x * 2]
    expect(await _pipe.async(1, ...functions)).toBe(4)
  })
})

describe('exhaustive matching', () => {
  it('covers literal unions and discriminated unions', () => {
    const match = (value: 'yes' | 'no'): number => _match<typeof value, number>(value)
      .with('yes', () => 1).with('no', () => 0).exhaustive()
    expect(match('yes')).toBe(1)
    expect(match('no')).toBe(0)
    type State = { kind: 'ok', value: number } | { kind: 'error', message: string }
    const render = (value: State): string => _match<State, string>(value)
      .with({ kind: 'ok' }, (state) => String(state.value))
      .with({ kind: 'error' }, (state) => state.message)
      .exhaustive()
    expect(render({ kind: 'ok', value: 4 })).toBe('4')
    expect(render({ kind: 'error', message: 'bad' })).toBe('bad')
  })

  it('supports constructors and explicit fallbacks', () => {
    expect(_match<string | number, string>(2).with(String, (x) => x).with(Number, (x) => String(x)).exhaustive()).toBe('2')
    expect(_match<number, string>(2).with(1, () => 'one')._(() => 'other').exhaustive()).toBe('other')
    expect(_match<unknown, string>(null).with({ a: 1 }, () => 'shape')._(() => 'none').exec()).toBe('none')
  })

  it('throws on an unsafe exhaustive call and preserves legacy exec fallback', () => {
    const builder = _match<number, string>(2).with(1, () => 'one')
    expect(builder.exec()).toBeNull()
    expect(() => (builder as unknown as { exhaustive: () => string }).exhaustive()).toThrow('Non-exhaustive match')
  })

  it('uses a fallback with dynamic patterns and values excluded by constructors', () => {
    const render = (pattern: string, value: string): string => _match<string, string>(value)
      .with(pattern, () => 'matched')
      ._(() => 'other')
      .exhaustive()
    expect(render('a', 'a')).toBe('matched')
    expect(render('a', 'b')).toBe('other')
    expect(_match<number, string>(NaN).with(Number, () => 'number')._(() => 'not a number').exhaustive()).toBe('not a number')
    expect(_match<{ value: number }, string>({ value: 2 }).with({ value: Number }, (item) => String(item.value)).exhaustive()).toBe('2')
  })
})

describe('Maybe / Either interoperability', () => {
  it('converts both branches without changing historical nullable handling', () => {
    expect(_Maybe.of(0).toEither('empty').getOrThrow()).toBe(0)
    expect(_Maybe.of(null).toEither('empty').value).toBe('empty')
    expect(_Either.toMaybe(_Either.right<string, number>(3)).getOrElse(0)).toBe(3)
    expect(_Either.toMaybe(_Either.left<string, number>('bad')).isNothing()).toBe(true)
    // Right(null) remains an explicit Just, not an absent result.
    expect(_Either.toMaybe(_Either.right(null)).isJust()).toBe(true)
    expect(_Maybe.fromNullable(0)).toBe(true)
  })

  it('sequences empty/nonempty lists and short-circuits traversal', () => {
    expect(_Maybe.sequence<number>([]).getOrElse([])).toEqual([])
    expect(_Maybe.sequence([_Maybe.of(1), _Maybe.of(2)]).getOrElse([])).toEqual([1, 2])
    expect(_Maybe.sequence([_Maybe.of(1), _Maybe.nothing<number>(0)]).isNothing()).toBe(true)
    const seen: number[] = []
    const result = _Maybe.traverse([1, 2, 3], (value) => {
      seen.push(value)
      return value === 2 ? _Maybe.nothing<number>(0) : _Maybe.just(value * 2)
    })
    expect(result.isNothing()).toBe(true)
    expect(seen).toEqual([1, 2])
    expect(_Maybe.traverse([1, 2], (x) => _Maybe.just(x * 2)).getOrElse([])).toEqual([2, 4])
  })
})

describe('bounded async collections', () => {
  it('limits concurrency and preserves input order', async () => {
    let active = 0
    let peak = 0
    const result = await _Array.mapAsync([3, 2, 1, 0], async (value) => {
      peak = Math.max(peak, ++active)
      await new Promise((resolve) => setTimeout(resolve, value))
      active--
      return value * 2
    }, { concurrency: 2 })
    expect(result).toEqual([6, 4, 2, 0])
    expect(peak).toBe(2)
    expect(await _Array.filterAsync([1, 2, 3], async (x) => x % 2 === 1, { concurrency: 1 })).toEqual([1, 3])
  })

  it('rejects invalid limits and returns empty collections', async () => {
    for (const concurrency of [0, -1, 1.5, NaN]) {
      await expect(_Array.mapAsync([], (x) => x, { concurrency })).rejects.toThrow(RangeError)
    }
    expect(await _Array.mapAsync([], (x) => x)).toEqual([])
  })

  it('preserves thrown values and does not schedule more work after failure', async () => {
    const seen: number[] = []
    await expect(_Array.mapAsync([1, 2, 3], (x) => {
      seen.push(x)
      throw 'raw-error'
    }, { concurrency: 1 })).rejects.toBe('raw-error')
    expect(seen).toEqual([1])
  })

  it('cancels immediately, even when a callback ignores the signal', async () => {
    const controller = new AbortController()
    let seen = 0
    const result = _Array.mapAsync([1, 2, 3], async () => {
      seen++
      return await new Promise<number>(() => {})
    }, { concurrency: 1, signal: controller.signal })
    controller.abort()
    await expect(result).rejects.toHaveProperty('name', 'AbortError')
    expect(seen).toBe(1)
    await expect(_Array.mapAsync([1], () => { throw new Error('must not run') }, { signal: controller.signal })).rejects.toHaveProperty('name', 'AbortError')
  })

  it('retains sparse-array map/filter behavior', async () => {
    const values = new Array<number>(3)
    values[0] = 1
    values[2] = 3
    const result = await _Array.mapAsync(values, (x) => x * 2)
    expect(result.length).toBe(3)
    expect(1 in result).toBe(true)
    expect(result[1]).toBeUndefined()
    expect(await _Array.filterAsync(values, () => true)).toEqual([1, 3])
  })

  it('preserves native callback arguments and supplies cancellation separately', async () => {
    const values = [1, 2]
    const controller = new AbortController()
    expect(await _Array.mapAsync(values, (value, index, array, signal) => {
      expect(array).toBe(values)
      expect(signal).toBe(controller.signal)
      return value + index
    }, { signal: controller.signal })).toEqual([1, 3])
  })
})

describe('flexible currying', () => {
  it('accepts unary, grouped and complete applications', () => {
    const sum = _curry((a: number, b: number, c: number) => a + b + c)
    expect(sum(1)(2)(3)).toBe(6)
    expect(sum(1, 2)(3)).toBe(6)
    expect(sum(1)(2, 3)).toBe(6)
    expect(sum(1, 2, 3)).toBe(6)
    expect(_curry(() => 42)).toBe(42)
  })

  it('supports reusable partials and placeholders across calls', () => {
    const join = _curry((a: string, b: number, c: boolean) => `${a}:${b}:${c}`)
    const partial = join(_placeholder, 2, _curry.placeholder)
    expect(partial('a', true)).toBe('a:2:true')
    expect(partial('b')(false)).toBe('b:2:false')
    expect(join('c', _placeholder) (3, true)).toBe('c:3:true')
    const untyped = _curry((a: unknown, b: number) => `${a}:${b}`)
    expect(untyped(_placeholder)('a')(2)).toBe('a:2')
  })
})

describe('lazy iterables', () => {
  it('does no work until consumption and never over-reads take', () => {
    let calls = 0
    const values = _Array.lazy([1, 2, 3]).map((x) => { calls++; return x * 2 }).take(2)
    expect(calls).toBe(0)
    expect(values.toArray()).toEqual([2, 4])
    expect(calls).toBe(2)
    expect(values.toArray()).toEqual([2, 4])
    expect(calls).toBe(4)
    expect(_Array.lazy([1]).map(() => { throw new Error('over-read') }).take(0).toArray()).toEqual([])
  })

  it('handles infinite inputs, closes generators and composes operations', () => {
    let closed = false
    function * naturals (): Generator<number> {
      try { for (let n = 0; ; n++) yield n } finally { closed = true }
    }
    expect(_Array.lazy(naturals()).drop(2).filter((x) => x % 2 === 0).take(3).toArray()).toEqual([2, 4, 6])
    expect(closed).toBe(true)
    expect(_Array.lazy([1, 2]).flatMap((x) => [x, x]).reduce((acc, x) => acc + x, 0)).toBe(6)
    expect(() => _Array.lazy([]).take(-1)).toThrow(RangeError)
    expect(() => _Array.lazy([]).drop(NaN)).toThrow(RangeError)
  })
})

describe('extended validation', () => {
  it('transforms only valid values and reports transformation errors', () => {
    const schema = _Validation.string().min(2).transform((value) => value.length)
    expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<number>()
    expect(schema.parse('abc')).toBe(3)
    expect(schema.safeParse('a').isLeft()).toBe(true)
    expect(_Validation.string().transform(() => { throw new Error('bad transform') }).safeParse('a').value).toEqual([{ path: '', message: 'bad transform' }])
  })

  it('coerces explicitly without changing normal validators', () => {
    expect(_Validation.number().safeParse('42').isLeft()).toBe(true)
    expect(_Validation.coerce.number().parse('42')).toBe(42)
    expect(_Validation.coerce.number().safeParse('no').isLeft()).toBe(true)
    expect(_Validation.coerce.number().safeParse(Symbol('x')).isLeft()).toBe(true)
    expect(_Validation.coerce.string().parse(42)).toBe('42')
    expect(_Validation.coerce.boolean().parse('false')).toBe(true)
    expect(_Validation.coerce.date().parse('2024-01-01').getUTCFullYear()).toBe(2024)
    expect(_Validation.coerce.date().safeParse('invalid').isLeft()).toBe(true)
  })

  it('validates literals, tuples, records and dates', () => {
    expect(_Validation.literal('ok').safeParse('bad').isLeft()).toBe(true)
    const tuple = _Validation.tuple([_Validation.literal('ok'), _Validation.number()])
    expectTypeOf<Infer<typeof tuple>>().toEqualTypeOf<['ok', number]>()
    expect(tuple.parse(['ok', 2])).toEqual(['ok', 2])
    expect(tuple.safeParse(['ok']).isLeft()).toBe(true)
    expect(tuple.safeParse(['bad', 'x']).value).toEqual([
      { path: '[0]', message: 'Expected literal ok' }, { path: '[1]', message: 'Expected number' }
    ])
    expect(_Validation.record(_Validation.number()).parse({ a: 1 })).toEqual({ a: 1 })
    expect(_Validation.record(_Validation.number()).safeParse({ a: 'x' }).value).toEqual([{ path: 'a', message: 'Expected number' }])
    expect(_Validation.date().safeParse(new Date(NaN)).isLeft()).toBe(true)
    const input = new Date(0)
    expect(_Validation.date().parse(input)).not.toBe(input)
  })

  it('keeps stripping as default and allows explicit strict/passthrough policies', () => {
    const schema = _Validation.object({ name: _Validation.string() })
    const input = { name: 'Ana', extra: 1 }
    expect(schema.parse(input)).toEqual({ name: 'Ana' })
    expect(schema.strict().safeParse(input).value).toEqual([{ path: 'extra', message: 'Unknown key' }])
    expect(schema.passthrough().parse(input)).toEqual(input)
    expect(schema.strict().strip().parse(input)).toEqual({ name: 'Ana' })
    expect(input.extra).toBe(1)
    expect(schema.parse(input)).toEqual({ name: 'Ana' })
  })

  it('does not let record or passthrough keys change output prototypes', () => {
    const input = JSON.parse('{"__proto__": 1}')
    const record = _Validation.record(_Validation.number()).parse(input)
    const passthrough = _Validation.object({}).passthrough().parse(input)
    for (const output of [record, passthrough]) {
      expect(Object.getPrototypeOf(output)).toBe(Object.prototype)
      expect(Object.getOwnPropertyDescriptor(output, '__proto__')).toBeDefined()
    }
  })

  it('validates asynchronous refinements and transformations through nested schemas', async () => {
    const name = _Validation.string().refineAsync(async (value) => value !== 'taken', 'Already taken')
      .transformAsync(async (value) => value.toUpperCase())
    const schema = _Validation.object({ users: _Validation.array(_Validation.object({ name })) })
    expect(await schema.parseAsync({ users: [{ name: 'ana' }] })).toEqual({ users: [{ name: 'ANA' }] })
    expect((await schema.safeParseAsync({ users: [{ name: 'taken' }, { name: 1 }] })).value).toEqual([
      { path: 'users.[0].name', message: 'Already taken' },
      { path: 'users.[1].name', message: 'Expected string' }
    ])
    expect(() => name.parse('ana')).toThrow('Async schema')
    await expect(schema.parseAsync({ users: [{ name: 'taken' }] })).rejects.toThrow('Already taken')
  })

  it('propagates async behavior through wrappers, unions, tuples and records', async () => {
    const asyncNumber = _Validation.number().transformAsync(async (x) => x * 2)
    expect(await asyncNumber.optional().parseAsync(undefined)).toBeUndefined()
    expect(await asyncNumber.nullable().parseAsync(null)).toBeNull()
    expect(await asyncNumber.optional().default(3).parseAsync(undefined)).toBe(6)
    expect(await asyncNumber.refine((x) => x > 0).transform(String).parseAsync(2)).toBe('4')
    expect(await _Validation.union([asyncNumber, _Validation.string()]).parseAsync(3)).toBe(6)
    expect(await _Validation.tuple([asyncNumber]).parseAsync([3])).toEqual([6])
    expect(await _Validation.record(asyncNumber).parseAsync({ x: 3 })).toEqual({ x: 6 })
    expect((await asyncNumber.transformAsync(async () => { throw new Error('async failure') }).safeParseAsync(1)).isLeft()).toBe(true)
  })

  it('accumulates async union issues and preserves unknown-key policies', async () => {
    const schema = _Validation.object({ name: _Validation.string().transformAsync(async (x) => x.toUpperCase()) })
    expect((await schema.strict().safeParseAsync({ name: 'ana', extra: 1 })).value).toEqual([{ path: 'extra', message: 'Unknown key' }])
    expect(await schema.passthrough().parseAsync({ name: 'ana', extra: 1 })).toEqual({ name: 'ANA', extra: 1 })
    expect((await _Validation.union([_Validation.number(), _Validation.string().refineAsync(async () => false, 'No')]).safeParseAsync(false)).value).toHaveLength(2)
    expect((await _Validation.string().refineAsync(async () => { throw new Error('network') }).safeParseAsync('ana')).value).toEqual([{ path: '', message: 'network' }])
  })
})

// Compile-only regression checks. Invalid calls must stay invalid.
function typeChecks (): void {
  // @ts-expect-error async steps must consume the previous output
  _pipe.async(1, (x: number) => String(x), (x: number) => x + 1)
  // @ts-expect-error even longer pipelines must reject incompatible steps
  _pipe.async(1, (x: number) => x, (x: number) => x, (x: number) => x, (x: number) => x, (x: number) => String(x), (x: number) => x)
  const incomplete = _match<'a' | 'b', number>('a').with('a', () => 1)
  // @ts-expect-error missing the b branch
  incomplete.exhaustive()
  const predicate = _match<number, number>(1).with((x) => x > 0, () => 1)
  // @ts-expect-error a predicate alone does not prove coverage
  predicate.exhaustive()
  const broadPattern: string = String('a')
  // @ts-expect-error a string variable matches one value, not every string
  _match<string, number>('b').with(broadPattern, () => 1).exhaustive()
  const unionPattern = Math.random() < 0.5 ? 'a' : 'b'
  // @ts-expect-error a union-typed pattern is still one runtime value
  _match<'a' | 'b', number>('a').with(unionPattern, () => 1).exhaustive()
  const arrayPattern: number[] = [1]
  // @ts-expect-error one array pattern cannot cover every array
  _match<number[], number>([1, 2]).with(arrayPattern, () => 1).exhaustive()
  const objectPattern: { kind: 'a' | 'b' } = { kind: 'a' }
  // @ts-expect-error the discriminant pattern contains only one of its possible values
  _match<{ kind: 'a' } | { kind: 'b' }, number>({ kind: 'b' }).with(objectPattern, () => 1).exhaustive()
  // @ts-expect-error a widened object property is not an exhaustive discriminator
  _match<{ kind: string }, number>({ kind: 'b' }).with({ kind: broadPattern }, () => 1).exhaustive()
  // @ts-expect-error Number matches numeric values, not the constructor itself
  _match<{ value: NumberConstructor }, number>({ value: Number }).with({ value: Number }, () => 1).exhaustive()
  const sum = _curry((a: number, b: string) => `${a}${b}`)
  // @ts-expect-error incorrect first argument
  sum('bad')
  // @ts-expect-error incorrect placeholder replacement
  sum(_placeholder, 'ok')('bad')
  expectTypeOf(sum(1)('ok')).toEqualTypeOf<string>()
  expectTypeOf(sum(_placeholder, 'ok')(1)).toEqualTypeOf<string>()
  const boolean = _match<boolean, string>(true).with(Boolean, (x) => String(x)).exhaustive()
  expectTypeOf(boolean).toEqualTypeOf<string>()
  const untyped = _curry((a: unknown, b: number) => `${a}:${b}`)
  expectTypeOf(untyped(_placeholder)('a')(2)).toEqualTypeOf<string>()
}
void typeChecks
