/**
 * Type FN represents a function that accepts any number of arguments
 * and returns any value.
 */
export type FN = (...args: any[]) => any;

/**
 * Type FnsMatchPipe checks if a sequence of functions can be piped together.
 * Returns true if all functions can be piped, otherwise returns never.
 */
type FnsMatchPipe<FNS extends FN[]> =
  // If there is only one function in the sequence, return true.
  1 extends FNS['length']
    ? boolean
    : FNS extends [
      infer FN1st extends FN,
      infer FN2nd extends FN,
      ...infer FNRest extends FN[]
    ]
      ? // Check if the output type of the first function matches the input type of the next.
        Parameters<FN2nd> extends [ReturnType<FN1st>]
          ? FnsMatchPipe<[FN2nd, ...FNRest]> // Continue checking for the remaining functions.
          : never
      : never;

/**
 * Type Pipeline checks if a sequence of functions can be piped together.
 * If yes, returns a new function type representing the composition of the functions.
 */
export type Pipeline<FNS extends FN[]> =
  boolean extends FnsMatchPipe<FNS>
    ? 1 extends FNS['length']
      ? FNS[0] // If there's only one function, return that function directly.
      : FNS extends [
        infer FNFIRST extends FN,
        ...FN[],
        infer FNLAST extends FN
      ]
        ? (...args: Parameters<FNFIRST>) => ReturnType<FNLAST> // Return the resulting function type from composition.
        : never
    : never;
