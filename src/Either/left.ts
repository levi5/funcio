import { EitherType, TLeft } from "./either"

const Left = <L, R>(value: L): TLeft<L, R> => {
  return {
    flag: EitherType.FLAG_Left,
    value,
    isLeft(): boolean {
      return true
    },
    isRight(): boolean {
      return false
    }
  }
}

export const left = <L, R>(value: L): TLeft<L, R> =>{
  return Left<L, R>(value)
}
