import { left, right } from "./Monads/Either"
import { _Maybe, Just, Nothing } from "./Monads/Maybe"

import { _Object } from "./Object"
import { _pipe } from "./function/Pipe"

const Funcio = {
  _Object,
  _Maybe,
  Just,
  Nothing,
  left,
  right,
  _pipe
}


export { _Object, _Maybe, left, right, Just, Nothing, _pipe }
export default Funcio
