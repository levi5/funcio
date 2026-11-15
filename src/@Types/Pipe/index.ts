import type { FN } from "@funcio/@Types/common.js";
/**
 * Type FnsMatchPipe checks if a sequence of functions can be piped together.
 * Returns true if all functions can be piped, otherwise returns never.
 */
type FnsMatchPipe<FNS extends FN[]> =
  1 extends FNS['length']
    ? boolean
    : FNS extends [
      infer FN1st extends FN,
      infer FN2nd extends FN,
      ...infer FNRest extends FN[]
    ]
      ? Parameters<FN2nd> extends [ReturnType<FN1st>]
          ? FnsMatchPipe<[FN2nd, ...FNRest]>
          : never
      : never;

/**
 * Type Pipeline checks if a sequence of functions can be piped together.
 * If yes, returns a new function type representing the composition of the functions.
 */
export type Pipeline<FNS extends FN[]> =
  boolean extends FnsMatchPipe<FNS>
    ? 1 extends FNS['length']
      ? FNS[0]
      : FNS extends [
        infer FNFIRST extends FN,
        ...FN[],
        infer FNLAST extends FN
      ]
        ? (...args: Parameters<FNFIRST>) => ReturnType<FNLAST>
        : never
    : never;
