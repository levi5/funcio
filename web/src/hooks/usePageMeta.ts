export const MODULE_META: Record<string, { title: string; description: string }> = {
  pipe: {
    title: 'Funcio - Compose functions left-to-right, sync or async',
    description:
      'Compose functions left-to-right, sync or async. Fully typed pipeline operator for TypeScript with end-to-end type inference.'
  },
  curry: {
    title: 'Funcio - Automatic currying for TypeScript functions',
    description:
      'Automatic currying for TypeScript functions. Transform any function into a curried version with partial application support.'
  },
  match: {
    title: 'Funcio - Pattern matching for TypeScript',
    description:
      'Pattern matching for TypeScript. Exhaustive, type-safe, expressive matching on values, types, and structures.'
  },
  maybe: {
    title: 'Funcio - Option type for TypeScript',
    description:
      'Option type for TypeScript. Handle nullable values safely with map, flatMap, filter, getOrElse, and pattern matching.'
  },
  either: {
    title: 'Funcio - Result type for error handling',
    description:
      'Result type for error handling. Left/Right with map, flatMap, fold, and async support for railway-oriented programming.'
  },
  object: {
    title: 'Funcio - Immutable object helpers',
    description:
      'Immutable object helpers: getPath, setPath, chainify, makeImmutable, and lens-like composable accessors.'
  },
  array: {
    title: 'Funcio - Functional array methods',
    description:
      'Functional array methods: map, filter, reduce, flatMap, groupBy, unique, and more with full type inference.'
  },
  playground: {
    title: 'Funcio - Try Funcio in your browser',
    description:
      'Try Funcio in your browser. Edit and run live examples — every snippet on this page is a real editor wired to the library.'
  }
}

export const DEFAULT_META = {
  title: 'Funcio - Functional programming toolkit for TypeScript',
  description:
    'Funcio is a functional programming toolkit for TypeScript: Maybe, Either, pipe, curry, pattern matching and immutable object helpers. Every example runs live in your browser.'
}
