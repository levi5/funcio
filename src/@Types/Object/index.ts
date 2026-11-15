export type Chainify<A extends Record<string, any>> = {
  [key in keyof A]: A[key] extends (...args: any[]) => any
    // biome-ignore lint/suspicious/noConfusingVoidType: Explicit void distinguishes fluent methods from value-returning methods.
    ? void extends ReturnType<A[key]>
      ? (...args: Parameters<A[key]>) => Chainify<A>
      : (...args: Parameters<A[key]>) => ReturnType<A[key]>
    : A[key];
}
