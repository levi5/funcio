export const clamp = (min: number, max: number, value: number): number =>
  Math.min(max, Math.max(min, value))

export const inRange = (min: number, max: number, value: number): boolean =>
  value >= min && value <= max

export const sum = (values: number[]): number =>
  values.reduce((acc, v) => acc + v, 0)

export const avg = (values: number[]): number =>
  values.length === 0 ? 0 : sum(values) / values.length

export const roundTo = (precision: number, value: number): number => {
  const factor = 10 ** precision
  return Math.round(value * factor) / factor
}

export const randomInt = (min: number, max: number): number => {
  const lo = Math.ceil(Math.min(min, max))
  const hi = Math.floor(Math.max(min, max))
  return Math.floor(Math.random() * (hi - lo + 1)) + lo
}

export const _Number = {
  clamp,
  inRange,
  sum,
  avg,
  roundTo,
  randomInt
}
