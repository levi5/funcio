import { expect, describe, it } from "vitest"
import { _unwrap, left, right } from "../src/Monads/Either"
import { IEither } from "../src/@Types"

const fakeData = () => ({
  status: "success"
})

const makeSut = () => {
  const sut = (condition: boolean, value: any): IEither.Either<null, Object> => {
    if (condition) return right(value)
    return left(null)
  }
  return {
    sut,
  }
}

describe("Either monad", () => {
  it("Should return a 'Right' type in case of success", () => {
    const { sut } = makeSut()
    const box = sut(true, fakeData())
    expect(box.isRight()).toBeTruthy()
  })

  it("Should return the value corresponding to the success case.", () => {
    const { sut } = makeSut()
    const box = sut(true, fakeData())
    expect(box.value).toStrictEqual(fakeData())
  })

  it("Should return a 'Left' type in case of error", () => {
    const { sut } = makeSut()
    const box = sut(false, fakeData())
    expect(box.isLeft()).toBeTruthy()
  })

  it("Should return the value corresponding to the error case.", () => {
    const { sut } = makeSut()
    const box = sut(false, fakeData())
    expect(box.value).toBe(null)
  })

  it("Should unwrap the value and return the correct data when input is true", () => {
    const { sut } = makeSut()

    const wrapper = right<null, Object>(sut(true, fakeData()))
    const value = _unwrap<null, Object>(wrapper)
    expect(value).toStrictEqual(fakeData())
  })

  it("Should map the value inside a Right", () => {
    const value = right<string, number>(2)
      .map(value => value * 3)
      .getOrElse(0)

    expect(value).toBe(6)
  })

  it("Should not map the value inside a Left", () => {
    const value = left<string, number>("Invalid value")
      .map(value => value * 3)
      .getOrElse(0)

    expect(value).toBe(0)
  })

  it("Should map the error inside a Left", () => {
    const value = left<string, number>("Invalid value")
      .mapLeft(error => `Error: ${error}`)

    expect(value.value).toBe("Error: Invalid value")
  })

  it("Should flatMap the value inside a Right", () => {
    const value = right<string, number>(2)
      .flatMap(value => right<string, number>(value * 4))
      .getOrElse(0)

    expect(value).toBe(8)
  })

  it("Should not flatMap the value inside a Left", () => {
    const value = left<string, number>("Invalid value")
      .flatMap(value => right<string, number>(value * 4))
      .getOrElse(0)

    expect(value).toBe(0)
  })
})
