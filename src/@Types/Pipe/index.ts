export interface IPipe {
  <A>(input: A): A;
  <A, B>(input: A, fn1: (input: A) => B): B;
  <A, B, C>(input: A, fn1: (input: A) => B, fn2: (input: B) => C): C;
  <A, B, C, D>(
    input: A,
    fn1: (input: A) => B,
    fn2: (input: B) => C,
    fn3: (input: C) => D
  ): D;
  <A, B, C, D, E>(
    input: A,
    fn1: (input: A) => B,
    fn2: (input: B) => C,
    fn3: (input: C) => D,
    fn4: (input: D) => E
  ): E;
  <A, B, C, D, E, F>(
    input: A,
    fn1: (input: A) => B,
    fn2: (input: B) => C,
    fn3: (input: C) => D,
    fn4: (input: D) => E,
    fn5: (input: F) => F
  ): F;
}
