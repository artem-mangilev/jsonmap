import { AstNode, TokenType } from "../parser"
import { CurrentIndexExecutor, CurrentValueAtPathExecutor, CurrentValueExecutor, IfConditionExecutor, LastIndexExecutor, LastValueAtPathExecutor, LastValueExecutor, ValueOfExecutor } from "./executor"
import { Executor, IExecutorContext } from "./executor.interface"
import { LoopExecutor } from "./structure-executor"

export class MethodExecutor implements Executor {
    readonly childExecutorList!: Executor[]
    readonly customFunctionExecutorsMap: { [functionName: string]: CustomFunctionExecutor } = {}

    constructor(
        public context: IExecutorContext
    ) {
        this.childExecutorList = [
            new IfConditionExecutor(this.context),
            new LoopExecutor(this.context),
            new ValueOfExecutor(this.context),
            new CurrentValueExecutor(this.context),
            new CurrentIndexExecutor(this.context),
            new LastValueExecutor(this.context),
            new LastIndexExecutor(this.context),
            new CurrentValueAtPathExecutor(this.context),
            new LastValueAtPathExecutor(this.context),
        ]

        for (const fnname in this.context.customFunctionsMap) {
            this.customFunctionExecutorsMap[`#${fnname}`] = new CustomFunctionExecutor(this.context, fnname)
        }
    }

    execute(node: AstNode[]) {
        const [methodName, parameterList] = [
            node[0].value,
            node[1].value
        ]

        const [
            ifConditionExecutor,
            loopExecutor,
            valueOfExecutor,
            currentValueExecutor,
            currentIndexExecutor,
            lastValueExecutor,
            lastIndexExecutor,
            currentValueAtPathExecutor,
            lastValueAtPathExecutor
        ] = this.childExecutorList

        switch (methodName) {
            case '#ifcondition':
                return ifConditionExecutor.execute(parameterList as AstNode[])
            case '#loop':
                return loopExecutor.execute(parameterList as AstNode[])
            case '#valueof':
                return valueOfExecutor.execute(parameterList as AstNode[])
            case '#currentvalue':
                return currentValueExecutor.execute(parameterList as AstNode[])
            case '#currentindex':
                return currentIndexExecutor.execute(parameterList as AstNode[])
            case '#lastvalue':
                return lastValueExecutor.execute(parameterList as AstNode[])
            case '#lastindex':
                return lastIndexExecutor.execute(parameterList as AstNode[])
            case '#currentvalueatpath':
                return currentValueAtPathExecutor.execute(parameterList as AstNode[])
            case '#lastvalueatpath':
                return lastValueAtPathExecutor.execute(parameterList as AstNode[])
        }

        if (this.customFunctionExecutorsMap[methodName as string]) {
            return this.customFunctionExecutorsMap[methodName as string].execute(parameterList as AstNode[])
        }
    }
}

export class CustomFunctionExecutor implements Executor {
    constructor(
        public context: IExecutorContext,
        public functionName: string
    ) { }

    execute(node: AstNode[]) {
        const executedParams = (node.map(n => n.value) as AstNode[]).map((n) =>
            n.type === TokenType.Method ? this.context.execute(n) : n.value
        )

        return this.context.customFunctionsMap[this.functionName](...executedParams)
    }
}