export type TokenType =
  | 'comment'
  | 'string'
  | 'number'
  | 'keyword'
  | 'boolean'
  | 'function'
  | 'property'
  | 'operator'
  | 'punctuation'
  | 'plain'

export type Token = {
  type: TokenType
  value: string
}

const KEYWORDS = new Set([
  'await',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'export',
  'extends',
  'finally',
  'for',
  'function',
  'if',
  'import',
  'in',
  'instanceof',
  'let',
  'new',
  'return',
  'static',
  'super',
  'switch',
  'this',
  'throw',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'yield',
  'async',
  'of',
  'get',
  'set'
])

const LITERALS = new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity'])

const PATTERN = new RegExp(
  [
    '(?<comment>//[^\\n]*|/\\*[\\s\\S]*?\\*/)',
    '(?<string>\'(?:[^\'\\\\\\n]|\\\\.)*\'|"(?:[^"\\\\\\n]|\\\\.)*"|`(?:[^`\\\\]|\\\\.)*`)',
    '(?<number>\\b0[xXbBoO][0-9a-fA-F_]+\\b|\\b\\d[\\d_]*(?:\\.[\\d_]*)?(?:[eE][+-]?\\d+)?n?\\b)',
    '(?<word>[A-Za-z_$][\\w$]*)',
    '(?<operator>=>|\\.\\.\\.|\\?\\.|\\*\\*=?|===|!==|==|!=|<=|>=|&&=|\\|\\||&&|\\+\\+|--|[-+*/%]=|[=<>!?:+\\-*/%&|^~])',
    '(?<punctuation>[()\\[\\]{};,.])'
  ].join('|'),
  'g'
)

const classify = (word: string, previous: string | undefined): TokenType => {
  if (KEYWORDS.has(word)) return 'keyword'
  if (LITERALS.has(word)) return 'boolean'
  if (/^\s*\(/.test(previous ?? '')) return 'function'
  if (previous === '.' || previous?.endsWith(':')) return 'property'
  return 'plain'
}

export const tokenize = (code: string): Token[] => {
  const tokens: Token[] = []
  let cursor = 0

  for (const match of code.matchAll(PATTERN)) {
    const index = match.index ?? 0

    if (index > cursor) tokens.push({ type: 'plain', value: code.slice(cursor, index) })

    const groups = match.groups ?? {}

    const type: TokenType =
      (groups.comment !== undefined && 'comment') ||
      (groups.string !== undefined && 'string') ||
      (groups.number !== undefined && 'number') ||
      (groups.operator !== undefined && 'operator') ||
      (groups.punctuation !== undefined && 'punctuation') ||
      (typeof groups.word === 'string' ? classify(groups.word, code.slice(cursor, index)) : 'plain')

    tokens.push({ type, value: match[0] })
    cursor = index + match[0].length
  }

  if (cursor < code.length) tokens.push({ type: 'plain', value: code.slice(cursor) })

  return tokens
}
