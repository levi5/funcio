import { describe, expect, it } from "vitest"
import { _Object } from "../../src/main"

describe("_Object.setByPath function", () => {
  const originalObject = {
    a: 111,
    b: 222,
    c: 333,
    d: {
      e: 444,
      f: 555,
      g: {
        h: 666,
        i: 777,
      },
      j: [{ k: 100 }, { k: 200 }, { k: 300 }],
    },
  }

  it("should set the value at the specified path and not modify the original object", () => {
    const newValue = 88888
    const updatedObject = _Object.setByPath(["d", "f"], newValue, originalObject)

    expect(originalObject.d).not.toBe(updatedObject.d)
    expect(originalObject.d.f).not.toBe(updatedObject.d.f)
    expect(originalObject.d.g).toBe(updatedObject.d.g)
    expect(updatedObject.d.f).toBe(newValue)
  })

  it("should set a value deeply nested in the object", () => {
    const newValue = 99999
    const updatedObject = _Object.setByPath(["d", "g", "i"], newValue, originalObject)

    expect(originalObject.d.g).not.toBe(updatedObject.d.g)
    expect(originalObject.d.g.i).not.toBe(updatedObject.d.g.i)
    expect(updatedObject.d.g.i).toBe(newValue)
  })

  it("should set a value in an array element", () => {
    const newValue = 44444
    const updatedObject = _Object.setByPath(["d", "j", 1, "k"], newValue, originalObject)

    expect(originalObject.d.j[1]).not.toBe(updatedObject.d.j[1])
    expect(originalObject.d.j[1].k).not.toBe(updatedObject.d.j[1].k)
    expect(updatedObject.d.j[1].k).toBe(newValue)
  })


  it("should handle setting a value at an invalid path gracefully", () => {
    const newValue = 12345
    const updatedObject = _Object.setByPath([], newValue, originalObject)


    expect(updatedObject).toBe(originalObject)
  })

  it("should not modify the original object", () => {
    const newValue = 11111
    const updatedObject = _Object.setByPath(["a"], newValue, originalObject)

    expect(originalObject).not.toBe(updatedObject)
    expect(originalObject.a).not.toBe(updatedObject.a)
    expect(updatedObject.a).toBe(newValue)
  })
})
