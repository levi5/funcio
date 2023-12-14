import { _try, left, right } from './Monads/Either'
import { _Maybe, Just, Nothing } from './Monads/Maybe'

import { _Object } from './Object'
import { _match } from './function/Match/match'
import { _pipe } from './function/Pipe'
import { _curry } from './function/Curry/curry'

const _Either = {
  left,
  right,
  try: _try
}

const Funcio = {
  _Object,
  _Maybe,
  Just,
  Nothing,
  _Either,
  _pipe,
  _curry,
  _match
}

export { _Object, _Maybe, _Either, Just, Nothing, _pipe, _curry, _match }
export default Funcio
