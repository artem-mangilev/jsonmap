import { Executor, IExecutorContext } from "./executor.interface"
import { PathExecutor, PathExecutorParams } from "./path-executor"
import { AstNode, TokenType } from "../parser"
import { MethodExecutor } from "./method-executor"
import { ArrayLoopExecutionStateManager } from "../array-loop-execution-state-manager"
import { CustomFunctionsMap } from "../types/custom-functions-map"

export class ExecutorContext implements IExecutorContext {
    readonly childExecutorList: Executor<any>[] = [
        new MethodExecutor(this),
        new PathExecutor<PathExecutorParams>(this)
    ];

    constructor(
        public sourceObject: Record<string, any>,
        public arrayLoopStateManager: ArrayLoopExecutionStateManager,
        public customFunctionsMap: CustomFunctionsMap
    ) { }

    // TODO make some params type checkings
    // for sending params for correct Executor
    execute(node: AstNode, params: any = {}) {
        const [
            methodExecutor,
            pathExecutor
        ] = this.childExecutorList

        if (node.type === TokenType.Method) {
            return methodExecutor.execute(node.value as AstNode[], params)
        } else if (node.type === TokenType.Path) {
            return pathExecutor.execute(node.value as AstNode[], params)
        }
    }
}

export class IfConditionExecutor implements Executor {
    constructor(
        public context: IExecutorContext
    ) { }

    execute(node: AstNode[]) {
        const [conditionExpression, evaluationExpression, trueResult, falseResult] = [
            node[0].value as AstNode | string,
            node[1].value as AstNode | string,
            node[2].value as AstNode | string,
            node[3].value as AstNode | string
        ]

        const executedConditionExpression = () => (conditionExpression as AstNode)?.type === TokenType.Method
            ? this.context.execute(conditionExpression as AstNode)
            : conditionExpression

        const executedEvaluationExpression = () => (evaluationExpression as AstNode)?.type === TokenType.Method
            ? this.context.execute(evaluationExpression as AstNode)
            : evaluationExpression

        const executedTrueResult = () => (trueResult as AstNode)?.type === TokenType.Method
            ? this.context.execute(trueResult as AstNode)
            : trueResult

        const executedFalseResult = () => (falseResult as AstNode)?.type === TokenType.Method
            ? this.context.execute(falseResult as AstNode)
            : falseResult

        if (executedConditionExpression() === executedEvaluationExpression()) {
            return executedTrueResult()
        }

        return executedFalseResult()
    }
}

export class ValueOfExecutor implements Executor {
    constructor(
        public context: IExecutorContext
    ) { }

    execute(node: AstNode[]) {
        const [path] = [
            node[0].value as AstNode
        ]

        if (path.type === TokenType.Path) {
            // ValueOf don't know how to handle path, but context do
            return this.context.execute(path)
        }
    }
}

export class CurrentValueExecutor implements Executor {
    constructor(
        public context: IExecutorContext
    ) { }

    execute(node: AstNode) {
        const state = this.context.arrayLoopStateManager.getState()

        if (state) {
            return state.fromArrayRef[state.currentIndex]
        }

        throw new Error('Current value execution error')

    }
}

export class CurrentIndexExecutor implements Executor {
    constructor(
        public context: IExecutorContext
    ) { }

    execute(node: AstNode) {
        const state = this.context.arrayLoopStateManager.getState()

        if (state) {
            return state.currentIndex
        }

        throw new Error('Current index execution error')

    }
}

export class LastIndexExecutor implements Executor {
    constructor(
        public context: IExecutorContext
    ) { }

    execute(node: AstNode) {
        const state = this.context.arrayLoopStateManager.getState()

        if (state) {
            return state.fromArrayRef.length - 1
        }

        throw new Error('Last index execution error')

    }
}

export class LastValueExecutor implements Executor {
    constructor(
        public context: IExecutorContext
    ) { }

    execute(node: AstNode) {
        const state = this.context.arrayLoopStateManager.getState()

        if (state) {
            return state.fromArrayRef[state.fromArrayRef.length - 1]
        }

        throw new Error('Last index execution error')

    }
}

export class CurrentValueAtPathExecutor implements Executor {
    constructor(
        public context: IExecutorContext
    ) { }

    execute(node: AstNode[]) {
        const [path] = [
            node[0].value as AstNode
        ]

        const state = this.context.arrayLoopStateManager.getState()

        if (state) {
            return this.context.execute(path, {
                rootRef: state.fromArrayRef[state.currentIndex]
            })
        }

        throw new Error('Current value at path execution error')
    }
}

export class LastValueAtPathExecutor implements Executor {
    constructor(
        public context: IExecutorContext
    ) { }

    execute(node: AstNode[]) {
        const [path] = [
            node[0].value as AstNode
        ]

        const state = this.context.arrayLoopStateManager.getState()

        if (state) {
            return this.context.execute(path, {
                rootRef: state.fromArrayRef[state.fromArrayRef.length - 1]
            })
        }

        throw new Error('Last value at path execution error')
    }
}