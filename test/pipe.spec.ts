import { expect, describe, it } from "vitest"
import { _pipe } from '../src/function/Pipe'


describe("Pipe function", () => {
  it("Should apply two sum functions and return the value 10 as the final result", async () => {
    const someTwo = (a: number) => a + 2
    const someThree = (a: number) => a + 3

    const value = _pipe(5,
      someTwo,
      someThree)
    expect(value).toEqual(10)
  })

  it("should apply different functions with different returns", async () => {
    const pow = (a: number) => a ** 2
    const format = (a: number) => `Value: ${a}`

    const value = _pipe(4,
      pow,
      format)
    expect(value).toEqual(`Value: 16`)
  })
})
