export const $isObject = <T = Object>(value: T) => value && typeof value === 'object'
export const $isEmpty = <T = Object>(value: T) => $isObject(value) && !Object.keys(value).length