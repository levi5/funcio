import { $isObject, $isEmpty } from "./common";

export const $copy = <T extends Object>(object: T):T => {
  if ((!$isObject(object))) return object

  const copy = Array.isArray(object) ? [] : {}
  const keys = Object.keys(object)
  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      copy[key] = $copy(object[key])
    }
  })
  return copy as T
}