import arraySource from '@funcio/Array/asyncMethods.ts?raw'
import lazySource from '@funcio/Array/lazy.ts?raw'
import syncArraySource from '@funcio/Array/syncMethods.ts?raw'
import composeSource from '@funcio/function/Compose/compose.ts?raw'
import currySource from '@funcio/function/Curry/curry.ts?raw'
import matchSource from '@funcio/function/Match/match.ts?raw'
import pipeSource from '@funcio/function/Pipe/pipe.ts?raw'
import fnUtilsSource from '@funcio/function/Utils/fnUtils.ts?raw'
import eitherCombinatorsSource from '@funcio/Monads/Either/combinators.ts?raw'
import eitherLeftSource from '@funcio/Monads/Either/left.ts?raw'
import eitherRightSource from '@funcio/Monads/Either/right.ts?raw'
import eitherTrySource from '@funcio/Monads/Either/try.ts?raw'
import maybeJustSource from '@funcio/Monads/Maybe/just.ts?raw'
import maybeCoreSource from '@funcio/Monads/Maybe/maybe.ts?raw'
import maybeNothingSource from '@funcio/Monads/Maybe/nothing.ts?raw'
import numberSource from '@funcio/Number/index.ts?raw'
import chainifySource from '@funcio/Object/Chainify/index.ts?raw'
import makeImmutableSource from '@funcio/Object/Immutable/makeImmutable.ts?raw'
import setPathSource from '@funcio/Object/Immutable/setPathValue.ts?raw'
import stringSource from '@funcio/String/index.ts?raw'
import taskSource from '@funcio/Task/task.ts?raw'
import validationSource from '@funcio/Validation/validation.ts?raw'
import type { ImplementationDoc } from './types'

type Excerpt = { code: string; startLine: number; endLine: number }

const excerpt = (source: string, start: string, end?: string): Excerpt => {
  const from = source.indexOf(start)
  const to = end === undefined ? source.length : source.indexOf(end, from + start.length)
  if (from === -1 || to === -1) throw new Error(`Implementation excerpt not found: ${start}`)

  const code = source.slice(from, to).trimEnd()
  const startLine = source.slice(0, from).split('\n').length
  const endLine = startLine + (code.match(/\n/g)?.length ?? 0)
  return { code, startLine, endLine }
}

/** Excerpt plus the file it came from, so each step can link to GitHub. */
const cut = (sourceFile: string, source: string, start: string, end?: string) => ({
  source: sourceFile,
  ...excerpt(source, start, end)
})

const CURRY = 'src/function/Curry/curry.ts'
const PIPE = 'src/function/Pipe/pipe.ts'
const COMPOSE = 'src/function/Compose/compose.ts'
const FN_UTILS = 'src/function/Utils/fnUtils.ts'
const MATCH = 'src/function/Match/match.ts'
const MAYBE_JUST = 'src/Monads/Maybe/just.ts'
const MAYBE_NOTHING = 'src/Monads/Maybe/nothing.ts'
const MAYBE_CORE = 'src/Monads/Maybe/maybe.ts'
const EITHER_TRY = 'src/Monads/Either/try.ts'
const EITHER_RIGHT = 'src/Monads/Either/right.ts'
const EITHER_LEFT = 'src/Monads/Either/left.ts'
const EITHER_COMBINATORS = 'src/Monads/Either/combinators.ts'
const SET_PATH = 'src/Object/Immutable/setPathValue.ts'
const MAKE_IMMUTABLE = 'src/Object/Immutable/makeImmutable.ts'
const CHAINIFY = 'src/Object/Chainify/index.ts'
const ARRAY_ASYNC = 'src/Array/asyncMethods.ts'
const ARRAY_LAZY = 'src/Array/lazy.ts'
const ARRAY_SYNC = 'src/Array/syncMethods.ts'
const STRING = 'src/String/index.ts'
const NUMBER = 'src/Number/index.ts'
const TASK = 'src/Task/task.ts'
const VALIDATION = 'src/Validation/validation.ts'

