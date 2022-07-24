import { ArrayLoopExecutionStateManager } from './array-loop-execution-state-manager'
import { ExecutorContext } from './executor/executor'
import { StructureExecutorContext } from './executor/structure-executor'
import { AstNode, parser } from './parser'
import { fkey, isJsonmapToken, isObject } from './utils'
import { Required } from 'utility-types'

import 'core-js/actual/structured-clone'

interface JsonMapOptions {
    space?: number
}

type JsonMapOptionsInternal = Required<JsonMapOptions>

export class JsonMap {
    public options: JsonMapOptionsInternal

    constructor(
        options: JsonMapOptions = {}
    ) {
        this.options = fillWithDefaultOptions(options)
    }

    public transform(sourceJson: string, transformerJson: string): string {
        const parsedSource = JSON.parse(sourceJson)
        const arrayLoopStateManager = new ArrayLoopExecutionStateManager()
        const structureExecutorContext = new StructureExecutorContext(parsedSource, arrayLoopStateManager)

        // step 1. Struct modification and evaluation key expressions (loops, etc.)
        const parsedTransformer = JSON.parse(transformerJson, (key, value) => {
            if (isObject(value) && isJsonmapToken(fkey(value))) {
                const parserResult = parser.run(fkey(value))

                if (!parserResult.isError) {
                    structureExecutorContext.setStructureData(value[fkey(value)])

                    return structureExecutorContext.execute(parserResult.result as AstNode)
                }
            }

            return value
        })

        const inlineExpressionExecutorContext = new ExecutorContext(parsedSource, arrayLoopStateManager)

        // step 2. inline expressions evaluation
        return JSON.stringify(parsedTransformer, (key: string, value: any) => {
            if (arrayLoopStateManager.hasArray(value)) {
                arrayLoopStateManager.setActiveArray(value)
            }

            if (arrayLoopStateManager.getState()?.toArrayRef.includes(value)) {
                arrayLoopStateManager.nextState()
            }

            if (isJsonmapToken(value)) {
                const parserResult = parser.run(value)

                if (!parserResult.isError) {
                    return inlineExpressionExecutorContext.execute(parserResult.result as AstNode)
                }
            }

            return value
        }, this.options.space)
    }
}

function fillWithDefaultOptions({ space }: JsonMapOptions): JsonMapOptionsInternal {
    return {
        space: space === undefined ? 0 : space
    }
}

