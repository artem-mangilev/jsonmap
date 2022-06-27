import { char, letters, many, ResultType, sequenceOf, startOfInput, str } from 'arcsecond';
import { inputJson, transformerJson } from './test-json/value-of-transformer.test-json';

const tag = <T>(type: string) => (value: T) => ({ type, value });

const pathParser = sequenceOf([
  char('$').map(tag('path-root')),
  many(
    sequenceOf([char('.'), letters]).map((value) => value[1]).map(tag('path-item'))
  ).map(tag('path-items'))
]).map(tag('path'))

const valueOfParser = sequenceOf([
  str('#valueof').map(tag('method-name')),
  char('(').map(tag('open-bracket')),
  pathParser,
  char(')').map(tag('close-bracket'))
]).map(tag('method'))

const isJsonmapToken = (token: unknown) => typeof token === 'string' && token.startsWith('#');

function evalObject(object: any, pathArray: string[]): any {
  let currentState = object;
  for (const item of pathArray) {
    currentState = currentState[item]
  }

  return currentState;
}

function evalValueofMethod(parserResult: any, sourceObject: any): any {
  const stack = []

  if (Array.isArray(parserResult.value)) {
    stack.push(...parserResult.value)
  } else {
    stack.push(parserResult.value)
  }

  while (stack.length) {
    const item = stack.pop()

    if (item.type === 'path-items') {
      return evalObject(sourceObject, item.value.map(({ value }: any) => value))
    }

    if (typeof item.value === 'object') {
      if (Array.isArray(item.value)) {
        stack.push(...item.value)
      } else {
        stack.push(item.value)
      }
    }
  }

}

class JsonMap {
  public transform(sourceJson: string, transformerJson: string): string {
    const parsedSource = JSON.parse(sourceJson)
    const parsedTransformer = JSON.parse(transformerJson, (key, value) => {

      if (isJsonmapToken(value)) {
        const result = evalValueofMethod((valueOfParser.run(value) as any).result, parsedSource)
        console.log(result);
        return result
      }

      return value
    })

    return parsedTransformer
  }
}

const jsonmap = new JsonMap()
console.log(jsonmap.transform(inputJson, transformerJson));

