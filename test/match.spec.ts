import { _match } from '../src/function/Match/match'
import { left, right } from "../src/Monads/Either"
import { IEither } from "../src/@Types/index"
import { expect, describe, it } from "vitest"

describe("Match function", () => {
  it("Should return 4 when executing the _match function with an argument of 2", () => {
    const response = _match<number, number>(2)
      .with(1, (v) => v * 2)
      .with(2, (v) => v * v)
      ._(() => -1)
      .exec()
    expect(4).toBe(response)
  })

  it("Should return 'value is null' when executing the _match function with an argument of left(null)", () => {
    const parameter: IEither.Either<null, number> = left(null)
    const response: string = _match<IEither.Either<null, number>, string>(parameter)
      .with(left(null), (result) => `value is ${result.value}`)
      .with(right(2), (v) => 'value is 2')
      ._(():string => 'not value')
      .exec()
    expect(response).toBe('value is null');
  })

  it("Should return the default expression when no pattern matches", () => {
    const response: string = _match<number, string>(999)
      .with(200, () => 'ok')
      .with(404, () => 'not found')
      ._(() => 'unknown')
      .exec()
    expect(response).toBe('unknown');
  })

  it("Should keep the default expression when a pattern is added after it", () => {
    const response: string = _match<number, string>(999)
      ._(() => 'unknown')
      .with(200, () => 'ok')
      .exec()
    expect(response).toBe('unknown');
  })

})