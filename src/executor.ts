import { AstNode, ParserResult, TokenType } from "./parser";
import { evalObject, pushMany } from "./utils";

interface Executor {
    readonly childExecutorList?: Executor[];
    execute(node: AstNode | AstNode[]): any;
}

export class ExecutorContext implements Executor {
    readonly childExecutorList: Executor[] = [
        new MethodExecutor(this),
        new PathExecutor(this)
    ]

    constructor(
        public sourceObject: Record<string, any>
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

class MethodExecutor implements Executor {
    readonly childExecutorList!: Executor[]

    constructor(
        public context: ExecutorContext
    ) {
        this.childExecutorList = [
            new IfConditionExecutor(this.context),
            new ValueOfExecutor(this.context),
        ];
    }

    execute(node: AstNode[]) {
        const [methodName, parameterList] = [node[0].value, node[1].value];

        if (methodName === '#ifcondition') {
            const ifConditionExecutor = this.childExecutorList.find(executor => executor instanceof IfConditionExecutor)

            return ifConditionExecutor?.execute(parameterList as AstNode[])
        } else if (methodName === '#valueof') {
            const valueOfExecutor = this.childExecutorList.find(executor => executor instanceof ValueOfExecutor)

            return valueOfExecutor?.execute(parameterList as AstNode[])
        }
    }
}

class IfConditionExecutor implements Executor {
    constructor(
        public context: ExecutorContext
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

class ValueOfExecutor implements Executor {
    constructor(
        public context: ExecutorContext
    ) { }

    execute(node: AstNode[]) {
        const [path]: AstNode[] = [node[0].value as AstNode];

        if (path.type === TokenType.Path) {
            // ValueOf don't know how to handle path, but context do
            return this.context.execute(path);
        }
    }
}

class PathExecutor implements Executor {
    constructor(
        public context: ExecutorContext
    ) { }

    execute(node: AstNode[]) {
        const [pathRoot, pathItems] = [node[0].value as string, node[1].value as AstNode[]];

        return evalObject(this.context.sourceObject, pathItems.map(({ value }) => value as string))
    }
}