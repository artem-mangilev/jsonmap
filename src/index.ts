import { ExecutorContext } from './executor';
import { AstNode, parser } from './parser';
import { testMap } from './test-json/value-of-transformer.test-json';
import { isJsonmapToken } from './utils';

class JsonMap {
    public transform(sourceJson: string, transformerJson: string): string {
        const parsedSource = JSON.parse(sourceJson)
        const executorContext = new ExecutorContext(parsedSource);
        const parsedTransformer = JSON.parse(transformerJson, (key, value) => {
            if (isJsonmapToken(value)) {
                const parserResult = parser.run(value);

                if (!parserResult.isError) {
                    return executorContext.execute(parserResult.result as AstNode)
                }
            }

            return value
        })

        return parsedTransformer
    }
}

const jsonmap = new JsonMap()
console.log('INPUT:')
console.log(testMap['valueOf'].input)
console.log('TRANSFORMER:')
console.log(testMap['valueOf'].transformer)
console.log('RESULT:')
console.log(jsonmap.transform(testMap['valueOf'].input, testMap['valueOf'].transformer));

console.log('----------')

console.log('INPUT:')
console.log(testMap['ifcondition'].input)
console.log('TRANSFORMER:')
console.log(testMap['ifcondition'].transformer)
console.log('RESULT:')
console.log(jsonmap.transform(testMap['ifcondition'].input, testMap['ifcondition'].transformer));