export const curryImplementation: ImplementationDoc = {
  source: CURRY,
  techniques: ['Closures', 'Partial application', 'Recursion', 'Immutable argument collection'],
  steps: [
    {
      title: 'Represent a missing argument',
      ...cut(CURRY, currySource, 'export const _placeholder:', '\n\n'),
      explanation:
        'A unique symbol marks a hole without confusing it with ordinary values such as undefined. The same symbol is exposed as _curry.placeholder.'
    },
    {
      title: 'Capture arguments without mutating previous calls',
      ...cut(CURRY, currySource, 'function curry (fn:', '    // Only fill holes'),
      explanation:
        'collect returns a closure over previous arguments. slice creates a fresh array for each call, so a partial application can be reused without later calls changing its saved arguments.'
    },
    {
      title: 'Fill earlier holes, then append new arguments',
      ...cut(CURRY, currySource, '    // Only fill holes', '    return args.length'),
      explanation:
        'The loop consumes incoming arguments from left to right to fill existing placeholders. Remaining arguments are appended. Holes introduced by the current call stay open until another call.'
    },
    {
      title: 'Execute or return another partial application',
      ...cut(CURRY, currySource, '    return args.length', '\n\nconst placeholder:'),
      explanation:
        'Once the required positions are present and contain no placeholders, Reflect.apply invokes the function. Otherwise collect creates the next closure. Zero-arity functions execute immediately.'
    },
    {
      title: 'Expose the placeholder on the public function',
      ...cut(CURRY, currySource, 'const placeholder:'),
      explanation: 'Object.assign attaches the shared placeholder symbol to curry and exports the resulting function.'
    }
  ],
  tradeoffs:
    'Arity comes from fn.length: default and rest parameters can make that smaller than expected. Each partial call copies arguments, trading allocation for reusable state. Reflect.apply uses null as this; method receivers are not preserved.'
}

export const pipeImplementation: ImplementationDoc = {
  source: PIPE,
  techniques: ['Function composition', 'Left fold (reduce)', 'TypeScript overloads'],
  steps: [
    {
      title: 'Describe the pipeline result',
      ...cut(PIPE, pipeSource, 'function pipe<T,', '\nfunction pipe ('),
      explanation:
        'The public overload relates the input and function tuple to Pipeline, a type-level helper. These types are erased at runtime; the implementation below performs the actual work.'
    },
    {
      title: 'Pass each result to the next function',
      ...cut(PIPE, pipeSource, 'function pipe (', '\n\nexport const _pipe'),
      explanation:
        'reduce starts with input and processes functions left to right. Each return value becomes previousValue for the next step. An empty pipeline returns input unchanged. Reflect.apply invokes each step with the function itself as this.'
    },
    {
      title: 'Attach the asynchronous variant',
      ...cut(PIPE, pipeSource, 'export const _pipe'),
      explanation:
        'The intersection type describes a callable function with an async property. The assignment attaches asyncPipe at runtime; it is available as _pipe.async.'
    },
    {
      title: 'Await each asynchronous step in order',
      ...cut(PIPE, pipeSource, 'export async function asyncPipe (', '\n\nfunction pipe<T,'),
      explanation:
        'The promise accumulator starts with Promise.resolve(input). Every callback awaits the preceding result before invoking the next step, accepting synchronous and asynchronous functions. A thrown error or rejected promise rejects the pipeline.'
    }
  ],
  tradeoffs:
    'The synchronous variant does not await promises. The async variant is deliberately sequential, not parallel. Both visit every step once; exceptions stop subsequent steps.'
}

export const asyncPipeImplementation: ImplementationDoc = {
  source: PIPE,
  techniques: ['Promise accumulator', 'Sequential await', 'Overload inference'],
  steps: [
    {
      title: 'Declare overloads for the common arities',
      ...cut(PIPE, pipeSource, 'export function asyncPipe<T> (input: T): Promise', 'export async function asyncPipe'),
      explanation:
        'The overloads describe how each step receives the awaited output of the previous one. The variadic overload is the fallback for longer pipelines; all of this is erased at runtime.'
    },
    {
      title: 'Await before calling each step',
      ...cut(PIPE, pipeSource, 'export async function asyncPipe', '\n\nfunction pipe<T,'),
      explanation:
        'reduce starts with Promise.resolve(input). Its async callback awaits the accumulator before Reflect.apply, so the next function always receives a resolved value. Any rejection rejects the returned promise.'
    }
  ],
  tradeoffs:
    'The async pipeline is sequential by design: independent steps are not run in parallel. Promise inputs are awaited, but a synchronous throw inside a step also rejects the pipeline. The reduce allocates one promise per step.'
}

export const pipeFnImplementation: ImplementationDoc = {
  source: COMPOSE,
  techniques: ['Closures', 'Left fold (reduce)', 'Data-last API'],
  steps: [
    {
      title: 'Keep the function list until the value arrives',
      ...cut(COMPOSE, composeSource, 'export const _pipeFn'),
      explanation:
        'The returned closure captures fns and applies them with a left reduce when called. That is the reusable, data-last version of _pipe: build the transformation once, then feed it many inputs.'
    }
  ],
  tradeoffs:
    'The result type is unknown, so annotate the factory when type inference matters. The closure keeps the function references alive for as long as it exists. Exceptions propagate and an empty list returns the input unchanged.'
}

