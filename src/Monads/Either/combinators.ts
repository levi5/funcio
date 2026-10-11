import { left, right } from './index.js'
import { type IEither } from '../../@Types/index.js'

/**
 * Create an Either from a nullable value.
 * Returns Left(fallback) when value is null/undefined, Right(value) otherwise.
 */
export const fromNullable = <L, R>(value: R | null | undefined, leftFallback: L): IEither.Either<L, R> => {
  return (value === null || value === undefined)
    ? left<L, R>(leftFallback)
    : right<L, R>(value as R)
}

/**
 * Turn a list of Eithers into a single Either of list.
 * Short-circuits on the first Left.
 */
export const sequence = <L, R>(list: Array<IEither.Either<L, R>>): IEither.Either<L, R[]> => {
  const out: R[] = []
  for (const item of list) {
    if (item.isLeft()) return left<L, R[]>(item.value as L)
    out.push(item.value as R)
  }
  return right<L, R[]>(out)
}

/**
 * Combine two Eithers with a pure function.
 * If either side is Left, the first Left wins.
 */
export const combine = <L, A, B, R>(
  fa: IEither.Either<L, A>,
  fb: IEither.Either<L, B>,
  fn: (a: A, b: B) => R
): IEither.Either<L, R> => {
  if (fa.isLeft()) return left<L, R>(fa.value as L)
  if (fb.isLeft()) return left<L, R>(fb.value as L)
  return right<L, R>(fn(fa.value as A, fb.value as B))
}
