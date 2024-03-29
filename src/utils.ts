import { AstNode } from "./parser"

/**
 * Check if token is Jsonmap token
 * 
 * @param token token
 * @returns {boolean}
 */
export const isJsonmapToken = (token: unknown) => typeof token === 'string' && token.startsWith('#')

/**
 * Evaluate properties from pathArray on object
 * 
 * @param object object
 * @param pathArray array with path
 * @returns evaluate result
 */
export function evalObject(object: Record<string, any>, pathArray: string[]): any {
    let currentState = object
    for (const item of pathArray) {
        currentState = currentState[item]
    }

    return currentState
}

export function isObject(value: any): boolean {
    return value !== null && !Array.isArray(value) && typeof value === 'object'
}

/**
 * Get first key of object
 * 
 * @param object object
 * @returns first key
 */
export function fkey(object: Record<string, any>): any {
    return Object.keys(object)[0]
}

/**
 * Check if node is ast leaf 
 * 
 * @param node node
 * @returns is leaf
 */
export function isLeaf(node: AstNode): boolean {
    return typeof node === 'string'
}

/**
 * Type aware not empty checking
 * 
 * @param value value
 * @returns boolean
 */
export function notEmpty<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined
}