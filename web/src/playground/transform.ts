import {
  type ImportDeclaration,
  type ModuleDeclaration,
  type Program,
  parse,
  type Statement,
  type Token,
  tokenizer
} from 'acorn'

export type BindingKind = 'default' | 'namespace' | 'named'

export interface Binding {
  name: string
  kind: BindingKind
}

export interface Transformed {
  code: string
  bindings: Binding[]
}

export class SnippetError extends Error {
  public readonly line: number | undefined
  public readonly column: number | undefined

  constructor(message: string, line?: number, column?: number) {
    super(message)
    this.name = 'SnippetError'
    this.line = line
    this.column = column
  }
}

const RESOLVABLE_MODULES = new Set(['funcio', 'funcio/lib/main', 'main', '../src/main', '../../src/main'])

type TopLevel = Statement | ModuleDeclaration

interface Edit {
  start: number
  end: number
  text: string
}

function isResolvable(source: string | number | bigint | boolean | RegExp | null | undefined): boolean {
  if (typeof source !== 'string') return false

  if (RESOLVABLE_MODULES.has(source)) return true
  return /(^|\/)main$/.test(source)
}

function bindingsOf(node: ImportDeclaration): Binding[] {
  return node.specifiers.map((specifier) => {
    const kind: BindingKind =
      specifier.type === 'ImportDefaultSpecifier'
        ? 'default'
        : specifier.type === 'ImportNamespaceSpecifier'
          ? 'namespace'
          : 'named'

    return { name: specifier.local.name, kind }
  })
}

function returnValueEdit(body: TopLevel[], code: string): Edit | null {
  const last = body[body.length - 1]
  if (!last) return null

  if (last.type === 'ExpressionStatement' && last.directive === undefined) {
    return { start: last.start, end: last.end, text: `return (${code.slice(last.start, last.end)});` }
  }

  if (last.type === 'BlockStatement') {
    const inner = last.body
    const only = inner[inner.length - 1]
    if (inner.length === 1 && only?.type === 'ExpressionStatement' && only.directive === undefined) {
      return { start: only.start, end: only.end, text: `return (${code.slice(only.start, only.end)});` }
    }
  }

  return null
}

const ENDS_EXPRESSION = new Set(['name', 'num', 'string', 'regexp', 'template', ')', ']', '}', '++', '--'])

function insertStatementBreaks(code: string): string {
  const scanner = tokenizer(code, { ecmaVersion: 'latest' })
  const breaks: number[] = []
  let previous: Token | null = null
  let cursor = 0

  for (;;) {
    let token: Token

    try {
      token = scanner.getToken()
    } catch {
      return code
    }

    if (token.type.label === 'eof') break

    const atLineStart = code.slice(cursor, token.start).includes('\n')
    cursor = token.end

    if (
      previous !== null &&
      token.type.label === '[' &&
      atLineStart &&
      ENDS_EXPRESSION.has(previous.type.label) &&
      code[token.start - 1] !== ';'
    ) {
      breaks.push(token.start)
    }

    previous = token
  }

  if (breaks.length === 0) return code

  let result = code
  for (let index = breaks.length - 1; index >= 0; index--) {
    const at = breaks[index]
    result = `${result.slice(0, at)};${result.slice(at)}`
  }

  return result
}

export function transform(source: string): Transformed {
  const code = insertStatementBreaks(source.replace(/\r\n?/g, '\n'))

  let program: Program
  try {
    program = parse(code, { ecmaVersion: 'latest', sourceType: 'module' })
  } catch (error) {
    const loc = (error as { loc?: { line: number; column: number } }).loc
    throw new SnippetError((error as Error).message.replace(/\s*\(\d+:\d+\)\s*$/, ''), loc?.line, loc?.column)
  }

  const bindings: Binding[] = []
  const edits: Edit[] = []

  for (const node of program.body) {
    if (node.type !== 'ImportDeclaration') continue

    const source = node.source.value
    if (!isResolvable(source)) {
      throw new SnippetError(`The playground can only import from "funcio". The snippet tried to import "${source}".`)
    }

    bindings.push(...bindingsOf(node))
    edits.push({ start: node.start, end: node.end, text: '' })
  }

  const returned = returnValueEdit(program.body, code)
  if (returned) edits.push(returned)

  edits.sort((a, b) => b.start - a.start || b.end - a.end)

  let body = code
  for (const edit of edits) body = body.slice(0, edit.start) + edit.text + body.slice(edit.end)

  const seen = new Set<string>()
  return {
    code: body,
    bindings: bindings.filter((binding) => {
      if (seen.has(binding.name)) return false
      seen.add(binding.name)
      return true
    })
  }
}
