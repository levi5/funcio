import { expect, describe, it } from "vitest"

import { TEither, left, right } from '../src/Either'

const fakeData = () => ({
  status: "success"
})

const makeSut = () => {
  const sut = (condition: boolean, value: any): TEither<null, Object> => {
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

})