export const composeImplementation: ImplementationDoc = {
  source: COMPOSE,
  techniques: ['Closures', 'reduceRight', 'Data-last function factories'],
  steps: [
    {
      title: 'Compose right-to-left',
      ...cut(COMPOSE, composeSource, 'export const _compose', '\n\n/**'),
      explanation:
        'The returned function keeps the original list in a closure. reduceRight starts from the input and applies the last function first, producing the familiar compose(f, g)(x) === f(g(x)) order.'
    },
    {
      title: 'Build the data-last pipe',
      ...cut(COMPOSE, composeSource, 'export const _pipeFn'),
      explanation:
        'The twin helper keeps a function list and applies it with a left reduce when the value arrives. That makes the resulting function reusable across many inputs.'
    }
  ],
  tradeoffs:
    'Both helpers type the result as unknown, so callers may need annotations in TypeScript. Functions are invoked without a receiver, and an empty composition simply returns its input. Exceptions propagate to the caller.'
}

export const fnUtilsImplementation: ImplementationDoc = {
  source: FN_UTILS,
  techniques: ['Closures', 'Memoization', 'Argument adaptation'],
  steps: [
    {
      title: 'Observe without changing the value',
      ...cut(FN_UTILS, fnUtilsSource, 'export const _tap', '\n\n/**'),
      explanation:
        'The returned function runs the side effect and then returns the original value. The effect cannot replace the value, which makes _tap safe inside a pipeline.'
    },
    {
      title: 'Guard a function with a closure',
      ...cut(FN_UTILS, fnUtilsSource, 'export const _once', '\n\n/**'),
      explanation:
        'called starts as false and the first result is stored. Later calls skip fn and return that stored result, including undefined.'
    },
    {
      title: 'Cache results by key',
      ...cut(FN_UTILS, fnUtilsSource, 'export const _memoize', '\n\n/**'),
      explanation:
        'A Map keeps the cache local to the returned function. The default key is JSON.stringify(args); pass a resolver when argument order, symbols or large objects make that unsuitable.'
    },
    {
      title: 'Swap the first two arguments',
      ...cut(FN_UTILS, fnUtilsSource, 'export const _flip'),
      explanation:
        'The wrapper receives b and a and calls the original function in the original order. This is useful when adapting binary functions to a data-last style.'
    }
  ],
  tradeoffs:
    '_memoize assumes pure functions and retains every cached result for the lifetime of the wrapper. JSON.stringify loses functions, symbols and undefined and can collide for objects with different key order. _once caches undefined and does not release captured arguments.'
}

export const matchImplementation: ImplementationDoc = {
  source: MATCH,
  techniques: ['Builder pattern', 'Pattern matching', 'Recursive comparison', 'Type-level coverage'],
  steps: [
    {
      title: 'Start an immutable chain of patterns',
      ...cut(MATCH, matchSource, 'export const _match', '\n\nconst matchPattern'),
      explanation:
        '_match seeds the builder with the value and an empty pattern list. Every call to with or _ returns a new builder object; the earlier one is never mutated.'
    },
    {
      title: 'Register cases and a fallback',
      ...cut(MATCH, matchSource, 'const patternBuilder', '    exec:'),
      explanation:
        'with appends the pattern and its handler. _ stores the fallback separately. Execution is deferred until exec or exhaustive is called, so the declaration order is preserved.'
    },
    {
      title: 'Match constructors and primitive values',
      ...cut(MATCH, matchSource, 'const matchPattern', '  if (Array.isArray(pattern))'),
      explanation:
        'String, Number, Boolean and Symbol are treated as constructor patterns. Literal strings, numbers, booleans, symbols and nullish values compare directly; Number explicitly rejects NaN.'
    },
    {
      title: 'Match arrays, predicates and object shapes',
      ...cut(MATCH, matchSource, '  if (Array.isArray(pattern))', '  return $isObject(pattern)'),
      explanation:
        'Arrays require the same length and compare every position recursively. A function pattern is a predicate and must return exactly true; a thrown predicate is treated as false.'
    },
    {
      title: 'Object patterns are partial',
      ...cut(MATCH, matchSource, '  return $isObject(pattern)', '\n}\n\nconst unmatched'),
      explanation:
        'Only the keys listed in the pattern are checked, which makes object patterns ideal for matching tagged payloads without spelling out every field. Extra keys on the value are ignored.'
    },
    {
      title: 'Execute the first match',
      ...cut(MATCH, matchSource, '    exec: (): R => {', '    exhaustive:'),
      explanation:
        'patterns.find keeps declaration order, so the first matching case wins. If nothing matches, exec calls the fallback; the default fallback returns null.'
    },
    {
      title: 'Exhaustiveness is checked at runtime too',
      ...cut(MATCH, matchSource, '    exhaustive:'),
      explanation:
        'The type-level API only allows exhaustive when every case is covered. At runtime it still throws when no pattern matches and no fallback was registered.'
    }
  ],
  tradeoffs:
    'Patterns are tried in order, so broad predicates before specific literals can shadow later cases. Object matching is partial and recursive, not a structural identity check. Predicate errors are swallowed as false. Symbols compare by description, and Number never matches NaN.'
}

