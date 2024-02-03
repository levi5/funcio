/* eslint-disable @typescript-eslint/return-await */

export const forEachAsync = async <T>(array: T[], fn: (x: T) => any): Promise<any> => array.reduce(
  async (promise: Promise<void>, value: T) => promise.then(() => fn(value)),
  Promise.resolve()
)

export const mapAsync = async <T, R>(array: T[], fn: (x: T) => Promise<R>) => Promise.all(array.map(fn))

export const filterAsync = async <T>(array: T[], fn: (x: T) =>
Promise<boolean>) => mapAsync(array, fn)
  .then((arr) => array.filter((value, index) => Boolean(arr[index])))
