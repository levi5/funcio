import Funcio, * as FuncioNamespace from 'funcio'
import type { ScopeProvider } from './execute'
import { type Binding, SnippetError } from './transform'

const namespace = FuncioNamespace as unknown as Record<string, unknown>
// Node/tsx can expose the CommonJS module as default; Vite uses the ESM default.
const exports: Record<string, unknown> = { ...Funcio, ...namespace }
const library = (Funcio as unknown as { default?: typeof Funcio }).default ?? Funcio

const exportedNames = Object.keys(exports).filter(
  (name) => name !== 'default' && name !== '__esModule' && /^[$A-Z_a-z][$\w]*$/.test(name)
)

export const libScope: ScopeProvider = (bindings: Binding[]) => {
  const scope = new Map<string, unknown>()

  for (const name of exportedNames) scope.set(name, exports[name])
  scope.set('Funcio', library)

  for (const binding of bindings) {
    if (binding.kind === 'default') {
      scope.set(binding.name, library)
      continue
    }

    if (binding.kind === 'namespace') {
      scope.set(binding.name, { ...exports, default: library })
      continue
    }

    const imported = binding.imported ?? binding.name
    if (!(imported in exports)) {
      throw new SnippetError(`Funcio does not export "${imported}". Check the docs for the available members.`)
    }

    scope.set(binding.name, exports[imported])
  }

  return [...scope.entries()]
}
