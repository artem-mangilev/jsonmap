import { ArrayLoopExecutionStateManager } from "../array-loop-execution-state-manager"
import { AstNode } from "../parser"

export interface Executor {
    readonly childExecutorList?: Executor[]
    execute(node: AstNode | AstNode[]): any
}

export interface IExecutorContext extends Executor {
    sourceObject: Record<string, any>
    arrayLoopStateManager: ArrayLoopExecutionStateManager
}