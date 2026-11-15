export type Chainify<A extends object> = {
  [key in keyof A]: A[key] extends (...args: never[]) => infer R
    ? R extends void
      ? (...args: Parameters<A[key]>) => Chainify<A>
      : (...args: Parameters<A[key]>) => ReturnType<A[key]>
    : A[key];
}
