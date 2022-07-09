import { ExecutorContext } from "./executor";
import { AstNode } from "../parser";
import { evalObject } from "../utils";
import { Executor, IExecutorContext } from "./executor.interface";

export class PathExecutor implements Executor {
    constructor(
        public context: IExecutorContext
    ) { }

    execute(node: AstNode[]) {
        const [pathRoot, pathItems] = [node[0].value as string, node[1].value as AstNode[]];

        return evalObject(this.context.sourceObject, pathItems.map(({ value }) => value as string))
    }
}