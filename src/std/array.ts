export function concatAll(stringArray: string[]) {
    return stringArray.join('')
}

export function sum(numberArray: number[]) {
    return numberArray.reduce((acc, current) => acc + current, 0)
}

export function average(numberArray: number[]) {
    return sum(numberArray) / numberArray.length
}

export function min(numberArray: number[]) {
    return Math.min(...numberArray)
}

export function max(numberArray: number[]) {
    return Math.max(...numberArray)
}