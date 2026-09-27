import { array } from './modules/array'
import { curry } from './modules/curry'
import { either } from './modules/either'
import { match } from './modules/match'
import { maybe } from './modules/maybe'
import { object } from './modules/object'
import { pipe } from './modules/pipe'
import type { ModuleDoc } from './types'

export const modules: ModuleDoc[] = [pipe, curry, match, maybe, either, object, array]

export { heroExample } from './hero'

export type { ApiEntry, Example, ModuleDoc } from './types'
