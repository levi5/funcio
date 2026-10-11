import { $isObject } from '../common.js'

export const $copy = <T>(object: T): T => {
  if (object instanceof Date) return new Date(object.getTime()) as unknown as T
  if (object instanceof RegExp) return new RegExp(object.source, object.flags) as unknown as T
  if (object instanceof Map) {
    const out = new Map()
    object.forEach((v, k) => out.set(k, $copy(v as unknown as object)))
    return out as unknown as T
  }
  if (object instanceof Set) {
    const out = new Set()
    object.forEach((v) => out.add($copy(v as unknown as object)))
    return out as unknown as T
  }
  if ((!$isObject(object as unknown as object))) return object

  const copy = (Array.isArray(object) ? [] : {}) as Record<string | symbol, unknown>
  const keys = [...Object.keys(object as object), ...Object.getOwnPropertySymbols(object as object)]
  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(object, key) || typeof key === 'symbol') {
      copy[key as string] = $copy((object as Record<string | symbol, unknown>)[key as string])
    }
  })
  return copy as T
}
