export interface ApiEntry {
  name: string
  signature?: string
  description: string
  implementation?: ImplementationDoc
}

export interface ImplementationDoc {
  source: string
  techniques: string[]
  steps: { title: string; code: string; explanation: string }[]
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
