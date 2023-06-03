import { IPipe } from "../../@Types/Pipe"
import { identity } from "./identity"

export const _pipe: IPipe = <T>(input: T, ...fns: Function[]): unknown => {
  if (!fns.length) return identity(input) as T
  return fns.reduce((previousValue, fn) =>
    fn.call(fn, previousValue), input)
}

