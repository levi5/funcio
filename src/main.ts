import { left, right } from "./Monads/Either"
import { _Maybe, Just, Nothing } from "./Monads/Maybe"

import { _Object } from "./Object"

const Funcio = {
  _Object,
  _Maybe,
  Just,
  Nothing,
  left,
  right,
}

export { _Object, _Maybe, left, right, Just, Nothing, }
export default Funcio