export const maybeImplementation: ImplementationDoc = {
  source: MAYBE_JUST,
  techniques: ['Class hierarchy', 'Tagged variants', 'Nullish-aware map', 'Short-circuiting'],
  steps: [
    {
      title: 'Store a private value and a tag',
      ...cut(
        MAYBE_JUST,
        maybeJustSource,
        'export class Just<T>',
        '  /**\n   * Checks if the Maybe instance is a Just.'
      ),
      explanation:
        'Just extends the shared _Maybe base and keeps the value in a private field. The tag identifies the runtime variant without exposing the field, while isJust and isNothing describe the branch.'
    },
    {
      title: 'map protects the rest of the chain',
      ...cut(MAYBE_JUST, maybeJustSource, '  public map<R>', '  public flatMap<R extends _Maybe>'),
      explanation:
        'The callback runs only for a Just. Its result is passed through _Maybe.fromNullable, so returning null or undefined turns the next step into Nothing instead of leaking a nullable value.'
    },
    {
      title: 'flatMap composes functions that already return a Maybe',
      ...cut(MAYBE_JUST, maybeJustSource, '  public flatMap<R extends _Maybe>', '  public chain<R extends _Maybe>'),
      explanation:
        'flatMap returns the callback result directly, avoiding Just(Just(value)). chain is a readable alias for the same operation.'
    },
    {
      title: 'Nothing ignores transformations',
      ...cut(MAYBE_NOTHING, maybeNothingSource, '  public map<R>', '  public flatMap<R extends _Maybe>'),
      explanation:
        'Both variants implement the same interface. Nothing returns itself from map, flatMap and filter, so absent values short-circuit without null checks at each step.'
    },
    {
      title: 'Choose the variant at construction time',
      ...cut(MAYBE_CORE, maybeCoreSource, '  static fromNullable<T>', '\n}'),
      explanation:
        'fromNullable is a predicate; of uses it to pick Just or Nothing. Note that Just.of explicitly wraps any value, including null, while _Maybe.of(null) produces Nothing.'
    }
  ],
  tradeoffs:
    'get() on Nothing returns an ExtractValueError object instead of throwing, which is easy to miss. A Just can still hold null when constructed directly with Just.of. The when builder mutates its own branch fields and is not reusable. Callbacks in map are not wrapped: an exception escapes the chain.'
}

export const eitherImplementation: ImplementationDoc = {
  source: EITHER_TRY,
  techniques: ['Discriminated unions', 'try/catch lifting', 'Short-circuiting', 'Value objects'],
  steps: [
    {
      title: 'Lift synchronous code into Either',
      ...cut(EITHER_TRY, eitherTrySource, 'export const syncTry', '\n\n/**\n * Object containing'),
      explanation:
        'A successful call becomes Right(result). A thrown value becomes Left(error) with the original value preserved. The Promise guard prevents an async function from silently producing a Right(Promise).'
    },
    {
      title: 'Lift asynchronous code without losing the error',
      ...cut(EITHER_TRY, eitherTrySource, 'export const asyncTry', '\n\n/**\n * Wraps a synchronous'),
      explanation:
        'asyncTry awaits the operation inside the same try/catch. Rejections become Left, so the caller can keep using map and flatMap instead of a second error-handling style.'
    },
    {
      title: 'Right transforms; Left is inert',
      ...cut(EITHER_RIGHT, eitherRightSource, '    map<NR>', '    getOrElse<DefaultValue>'),
      explanation:
        'map wraps the transformed value in a new Right, mapLeft returns the same Right, and flatMap delegates to the callback so nested Eithers stay flat. orElse does nothing because there is no error to recover from.'
    },
    {
      title: 'Left preserves the failure',
      ...cut(EITHER_LEFT, eitherLeftSource, '    map<NR>', '    getOrElse<DefaultValue>'),
      explanation:
        'The mirror image: map and flatMap return a Left unchanged, while mapLeft transforms the stored error. The chain can carry the failure until a single match or fold handles it.'
    },
    {
      title: 'Match is the single exit',
      ...cut(EITHER_RIGHT, eitherRightSource, '    match<T>', '    map<NR>'),
      explanation:
        'match calls exactly one handler and returns its result. Left implements the same signature, so both branches are forced to produce the same output type.'
    },
    {
      title: 'sequence stops at the first Left',
      ...cut(EITHER_COMBINATORS, eitherCombinatorsSource, 'export const sequence', '\n\n/**\n * Combine'),
      explanation:
        'The loop copies Right values into an array and returns immediately on the first Left. That makes it the Either analogue of Promise.all, but failures short-circuit instead of being collected.'
    }
  ],
  tradeoffs:
    'The variants are plain objects created on every operation, not classes. syncTry only rejects values that are instanceof Promise, so generic thenables can still slip through. getOrThrow throws the stored Left when it is an Error and wraps anything else. Thrown non-Error values are typed as Error but preserved at runtime.'
}

