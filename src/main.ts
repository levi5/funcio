import { _try, left, right } from './Monads/Either'
import { _Maybe, Just, Nothing } from './Monads/Maybe'

import { _curry } from './function/Curry/curry'
import { _match } from './function/Match/match'
import { _Object } from './Object'
import { _pipe } from './function/Pipe'

const _Either = {
  left,
  right,
  try: _try
}

const Funcio = {
  _curry,
  _Either,
  _match,
  _Maybe,
  _Object,
  _pipe,
  Just,
  Nothing
}

export {
  _curry,
  _Either,
  _match,
  _Maybe,
  _Object,
  _pipe,
  Just,
  Nothing
}
export default Funcio
