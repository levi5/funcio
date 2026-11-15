import { _Array, _Maybe, _Object, _curry, _pipe } from '@funcio/main.js'
import { describe, expect, expectTypeOf, it } from 'vitest'

describe('lint cleanup compatibility', () => {
  it('extracts the conditional result before resolving a Promise', async () => {
    const result = _Maybe.of(2).when(true).then((value) => value * 2).else(() => 0).unwrap()
    expect(await Promise.resolve(result)).toBe(4)
  })
  it('preserves the last callback result and sequential execution in forEachAsync', async () => {
    const visited: number[] = []
    const result = await _Array.forEachAsync([1, 2, 3], async (value) => {
      visited.push(value)
      await Promise.resolve()
      visited.push(-value)
      return String(value)
    })

    expect(visited).toEqual([1, -1, 2, -2, 3, -3])
    expect(result).toBe('3')
    expectTypeOf(result).toEqualTypeOf<string | undefined>()
    expect(await _Array.forEachAsync([], () => 'unused')).toBeUndefined()
  })

  it('retains chainable void methods and value-returning methods', () => {
    const counter = _Object.chainify({
      value: 0,
      increment(): void {
        this.value++
      },
      read(): number {
        return this.value
      }
    })

    expect(counter.increment()).toBe(counter)
    expect(counter.increment().read()).toBe(2)
    expectTypeOf(counter.read()).toEqualTypeOf<number>()
  })

  it('keeps inferred curry and async pipeline results', async () => {
    const label = _curry((prefix: string, value: number) => `${prefix}${value}`)
    expectTypeOf(label('item:')(2)).toEqualTypeOf<string>()
    expect(label('item:')(2)).toBe('item:2')

    const result = await _pipe.async(2, (value) => value * 3, async (value) => String(value))
    expectTypeOf(result).toEqualTypeOf<string>()
    expect(result).toBe('6')
  })
})
