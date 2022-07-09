import { Executor, IExecutorContext } from "./executor.interface";
import { PathExecutor } from "./path-executor";
import { AstNode, TokenType } from "../parser";
import { LoopExecutor } from "./structure-executor";
import { MethodExecutor } from "./method-executor";
import { ArrayLoopExecutionStateManager } from "../array-loop-execution-state-manager";

export class ExecutorContext implements IExecutorContext {
    readonly childExecutorList: Executor[] = [
        new MethodExecutor(this),
        new PathExecutor(this)
    ];

    constructor(
        public sourceObject: Record<string, any>,
        public arrayLoopStateManager: ArrayLoopExecutionStateManager
    ) { }

    execute(node: AstNode) {
        if (node.type === TokenType.Method) {
            const methodExecutor = this.childExecutorList.find((executor) => executor instanceof MethodExecutor)!;

            return methodExecutor.execute(node.value as AstNode[])
        } else if (node.type === TokenType.Path) {
            const pathExecutor = this.childExecutorList.find((executor) => executor instanceof PathExecutor)!;

            return pathExecutor.execute(node.value as AstNode[])
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

        const executedConditionExpression: string = (conditionExpression as AstNode)?.type === TokenType.Method
            ? this.context.execute(conditionExpression as AstNode)
            : conditionExpression

        const executedEvaluationExpression: string = (evaluationExpression as AstNode)?.type === TokenType.Method
            ? this.context.execute(evaluationExpression as AstNode)
            : evaluationExpression

        const executedTrueResult: string = (trueResult as AstNode)?.type === TokenType.Method
            ? this.context.execute(trueResult as AstNode)
            : trueResult

        const executedFalseResult: string = (falseResult as AstNode)?.type === TokenType.Method
            ? this.context.execute(falseResult as AstNode)
            : falseResult

        if (executedConditionExpression === executedEvaluationExpression) {
            return executedTrueResult
        }

        return executedFalseResult
    }
}

export class ValueOfExecutor implements Executor {
    constructor(
        public context: IExecutorContext
    ) { }

    execute(node: AstNode[]) {
        const [path]: AstNode[] = [node[0].value as AstNode];

        if (path.type === TokenType.Path) {
            // ValueOf don't know how to handle path, but context do
            return this.context.execute(path);
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

        throw new Error('Current value execution error');

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

        throw new Error('Current index execution error');

    }
}