export const objectImplementation: ImplementationDoc = {
  source: SET_PATH,
  techniques: ['Structural sharing', 'Recursion', 'Immutable updates'],
  steps: [
    {
      title: 'Reject paths that cannot be written',
      ...cut(SET_PATH, setPathSource, 'export const setByPath', '  const source ='),
      explanation:
        'An empty path or a non-object target is returned unchanged. This keeps the helper total and avoids inventing a container when there is nothing to update.'
    },
    {
      title: 'Create missing intermediate containers',
      ...cut(SET_PATH, setPathSource, '  const source =', '  const cloned'),
      explanation:
        "When the first key is absent, the code installs an empty array for the next numeric key or an empty object otherwise. That lets setByPath(['a', 'b'], 1, {}) create the full path."
    },
    {
      title: 'Clone only the current level',
      ...cut(SET_PATH, setPathSource, '  const cloned', '  if (typeof newObj[currentKey]'),
      explanation:
        'Arrays are copied with spread and objects with object spread. Untouched branches keep their original references, which is the structural sharing that makes immutable updates cheap.'
    },
    {
      title: 'Recurse or assign the final value',
      ...cut(SET_PATH, setPathSource, '  if (typeof newObj[currentKey]'),
      explanation:
        'The last key receives the value; earlier keys recurse into the cloned child. Each recursive call clones its own level, so the original object and every ancestor remain untouched.'
    }
  ],
  tradeoffs:
    'Only string and number path segments are supported. The function creates defaults eagerly, so a typo in a path may add a branch instead of failing. Untouched nested objects are still shared, so mutating them directly would be visible through the new object. Symbol keys cannot be used in the path.'
}

export const makeImmutableImplementation: ImplementationDoc = {
  source: MAKE_IMMUTABLE,
  techniques: ['Recursive freeze', 'Defensive copying', 'Cycle detection via frozen state'],
  steps: [
    {
      title: 'Freeze children before the parent',
      ...cut(MAKE_IMMUTABLE, makeImmutableSource, 'export const deepFreeze', '\n\n/**'),
      explanation:
        'deepFreeze walks every enumerable key, recursing only into objects that are not already frozen. Children are frozen before the parent, and Object.isFrozen doubles as the cycle guard for already-processed branches.'
    },
    {
      title: 'Copy first, then freeze the copy',
      ...cut(MAKE_IMMUTABLE, makeImmutableSource, 'const makeImmutable'),
      explanation:
        'The helper clones the input with $copy and freezes the clone. Your original object stays writable, while the returned graph is deeply frozen. Arrays, Dates, RegExps, Maps and Sets get their own copies.'
    }
  ],
  tradeoffs:
    'The traversal only follows enumerable string keys, so symbol keys and non-enumerable properties are not deeply frozen. Cyclic structures are not supported. Map, Set and Date contents can still be mutated through their methods even when the container is frozen. Functions are returned as-is.'
}

export const chainifyImplementation: ImplementationDoc = {
  source: CHAINIFY,
  techniques: ['Proxy', 'Reflect', 'Method wrapping'],
  steps: [
    {
      title: 'Intercept property access',
      ...cut(CHAINIFY, chainifySource, 'export const _chainify', '  get (target, property, receiver)'),
      explanation:
        'new Proxy returns a wrapper around the original object. The get trap runs for every property read, including methods, without changing the target itself.'
    },
    {
      title: 'Pass values through untouched',
      ...cut(
        CHAINIFY,
        chainifySource,
        '  get (target, property, receiver)',
        "    if (typeof method !== 'function') return method"
      ),
      explanation:
        'Symbol properties and non-function values are read with Reflect.get and returned as-is. A plain property access therefore behaves exactly like it does on the original object.'
    },
    {
      title: 'Turn undefined results into the proxy',
      ...cut(CHAINIFY, chainifySource, "    if (typeof method !== 'function') return method"),
      explanation:
        'Method calls are applied with the original target as this. When the method returns undefined, the trap returns the proxy instead, which is what makes a chain continue; a real return value ends the chain.'
    }
  ],
  tradeoffs:
    'chainify only helps with methods that return undefined. Returning a value stops the chain even when it is the object itself. Property writes and reads are not trapped beyond get, and proxying has a small runtime cost. Private class fields still see the real target, while the receiver passed to getters changes.'
}

