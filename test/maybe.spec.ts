import { expect, describe, it } from "vitest"
import { _Maybe } from "../src/Monads/Maybe"


describe("Maybe Monad", () => {
  it("Should check if the returned value is a 'Just' container", async () => {
    const container = _Maybe.of({ status: true })
    expect(container.isJust()).toBeTruthy()
  })


  it("Should return 'Nothing' when mapping over an undefined value", async () => {
    const container = _Maybe.of({ status: true, error: null })
      .map(data => data.error)
      .map(error => error.message)
      .map(message => message);

    expect(container.isNothing()).toBeTruthy();
  });



  it("Should check if the returned value is a 'Nothing' container", async () => {
    const container = _Maybe.of(null)
    expect(container.isNothing()).toBeTruthy()
  })

  it("Should apply the addTwo function to the value 3 and it will return the final value 5", async () => {
    const addTwo = (value: number,) => value + 2
    const value = _Maybe.of(3).map(addTwo).getOrElse(3)
    expect(value).toBe(5)
  })


  it("Should add two to the value inside a Maybe object and unwrap it", () => {
    const addTwo = (value: number,) => value + 2
    const value = _Maybe.of(_Maybe.of(3).map(addTwo)).unwrap()
    expect(value).toBe(5)
  })

  it("Should return Nothing when the mapped value is null", () => {
    const value = _Maybe.of({ error: null })
      .map(data => data.error)

    expect(value.isNothing()).toBeTruthy()
  })

  it("Should flatMap a Just value", () => {
    const value = _Maybe.of(3)
      .flatMap(value => _Maybe.of(value + 4))
      .getOrElse(0)

    expect(value).toBe(7)
  })

  it("Should not flatMap a Nothing value", () => {
    const value = _Maybe.of(null)
      .flatMap(value => _Maybe.of(value))
      .getOrElse("fallback")

    expect(value).toBe("fallback")
  })

  it("Should use chain as an alias for flatMap", () => {
    const value = _Maybe.of(3)
      .chain(value => _Maybe.of(value * 2))
      .getOrElse(0)

    expect(value).toBe(6)
  })
})

describe("Maybe Fluent Conditional (.when().then().else())", () => {
  it("executes then branch when predicate is true (boolean)", () => {
    const result = _Maybe.of(5)
      .when(true)
      .then(x => x * 2)
      .else(x => x)
      .getOrElse(0)
    expect(result).toBe(10)
  })

  it("executes else branch when predicate is false (boolean)", () => {
    const result = _Maybe.of(5)
      .when(false)
      .then(x => x * 2)
      .else(x => x)
      .getOrElse(0)
    expect(result).toBe(5)
  })

  it("executes then branch when predicate function returns true", () => {
    const result = _Maybe.of(5)
      .when(x => x > 3)
      .then(x => x * 2)
      .else(x => x)
      .getOrElse(0)
    expect(result).toBe(10)
  })

  it("executes else branch when predicate function returns false", () => {
    const result = _Maybe.of(2)
      .when(x => x > 3)
      .then(x => x * 2)
      .else(x => x)
      .getOrElse(0)
    expect(result).toBe(2)
  })

  it("executes else branch for Nothing", () => {
    const result = _Maybe.of(null)
      .when(true)
      .then(x => x * 2)
      .else(() => 99)
      .getOrElse(0)
    expect(result).toBe(99)
  })

  it("executes else branch for Nothing with predicate function", () => {
    const result = _Maybe.of(null)
      .when(x => x > 3)
      .then(x => x * 2)
      .else(() => 99)
      .getOrElse(0)
    expect(result).toBe(99)
  })

  it("supports toMaybe() for re-wrapping to Maybe", () => {
    const maybe = _Maybe.of(5)
      .when(true)
      .then(x => x * 2)
      .else(x => x)
      .toMaybe()
    expect(maybe.isJust()).toBe(true)
    expect(maybe.getOrElse(0)).toBe(10)
  })

  it("toMaybe() returns Nothing when else returns null/undefined", () => {
    const maybe = _Maybe.of(5)
      .when(false)
      .then(x => x * 2)
      .else(() => null)
      .toMaybe()
    expect(maybe.isNothing()).toBe(true)
  })

  it("works with array filter use case", () => {
    const files = [{ path: 'a.ts' }, { path: 'b.ts' }]
    const scope = 'file'
    
    const result = _Maybe.of(files)
      .when(scope === 'file')
      .then(f => f.filter(file => file.path.endsWith('.ts')))
      .else(f => f)
      .getOrElse([])
    
    expect(result).toHaveLength(2)
  })

  it("works with array filter use case - else branch", () => {
    const files = [{ path: 'a.ts' }, { path: 'b.ts' }]
    const scope = 'folder'
    
    const result = _Maybe.of(files)
      .when(scope === 'file')
      .then(f => f.filter(file => file.path.endsWith('.ts')))
      .else(f => f)
      .getOrElse([])
    
    expect(result).toHaveLength(2)
  })

  it("supports map chaining after when", () => {
    const result = _Maybe.of(5)
      .when(true)
      .then(x => x * 2)
      .else(x => x)
      .map(x => x + 1)
      .getOrElse(0)
    expect(result).toBe(11)
  })

  it("supports flatMap chaining after when", () => {
    const result = _Maybe.of(5)
      .when(true)
      .then(x => x * 2)
      .else(x => x)
      .flatMap(x => _Maybe.of(x + 1))
      .getOrElse(0)
    expect(result).toBe(11)
  })

  it("supports chain alias after when", () => {
    const result = _Maybe.of(5)
      .when(true)
      .then(x => x * 2)
      .else(x => x)
      .chain(x => _Maybe.of(x + 1))
      .getOrElse(0)
    expect(result).toBe(11)
  })

  it("toMaybe() avoids double wrapping when then/else return Maybe", () => {
    const maybe = _Maybe.of(5)
      .when(true)
      .then(x => _Maybe.of(x * 2))
      .else(x => _Maybe.of(x))
      .toMaybe()
    expect(maybe.isJust()).toBe(true)
    expect(maybe.getOrElse(0)).toBe(10)
  })
})
