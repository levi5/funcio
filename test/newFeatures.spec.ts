import { describe, expect, it } from 'vitest'
import { _Either, _Maybe, _Array, _Object, _String, _Number, _Task, _Validation, _compose, _pipeFn, _tap, _once, _memoize, _flip, _pipe, _match } from '../src/main.js'
import { _try } from '../src/Monads/Either/try.js'

describe('Compat: comportamento histórico preservado (sem breaking changes)', () => {
  it('try.sync/async preservam o valor lançado cru (sem embrulhar em Error)', () => {
    const sync = _try.sync(() => { throw 'boom-raw' })
    expect(sync.isLeft()).toBe(true)
    expect(sync.value).toBe('boom-raw')
  })

  it('try.async preserva rejeição não-Error', async () => {
    const res = await _try.async(() => Promise.reject('async-boom-raw'))
    expect(res.isLeft()).toBe(true)
    expect(res.value).toBe('async-boom-raw')
  })

  it('setByPath de 1 nível retorna o valor (seed interno invisível)', () => {
    expect(_Object.setByPath(['a'], 1, {} as Record<string, unknown>)).toEqual({ a: 1 })
  })

  it('exports antigos continuam presentes', () => {
    expect(typeof _Either.left).toBe('function')
    expect(typeof _Either.right).toBe('function')
    expect(typeof _Either.unwrap).toBe('function')
    expect(typeof _Either.try.sync).toBe('function')
    expect(typeof _Either.try.async).toBe('function')
    expect(typeof _pipe).toBe('function')
    expect(typeof _match).toBe('function')
  })
})

describe('P0: Either extensions', () => {
  it('bimap maps Right side', () => {
    const r = _Either.right<string, number>(10).bimap((e) => `E:${e}`, (v) => v * 2)
    expect(r.getOrElse(0)).toBe(20)
  })

  it('bimap maps Left side', () => {
    const l = _Either.left<string, number>('oops').bimap((e) => `E:${e}`, (v) => v * 2)
    expect(l.match({ left: (e) => e, right: (v) => String(v) })).toBe('E:oops')
  })

  it('fold handles both sides', () => {
    expect(_Either.right<string, number>(5).fold(() => 'L', (v) => `R${v}`)).toBe('R5')
    expect(_Either.left<string, number>('x').fold(() => 'L', (v) => `R${v}`)).toBe('L')
  })

  it('orElse recovers from Left', () => {
    const r = _Either.left<string, number>('bad').orElse(() => _Either.right<string, number>(42))
    expect(r.getOrElse(0)).toBe(42)
  })

  it('getOrThrow returns Right and throws Left', () => {
    expect(_Either.right<string, number>(7).getOrThrow()).toBe(7)
    expect(() => _Either.left<string, number>('boom').getOrThrow()).toThrow()
  })

  it('tap runs side effect on Right only', () => {
    let seen = 0
    _Either.right<string, number>(3).tap((v) => { seen = v })
    expect(seen).toBe(3)
    _Either.left<string, number>('e').tap(() => { seen = 99 })
    expect(seen).toBe(3)
  })

  it('fromNullable wraps null/undefined as Left', () => {
    expect(_Either.fromNullable(null, 'empty').isLeft()).toBe(true)
    expect(_Either.fromNullable(5, 'empty').getOrElse(0)).toBe(5)
  })

  it('sequence short-circuits on first Left', () => {
    const ok = _Either.sequence([_Either.right<string, number>(1), _Either.right<string, number>(2)])
    expect(ok.getOrElse([])).toEqual([1, 2])
    const ko = _Either.sequence([_Either.right<string, number>(1), _Either.left<string, number>('bad')])
    expect(ko.isLeft()).toBe(true)
  })

  it('combine merges two Eithers', () => {
    const r = _Either.combine(_Either.right<string, number>(2), _Either.right<string, number>(3), (a, b) => a + b)
    expect(r.getOrElse(0)).toBe(5)
  })
})

describe('P0: Maybe extensions', () => {
  it('fold handles Just/Nothing', () => {
    expect(_Maybe.of(5).fold(() => 'none', (v) => `just${v}`)).toBe('just5')
    expect(_Maybe.of(null).fold(() => 'none', () => 'just')).toBe('none')
  })

  it('filter keeps or drops Just', () => {
    expect(_Maybe.of(10).filter((v) => v > 5).isJust()).toBe(true)
    expect(_Maybe.of(2).filter((v) => v > 5).isNothing()).toBe(true)
  })

  it('orElse falls back on Nothing', () => {
    expect(_Maybe.of(null).orElse(_Maybe.of(9)).getOrElse(0)).toBe(9)
    expect(_Maybe.of(1).orElse(_Maybe.of(9)).getOrElse(0)).toBe(1)
  })

  it('tap preserves value', () => {
    let seen = 0
    const r = _Maybe.of(4).tap((v) => { seen = v }).getOrElse(0)
    expect(r).toBe(4)
    expect(seen).toBe(4)
  })
})