export const lazyArrayImplementation: ImplementationDoc = {
  source: ARRAY_LAZY,
  techniques: ['Generators', 'Deferred execution', 'Iterable protocol', 'Lazy pipelines'],
  steps: [
    {
      title: 'Wrap the source without consuming it',
      ...cut(ARRAY_LAZY, lazySource, 'export class LazyArray', '  map<R>'),
      explanation:
        'LazyArray stores an Iterable and delegates Symbol.iterator to it. Constructing the wrapper does not loop over the source, so an infinite generator can be passed safely.'
    },
    {
      title: 'Build a new generator for each stage',
      ...cut(ARRAY_LAZY, lazySource, '  map<R>', '  filter ('),
      explanation:
        'map returns a new LazyArray whose iterator pulls one value at a time and applies the callback. Nothing is allocated until the final consumer asks for values.'
    },
    {
      title: 'Stop pulling once take is satisfied',
      ...cut(ARRAY_LAZY, lazySource, '  take (count', '  drop (count'),
      explanation:
        'take counts down inside its generator and returns as soon as the requested number of values is produced. That is what allows infinite sources to terminate when paired with a fence such as take.'
    },
    {
      title: 'Consume exactly once',
      ...cut(ARRAY_LAZY, lazySource, '  reduce<R>', '\n}\n\nexport const lazy'),
      explanation:
        'reduce and toArray are eager terminals. Each iteration restarts the pipeline from the original source; arrays can be iterated again, while generator instances cannot.'
    }
  ],
  tradeoffs:
    'The pipeline has no cache: iterating twice runs the callbacks twice. A one-shot generator is exhausted after the first terminal operation. Errors thrown by callbacks surface during iteration. take does not over-read, but filter still scans until it finds enough matching values.'
}

export const syncArrayImplementation: ImplementationDoc = {
  source: ARRAY_SYNC,
  techniques: ['Index stepping', 'Set-based deduplication', 'reduce', 'Non-mutating copies'],
  steps: [
    {
      title: 'Chunk with a stride',
      ...cut(ARRAY_SYNC, syncArraySource, 'export const chunk', '\n\nexport const uniq'),
      explanation:
        'The loop advances by size and slices each window. A non-positive size returns an empty array instead of looping forever. slice copies the values, so the input array is not mutated.'
    },
    {
      title: 'Deduplicate with a Set',
      ...cut(ARRAY_SYNC, syncArraySource, 'export const uniq', '\n\nexport const uniqBy'),
      explanation:
        'Spread turns the Set back into an array, preserving first-seen order. uniqBy applies the same idea to a derived key, building the key once per item and filtering subsequent duplicates.'
    },
    {
      title: 'Group into buckets with reduce',
      ...cut(ARRAY_SYNC, syncArraySource, 'export const groupBy', '\n\nexport const partition'),
      explanation:
        'Each item is converted to a string key, the bucket is created on first use, and the item is pushed. The result is a plain object whose key order follows first appearance.'
    },
    {
      title: 'Zip stops at the shorter list',
      ...cut(ARRAY_SYNC, syncArraySource, 'export const zip', '\n\nexport const zipWith'),
      explanation:
        'Math.min chooses the safe length. Array.from builds the pairs by index, so neither input is read past its end. zipWith maps the same pairs through the supplied function.'
    },
    {
      title: 'Range respects direction and step',
      ...cut(ARRAY_SYNC, syncArraySource, 'export const range', '\n\nexport const sortBy'),
      explanation:
        'Only a positive step with start < end or a negative step with start > end produces values. A zero step returns early, avoiding an infinite loop. The bounds are exclusive on the far side.'
    },
    {
      title: 'Sort a copy, not the input',
      ...cut(ARRAY_SYNC, syncArraySource, 'export const sortBy', '\n\nexport const take'),
      explanation:
        'Spread copies the array before sort, so the caller keeps its original order. The comparator computes each key once per comparison and compares numbers or strings with < and >.'
    }
  ],
  tradeoffs:
    'groupBy stringifies keys, so 1 and "1" collide. sortBy recomputes the key during comparisons and uses the default relational ordering rather than a locale-aware collation. chunk returns [] for a non-positive size instead of throwing. None of these helpers deep-copy their items.'
}

