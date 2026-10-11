import { _try, _unwrap, combine, fromNullable, left, right, sequence } from './Monads/Either/index.js'
import { _Maybe, Just, Nothing } from './Monads/Maybe/index.js'

import { _curry } from './function/Curry/curry.js'
import { _match } from './function/Match/match.js'
import { _Object } from './Object/index.js'
import { _pipe } from './function/Pipe/index.js'
import { _compose, _pipeFn } from './function/Compose/compose.js'
import { _flip, _memoize, _once, _tap } from './function/Utils/fnUtils.js'
import { identity } from './function/Pipe/identity.js'
import { _Array } from './Array/index.js'
import { _String } from './String/index.js'
import { _Number } from './Number/index.js'
import { _Task } from './Task/task.js'
import { _Validation } from './Validation/validation.js'
import { type IEither } from './@Types/index.js'

const _Either = {
  left,
  right,
  unwrap: _unwrap,
  try: _try,
  fromNullable,
  sequence,
  combine
}

export type { IEither }

const Funcio = {
  _curry,
  _Either,
  _match,
  _Maybe,
  _Object,
  _Array,
  _String,
  _Number,
  _Task,
  _Validation,
  _pipe,
  _compose,
  _pipeFn,
  _tap,
  _once,
  _memoize,
  _flip,
  identity,
  Just,
  Nothing
}

export {
  _try,
  _curry,
  _Either,
  _match,
  _Maybe,
  _Object,
  _Array,
  _String,
  _Number,
  _Task,
  _Validation,
  _pipe,
  _compose,
  _pipeFn,
  _tap,
  _once,
  _memoize,
  _flip,
  identity,
  Just,
  Nothing
}

export default Funcio
