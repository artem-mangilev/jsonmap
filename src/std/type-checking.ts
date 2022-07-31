export function isNumber(param: unknown): boolean {
    return typeof param === 'number'
}

export function isString(param: unknown): boolean {
    return typeof param === 'string'
}

export function isBoolean(param: unknown): boolean {
    return typeof param === 'boolean'
}

export function isArray(param: unknown): boolean {
    console.log(param)
    return Array.isArray(param)
}