export const mapAsyncImplementation: ImplementationDoc = {
  source: ARRAY_ASYNC,
  techniques: ['Worker pool', 'Closures', 'Indexed result storage', 'Cooperative cancellation'],
  steps: [
    {
      title: 'Define concurrency and cancellation options',
      ...cut(ARRAY_ASYNC, arraySource, 'export interface AsyncArrayOptions', '/** Preserves input order'),
      explanation:
        'Callers can set a concurrency limit and an AbortSignal. The aborted helper creates an Error named AbortError, used consistently for cancellation.'
    },
    {
      title: 'Validate options before starting work',
      ...cut(ARRAY_ASYNC, arraySource, 'export const mapAsync', '  return await new Promise'),
      explanation:
        'The callback may return a value or a promise. Concurrency defaults to Infinity and must be a positive integer or Infinity. An already-aborted signal rejects before any callback starts.'
    },
    {
      title: 'Prepare ordered storage and shared scheduling state',
      ...cut(ARRAY_ASYNC, arraySource, '  return await new Promise', '    const cleanup'),
      explanation:
        'Results are allocated up front. Only existing array indices are queued, so sparse slots become undefined without invoking the callback for a hole. Workers share next and stopped through a closure.'
    },
    {
      title: 'Centralize failure and clean up the abort listener',
      ...cut(ARRAY_ASYNC, arraySource, '    const cleanup', '    const worker'),
      explanation:
        'fail stops queued work, removes the listener and rejects with the original error. The abort listener uses the same path. Cancellation does not forcibly terminate callbacks that are already running.'
    },
    {
      title: 'Let workers claim indices and await callbacks',
      ...cut(ARRAY_ASYNC, arraySource, '    const worker', '    Promise.all'),
      explanation:
        'Each worker claims an index before awaiting, so another worker cannot claim that same item. Results are written to their original positions, preserving input order regardless of completion order. Callback failures enter the shared failure path.'
    },
    {
      title: 'Start a bounded pool and finish together',
      ...cut(ARRAY_ASYNC, arraySource, '    Promise.all', '\n\nexport const filterAsync'),
      explanation:
        'At most min(number of queued indices, concurrency) workers start. Promise.all waits for them, cleans up the listener and resolves the ordered result. If failure already rejected the outer promise, a later resolve cannot change it.'
    }
  ],
  tradeoffs:
    'Input indices and results require O(n) storage. Unlimited concurrency can overwhelm external services; set a limit for network work. Already-running callbacks may continue after rejection: pass their fourth argument, signal, to abort-aware operations such as fetch.'
}

export const stringImplementation: ImplementationDoc = {
  source: STRING,
  techniques: ['Unicode normalization', 'Regular expressions', 'Pure functions'],
  steps: [
    {
      title: 'Capitalize only the first code unit',
      ...cut(STRING, stringSource, 'export const capitalize', 'export const uncapitalize'),
      explanation:
        'The empty string is returned unchanged; otherwise the first character is uppercased and the rest is appended. This is intentionally simpler than full locale-aware title casing.'
    },
    {
      title: 'Normalize before slugifying',
      ...cut(STRING, stringSource, 'export const slugify', 'export const toCamelCase'),
      explanation:
        'NFD splits accented characters from their marks, and the combining-mark regex removes them. Lowercasing, trimming, removing punctuation and collapsing separators produce a stable URL slug.'
    },
    {
      title: 'Convert separators to camel case',
      ...cut(STRING, stringSource, 'export const toCamelCase', 'export const toSnakeCase'),
      explanation:
        'The regex consumes runs of dashes, underscores or spaces and uppercases the following character. A leading uppercase letter is lowered so PascalCase becomes camelCase.'
    }
  ],
  tradeoffs:
    'String helpers operate on UTF-16 code units, so emoji and some scripts can split at the first character. slugify is ASCII-oriented and drops characters outside a-z0-9 rather than transliterating them. None of the helpers mutate their input.'
}

export const numberImplementation: ImplementationDoc = {
  source: NUMBER,
  techniques: ['Pure arithmetic', 'Guard clauses', 'Fixed-precision rounding'],
  steps: [
    {
      title: 'Clamp between two bounds',
      ...cut(NUMBER, numberSource, 'export const clamp', 'export const inRange'),
      explanation:
        'Math.max enforces the lower bound and Math.min enforces the upper one. The order matters: reversing it would let the upper bound win before the lower bound is applied.'
    },
    {
      title: 'Round with a decimal factor',
      ...cut(NUMBER, numberSource, 'export const roundTo', 'export const randomInt'),
      explanation:
        'Multiplying by 10^precision moves the desired digits into the integer part, Math.round rounds there, and dividing moves them back. This is binary floating-point arithmetic, so edge cases such as 1.005 still follow IEEE-754 behaviour.'
    },
    {
      title: 'Reduce an array to a scalar',
      ...cut(NUMBER, numberSource, 'export const sum', 'export const avg'),
      explanation:
        'sum starts from zero and reduces with addition. avg reuses sum and guards the empty array, returning 0 instead of NaN or Infinity.'
    }
  ],
  tradeoffs:
    'roundTo can still produce surprising results for decimal fractions because 10 ** precision is not exact in binary floating point. sum does not validate its input, so NaN propagates. randomInt is not cryptographically secure.'
}

