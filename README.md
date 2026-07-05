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
      - [`_Either.try.sync(fn)`](#_eithertrysyncfn)
      - [`_Either.try.async(fn)`](#_eithertryasyncfn)
      - [`_Either.unwrap()`](#_eitherunwrap)
      - [`_Either.match(handlers)`](#_eithermatchhandlers)
      - [`_Either.map(function)`](#_eithermapfunction)
      - [`_Either.mapLeft(function)`](#_eithermapleftfunction)
      - [`_Either.flatMap(function)`](#_eitherflatmapfunction)
      - [`_Either.getOrElse(defaultValue)`](#_eithergetorelse-defaultvalue)
    - [`_Object`](#_object)
      - [`_Object.makeImmutable`](#_objectmakeimmutable)
      - [`_Object.chainify`](#_objectchainify)
      - [`_Object.setByPath(keysToFollow, value, obj)`](#_objectsetbypathkeystofollow-value-obj)
      - [`_Object.getPathValue(keysToFollow, obj)`](#_objectgetpathvaluekeystofollow-obj)
    - [`_Maybe`](#_maybe)
      - [`_Maybe.get()`](#_maybeget)
      - [`_Maybe.getOrElse(defaultValue)`](#_maybegetorelsedefaultvalue)
      - [`_Maybe.map(function)`](#_maybemapfunction)
      - [`_Maybe.flatMap(function)`](#_maybeflatmapfunction)
      - [`_Maybe.chain(function)`](#_maybechainfunction)
    - [`_Maybe.unwrap()`](#_maybeunwrap)
    - [`_pipe`](#_pipe)
      - [`_pipe.async`](#_pipeasync)
    - [`_Array`](#_array)
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
import Funcio from 'funcio';

const rightResult = Funcio._Either.right(42);
```

#### `_Either.left(value)`

The `_Either.left(value)` method crafts an `Either` instance with the "Left" case containing a specific value.

```typescript
import Funcio from 'funcio';

const leftResult = Funcio._Either.left("Error: Something went wrong");
```

#### `_Either.isRight(either)`

The `_Either.isRight(either)` method assesses if the provided `Either` instance resides in the "Right" case and returns `true` for a match or `false` if it's in the "Left" case.

```typescript
import Funcio from 'funcio';

const result = Funcio._Either.right(42);
const isRight = result.isRight();

// Result: true
```

#### `_Either.isLeft(either)`

The `_Either.isLeft(either)` method verifies if the provided `Either` instance dwells in the "Left" case and returns `true` for an affirmative or `false` if it inhabits the "Right" case.

```typescript
import Funcio from 'funcio';

const result = Funcio._Either.left("Error: Something went wrong");
const isLeft = result.isLeft();  // Result: true
```

#### `_Either.try.sync(fn)`

The `_Either.try.sync(fn)` function is a powerful tool for encapsulating synchronous functions that can throw exceptions in a safe context. It allows you to execute a function `fn` and return the result in the "Right" case if the function is successful, or the exception in the "Left" case if the function fails.

```typescript
import Funcio from 'funcio';

function divide(a: number, b: number) {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}

const result1 = Funcio._Either.try.sync(() => divide(6, 2)); // Result: Right(3)
const result2 = Funcio._Either.try.sync(() => divide(6, 0)); // Result: Left(Error: Division by zero)
```

#### `_Either.try.async(fn)`

The `_Either.try.async(fn)` function is a powerful tool for encapsulating asynchronous functions that can throw exceptions in a safe context. It allows you to execute an asynchronous function `fn` and return the result in the "Right" case if the function is successful or the exception in the "Left" case if the function fails.

```typescript
import Funcio from 'funcio';

const jsonString = '{"name": "John", "age": 30}';
const validJson = await Funcio._Either.try.async<object>(() => JSON.parse(jsonString));

const invalidJsonString = '{"name": "John", "age": 30,}';
const invalidJson = await Funcio._Either.try.async<object>(() => JSON.parse(invalidJsonString));
```

#### `_Either.unwrap()`

The `_Either.unwrap()` function extracts the value contained within an `Either` structure. This function proves to be instrumental in scenarios where you need to handle both success and failure cases, as it allows you to access the wrapped value regardless of the outcome.

```typescript
import Funcio from 'funcio';

const eitherValue = Funcio._Either.right(42);
const unwrappedValue = Funcio._Either.unwrap(eitherValue);

// Result: 42
```

#### `_Either.match(handlers)`

The _Either.match method allows you to handle both Right and Left cases in a single, type-safe call. You provide an object with right and left functions, and the method executes the appropriate handler.

```typescript
import Funcio from 'funcio';

const result = Funcio._Either.right(10).match({
  right: (val) => `Success: ${val}`,
  left: (err) => `Error: ${err}`
});

// Result: "Success: 10"

const errorResult = Funcio._Either.left("Something went wrong").match({
  right: (val) => `Success: ${val}`,
  left: (err) => `Error: ${err}`
})

```

#### `_Either.map(function)`

The `_Either.map(function)` method transforms the value inside a `Right`. If the current value is a `Left`, the function is skipped and the error is preserved.

```typescript
import Funcio from 'funcio';

const result = Funcio._Either.right<string, number>(10)
  .map((value) => value * 2)
  .getOrElse(0);

// Result: 20
```

#### `_Either.mapLeft(function)`

The `_Either.mapLeft(function)` method transforms the value inside a `Left`. It is useful for normalizing errors while leaving successful `Right` values untouched.

```typescript
import Funcio from 'funcio';

const result = Funcio._Either.left<string, number>("Invalid payload")
  .mapLeft((error) => `Error: ${error}`)
  .match({
    right: (value) => value,
    left: (error) => error
  });

// Result: "Error: Invalid payload"
```

#### `_Either.flatMap(function)`

The `_Either.flatMap(function)` method chains operations that already return an `Either`, avoiding nested structures like `Either<Error, Either<Error, Value>>`.

```typescript
import Funcio from 'funcio';

const divide = (a: number, b: number) =>
  b === 0
    ? Funcio._Either.left<string, number>("Division by zero")
    : Funcio._Either.right<string, number>(a / b);

const result = Funcio._Either.right<string, number>(10)
  .flatMap((value) => divide(value, 2))
  .getOrElse(0);

// Result: 5
```

#### `_Either.getOrElse(defaultValue)`

The `_Either.getOrElse(defaultValue)` method extracts the `Right` value or returns the provided fallback when the current value is a `Left`.

```typescript
import Funcio from 'funcio';

const result = Funcio._Either.left<string, number>("Not found")
  .getOrElse(404);

// Result: 404
```

### `_Object`

`_Object` is a module in the Funcio library that offers a treasure trove of utilities for manipulating objects.

#### `_Object.makeImmutable`

The `_Object.makeImmutable` function is a versatile tool provided by the `_Object` module in our library. It enables you to create an immutable incarnation of an object, ensuring that its properties remain impervious to change once set.

```typescript
import Funcio from 'funcio';

const user =  {
  "name": "Alice",
  "age": 25,
  "address": { "city": "Wonderland" },
  "hobbies": ["reading", "painting"]
}

const immutableUser = Funcio._Object.makeImmutable(user);
immutableUser.address.city = "Avalora"; // ❌ Error: TypeError: Cannot assign to read-only property 'city' of object '#<Object>'.
```

#### `_Object.chainify`

`_Object.chainify` is a versatile utility in the Funcio library that allows you to create a fluent interface for method chaining, providing a seamless and expressive way to apply multiple operations on an object.

```typescript
import Funcio from 'funcio';

class ExampleClass {
  private value: number;

  constructor(value: number) {
    this.value = value;
  }

  setValue(newValue: number): this {
    this.value = newValue;
    return this;
  }

  multiplyBy(factor: number): this {
    this.value *= factor;
    return this;
  }

  getValue(): number {
    return this.value;
  }
}

// Using _chainify with ExampleClass
const result = Funcio._Object.chainify(new ExampleClass(5))
  .setValue(10)
  .multiplyBy(3)
  .getValue();

// Result: 30
```

#### `_Object.setByPath(keysToFollow, value, obj)`

The `_Object.setByPath(keysToFollow, value, obj)` method allows you to set a value at a specific path within an object. It takes an array keysToFollow representing the path to the desired value and the object obj where the value will be set. For example:

```typescript
import Funcio from 'funcio';

const person = {
  name: "John Doe",
  age: 30,
  address: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    country: "USA",
  },
}

const streetValue = Funcio._Object.setByPath(['address', 'street'], '124 Main St', person);

// Result: "124 Main St" for streetValue
```

#### `_Object.getPathValue(keysToFollow, obj)`

The `_Object.getPathValue(keysToFollow, obj)` function retrieves the value

 at the specified path within an object. It takes an array of keys (`keysToFollow`) representing the path to follow and the target object (`obj`). The function returns the value found at the specified path or `undefined` if the path is not valid.

```typescript
import Funcio from 'funcio';

const person = {
  name: "John Doe",
  age: 30,
  address: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    country: "USA",
  },
}

const streetValue = Funcio._Object.getPathValue(['address', 'street'], person);
const nonExistingValue = Funcio._Object.getPathValue(['address', 'null'], person);

// Result: "123 Main St" for streetValue
// Result: undefined for nonExistingValue
```

### `_Maybe`

`_Maybe` is a module in the Funcio library that empowers you to handle optional values with finesse, in line with functional programming principles. The concept of "Maybe" is your guardian angel for situations where a value may or may not be present, safeguarding against null reference errors and enabling the creation of safer code.

#### `_Maybe.get()`

The `_Maybe.get()` method is a foundational function bequeathed by the `_Maybe` module within the Funcio library. It allows you to securely fetch the value ensconced within a `Maybe` object.

When you invoke `_Maybe.get()` on a `Maybe` instance, it will yield the value if it's present, or it will raise an error or yield a default value if the `Maybe` is empty.

#### `_Maybe.getOrElse(defaultValue)`

The `_Maybe.getOrElse(defaultValue)` method is another invaluable tool within the `_Maybe` module in Funcio. It permits you to procure the value from a `Maybe` object while specifying a default value to deploy in case the `Maybe` is empty.

```typescript
import Funcio from 'funcio';

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
import Funcio from 'funcio';

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

#### `_Maybe.flatMap(function)`

The `_Maybe.flatMap(function)` method chains operations that return another `Maybe`. It keeps your pipeline flat and skips the function when the current value is `Nothing`.

```typescript
import Funcio from 'funcio';

const user = {
  profile: {
    email: "alice@example.com"
  }
}

const email = Funcio._Maybe.of(user.profile)
  .flatMap((profile) => Funcio._Maybe.of(profile.email))
  .getOrElse("No email");

// Result: "alice@example.com"
```

#### `_Maybe.chain(function)`

The `_Maybe.chain(function)` method is an alias for `_Maybe.flatMap(function)`, useful if you prefer the shorter functional-programming name.

```typescript
import Funcio from 'funcio';

const result = Funcio._Maybe.of(3)
  .chain((value) => Funcio._Maybe.of(value * 2))
  .getOrElse(0);

// Result: 6
```

### `_Maybe.unwrap()`

The _Maybe.unwrap() method, when called on a Maybe instance, retrieves the encapsulated value if it exists. If the Maybe is empty, an error or a default value can be specified to handle this scenario, ensuring robust error handling and smooth execution flow.

```typescript
 import Funcio from 'funcio';

const maybeValue = Funcio._Maybe.of(42);
const unwrappedValue = maybeValue.unwrap();

// Result: 42
```

### `_pipe`

The `_pipe` function in the Funcio library is a formidable utility for composing multiple functions into a single, higher-order function. It empowers you to craft a pipeline of functions where the output of one function becomes the input for the next.

```typescript
import Funcio from 'funcio';

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

#### `_pipe.async`

The `_pipe.async` helper composes synchronous and asynchronous functions in order. Each function receives the resolved value from the previous step.

```typescript
import Funcio from 'funcio';

const result = await Funcio._pipe.async(
  4,
  (value: number) => value + 2,
  async (value: number) => value * 3,
  (value: number) => `Value: ${value}`
);

// Result: "Value: 18"
```

### `_Array`

The `_Array` module groups async-friendly array helpers for working with collections while preserving readable functional flows.

```typescript
import Funcio from 'funcio';

const doubled = await Funcio._Array.mapAsync([1, 2, 3], async (value) => value * 2);
const evens = await Funcio._Array.filterAsync([1, 2, 3, 4], async (value) => value % 2 === 0);

// doubled: [2, 4, 6]
// evens: [2, 4]
```

### `_curry`

The `_Curry` function in the Funcio library is a powerful tool for enabling currying, a fundamental concept in functional programming. Currying allows you to transform a function that takes multiple arguments into a series of functions, each accepting a single argument. This technique enhances code readability, reusability, and composability.

The `_curry(fn)` method transforms a regular function into a curried function. Once curried, you can partially apply arguments one at a time, creating new functions along the way.

```typescript
import Funcio from 'funcio';

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
import Funcio from 'funcio';

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
