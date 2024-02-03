import { _chainify as chainify } from './Chainify'
import { getPathValue } from './Immutable/getPathValue'
import makeImmutable from './Immutable/makeImmutable'

export const _Object = {
  makeImmutable,
  chainify,
  getPathValue
}
