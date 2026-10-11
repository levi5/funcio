import { filterAsync, forEachAsync, mapAsync } from './asyncMethods.js'
import { chunk, drop, flatMap, groupBy, partition, range, sortBy, take, uniq, uniqBy, zip, zipWith } from './syncMethods.js'

const reduceAsync = async <T, R>(array: T[], fn: (acc: R, value: T) => Promise<R> | R, initial: R): Promise<R> => {
  let acc = initial
  for (const item of array) acc = await fn(acc, item)
  return acc
}

export const _Array = {
  forEachAsync,
  mapAsync,
  filterAsync,
  reduceAsync,
  chunk,
  uniq,
  uniqBy,
  groupBy,
  partition,
  zip,
  zipWith,
  range,
  sortBy,
  take,
  drop,
  flatMap
}
