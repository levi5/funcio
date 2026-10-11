import { _chainify as chainify } from './Chainify/index.js'
import { getPathValue } from './Immutable/getPathValue.js'
import { setByPath } from './Immutable/setPathValue.js'
import makeImmutable from './Immutable/makeImmutable.js'
import { dissocPath, evolve, hasPath, mergeDeep, omit, pick } from './Extra/objectUtils.js'

export const _Object = {
  makeImmutable,
  chainify,
  getPathValue,
  setByPath,
  pick,
  omit,
  mergeDeep,
  evolve,
  hasPath,
  dissocPath
}
