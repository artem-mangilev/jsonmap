import { AstNode } from "../parser"
import { evalObject } from "../utils"
import { Executor, IExecutorContext } from "./executor.interface"

export interface PathExecutorParams {
    rootRef?: Record<string, any>
}

export class PathExecutor<T extends PathExecutorParams> implements Executor<T> {
    constructor(
        public context: IExecutorContext
    ) { }

    execute(node: AstNode[], params?: T) {
        const [pathRoot, pathItems] = [
            node[0].value as string,
            node[1].value as AstNode[]
        ]

        return evalObject(
            params?.rootRef ? params.rootRef : this.context.sourceObject,
            pathItems.map(({ value }) => value as string)
        )
    }
}