describe('P0: pipe/compose/fn utils', () => {
  it('_compose runs right-to-left', () => {
    const f = _compose((x: number) => x + 1, (x: number) => x * 2)
    expect(f(5)).toBe(11)
  })

  it('_pipeFn is reusable data-last pipe', () => {
    const f = _pipeFn((x: number) => x + 2, (x: number) => x * x)
    expect(f(2)).toBe(16)
    expect(_pipe(2, (x: number) => x + 1)).toBe(3)
  })

  it('_tap returns value untouched', () => {
    let seen = 0
    const t = _tap<number>((v) => { seen = v })
    expect(t(5)).toBe(5)
    expect(seen).toBe(5)
  })

  it('_once runs only once', () => {
    let n = 0
    const f = _once(() => ++n)
    f(); f()
    expect(n).toBe(1)
  })

  it('_memoize caches by args', () => {
    let n = 0
    const f = _memoize((x: number) => { n++; return x * 2 })
    expect(f(2)).toBe(4)
    expect(f(2)).toBe(4)
    expect(n).toBe(1)
  })

  it('_flip swaps args', () => {
    const sub = (a: number, b: number) => a - b
    expect(_flip(sub)(2, 10)).toBe(8)
  })

  it('_match supports predicate + fixed array matching', () => {
    const r = _match<number, string>(10)
      .with((v: number) => v > 5, () => 'big')
      ._(() => 'small')
      .exec()
    expect(r).toBe('big')
    const arr = _match<number[], string>([1, 2])
      .with([1, 2], () => 'pair')
      ._(() => 'other')
      .exec()
    expect(arr).toBe('pair')
  })
})

describe('P1: _Array sync', () => {
  it('chunk/uniq/groupBy/partition', () => {
    expect(_Array.chunk(2, [1, 2, 3, 4, 5])).toEqual([[1, 2], [3, 4], [5]])
    expect(_Array.uniq([1, 1, 2])).toEqual([1, 2])
    expect(_Array.groupBy((x: number) => (x % 2 === 0 ? 'even' : 'odd'), [1, 2, 3])).toEqual({ odd: [1, 3], even: [2] })
    expect(_Array.partition((x: number) => x > 2, [1, 2, 3])).toEqual([[3], [1, 2]])
  })

  it('zip/range/sortBy/take/drop', () => {
    expect(_Array.zip([1, 2], ['a', 'b'])).toEqual([[1, 'a'], [2, 'b']])
    expect(_Array.range(0, 3)).toEqual([0, 1, 2])
    expect(_Array.sortBy((x: number) => x, [3, 1, 2])).toEqual([1, 2, 3])
    expect(_Array.take(2, [1, 2, 3])).toEqual([1, 2])
    expect(_Array.drop(2, [1, 2, 3])).toEqual([3])
  })
})

describe('P1: _Object extras', () => {
  it('pick/omit', () => {
    expect(_Object.pick(['a'], { a: 1, b: 2 })).toEqual({ a: 1 })
    expect(_Object.omit(['b'], { a: 1, b: 2 })).toEqual({ a: 1 })
  })

  it('mergeDeep merges nested', () => {
    expect(_Object.mergeDeep({ a: { x: 1 } }, { a: { y: 2 } })).toEqual({ a: { x: 1, y: 2 } })
  })

  it('evolve/hasPath/dissocPath', () => {
    expect(_Object.evolve({ a: (v: number) => v * 2 }, { a: 5 })).toEqual({ a: 10 })
    expect(_Object.hasPath(['a', 'b'], { a: { b: 1 } })).toBe(true)
    expect(_Object.dissocPath(['a'], { a: 1, b: 2 })).toEqual({ b: 2 })
  })

  it('copy preserves Date/Map/Set', () => {
    const src = { d: new Date(0), m: new Map([['k', 1]]), s: new Set([1]) }
    const frozen = _Object.makeImmutable(src)
    expect(frozen.d instanceof Date).toBe(true)
    expect(frozen.m instanceof Map).toBe(true)
  })
})

describe('P1: _String/_Number', () => {
  it('string helpers', () => {
    expect(_String.capitalize('hello')).toBe('Hello')
    expect(_String.slugify('Olá Mundo!')).toBe('ola-mundo')
    expect(_String.toCamelCase('hello-world')).toBe('helloWorld')
    expect(_String.toSnakeCase('helloWorld')).toBe('hello_world')
  })

  it('number helpers', () => {
    expect(_Number.clamp(0, 10, 15)).toBe(10)
    expect(_Number.sum([1, 2, 3])).toBe(6)
    expect(_Number.avg([2, 4])).toBe(3)
    expect(_Number.roundTo(2, 1.235)).toBe(1.24)
  })
})

describe('P2: _Task', () => {
  it('chains map/flatMap and captures errors', async () => {
    const ok = await _Task.fromPromise(async () => 5).map((v) => v * 2).run()
    expect(ok.getOrElse(0)).toBe(10)
    const ko = await _Task.fromPromise(async () => { throw new Error('x') }).run()
    expect(ko.isLeft()).toBe(true)
    const rec = await _Task.fromPromise(async () => { throw new Error('x') })
      .orElse(() => _Task.of(7)).run()
    expect(rec.getOrElse(0)).toBe(7)
  })

  it('parallel collects results', async () => {
    const r = await _Task.parallel([_Task.of(1), _Task.of(2)]).run()
    expect(r.getOrElse([])).toEqual([1, 2])
  })
})

describe('P2: _Validation accumulates errors', () => {
  it('string/number schemas', () => {
    expect(_Validation.string().min(3).safeParse('hi').isLeft()).toBe(true)
    expect(_Validation.string().email().safeParse('a@b.co').isRight()).toBe(true)
    expect(_Validation.number().positive().safeParse(-1).isLeft()).toBe(true)
  })

  it('object schema reports all bad fields', () => {
    const schema = _Validation.object({ name: _Validation.string().min(2), age: _Validation.number().positive() })
    const res = schema.safeParse({ name: 'x', age: -1 })
    expect(res.isLeft()).toBe(true)
    if (res.isLeft()) expect((res.value as unknown[]).length).toBe(2)
    expect(schema.safeParse({ name: 'Ana', age: 30 }).isRight()).toBe(true)
  })
})
