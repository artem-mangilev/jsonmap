import { ArrayLoopExecutionStateManager } from './array-loop-execution-state-manager';
import { ExecutorContext } from './executor/executor';
import { StructureExecutorContext } from './executor/structure-executor';
import { AstNode, parser } from './parser';
import { testMap } from './test-json/value-of-transformer.test-json';
import { isJsonmapToken, isObject } from './utils';

class JsonMap {
    public transform(sourceJson: string, transformerJson: string): string {
        const parsedSource = JSON.parse(sourceJson)
        const arrayLoopStateManager = new ArrayLoopExecutionStateManager()
        const structureExecutorContext = new StructureExecutorContext(parsedSource, arrayLoopStateManager)

        // step 1. Struct modification and evaluation key expressions (loops, etc.)
        const parsedTransformer = JSON.parse(transformerJson, (key, value) => {
            if (isObject(value) && isJsonmapToken(Object.keys(value)[0])) {
                const childKey = Object.keys(value)[0]

                const parserResult = parser.run(childKey);

                if (!parserResult.isError) {
                    structureExecutorContext.setStructureData(value[childKey])

                    return structureExecutorContext.execute(parserResult.result as AstNode)
                }
            }

            return value
        })

        const inlineExpressionExecutorContext = new ExecutorContext(parsedSource, arrayLoopStateManager)

        // step 2. inline expressions evaluation
        return JSON.stringify(parsedTransformer, (key: string, value: any) => {
            if (arrayLoopStateManager.getState().toArrayRef.includes(value)) {
                arrayLoopStateManager.nextState()
            }

            if (isJsonmapToken(value)) {
                const parserResult = parser.run(value)

                if (!parserResult.isError) {
                    return inlineExpressionExecutorContext.execute(parserResult.result as AstNode)
                }
            }

            return value

        }, 2)
    }
}

const jsonmap = new JsonMap()
// console.log('INPUT:')
// console.log(testMap['valueOf'].input)
// console.log('TRANSFORMER:')
// console.log(testMap['valueOf'].transformer)
// console.log('RESULT:')
// console.log(jsonmap.transform(testMap['valueOf'].input, testMap['valueOf'].transformer));

// console.log('----------')

// console.log('INPUT:')
// console.log(testMap['ifcondition'].input)
// console.log('TRANSFORMER:')
// console.log(testMap['ifcondition'].transformer)
// console.log('RESULT:')
// console.log(jsonmap.transform(testMap['ifcondition'].input, testMap['ifcondition'].transformer));

// console.log('----------')

console.log('INPUT:')
console.log(testMap['loopNumbers'].input)
console.log('TRANSFORMER:')
console.log(testMap['loopNumbers'].transformer)
console.log('RESULT:')
console.log(jsonmap.transform(testMap['loopNumbers'].input, testMap['loopNumbers'].transformer));

