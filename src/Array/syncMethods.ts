export const chunk = <T>(size: number, array: T[]): T[][] => {
  if (size <= 0) return []
  const out: T[][] = []
  for (let i = 0; i < array.length; i += size) out.push(array.slice(i, i + size))
  return out
}

export const uniq = <T>(array: T[]): T[] => [...new Set(array)]

export const uniqBy = <T, K>(fn: (value: T) => K, array: T[]): T[] => {
  const seen = new Set<K>()
  return array.filter((item) => {
    const key = fn(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export const groupBy = <T>(fn: (value: T) => string | number, array: T[]): Record<string, T[]> => {
  return array.reduce<Record<string, T[]>>((acc, item) => {
    const key = String(fn(item))
    acc[key] = acc[key] ?? []
    acc[key].push(item)
    return acc
  }, {})
}

export const partition = <T>(predicate: (value: T) => boolean, array: T[]): [T[], T[]] => {
  const pass: T[] = []
  const fail: T[] = []
  array.forEach((item) => (predicate(item) ? pass.push(item) : fail.push(item)))
  return [pass, fail]
}

export const zip = <A, B>(a: A[], b: B[]): Array<[A, B]> => {
  const len = Math.min(a.length, b.length)
  return Array.from({ length: len }, (_, i) => [a[i], b[i]] as [A, B])
}

export const zipWith = <A, B, R>(fn: (a: A, b: B) => R, a: A[], b: B[]): R[] => {
  return zip(a, b).map(([x, y]) => fn(x, y))
}

export const range = (start: number, end: number, step = 1): number[] => {
  const out: number[] = []
  if (step === 0) return out
  if (start < end && step > 0) {
    for (let i = start; i < end; i += step) out.push(i)
  } else if (start > end && step < 0) {
    for (let i = start; i > end; i += step) out.push(i)
  }
  return out
}

export const sortBy = <T>(fn: (value: T) => number | string, array: T[]): T[] => {
  return [...array].sort((a, b) => {
    const va = fn(a)
    const vb = fn(b)
    return va < vb ? -1 : va > vb ? 1 : 0
  })
}

export const take = <T>(n: number, array: T[]): T[] => array.slice(0, Math.max(0, n))

export const drop = <T>(n: number, array: T[]): T[] => array.slice(Math.max(0, n))

export const flatMap = <T, R>(fn: (value: T) => R[], array: T[]): R[] => {
  return array.reduce<R[]>((acc, item) => acc.concat(fn(item)), [])
}
