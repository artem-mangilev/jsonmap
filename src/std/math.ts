import { notEmpty } from "../utils"
import { toDecimal } from "./type-conversion"

export function add(...numbers: unknown[]) {
    const casted = numbers.map(value => toDecimal(value)).filter(notEmpty)

    return casted.reduce((acc, curr) => acc + curr, 0)
}

export function subtract(...numbers: unknown[]) {
    const casted = numbers.map(value => toDecimal(value)).filter(notEmpty)

    // assume first is bigger one
    return casted.reduce((acc, curr) => acc - curr)
}

export function multiply(...numbers: unknown[]) {
    const casted = numbers.map(value => toDecimal(value)).filter(notEmpty)

    return casted.reduce((acc, curr) => acc * curr)
}

export function divide(...numbers: unknown[]) {
    const casted = numbers.map(value => toDecimal(value)).filter(notEmpty)

    return casted.reduce((acc, curr) => acc / curr)
}

export function round(value: unknown, signsAfterComma: unknown) {
    const nValue = toDecimal(value)
    const nSignsAfterComma = toDecimal(signsAfterComma)

    if (notEmpty(nValue) && notEmpty(nSignsAfterComma)) {
        return +nValue.toFixed(nSignsAfterComma)
    }

    throw new Error('Arguments must not be empty')
}

export function mathEquals(number1: unknown, number2: unknown) {
    const [castedNumber1, castedNumber2] = [toDecimal(number1), toDecimal(number2)]

    if (notEmpty(castedNumber1) && notEmpty(castedNumber2)) {
        return castedNumber1 === castedNumber2
    }

    throw new Error('Arguments must not be empty')
}

export function mathGreaterThan(number1: unknown, number2: unknown) {
    const [castedNumber1, castedNumber2] = [toDecimal(number1), toDecimal(number2)]

    if (notEmpty(castedNumber1) && notEmpty(castedNumber2)) {
        return castedNumber1 > castedNumber2
    }

    throw new Error('Arguments must not be empty')
}

export function mathLessThan(number1: unknown, number2: unknown) {
    const [castedNumber1, castedNumber2] = [toDecimal(number1), toDecimal(number2)]

    if (notEmpty(castedNumber1) && notEmpty(castedNumber2)) {
        return castedNumber1 < castedNumber2
    }

    throw new Error('Arguments must not be empty')
}

export function mathGreaterThanOrEqualTo(number1: unknown, number2: unknown) {
    const [castedNumber1, castedNumber2] = [toDecimal(number1), toDecimal(number2)]

    if (notEmpty(castedNumber1) && notEmpty(castedNumber2)) {
        return castedNumber1 >= castedNumber2
    }

    throw new Error('Arguments must not be empty')
}

export function mathLessThanOrEqualTo(number1: unknown, number2: unknown) {
    const [castedNumber1, castedNumber2] = [toDecimal(number1), toDecimal(number2)]

    if (notEmpty(castedNumber1) && notEmpty(castedNumber2)) {
        return castedNumber1 <= castedNumber2
    }

    throw new Error('Arguments must not be empty')
}