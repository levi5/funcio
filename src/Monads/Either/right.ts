import { EitherType, TRight } from "../../@Types"

const Right = <L, R>(value: R): TRight<L, R> => {
  return {
    flag: EitherType.Flag_Right,
    value,
    isLeft(): boolean {
      return false
    },
    isRight(): boolean {
      return true
    }
  }
}

export const right = <L, R>(value: R): TRight<L, R> => {
  return Right<L, R>(value)
}
