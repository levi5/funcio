import Funcio, * as FuncioNamespace from 'funcio'
import type { ScopeProvider } from './execute'
import { type Binding, SnippetError } from './transform'

const exports = FuncioNamespace as unknown as Record<string, unknown>

const exportedNames = Object.keys(exports).filter((name) => name !== 'default' && name !== '__esModule')

export const libScope: ScopeProvider = (bindings: Binding[]) => {
  const scope = new Map<string, unknown>()

  for (const name of exportedNames) scope.set(name, exports[name])
  scope.set('Funcio', Funcio)

  for (const binding of bindings) {
    if (binding.kind === 'default') {
      scope.set(binding.name, Funcio)
      continue
    }

    if (binding.kind === 'namespace') {
      scope.set(binding.name, FuncioNamespace)
      continue
    }

    if (!(binding.name in exports)) {
      throw new SnippetError(`Funcio does not export "${binding.name}". Check the docs for the available members.`)
    }

    scope.set(binding.name, exports[binding.name])
  }

  return [...scope.entries()]
}
