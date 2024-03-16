import { _curry } from '../../function/Curry/curry'
import { _match } from '../../function/Match/match'
import { $copy } from './copy'
import { type OBJ } from '../common'

/**
 * Processes a key in an object by following a path of keys.
 *
 * @param {Array<string | number | symbol>} keysToFollow - The path of keys to follow.
 * @param {OBJ} obj - The object to process.
 * @param {keyof OBJ} key - The current key to process.
 * @returns {*} The value obtained by following the path of keys in the object.
 */
const processKey = _curry(<O extends OBJ, K extends keyof OBJ>(keysToFollow: Array<string | number | symbol>, obj: O, key: K): any => {
  return keysToFollow.length > 1
    ? getPathValue(keysToFollow.slice(1), obj[key])
    : $copy(obj[key])
})

/**
 * Checks and processes a key in an object only if the key exists.
 *
 * @param {Array<string | number | symbol>} keysToFollow - The path of keys to follow.
 * @param {OBJ} obj - The object to process.
 * @param {string | number | symbol} currentKey - The current key to check and process.
 * @returns {*} The value obtained by processing the key if it exists, otherwise undefined.
 */
const checkAndProcessKey = <O extends OBJ>(keysToFollow: Array<string | number | symbol>, obj: O, currentKey: string | number | symbol): any | undefined => {
  const keyExists = currentKey in obj || (typeof currentKey === 'symbol' && Object.getOwnPropertySymbols(obj).includes(currentKey))
  return keyExists ? processKey(keysToFollow)(obj)(currentKey) : undefined
}

/**
 * Gets the value from an object by following a path of keys.
 *
 * @param {Array<string | number | symbol>} keysToFollow - The path of keys to follow.
 * @param {OBJ} obj - The object to retrieve the value from.
 * @returns {*} The value obtained by following the path of keys in the object.
 */
export const getPathValue = <O extends OBJ>(keysToFollow: Array<string | number | symbol>, obj: O): any => {
  const currentKey = keysToFollow[0]
  const keyType = typeof currentKey

  return _match(keyType)
    .with('symbol', () => checkAndProcessKey(keysToFollow, obj, currentKey))
    .with('number', () => checkAndProcessKey(keysToFollow, obj, currentKey))
    .with('string', () => checkAndProcessKey(keysToFollow, obj, currentKey))
    ._(() => undefined)
    .exec()
}