export const taskImplementation: ImplementationDoc = {
  source: TASK,
  techniques: ['Lazy evaluation', 'Either-based errors', 'AbortSignal', 'Bounded concurrency'],
  steps: [
    {
      title: 'Keep the work behind a private function',
      ...cut(TASK, taskSource, 'export class _Task', '  static of'),
      explanation:
        'The constructor is private and stores a function that receives an optional signal. Creating a Task does not start any I/O; every run calls the function again.'
    },
    {
      title: 'Lift promises and preserve failures',
      ...cut(TASK, taskSource, '  static fromPromise', '  static fromEither'),
      explanation:
        'fromPromise awaits the operation and converts both values and thrown errors into Either. Non-Error throws are wrapped in an Error so later handlers have a consistent type.'
    },
    {
      title: 'Chain only successful steps',
      ...cut(TASK, taskSource, '  map<R>', '  mapLeft (fn'),
      explanation:
        'map and flatMap run the previous task first. A Left is forwarded unchanged, an abort signal short-circuits, and callback exceptions become Left instead of escaping.'
    },
    {
      title: 'Retry by re-running the lazy task',
      ...cut(TASK, taskSource, '  retry (retries', '  timeout (ms'),
      explanation:
        'The first attempt always runs. The loop makes at most retries additional attempts while the result is Left and the signal is not aborted, optionally waiting between attempts. Arguments are validated eagerly.'
    },
    {
      title: 'Timeout with a child AbortController',
      ...cut(TASK, taskSource, '  timeout (ms', '  async run'),
      explanation:
        'The timeout creates a controller, forwards an outer abort to it, and aborts it from a timer. A timed-out run resolves to Left(TimeoutError) even if the operation later completes. Cooperative work should observe the signal to stop early.'
    },
    {
      title: 'Resolve and cancel through run',
      ...cut(TASK, taskSource, '  async run', '  async match'),
      explanation:
        'run checks for an already-aborted signal, registers an abort listener, then invokes the stored function. Whichever finishes first, the promise resolves once with an Either; synchronous throws and rejections are normalized into Left.'
    },
    {
      title: 'Start a bounded pool for parallel work',
      ...cut(TASK, taskSource, '  static parallel', '\n}'),
      explanation:
        'Workers share a single next index, so each task is claimed once. Results go into a preallocated array by original index, which preserves order regardless of completion order. The first failure is stored with ??=, and the loop stops claiming new tasks.'
    }
  ],
  tradeoffs:
    'Tasks are lazy but not memoized: every run repeats the work. timeout cannot stop non-cooperative code; it only aborts the signal passed to the operation. parallel preserves input order but starts at most concurrency workers and may let already-running tasks finish after the first failure. Retry reuses the same signal.'
}

export const validationImplementation: ImplementationDoc = {
  source: VALIDATION,
  techniques: ['Composable schemas', 'Either-based results', 'Error accumulation', 'Async propagation'],
  steps: [
    {
      title: 'One base contract for every schema',
      ...cut(VALIDATION, validationSource, 'abstract class BaseSchema', '  transform<R>'),
      explanation:
        'BaseSchema defines safeParse and gives every schema parse, safeParseAsync and parseAsync. parse turns the Left issues into a single Error message; safeParse stays total and returns Either.'
    },
    {
      title: 'Transform only valid values',
      ...cut(VALIDATION, validationSource, '  transform<R>', '  transformAsync<R>'),
      explanation:
        'The wrapper reuses the previous safeParse result. Left issues pass through untouched; a successful value runs the callback, whose exception becomes an issue instead of escaping.'
    },
    {
      title: 'Object schemas accumulate every field error',
      ...cut(
        VALIDATION,
        validationSource,
        '  safeParse (value: unknown): ValidationResult<OptionalObject<T>>',
        '\n}\n\nclass ArraySchema'
      ),
      explanation:
        'The loop validates each key independently. Successful values are defined on the output with enumerable descriptors; failures are pushed with the key prefix, so one pass reports all bad fields rather than stopping at the first.'
    },
    {
      title: 'Unknown keys are a policy',
      ...cut(VALIDATION, validationSource, '  private finish', '  async safeParseAsync'),
      explanation:
        'finish compares the input keys with the shape. strict adds an issue, passthrough copies the extra property, and strip leaves it out. Each policy method returns a new schema, so the original configuration is untouched.'
    },
    {
      title: 'Async schemas reject synchronous parsing',
      ...cut(VALIDATION, validationSource, 'class AsyncSchema', '\n\nconst parseAsync'),
      explanation:
        'AsyncSchema deliberately throws from safeParse because running only part of an asynchronous validation would be misleading. safeParseAsync delegates to the async validator and is threaded through objects, arrays and unions.'
    }
  ],
  tradeoffs:
    'ValidationIssue paths are strings, not a structured path array. Object schemas validate every key even after earlier failures, which is useful but can be expensive. Async schemas cannot be consumed with parse or safeParse. Coercion is explicit, and Boolean("false") is true because a non-empty string is truthy.'
}
