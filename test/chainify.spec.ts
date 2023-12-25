import { expect, describe, it } from "vitest"
import { _chainify } from '../src/Object/Chainify'


const makeSut = (name: string, age: number) => {
  class Person {
    private name: string
    private age: number;
    constructor(name: string, age: number) {
      this.name = name
      this.age = age
    }
    setName(name: string) {
      this.name = name;
    }

    setAge(age: number) {
      this.age = age
    }

    getPerson() {
      return { name: this.name, age: this.age }
    }
  }

  return new Person(name, age)
}

describe("Chainify function", () => {
  it("Should set name and age to empty values using chaining", async () => {
    const person = _chainify(makeSut('John Doe', 34))
      .setName('')
      .setAge(0)
      .getPerson();
    expect(person).toEqual({ name: '', age: 0 });
  })

  it("Should chain multiple setters and return the updated person object", async () => {
    const person = _chainify(makeSut('John Doe', 34))
      .setName('Mauricio Kitazawa')
      .setAge(29)
      .setName('Jane Doe')
      .setAge(25)
      .getPerson();
    expect(person).toEqual({ name: 'Jane Doe', age: 25 });
  })

  it("Should return the original person object without setting name and age", async () => {
    const person = _chainify(makeSut('John Doe', 34)).getPerson();
    expect(person).toEqual({ name: 'John Doe', age: 34 });
  })
})
