import { ArrayLoopExecutionStateManager } from "../array-loop-execution-state-manager"
import { AstNode } from "../parser"
import { CustomFunctionsMap } from "../types/custom-functions-map"

export interface Executor<TParams = any> {
    readonly childExecutorList?: Executor<any>[]
    execute(node: AstNode | AstNode[], params?: TParams): any
}

export interface IExecutorContext extends Executor {
    sourceObject: Record<string, any>
    arrayLoopStateManager: ArrayLoopExecutionStateManager,
    customFunctionsMap: CustomFunctionsMap
}