import { AstNode } from "../parser"
import { CurrentIndexExecutor, CurrentValueAtPathExecutor, CurrentValueExecutor, IfConditionExecutor, ValueOfExecutor } from "./executor"
import { Executor, IExecutorContext } from "./executor.interface"
import { LoopExecutor } from "./structure-executor"

export class MethodExecutor implements Executor {
    readonly childExecutorList!: Executor[]

    constructor(
        public context: IExecutorContext
    ) {
        this.childExecutorList = [
            new IfConditionExecutor(this.context),
            new LoopExecutor(this.context),
            new ValueOfExecutor(this.context),
            new CurrentValueExecutor(this.context),
            new CurrentIndexExecutor(this.context),
            new CurrentValueAtPathExecutor(this.context)
        ]
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
            currentValueAtPath
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
            case '#currentvalueatpath':
                return currentValueAtPath.execute(parameterList as AstNode[])
        }
    }
}