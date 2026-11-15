import { expect, describe, it } from "vitest"

import { _Object } from '@funcio/Object/index.js'

const makeSut = () => {
  const sut = _Object.makeImmutable
  return {
    sut
  }
}

const modifyObject = (immutableObject: { age: number; address: { city: string } }) => {
  try {
    if (!immutableObject) return;
    immutableObject.age = 40
    immutableObject.address.city = 'none'
    return immutableObject
  } catch {
    return immutableObject
  }
}

describe("makeImmutable function", () => {
  it("Should not modify the original object", () => {
    const { sut } = makeSut()

    const person = {
      name: "John Doe",
      age: 30,
      address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        country: "USA"
      },
    }

    const immutableObjectPerson = sut(person)
    expect(modifyObject(immutableObjectPerson)).toStrictEqual(person)
  })
})
