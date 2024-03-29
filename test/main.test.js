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

test('evaluate type checking functions', async () => {
    const [input, transformer, expectedResult] = await getTestJsons('type-check');

    expect(JSON.parse(new JsonMap().transform(input, transformer))).toEqual(JSON.parse(expectedResult))
})

test('evaluate type conversion functions', async () => {
    const [input, transformer, expectedResult] = await getTestJsons('type-conversions');

    expect(JSON.parse(new JsonMap().transform(input, transformer))).toEqual(JSON.parse(expectedResult))
})

test('evaluate string util functions', async () => {
    const [input, transformer, expectedResult] = await getTestJsons('string');

    expect(JSON.parse(new JsonMap().transform(input, transformer))).toEqual(JSON.parse(expectedResult))
})

test('evaluate array util functions', async () => {
    const [input, transformer, expectedResult] = await getTestJsons('array');

    expect(JSON.parse(new JsonMap().transform(input, transformer))).toEqual(JSON.parse(expectedResult))
})

test('evaluate math util functions', async () => {
    const [input, transformer, expectedResult] = await getTestJsons('math');

    expect(JSON.parse(new JsonMap().transform(input, transformer))).toEqual(JSON.parse(expectedResult))
})

test('evaluate custom function', async () => {
    const [input, transformer, expectedResult] = await getTestJsons('custom-function');

    const jsonmap = new JsonMap()

    jsonmap.declare('date', (unixtime) =>
        // convert unix time to human readable date string
        new Date(+unixtime * 1000).toDateString()
    )

    expect(JSON.parse(jsonmap.transform(input, transformer))).toEqual(JSON.parse(expectedResult))
})