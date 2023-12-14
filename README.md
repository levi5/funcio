# Funcio 🚀

Funcio is a powerful and versatile library designed to bring the elegance of functional programming to the TypeScript ecosystem. With Funcio, seamlessly integrate functional programming principles and techniques into your codebase, unlocking a universe of possibilities. It empowers you to create clean and expressive code using functional programming paradigms. 🧙‍♂️

**Note: This library is currently under construction and not yet ready for production use.**

## Table of Contents

- [Funcio 🚀](#funcio-)
  - [Table of Contents](#table-of-contents)
  - [Installation 📦](#installation-)
  - [Getting Started 🏁](#getting-started-)
  - [Usage 🚀](#usage-)
    - [`_Either`](#_either)
      - [`_Either.right(value)`](#_eitherrightvalue)
      - [`_Either.left(value)`](#_eitherleftvalue)
      - [`_Either.isRight(either)`](#_eitherisrighteither)
      - [`_Either.isLeft(either)`](#_eitherislefteither)
      - [`_Either._try.sync(fn)`](#_either_trysyncfn)
      - [`_Either._try.async(fn)`](#_either_tryasyncfn)
    - [`_Object`](#_object)
      - [`_Object.makeImmutable`](#_objectmakeimmutable)
    - [`_Maybe`](#_maybe)
      - [`_Maybe.get()`](#_maybeget)
      - [`_Maybe.getOrElse(defaultValue)`](#_maybegetorelsedefaultvalue)
      - [`_Maybe.map(function)`](#_maybemapfunction)
    - [`_pipe`](#_pipe)
    - [`_curry`](#_curry)
    - [`_match`](#_match)
  - [Contributions 🤝](#contributions-)
  - [License 📜](#license-)

## Installation 📦

To integrate Funcio into your project, let the npm package manager work its magic. Simply run the following command in your terminal:

```bash
npm install funcio
```

If you prefer yarn, it's got you covered too:

```bash
yarn add funcio
```

## Getting Started 🏁

Embark on your Funcio journey by importing it into your TypeScript code:

```typescript
import Funcio from 'funcio';
```

## Usage 🚀

### `_Either`

`_Either` is a module in the Funcio library that enables you to handle two distinct scenarios: the "Right" case and the "Left" case. It excels in situations where you need to decide between two possible outcomes. The "Right" case typically represents success, while the "Left" case conveys errors or alternative values.

#### `_Either.right(value)`

The `_Either.right(value)` method creates an `Either` instance, cradling a specific value in the "Right" case.

```typescript
import { Funcio } from 'funcio';

const rightResult = Funcio._Either.right(42);
```

#### `_Either.left(value)`

The `_Either.left(value)` method crafts an `Either` instance with the "Left" case containing a specific value.

```typescript
import { Funcio } from 'funcio';

const leftResult = Funcio._Either.left("Error: Something went wrong");
```

#### `_Either.isRight(either)`

The `_Either.isRight(either)` method assesses if the provided `Either` instance resides in the "Right" case and returns `true` for a match or `false` if it's in the "Left" case.

```typescript
import { Funcio } from 'funcio';

const result = Funcio._Either.right(42);
const isRight = result.isRight();

// Result: true
```

#### `_Either.isLeft(either)`

The `_Either.isLeft(either)` method verifies if the provided `Either` instance dwells in the "Left" case and returns `true` for an affirmative or `false` if it inhabits the "Right" case.

```typescript
import { Funcio } from 'funcio';

const result = Funcio._Either.left("Error: Something went wrong");
const isLeft = result.isLeft();  // Result: true
```

#### `_Either._try.sync(fn)`

The `_Either._try.sync(fn)` function is a powerful tool for encapsulating synchronous functions that can throw exceptions in a safe context. It allows you to execute a function `fn` and return the result in the "Right" case if the function is successful, or the exception in the "Left" case if the function fails.

```typescript
import { Funcio } from 'funcio';

function divide(a: number, b: number) {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}

const result1 = Funcio._Either._try.sync(() => divide(6, 2)); // Result: Right(3)
const result2 = Funcio._Either._try.sync(() => divide(6, 0)); // Result: Left(Error: Division by zero)
```

#### `_Either._try.async(fn)`

The `_Either._try.async(fn)` function is a powerful tool for encapsulating asynchronous functions that can throw exceptions in a safe context. It allows you to execute an asynchronous function `fn` and return the result in the "Right" case if the function is successful or the exception in the "Left" case if the function fails.

```typescript
import { Funcio } from 'funcio';

const jsonString = '{"name": "John", "age": 30}';
const validJson = await Funcio._Either._try.async<object>(() => JSON.parse(jsonString));

const invalidJsonString = '{"name": "John", "age": 30,}';
const invalidJson = await Funcio._Either._try.async<object>(() => JSON.parse(invalidJsonString));
```

### `_Object`

`_Object` is a module in the Funcio library that offers a treasure trove of utilities for manipulating objects.

#### `_Object.makeImmutable`

The `_Object.makeImmutable` function is a versatile tool provided by the `_Object` module in our library. It enables you to create an immutable incarnation of an object, ensuring that its properties remain impervious to change once set.

```typescript
import { Funcio } from 'funcio';

const user =  {
  "name": "Alice",
  "age": 25,
  "address": { "city": "Wonderland" },
  "hobbies": ["reading", "painting"]
}

const immutableUser = Funcio._Object.makeImmutable(user);
immutableUser.address.city = "Avalora"; // ❌ Error: TypeError: Cannot assign to read-only property 'city' of object '#<Object>'.
```

### `_Maybe`

`_Maybe` is a module in the Funcio library that empowers you to handle optional values with finesse, in line with functional programming principles. The concept of "Maybe" is your guardian angel for situations where a value may or may not be present, safeguarding against null reference errors and enabling the creation of safer code.

#### `_Maybe.get()`

The `_Maybe.get

()` method is a foundational function bequeathed by the `_Maybe` module within the Funcio library. It allows you to securely fetch the value ensconced within a `Maybe` object.

When you invoke `_Maybe.get()` on a `Maybe` instance, it will yield the value if it's present, or it will raise an error or yield a default value if the `Maybe` is empty.

#### `_Maybe.getOrElse(defaultValue)`

The `_Maybe.getOrElse(defaultValue)` method is another invaluable tool within the `_Maybe` module in Funcio. It permits you to procure the value from a `Maybe` object while specifying a default value to deploy in case the `Maybe` is empty.

```typescript
import { Funcio } from 'funcio';

const maybeValue = Funcio._Maybe.of(42) // Create a Maybe with a present value
const maybeEmpty = Funcio._Maybe.of(null); // Create an empty Maybe

const retrievedValue = maybeValue.get(); // Retrieve the present value
const defaultValue = maybeEmpty.getOrElse(0); // Retrieve a default value if the Maybe is empty

// Result: 42
// Result: 0
```

#### `_Maybe.map(function)`

The `_Maybe.map(function)` method is a potent tool presented by the `_Maybe` module within the Funcio library. It allows you to apply a function to the value contained within a Maybe object, but only if the Maybe isn't empty. This method is your trusty companion for transforming the value within a Maybe while preserving safety and gracefully handling optional values.

```typescript
import { Funcio } from 'funcio';

// Create a Maybe with a value
const maybeValue = Funcio._Maybe.of(5);

// Define a function to double the value
const doubleValue = (x) => x * 2;

// Utilize map to wield the function on the Maybe's value
const doubledMaybe = maybeValue.map(doubleValue);

// Create a Maybe with no value (empty)
const maybeEmpty = Funcio._Maybe.of(null);

// Endeavor to employ the same function on the empty Maybe
const doubledEmptyMaybe = maybeEmpty.map(doubleValue);

// Retrieve the outcomes
const result1 = doubledMaybe.getOrElse("Value is empty");
const result2 = doubledEmptyMaybe.getOrElse("Value is empty");

result1 // Output: 10
result2 // Output: "Value is empty"
```

### `_pipe`

The `_pipe` function in the Funcio library is a formidable utility for composing multiple functions into a single, higher-order function. It empowers you to craft a pipeline of functions where the output of one function becomes the input for the next.

```typescript
import { Funcio } from 'funcio';

const addTwo = (x: number) => x + 2;
const square = (x: number) => x * x;
const subtractTen = (x: number) => x - 10;

const transform = Funcio._pipe(
  2,
  addTwo,
  square,
  subtractTen
);

// Result: 16
```

### `_curry`

The `_Curry` function in the Funcio library is a powerful tool for enabling currying, a fundamental concept in functional programming. Currying allows you to transform a function that takes multiple arguments into a series of functions, each accepting a single argument. This technique enhances code readability, reusability, and composability.

The `_curry(fn)` method transforms a regular function into a curried function. Once curried, you can partially apply arguments one at a time, creating new functions along the way.

```typescript
import { Funcio } from 'funcio';

// Regular function
const add = (a: number, b: number, c: number) => a + b + c;

// Curry the function
const curriedAdd = Funcio._curry(add);

// Partially apply arguments
const addFive = curriedAdd(5);
const addTen = addFive(10);

// Usage
const result = addTen(7); // Result: 22
```

### `_match`

The `_match` function in the Funcio library is a powerful pattern-matching tool for executing different code blocks based on the matched values. It allows you to define patterns and corresponding actions, providing a concise and expressive way to handle multiple cases.

```typescript
import { Funcio } from 'funcio';

const response = Funcio._match<number, number>(2)
  .with(1, (v) => v * 2)
  .with(2, (v) => v * v)
  ._(() => -1)
  .exec();

result // 4

```

## Contributions 🤝

We extend a warm welcome to contributions from the open-source community. If you have ideas or a desire to contribute to Funcio, please explore our [GitHub repository](https://github.com/levi5/funcio.git) and submit a pull request.

## License 📜

Funcio is released under the [MIT License](LICENSE.txt).

---

Embark on a thrilling journey into the realm of functional programming with Funcio! 🌟
