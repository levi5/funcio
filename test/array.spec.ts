import { expect, describe, it } from "vitest"
import Funcio, { _Array } from "../src/main"

describe("Array helpers", () => {
  it("Should export _Array from the main entrypoint", () => {
    expect(Funcio._Array).toBe(_Array)
  })

  it("Should map values asynchronously", async () => {
    const value = await _Array.mapAsync([1, 2, 3], async value => value * 2)

    expect(value).toEqual([2, 4, 6])
  })

  it("Should filter values asynchronously", async () => {
    const value = await _Array.filterAsync([1, 2, 3, 4], async value => value % 2 === 0)

    expect(value).toEqual([2, 4])
  })
})
