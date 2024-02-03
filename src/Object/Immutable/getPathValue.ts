import { _curry } from '../../function/Curry/curry'
import { _match } from '../../function/Match/match'
import { type OBJ } from '../common'
import { $copy } from './copy'

const processKey = _curry(<O extends OBJ, K extends keyof OBJ>(keysToFollow: Array<string | number | symbol>, obj: O, key: K) => {
  return keysToFollow.length > 1
    ? getPathValue(keysToFollow.slice(1), obj[key])
    : $copy(obj[key])
})

const checkAndProcessKey = <O extends OBJ>(keysToFollow: Array<string | number | symbol>, obj: O, currentKey: string | number | symbol) => {
  const keyExists = currentKey in obj || (typeof currentKey === 'symbol' && Object.getOwnPropertySymbols(obj).includes(currentKey))
  return keyExists ? processKey(keysToFollow)(obj)(currentKey) : undefined
}

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
