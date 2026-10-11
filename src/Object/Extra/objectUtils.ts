import { type OBJ } from '../common.js'

export const pick = <O extends OBJ, K extends keyof O>(keys: K[], obj: O): Pick<O, K> => {
  const out = {} as Pick<O, K>
  keys.forEach((k) => {
    if (k in obj) (out as Record<string, unknown>)[k as string] = obj[k]
  })
  return out
}

export const omit = <O extends OBJ, K extends keyof O>(keys: K[], obj: O): Omit<O, K> => {
  const out = { ...obj }
  keys.forEach((k) => delete (out as Record<string, unknown>)[k as string])
  return out as Omit<O, K>
}

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v) && !(v instanceof Date)

export const mergeDeep = <A extends OBJ, B extends OBJ>(a: A, b: B): A & B => {
  const out: Record<string, unknown> = { ...a }
  Object.keys(b).forEach((key) => {
    const bv = (b as Record<string, unknown>)[key]
    const av = (a as Record<string, unknown>)[key]
    out[key] = isPlainObject(av) && isPlainObject(bv) ? mergeDeep(av as OBJ, bv as OBJ) : bv
  })
  return out as A & B
}

export const evolve = <O extends OBJ>(transforms: { [K in keyof O]?: (value: O[K]) => O[K] }, obj: O): O => {
  const out = { ...obj }
  Object.keys(transforms).forEach((key) => {
    const fn = (transforms as Record<string, (v: unknown) => unknown>)[key]
    if (typeof fn === 'function' && key in out) {
      (out as Record<string, unknown>)[key] = fn((out as Record<string, unknown>)[key])
    }
  })
  return out
}

export const hasPath = (path: Array<string | number | symbol>, obj: unknown): boolean => {
  let cur: unknown = obj
  for (const key of path) {
    if (cur === null || cur === undefined || typeof cur !== 'object') return false
    if (!(key in (cur as object))) return false
    cur = (cur as Record<string | number | symbol, unknown>)[key]
  }
  return true
}

export const dissocPath = <O extends OBJ>(path: Array<string | number>, obj: O): O => {
  if (path.length === 0) return obj
  if (path.length === 1) {
    const out = Array.isArray(obj) ? [...(obj as unknown[])] : { ...obj }
    delete (out as Record<string, unknown>)[path[0] as string]
    return out as O
  }
  const [head, ...tail] = path
  const nested = (obj as Record<string, unknown>)[head as string]
  if (nested === null || typeof nested !== 'object') return obj
  const out = Array.isArray(obj) ? [...(obj as unknown[])] : { ...obj }
  ;(out as Record<string, unknown>)[head as string] = dissocPath(tail, nested as OBJ)
  return out as O
}
