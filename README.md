# Funcio 🚀

Funcio is a powerful and versatile library designed to bring the elegance of functional programming to the TypeScript ecosystem. With Funcio, seamlessly integrate functional programming principles and techniques into your codebase, unlocking a universe of possibilities. It empowers you to create clean and expressive code using functional programming paradigms. 🧙‍♂️

**Note: This library is currently under construction and not yet ready for production use.**

📖 **Documentation:** https://levi5.github.io/funcio/ — every example on the site is a runnable editor wired to the real library.

[![Docs](https://img.shields.io/badge/docs-levi5.github.io%2Ffuncio-7c5cff?style=for-the-badge)](https://levi5.github.io/funcio/)
[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub-EA4AAA?style=for-the-badge&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/levi5)

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
      - [`_Either.bimap / fold / orElse / tap / getOrThrow`](#_eitherbimap--fold--orelse--tap--getorthrow)
      - [`_Either.fromNullable / sequence / combine`](#_eitherfromnullable--sequence--combine)
    - [`_Object`](#_object)
      - [`_Object.makeImmutable`](#_objectmakeimmutable)
      - [`_Object.chainify`](#_objectchainify)
      - [`_Object.setByPath(keysToFollow, value, obj)`](#_objectsetbypathkeystofollow-value-obj)
      - [`_Object.getPathValue(keysToFollow, obj)`](#_objectgetpathvaluekeystofollow-obj)
      - [`_Object.pick / omit / mergeDeep / evolve / hasPath / dissocPath`](#_objectpick--omit--mergedeep--evolve--haspath--dissocpath)
    - [`_Maybe`](#_maybe)
      - [`_Maybe.get()`](#_maybeget)
      - [`_Maybe.getOrElse(defaultValue)`](#_maybegetorelsedefaultvalue)
      - [`_Maybe.map(function)`](#_maybemapfunction)
      - [`_Maybe.flatMap(function)`](#_maybeflatmapfunction)
      - [`_Maybe.chain(function)`](#_maybechainfunction)
      - [`_Maybe.fold / filter / orElse / tap`](#_maybefold--filter--orelse--tap)
    - [`_Maybe.unwrap()`](#_maybeunwrap)
    - [`_Maybe.when(predicate).then(fn).else(fn)`](#_maybewhenpredicatethenfnelsefn)
    - [`_pipe`](#_pipe)
      - [`_pipe.async`](#_pipeasync)
      - [`_compose / _pipeFn`](#_compose--_pipefn)
    - [`_Array`](#_array)
    - [`_String / _Number`](#_string--_number)
    - [`_Task`](#_task)
    - [`_Validation`](#_validation)
    - [`_tap / _once / _memoize / _flip`](#_tap--_once--_memoize--_flip)
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

#### `_Either.bimap / fold / orElse / tap / getOrThrow`

```typescript
import Funcio from 'funcio';

const doubled = Funcio._Either.right<string, number>(10)
  .bimap((e) => `E:${e}`, (v) => v * 2)
  .fold((e) => e, (v) => `R${v}`); // "R20"

const recovered = Funcio._Either.left<string, number>("bad")
  .orElse(() => Funcio._Either.right<string, number>(42))
  .getOrElse(0); // 42

Funcio._Either.right<string, number>(3).tap(console.log); // logs 3, returns Right(3)
Funcio._Either.right<string, number>(7).getOrThrow(); // 7 (throws on Left)
```

#### `_Either.fromNullable / sequence / combine`

```typescript
import Funcio from 'funcio';

Funcio._Either.fromNullable(null, "empty").isLeft(); // true
Funcio._Either.sequence([
  Funcio._Either.right<string, number>(1),
  Funcio._Either.right<string, number>(2),
]).getOrElse([]); // [1, 2]
Funcio._Either.combine(
  Funcio._Either.right<string, number>(2),
  Funcio._Either.right<string, number>(3),
  (a, b) => a + b,
).getOrElse(0); // 5
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

#### `_Maybe.when(predicate).then(fn).else(fn)`

The `_Maybe.when()` method provides a fluent conditional API for executing different transformations based on a predicate. It supports both boolean values and predicate functions.

```typescript
import Funcio from 'funcio';

const files = [{ path: 'a.ts' }, { path: 'b.js' }, { path: 'c.ts' }];

// Using boolean predicate
const result = Funcio._Maybe.of(files)
  .when(true)
  .then(f => f.filter(file => file.path.endsWith('.ts')))
  .else(f => f)
  .getOrElse([]);

// Result: [{ path: 'a.ts' }, { path: 'c.ts' }]
```

Using a predicate function (receives the inner value):

```typescript
const result = Funcio._Maybe.of(5)
  .when(x => x > 3)
  .then(x => x * 2)
  .else(x => x)
  .getOrElse(0);

// Result: 10
```

With `Nothing` (always executes `else` branch as fallback):

```typescript
const result = Funcio._Maybe.of(null)
  .when(true)
  .then(x => x * 2)
  .else(() => 'fallback')
  .getOrElse('default');

// Result: 'fallback'
```

Chain with other Maybe methods:

```typescript
const result = Funcio._Maybe.of(5)
  .when(true)
  .then(x => x * 2)
  .else(x => x)
  .map(x => x + 1)
  .getOrElse(0);

// Result: 11
```

Wrap result back into Maybe (avoids double-wrapping if callbacks return Maybe):

```typescript
const maybe = Funcio._Maybe.of(5)
  .when(true)
  .then(x => Funcio._Maybe.of(x * 2))
  .else(x => Funcio._Maybe.of(x))
  .toMaybe();

maybe.isJust(); // true
maybe.getOrElse(0); // 10
```

#### `_Maybe.fold / filter / orElse / tap`

```typescript
import Funcio from 'funcio';

Funcio._Maybe.of(5).fold(() => "none", (v) => `just${v}`); // "just5"
Funcio._Maybe.of(10).filter((v) => v > 5).isJust(); // true
Funcio._Maybe.of(null).orElse(Funcio._Maybe.of(9)).getOrElse(0); // 9
```

#### Maybe / Either conversions and traversal

```typescript
import { _Maybe, _Either } from 'funcio';

_Maybe.of(42).toEither('missing').getOrThrow(); // 42
_Maybe.of(null).toEither('missing').value; // 'missing'
_Either.toMaybe(_Either.right(42)).getOrElse(0); // 42
_Either.toMaybe(_Either.left('error')).isNothing(); // true
_Maybe.sequence([_Maybe.just(1), _Maybe.just(2)]).getOrElse([]); // [1, 2]
_Maybe.traverse([1, 2], (x) => _Maybe.just(x * 2)).getOrElse([]); // [2, 4]
```

`sequence` and `traverse` stop on the first `Nothing`; empty inputs produce `Just([])`.
`_Either.toMaybe` preserves explicit `Right` values, even `null`. The historical
`_Maybe.fromNullable` boolean predicate is unchanged.

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

// Result: 6
```

#### `_compose / _pipeFn`

```typescript
import Funcio from 'funcio';

const transform = Funcio._pipeFn(
  (x: number) => x + 2,
  (x: number) => x * x,
); // (x) => ...

transform(2); // 16
Funcio._compose((x: number) => x + 1, (x: number) => x * 2)(5); // 11
```

#### `_pipe.async`

The `_pipe.async` helper composes synchronous and asynchronous functions in order. Each function receives the resolved value from the previous step. TypeScript infers the resolved result and rejects incompatible steps. Promise inputs are also awaited.

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

The `_Array` module groups async-friendly array helpers plus sync collection utilities (chunk, groupBy, zip, range, sortBy...) for working with collections while preserving readable functional flows.

```typescript
import Funcio from 'funcio';

const doubled = await Funcio._Array.mapAsync([1, 2, 3], async (value) => value * 2);
const evens = await Funcio._Array.filterAsync([1, 2, 3, 4], async (value) => value % 2 === 0);
const chunks = Funcio._Array.chunk(2, [1, 2, 3]); // [[1,2],[3]]
const grouped = Funcio._Array.groupBy((x: number) => (x % 2 === 0 ? "even" : "odd"), [1, 2, 3]);

// doubled: [2, 4, 6]
// evens: [2, 4]
```

#### Bounded concurrency and cancellation

`mapAsync` and `filterAsync` accept an optional third argument:

```typescript
const controller = new AbortController();
const names = await Funcio._Array.mapAsync(
  [1, 2, 3],
  async (id, index, array, signal) => {
    const response = await fetch(`/api/users/${id}`, { signal });
    return response.json();
  },
  { concurrency: 2, signal: controller.signal }
);
```

The default remains unlimited concurrency. Results preserve input order.
Concurrency must be a positive integer or `Infinity`. Cancellation rejects with
`AbortError`, even if a callback ignores the signal; pass it to `fetch` to cancel
the underlying request too. Failure or cancellation stops queued work, but
already-running callbacks may continue. Callback errors are not wrapped.

#### Lazy iterables

```typescript
const total = Funcio._Array.lazy([1, 2, 3, 4])
  .filter((x) => x % 2 === 0)
  .map((x) => x * 10)
  .take(1)
  .reduce((sum, x) => sum + x, 0); // 20
```

`lazy(iterable)` supports `map`, `filter`, `flatMap`, `take`, `drop`, `reduce`,
`toArray` and `for...of`. It performs no work until consumed, and `take` does not
read an extra element. Arrays can be consumed repeatedly; generator instances
remain single-use. `take` and `drop` require non-negative integer counts.

#### `_Object.pick / omit / mergeDeep / evolve / hasPath / dissocPath`

```typescript
import Funcio from 'funcio';

Funcio._Object.pick(["a"], { a: 1, b: 2 }); // { a: 1 }
Funcio._Object.omit(["b"], { a: 1, b: 2 }); // { a: 1 }
Funcio._Object.mergeDeep({ a: { x: 1 } }, { a: { y: 2 } }); // { a: { x: 1, y: 2 } }
```

### `_String / _Number`

```typescript
import Funcio from 'funcio';

Funcio._String.capitalize("hello"); // "Hello"
Funcio._String.slugify("Olá Mundo!"); // "ola-mundo"
Funcio._Number.clamp(0, 10, 15); // 10
Funcio._Number.avg([2, 4]); // 3
```

### `_Task`

```typescript
import Funcio from 'funcio';

const result = await Funcio._Task
  .fromPromise(async () => 5)
  .map((v) => v * 2)
  .run();

result.getOrElse(0); // 10
```

Tasks are lazy: each `run()` executes the operation again. Execution controls compose with existing methods:

```typescript
const controller = new AbortController();
const request = Funcio._Task.fromPromise(async (signal) => {
  const response = await fetch('/api/users', { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
});

const result = await request
  .timeout(2000) // Timeout for each attempt
  .retry(2, 100) // Up to 2 additional attempts, 100ms apart
  .run(controller.signal);

// To cancel an in-progress run: controller.abort();
const users = await Funcio._Task.parallel([request, request, request], 2).run();
```

- `retry(retries, delayMs = 0)` retries failures; `retry(0)` runs once.
- `timeout(ms)` returns a `Left` with an error named `TimeoutError` and aborts its operation's signal. Put it after `retry` to limit the entire retry sequence instead.
- `run(signal?)` and `match(handlers, signal?)` accept cancellation. Cancellation returns a `Left` with an error named `AbortError`, skips queued work and stops retries.
- Cancellation is cooperative: pass the supplied signal to APIs such as `fetch`. An operation that ignores it may continue in the background, even after the task returns.
- `parallel(tasks, concurrency = Infinity)` preserves input order, limits active tasks and stops scheduling queued tasks after a failure. Already-running tasks are allowed to finish.
- Invalid retry counts, delays, timeouts or concurrency limits throw `RangeError` when configured.

### `_Validation`

```typescript
import Funcio from 'funcio';

const schema = Funcio._Validation.object({
  name: Funcio._Validation.string().min(2),
  age: Funcio._Validation.number().positive(),
});

schema.safeParse({ name: "Ana", age: 30 }).isRight(); // true
schema.safeParse({ name: "x", age: -1 }).isLeft(); // true (2 issues accumulated)
```

Additional schemas and composable modifiers:

```typescript
import { _Validation as v, type Infer } from 'funcio';

const userSchema = v.object({
  name: v.string().min(2),
  nickname: v.string().optional(),
  email: v.string().email().nullable(),
  active: v.boolean().default(true),
  role: v.enum(['admin', 'user']),
  id: v.union([v.string(), v.number().int()]),
  age: v.number().refine((age) => age >= 18, 'Must be an adult'),
});

type User = Infer<typeof userSchema>; // nickname is an optional property
const result = userSchema.safeParse({
  name: 'Ana', email: null, role: 'user', id: 1, age: 30,
}); // Right: active defaults to true
```

- `optional()` accepts `undefined`; `nullable()` accepts `null`. Combine them to accept both.
- `default(value)` replaces only `undefined`, validates the default and removes `undefined` from the inferred output type.
- `enum(values)` accepts a non-empty tuple of string literals.
- `union(schemas)` returns the first successful alternative, or accumulates all alternative issues if none match.
- `refine(predicate, message?)` checks a successfully parsed value, including entire objects and arrays. Predicates should return a boolean; exceptions thrown by user predicates propagate.
- `safeParse` returns `Either<ValidationIssue[], T>` with nested error paths; `parse` throws on invalid input. Apply type-specific checks such as `.min()` before generic modifiers such as `.optional()`.

#### Transformations, extra schemas and asynchronous validation

```typescript
import { _Validation as v } from 'funcio';

const length = v.string().min(2).transform((text) => text.length);
length.parse('hello'); // 5, inferred as number

v.coerce.number().parse('42'); // 42
v.literal('ok').parse('ok'); // 'ok'
v.tuple([v.literal('ok'), v.number()]).parse(['ok', 42]);
v.record(v.number()).parse({ score: 42 });
v.date().parse(new Date()); // a copy of a valid Date

const user = v.object({ name: v.string() });
user.parse({ name: 'Ana', extra: 1 }); // { name: 'Ana' } (unchanged default)
user.strict().safeParse({ name: 'Ana', extra: 1 }).isLeft(); // true
user.passthrough().parse({ name: 'Ana', extra: 1 }); // keeps extra
user.strict().strip(); // explicitly restore the default

const availableName = v.string()
  .refineAsync(async (name) => name !== 'taken', 'Name unavailable')
  .transformAsync(async (name) => name.toUpperCase());

await v.object({ name: availableName }).parseAsync({ name: 'ana' });
// { name: 'ANA' }
```

- `transform` and `transformAsync` run only after successful validation and infer
  the transformed output type. Thrown transformation errors become issues.
- `refineAsync` supports asynchronous predicates; failures and thrown errors
  become validation issues.
- Use `parseAsync` / `safeParseAsync` for async schemas, including nested objects,
  arrays, unions, tuples, records and generic modifiers. Synchronous parsing of
  an async schema throws an explanatory error instead of silently skipping checks.
- Coercion is **opt-in** and uses JavaScript's `String`, `Number`, `Boolean` and
  `Date` conversions, followed by validation. In particular, `Boolean('false')`
  is `true`. Normal validators do not coerce.
- Object policies return new schemas and do not change the original schema.
  Tuples require an exact length; records validate all enumerable own string keys.

### `_tap / _once / _memoize / _flip`

```typescript
import Funcio from 'funcio';

const tapped = Funcio._tap<number>(console.log); // (v) => v with side effect
const runOnce = Funcio._once(() => Math.random());
const cached = Funcio._memoize((x: number) => x * 2);
const flipped = Funcio._flip((a: number, b: number) => a - b); // (b, a) => a - b
```

### `_curry`

The `_Curry` function in the Funcio library is a powerful tool for enabling currying, a fundamental concept in functional programming. Currying allows you to transform a function that takes multiple arguments into a series of functions, each accepting a single argument. This technique enhances code readability, reusability, and composability.

The `_curry(fn)` method transforms a regular function into a curried function. Once curried, you can partially apply arguments one at a time, creating new functions along the way.

Grouped arguments and placeholders are also supported without changing unary application:

```typescript
import { _curry, _placeholder } from 'funcio';

const sum = _curry((a: number, b: number, c: number) => a + b + c);
sum(1)(2)(3); // 6
sum(1, 2)(3); // 6
sum(1, _placeholder, 3)(2); // 6
// _curry.placeholder is the same placeholder.
```

Partial applications are reusable. Arity is still determined by `fn.length`,
so parameters after the first default parameter and rest parameters are not
counted toward the required arguments.

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

response // 4
```

Use `.exhaustive()` to require complete coverage of literal/discriminated unions
or an explicit fallback:

```typescript
import { _match } from 'funcio';

type State = { kind: 'ok', value: number } | { kind: 'error', message: string };
const render = (state: State): string => _match<State, string>(state)
  .with({ kind: 'ok' }, (value) => String(value.value))
  .with({ kind: 'error' }, (value) => value.message)
  .exhaustive();
```

Removing either branch makes `.exhaustive()` a TypeScript error. Arbitrary
predicates do not prove coverage; use `._(() => fallback)` for those cases.
Constructor patterns (`String`, `Number`, `Boolean`, `Symbol`) check primitive
types. `.exec()` retains its historical permissive typing and returns `null`
when there is no match or fallback. `.exhaustive()` has a checked result type
and throws if an unsafe cast bypasses coverage.

## Contributions 🤝

We extend a warm welcome to contributions from the open-source community. If you have ideas or a desire to contribute to Funcio, please explore our [GitHub repository](https://github.com/levi5/funcio.git) and submit a pull request.

### Development and verification

Use Node.js 24 (`nvm use`) for development. The CI also checks the library on
Node.js 22 and 26. Both lockfiles are committed; use `npm ci` for reproducible
installs.

```sh
npm ci
npm run lint
npm run typecheck
npm test -- --run
npm run coverage
npm run test:package
npm --prefix web ci
npm --prefix web run build
```

`lint` is read-only; `lint:fix` applies supported fixes. `build` generates
CommonJS, native ESM and declarations. Internal imports use `@funcio/*`;
`tsc-alias` rewrites these to relative paths in **both JavaScript and declarations**,
so package consumers do not need aliases or extra runtime dependencies.

The [documentation site](web/README.md) uses `@/*` for site imports and bundles
the library from this checkout, including playground workers. Its header, hero,
structured data and HTML version metadata all read the root `package.json`
version. No generated version file, hardcoded CDN version or npm lookup is
required; changing the library version automatically updates the next site build.

GitHub Actions checks lint, types, tests, coverage, package entry points, runnable
documentation examples and the production site. Pages deployment runs these
checks before uploading, while npm publishing remains tag-driven. Dependabot
checks library tooling, website dependencies and Actions weekly.

Tooling uses TypeScript 6, Vitest 5 with V8 coverage, and Biome 2 for linting
the library and website. The website uses React 19 and Vite 8. The library
still has no runtime dependencies.

## License 📜

Funcio is released under the [MIT License](LICENSE.txt).

---

Embark on a thrilling journey into the realm of functional programming with Funcio! 🌟
