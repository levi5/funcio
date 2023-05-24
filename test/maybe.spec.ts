import { expect, describe, it } from "vitest"
import { _Maybe } from "../src/Monads/Maybe"


describe("Maybe Monad", () => {
  it("Should check if the returned value is a 'Just' container", async () => {
    const container = _Maybe.of({ status: true })
    expect(container.isJust()).toBeTruthy()
  })

  it("Should check if the returned value is a 'Nothing' container", async () => {
    const container = _Maybe.of(null)
    expect(container.isNothing()).toBeTruthy()
  })

  it("Should apply the addTwo function to the value 3 and it will return the final value 5", async () => {
    const addTwo = (value: number) => value + 2
    const value = _Maybe.of(3).map(addTwo).get()
    expect(value).toBe(5)
  })
})