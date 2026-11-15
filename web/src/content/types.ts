export interface ApiEntry {
  name: string
  signature?: string
  description: string
  implementation?: ImplementationDoc
}

export interface ImplementationStep {
  title: string
  code: string
  explanation: string
  /** Source file for this step. Defaults to the document source. */
  source?: string
  startLine?: number
  endLine?: number
}

export interface ImplementationDoc {
  source: string
  techniques: string[]
  steps: ImplementationStep[]
  tradeoffs: string
}

export interface Example {
  id: string
  title: string
  description: string
  code: string
  expected?: string
}

export interface ModuleDoc {
  id: string
  title: string
  tagline: string
  api: ApiEntry[]
  examples: Example[]
}
