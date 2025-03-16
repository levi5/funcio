import { _try, _unwrap, left, right } from './Monads/Either'
import { _Maybe, Just, Nothing } from './Monads/Maybe'

import { _curry } from './function/Curry/curry'
import { _match } from './function/Match/match'
import { _Object } from './Object'
import { _pipe } from './function/Pipe'
import { type IEither } from './@Types'

const _Either = {
  left,
  right,
  unwrap: _unwrap,
  try: _try
}

export type { IEither }

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
