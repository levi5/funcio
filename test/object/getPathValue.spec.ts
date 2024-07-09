import { expect, describe, it } from "vitest"
import { _Object } from '../../src/Object'

describe("_Object.getPathValue function", () => {
  const person = {
    name: "John Doe",
    age: 30,
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      country: "USA",
      info:{
        test: ''
      }
    },
  }

  it("should return the street value from the person object", () => {
    const streetValue = _Object.getPathValue(['address', 'street'], person)
    expect(streetValue).toBe(person.address.street)
  })

  it("should return undefined for a non-existing key", () => {
    const nonExistingValue = _Object.getPathValue(['address', 'null'], person)
    expect(nonExistingValue).toBeUndefined()
  })
})
