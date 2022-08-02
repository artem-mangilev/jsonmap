export function getFirstIndexOf(inputString: string, search: string) {
    return inputString.indexOf(search)
}

export function getLastIndexOf(inputString: string, search: string) {
    return inputString.lastIndexOf(search)
}

export function getSubstring(inputString: string, startIndex: number, len: number = inputString.length) {
    return inputString.slice(startIndex, startIndex + len)
}

export function concat(...strings: string[]) {
    return strings.join('')
}

