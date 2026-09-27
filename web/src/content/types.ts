export interface ApiEntry {
  name: string
  signature?: string
  description: string
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
