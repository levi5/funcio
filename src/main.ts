import { _try, _unwrap, combine, fromNullable, left, right, sequence } from '@funcio/Monads/Either/index.js'
import { _Maybe, Just, Nothing } from '@funcio/Monads/Maybe/index.js'

import { _curry, _placeholder } from '@funcio/function/Curry/curry.js'
import { _match } from '@funcio/function/Match/match.js'
import { _Object } from '@funcio/Object/index.js'
import { _pipe } from '@funcio/function/Pipe/index.js'
import { _compose, _pipeFn } from '@funcio/function/Compose/compose.js'
import { _flip, _memoize, _once, _tap } from '@funcio/function/Utils/fnUtils.js'
import { identity } from '@funcio/function/Pipe/identity.js'
import { _Array } from '@funcio/Array/index.js'
import { _String } from '@funcio/String/index.js'
import { _Number } from '@funcio/Number/index.js'
import { _Task } from '@funcio/Task/task.js'
import { _Validation } from '@funcio/Validation/validation.js'
import type { IEither } from '@funcio/@Types/index.js'

const _Either = {
  left,
  right,
  unwrap: _unwrap,
  try: _try,
  fromNullable,
  sequence,
  combine,
  toMaybe: <L, R>(either: IEither.Either<L, R>): Just<R> | Nothing<R> =>
    either.isRight() ? Just.of(either.value as R) : Nothing.of(undefined as unknown as R)
}

export type { IEither }
export type { Schema, Infer, Validation, ValidationIssue, ValidationResult } from '@funcio/Validation/validation.js'
export type { TaskResult } from '@funcio/Task/task.js'
export type { AsyncArrayOptions } from '@funcio/Array/asyncMethods.js'
export { LazyArray } from '@funcio/Array/lazy.js'

const Funcio = {
  _curry,
  _placeholder,
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
  _placeholder,
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
