import { type OBJ } from '../common'

/**
 * Sets a value in an object by following a path of keys.
 *
 * @param {Array<string | number>} keysToFollow - The path of keys to follow.
 * @param {unknown} value - The value to set.
 * @param {OBJ} obj - The object to set the value in.
 */
export const setByPath = <O extends OBJ>(keysToFollow: Array<string | number>, value: unknown, obj: O): O => {
  if (keysToFollow.length === 0 || (obj && typeof obj !== 'object')) return obj

  if (!(keysToFollow[0] in obj)) {
    (obj as any)[keysToFollow[0]] = keysToFollow.length === 1
      ? null
      : Number.isInteger(keysToFollow[1])
        ? []
        : {}
  }

  const newObj = Array.isArray(obj) ? [...obj] : { ...obj }
  const currentKey = keysToFollow[0]

  if (typeof newObj[currentKey] === 'undefined') {
    newObj[currentKey] = Number.isInteger(keysToFollow[1]) ? [] : {}
  }

  newObj[currentKey] = keysToFollow.length > 1
    ? setByPath(keysToFollow.slice(1), value, newObj[currentKey])
    : value

  return newObj as O
}
