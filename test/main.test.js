const { JsonMap } = require('../index');
const fs = require('fs');
const path = require('path')

const readFile = (pathStr) => fs.promises.readFile(path.resolve(__dirname, pathStr))

function getTestJsons(name) {
    return Promise.all([
        readFile(`./json/${name}/${name}.input.json`),
        readFile(`./json/${name}/${name}.transformer.json`),
        readFile(`./json/${name}/${name}.result.json`)
    ])
}

test('evaluate #valueof', async () => {
    const [input, transformer, expectedResult] = await getTestJsons('simple-value-of');

    expect(JSON.parse(new JsonMap().transform(input, transformer))).toEqual(JSON.parse(expectedResult))
})

test('evaluate #ifcondition', async () => {
    const [input, transformer, expectedResult] = await getTestJsons('simple-if-condition');

    expect(JSON.parse(new JsonMap().transform(input, transformer))).toEqual(JSON.parse(expectedResult))
})

test('evaluate array #loop', async () => {
    const [input, transformer, expectedResult] = await getTestJsons('simple-array-loop');

    expect(JSON.parse(new JsonMap().transform(input, transformer))).toEqual(JSON.parse(expectedResult))
})

test('evaluate several array #loop`s', async () => {
    const [input, transformer, expectedResult] = await getTestJsons('several-array-loops');

    expect(JSON.parse(new JsonMap().transform(input, transformer))).toEqual(JSON.parse(expectedResult))
})

test('evaluate access to array item with index', async () => {
    const [input, transformer, expectedResult] = await getTestJsons('index-access');

    expect(JSON.parse(new JsonMap().transform(input, transformer))).toEqual(JSON.parse(expectedResult))
})