import { $copy } from "./copy";
import { $isObject } from "./common";

const $deepFreeze = <T extends Object, K extends keyof T>(object: T): T => {
  if ($isObject(object) && !Object.isFrozen(object)) {
    const keys: K[] = Object.keys(object) as K[]
    keys.forEach((key: K) => $deepFreeze(object[key] as T))
    Object.freeze(object)
  }
  return object
}


export const $makeImmutable = <T extends Object>(object: T) => {
  const objectClone = $copy(object)
  return $deepFreeze(objectClone)
}