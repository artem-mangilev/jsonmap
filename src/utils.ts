/**
 * Check if token is Jsonmap token
 * 
 * @param token token
 * @returns {boolean}
 */
export const isJsonmapToken = (token: unknown) => typeof token === 'string' && token.startsWith('#');

export const pushMany = <T, A extends Array<any>>(itemOrArray: T, target: A) => Array.isArray(itemOrArray) ? target.push(...itemOrArray) : target.push(itemOrArray);

/**
 * Evaluate properties from pathArray on object
 * 
 * @param object object
 * @param pathArray array with path
 * @returns evaluate result
 */
export function evalObject(object: Record<string, any>, pathArray: string[]): any {
    let currentState = object;
    for (const item of pathArray) {
        currentState = currentState[item]
    }

    return currentState;
}

export function isObject(value: any): boolean {
    return value !== null && !Array.isArray(value) && typeof value === 'object'
}
