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
})