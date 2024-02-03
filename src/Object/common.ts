export const $isObject = <T = object>(value: T) => value && typeof value === 'object'
export const $isEmpty = <T = object>(value: T) => $isObject(value) && !Object.keys(value).length
export type OBJ = Record<string | number | symbol, any>
