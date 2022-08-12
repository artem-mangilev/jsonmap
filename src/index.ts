import { ArrayLoopExecutionStateManager } from './array-loop-execution-state-manager'
import { ExecutorContext } from './executor/executor'
import { StructureExecutorContext } from './executor/structure-executor'
import { AstNode, parser } from './parser'
import { fkey, isJsonmapToken, isObject } from './utils'
import { Required } from 'utility-types'
import { isArray, isBoolean, isNumber, isString } from './std/type-checking'
import { CustomFunctionsMap } from './types/custom-functions-map'

import 'core-js/actual/structured-clone'
import { toBoolean, toDecimal, toInteger, toString } from './std/type-conversion'
import { getLength } from './std/iterable'
import { concat, getFirstIndexOf, getLastIndexOf, getSubstring, stringContains, stringEquals } from './std/string'
import { add, divide, multiply, round, subtract } from './std/math'

interface JsonMapOptions {
    space?: number
}

type JsonMapOptionsInternal = Required<JsonMapOptions>

export class JsonMap {
    public options: JsonMapOptionsInternal

    private customFunctions: CustomFunctionsMap = {}

    constructor(
        options: JsonMapOptions = {}
    ) {
        this.options = fillWithDefaultOptions(options)

        this.declareStdLibrary()
    }

    public transform(sourceJson: string, transformerJson: string): string {
        const parsedSource = JSON.parse(sourceJson)
        const arrayLoopStateManager = new ArrayLoopExecutionStateManager()
        const structureExecutorContext = new StructureExecutorContext(
            parsedSource,
            arrayLoopStateManager,
            this.customFunctions
        )

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

        const inlineExpressionExecutorContext = new ExecutorContext(
            parsedSource,
            arrayLoopStateManager,
            this.customFunctions
        )

        // step 2. inline expressions evaluation
        return JSON.stringify(parsedTransformer, (key, value) => {
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

                throw new Error(parserResult.error)

            }

            return value
        }, this.options.space)
    }

    declare(functionName: string, fn: (...args: any[]) => any): void {
        this.customFunctions[functionName] = fn
    }

    private declareStdLibrary(): void {
        // Declare type checking api
        this.declare('isnumber', isNumber)
        this.declare('isstring', isString)
        this.declare('isboolean', isBoolean)
        this.declare('isarray', isArray)

        // Declare type conversion api
        this.declare('tointeger', toInteger)
        this.declare('todecimal', toDecimal)
        this.declare('toboolean', toBoolean)
        this.declare('tostring', toString)

        // Declare api for iterables
        this.declare('length', getLength)

        // Declare api for strings
        this.declare('firstindexof', getFirstIndexOf)
        this.declare('lastindexof', getLastIndexOf)
        this.declare('substring', getSubstring)
        this.declare('concat', concat)
        this.declare('stringequals', stringEquals)
        this.declare('stringcontains', stringContains)

        // Declare math api
        this.declare('add', add)
        this.declare('subtract', subtract)
        this.declare('multiply', multiply)
        this.declare('divide', divide)
        this.declare('round', round)
    }
}

function fillWithDefaultOptions({ space }: JsonMapOptions): JsonMapOptionsInternal {
    return {
        space: space === undefined ? 0 : space
    }
}

