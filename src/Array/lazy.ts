/** A lazy, data-last collection. Reusable when its input is reusable. */
export class LazyArray<T> implements Iterable<T> {
  constructor (private readonly source: Iterable<T>) {}

  [Symbol.iterator] (): Iterator<T> {
    return this.source[Symbol.iterator]()
  }

  map<R>(fn: (value: T, index: number) => R): LazyArray<R> {
    const source = this.source
    return new LazyArray({
      * [Symbol.iterator] () {
        let index = 0
        for (const value of source) yield fn(value, index++)
      }
    })
  }

  filter (fn: (value: T, index: number) => boolean): LazyArray<T> {
    const source = this.source
    return new LazyArray({
      * [Symbol.iterator] () {
        let index = 0
        for (const value of source) if (fn(value, index++)) yield value
      }
    })
  }

  flatMap<R>(fn: (value: T) => Iterable<R>): LazyArray<R> {
    const source = this.source
    return new LazyArray({
      * [Symbol.iterator] () {
        for (const value of source) yield * fn(value)
      }
    })
  }

  take (count: number): LazyArray<T> {
    if (!Number.isInteger(count) || count < 0) throw new RangeError('Count must be a non-negative integer')
    const source = this.source
    return new LazyArray({
      * [Symbol.iterator] () {
        if (count === 0) return
        let remaining = count
        for (const value of source) {
          yield value
          if (--remaining === 0) return
        }
      }
    })
  }

  drop (count: number): LazyArray<T> {
    if (!Number.isInteger(count) || count < 0) throw new RangeError('Count must be a non-negative integer')
    const source = this.source
    return new LazyArray({
      * [Symbol.iterator] () {
        let remaining = count
        for (const value of source) {
          if (remaining > 0) remaining--
          else yield value
        }
      }
    })
  }

  reduce<R>(fn: (acc: R, value: T) => R, initial: R): R {
    let acc = initial
    for (const value of this) acc = fn(acc, value)
    return acc
  }

  toArray (): T[] {
    return Array.from(this)
  }
}

export const lazy = <T>(source: Iterable<T>): LazyArray<T> => new LazyArray(source)
