const MAX_DEPTH = 4
const MAX_ITEMS = 100

export function inspect(value: unknown, depth = 0, seen = new WeakSet<object>()): string {
  if (value === null) return 'null'

  switch (typeof value) {
    case 'undefined':
      return 'undefined'
    case 'boolean':
      return String(value)
    case 'number':
      if (Number.isNaN(value)) return 'NaN'
      if (value === Infinity) return 'Infinity'
      if (value === -Infinity) return '-Infinity'
      if (Object.is(value, -0)) return '-0'
      return String(value)
    case 'bigint':
      return `${value.toString()}n`
    case 'string':
      return depth === 0 ? value : JSON.stringify(value)
    case 'symbol':
      return value.description === undefined ? 'Symbol()' : `Symbol(${value.description})`
    case 'function': {
      const name = (value as { name?: string }).name
      return name ? `[Function: ${name}]` : '[Function (anonymous)]'
    }
  }

  const object = value as object

  if (seen.has(object)) return '[Circular]'
  if (depth > MAX_DEPTH) return Array.isArray(object) ? '[Array]' : '[Object]'
  seen.add(object)

  try {
    if (object instanceof Error) return formatError(object)
    if (object instanceof Date) {
      return Number.isNaN(object.getTime()) ? 'Invalid Date' : object.toISOString()
    }
    if (object instanceof RegExp) return object.toString()
    if (object instanceof Promise) return 'Promise { <pending> }'

    const ctorName = (object as { constructor?: { name?: string } }).constructor?.name

    if (Array.isArray(object)) {
      const items = object.slice(0, MAX_ITEMS).map((item) => inspect(item, depth + 1, seen))
      if (object.length > MAX_ITEMS) items.push(`… ${object.length - MAX_ITEMS} more`)
      return `[${items.join(', ')}]`
    }

    if (object instanceof Map) {
      const entries: string[] = []
      let count = 0
      for (const [key, val] of object) {
        if (count++ >= MAX_ITEMS) {
          entries.push('…')
          break
        }
        entries.push(`${inspect(key, depth + 1, seen)} => ${inspect(val, depth + 1, seen)}`)
      }
      return `Map(${object.size}) {${entries.length ? ` ${entries.join(', ')} ` : ''}}`
    }

    if (object instanceof Set) {
      const values: string[] = []
      let count = 0
      for (const val of object) {
        if (count++ >= MAX_ITEMS) {
          values.push('…')
          break
        }
        values.push(inspect(val, depth + 1, seen))
      }
      return `Set(${object.size}) {${values.length ? ` ${values.join(', ')} ` : ''}}`
    }

    const tag = (object as { tag?: unknown }).tag
    if (tag === 'Just' || tag === 'Nothing') {
      if (tag === 'Nothing') return 'Nothing'
      const get = (object as { get?: () => unknown }).get
      if (typeof get === 'function') {
        try {
          return `Just(${inspect(get.call(object), depth + 1, seen)})`
        } catch {}
      }
      return String(object)
    }

    const keys = Object.keys(object)
    if (keys.length === 0) return ctorName && ctorName !== 'Object' ? `${ctorName} {}` : '{}'

    const prefix = ctorName && ctorName !== 'Object' ? `${ctorName} ` : ''
    const body = keys
      .slice(0, MAX_ITEMS)
      .map((key) => {
        let raw: unknown
        try {
          raw = (object as Record<string, unknown>)[key]
        } catch {
          return `${key}: [throws]`
        }
        return `${key}: ${inspect(raw, depth + 1, seen)}`
      })
      .join(', ')

    const overflow = keys.length > MAX_ITEMS ? `, … ${keys.length - MAX_ITEMS} more` : ''
    return `${prefix}{ ${body}${overflow} }`
  } finally {
    seen.delete(object)
  }
}

export function formatError(error: unknown): string {
  if (!(error instanceof Error)) return inspect(error)

  const head = `${error.name}: ${error.message}`
  const frame = (error.stack ?? '')
    .split('\n')
    .slice(1)
    .find((line) => line.includes('funcio-playground'))

  return frame ? `${head}\n${frame.trim()}` : head
}

export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

export interface LogEntry {
  level: LogLevel
  text: string
}

export interface SerializedError {
  name: string
  message: string
  stack?: string
  isSyntaxError: boolean
  line?: number
  column?: number
}

export function serializeError(error: unknown): SerializedError {
  if (error instanceof Error) {
    const syntax = error.name === 'SyntaxError'
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      isSyntaxError: syntax,
      line: (error as { loc?: { line: number; column: number } }).loc?.line,
      column: (error as { loc?: { line: number; column: number } }).loc?.column
    }
  }

  return { name: 'Error', message: inspect(error), isSyntaxError: false }
}
