export function toInteger(param: unknown): number | null {
    switch (typeof param) {
        case 'string':
        case 'number':
            return parseInt(param.toString())
        case 'boolean':
            return param ? 1 : 0
        default:
            return null
    }
}

export function toDecimal(param: unknown): number | null {
    switch (typeof param) {
        case 'string':
        case 'number':
            return parseFloat(param.toString())
        case 'boolean':
            return param ? 1 : 0
        default:
            return null
    }
}

export function toBoolean(param: unknown): boolean {
    switch (typeof param) {
        case 'string':
            if (param.toLowerCase() === 'true') {
                return true
            } else if (param.toLowerCase() === 'false') {
                return false
            }
            return Boolean(param)
        default:
            return Boolean(param)
    }
}

export function toString(param: unknown): string {
    return String(param)
}