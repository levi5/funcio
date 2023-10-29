
import { _try, left, right } from "./Monads/Either"
import { _Maybe, Just, Nothing } from "./Monads/Maybe"

import { _Object } from "./Object"
import { _pipe } from "./function/Pipe"

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
  Either: _Either,
  _pipe
}

export { _Object, _Maybe, _Either, Just, Nothing, _pipe }
export default Funcio
