import { valueOfParser } from './parser';
import { inputJson, transformerJson } from './test-json/value-of-transformer.test-json';

const isJsonmapToken = (token: unknown) => typeof token === 'string' && token.startsWith('#');

function evalObject(object: any, pathArray: string[]): any {
    let currentState = object;
    for (const item of pathArray) {
        currentState = currentState[item]
    }

    return currentState;
}

function evalValueofMethod(parserResult: any, sourceObject: any): any {
    const stack: any[] = []

    const pushMany = (data: any) => Array.isArray(data) ? stack.push(...data) : stack.push(data)

    pushMany(parserResult.value);

    while (stack.length) {
        const item = stack.pop()

        if (item.type === 'path-items') {
            return evalObject(sourceObject, item.value.map(({ value }: any) => value))
        }

        if (typeof item.value === 'object') {
            pushMany(item.value);
        }
    }
}

class JsonMap {
    public transform(sourceJson: string, transformerJson: string): string {
        const parsedSource = JSON.parse(sourceJson)
        const parsedTransformer = JSON.parse(transformerJson, (key, value) => {
            if (isJsonmapToken(value)) {
                const parserResult = valueOfParser.run(value);

                if (!parserResult.isError) {
                    return evalValueofMethod(parserResult.result, parsedSource)
                } else {
                    console.log(parserResult.error);
                }
            }

            return value
        })

        return parsedTransformer
    }
}

const jsonmap = new JsonMap()
console.log(jsonmap.transform(inputJson, transformerJson));

