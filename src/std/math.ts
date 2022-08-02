export function add(...numbers: number[]) {
    return numbers.reduce((acc, curr) => acc + curr, 0)
}

export function subtract(...numbers: number[]) {
    // assume first is bigger one
    return numbers.reduce((acc, curr) => acc - curr, numbers[0])
}

export function multiply(...numbers: number[]) {
    return numbers.reduce((acc, curr) => acc * curr, numbers[0])
}

export function divide(...numbers: number[]) {
    return numbers.reduce((acc, curr) => acc / curr, numbers[0])
}

export function round(value: number, signsAfterComma: number) {
    return +value.toFixed(signsAfterComma)
}