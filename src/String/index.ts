export const capitalize = (s: string): string =>
  s.length === 0 ? s : s[0].toUpperCase() + s.slice(1)

export const uncapitalize = (s: string): string =>
  s.length === 0 ? s : s[0].toLowerCase() + s.slice(1)

export const truncate = (max: number, suffix: string, s: string): string => {
  if (s.length <= max) return s
  return s.slice(0, Math.max(0, max - suffix.length)) + suffix
}

export const slugify = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')

export const toCamelCase = (s: string): string =>
  s
    .replace(/[-_\s]+(.)?/g, (_, c: string) => (c ? c.toUpperCase() : ''))
    .replace(/^[A-Z]/, (c) => c.toLowerCase())

export const toSnakeCase = (s: string): string =>
  s
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase()

export const toKebabCase = (s: string): string => toSnakeCase(s).replace(/_/g, '-')

export const padLeft = (length: number, char: string, s: string): string => {
  const pad = char.length === 0 ? ' ' : char[0]
  return s.length >= length ? s : pad.repeat(length - s.length) + s
}

export const padRight = (length: number, char: string, s: string): string => {
  const pad = char.length === 0 ? ' ' : char[0]
  return s.length >= length ? s : s + pad.repeat(length - s.length)
}

export const _String = {
  capitalize,
  uncapitalize,
  truncate,
  slugify,
  toCamelCase,
  toSnakeCase,
  toKebabCase,
  padLeft,
  padRight
}
