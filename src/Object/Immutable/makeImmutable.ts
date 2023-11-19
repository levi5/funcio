import { $copy } from "./copy";
import { $isObject } from "../common";

/**
 * Deep freezes an object, making it immutable by recursively freezing all its properties.
 * @template T - The type of the object to be deep-frozen.
 * @template K - The keys of the object.
 * @param {T} object - The object to be deep-frozen.
 * @returns {T} The deep-frozen object.
 */
const deepFreeze = <T extends Object, K extends keyof T>(object: T): T => {
  if ($isObject(object) && !Object.isFrozen(object)) {
    const keys: K[] = Object.keys(object) as K[];
    keys.forEach((key: K) => deepFreeze(object[key] as T));
    Object.freeze(object);
  }
  return object;
};

/**
 * Creates an immutable copy of an object by deep freezing it.
 * @template T - The type of the object to be made immutable.
 * @param {T} object - The object to be made immutable.
 * @returns {T} The immutable copy of the object.
 */
const makeImmutable = <T extends Object>(object: T): T => {
  const objectClone = $copy(object);
  return deepFreeze(objectClone);
};

export default makeImmutable;
