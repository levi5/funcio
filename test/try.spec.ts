import { describe, expect, it } from "vitest";
import { _try } from "../src/Monads/Either/try";

function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}

describe('_try functions', () => {
  it('Should divide two numbers and return Right result', async () => {
    const result = await _try.sync(() => divide(6, 2));
    expect(result.value).toBe(3);
  });

  it('Should handle division by zero and return Left error', async () => {
    const result = _try.sync(() => divide(6, 0));
    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(new Error("Division by zero"));
  });

  it('Should parse valid JSON string and return the parsed object', async () => {
    const jsonString = '{"name": "John", "age": 30}';
    const parsedObject = await _try.async<object>(() => JSON.parse(jsonString));
    expect(parsedObject.value).toEqual({ name: 'John', age: 30 });
  });

  it('Should handle invalid JSON string and throw a SyntaxError', async () => {
    const invalidJsonString = '{"name": "John", "age": 30,}';
    const parsedObject = await _try.async<object>(() => JSON.parse(invalidJsonString));
    const error = parsedObject.isLeft() ? parsedObject.value as Error : new Error()
    expect(error.message).toBe('Expected double-quoted property name in JSON at position 27');
  });
});
