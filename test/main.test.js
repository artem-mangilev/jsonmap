const { JsonMap } = require('../index');
const fs = require('fs');
const path = require('path')

function getTestJsons(name) {
    return [
        fs.readFileSync(path.resolve(__dirname, `./json/${name}/${name}.input.json`), 'utf-8'),
        fs.readFileSync(path.resolve(__dirname, `./json/${name}/${name}.transformer.json`), 'utf-8'),
        fs.readFileSync(path.resolve(__dirname, `./json/${name}/${name}.result.json`), 'utf-8')
    ]
}

test('evaluate #valueof', () => {
    const [input, transformer, expectedResult] = getTestJsons('simple-value-of');

    expect(JSON.parse(new JsonMap().transform(input, transformer))).toEqual(JSON.parse(expectedResult))
})

test('evaluate #ifcondition', () => {
    const [input, transformer, expectedResult] = getTestJsons('simple-if-condition');

    expect(JSON.parse(new JsonMap().transform(input, transformer))).toEqual(JSON.parse(expectedResult))
})

test('evaluate array #loop', () => {
    const [input, transformer, expectedResult] = getTestJsons('simple-array-loop');

    expect(JSON.parse(new JsonMap().transform(input, transformer))).toEqual(JSON.parse(expectedResult))
})

test('evaluate access to array item with index', () => {
    const [input, transformer, expectedResult] = getTestJsons('index-access');

    expect(JSON.parse(new JsonMap().transform(input, transformer))).toEqual(JSON.parse(expectedResult))
})