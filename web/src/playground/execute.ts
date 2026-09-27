import { inspect, type LogEntry, type LogLevel, type SerializedError, serializeError } from './format'
import { type Binding, SnippetError, transform } from './transform'

type AnyAsyncFunction = new (...args: string[]) => (...args: unknown[]) => Promise<unknown>

const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor as AnyAsyncFunction

export type ScopeProvider = (bindings: Binding[]) => Array<[string, unknown]>

export interface ExecuteResult {
  ok: boolean
  logs: LogEntry[]
  value: string | null
  error?: SerializedError
}

function createConsole(logs: LogEntry[]): Console {
  const record =
    (level: LogLevel): ((...args: unknown[]) => void) =>
    (...args: unknown[]) => {
      logs.push({ level, text: args.map((arg) => inspect(arg)).join(' ') })
    }

  const fake: Record<string | symbol, unknown> = {
    log: record('log'),
    info: record('info'),
    warn: record('warn'),
    error: record('error'),
    debug: record('debug'),
    trace: record('debug')
  }

  return new Proxy(fake, {
    get(target, property) {
      return property in target ? target[property] : () => {}
    }
  }) as unknown as Console
}

export async function execute(code: string, provideScope: ScopeProvider): Promise<ExecuteResult> {
  const logs: LogEntry[] = []

  let body: string
  let scope: Array<[string, unknown]>

  try {
    const transformed = transform(code)
    body = transformed.code
    scope = provideScope(transformed.bindings)
  } catch (error) {
    return {
      ok: false,
      logs,
      value: null,
      error:
        error instanceof SnippetError
          ? {
              name: 'SyntaxError',
              message: error.message,
              isSyntaxError: true,
              line: error.line,
              column: error.column
            }
          : serializeError(error)
    }
  }

  const names = scope.map(([name]) => name)
  const values = scope.map(([, value]) => value)

  try {
    const factory = new AsyncFunction(...names, 'console', `"use strict";\n${body}\n//# sourceURL=funcio-playground.js`)

    const result = await factory(...values, createConsole(logs))

    return { ok: true, logs, value: result === undefined ? null : inspect(result) }
  } catch (error) {
    return { ok: false, logs, value: null, error: serializeError(error) }
  }
}
