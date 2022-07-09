import { ArrayLoopExecutionStateManager } from "../array-loop-execution-state-manager";
import { AstNode, TokenType } from "../parser";
import { Executor, IExecutorContext } from "./executor.interface";
import { MethodExecutor } from "./method-executor";
import { PathExecutor } from "./path-executor";

export class StructureExecutorContext implements IExecutorContext {
    readonly childExecutorList: Executor[] = [
        new MethodExecutor(this),
        new PathExecutor(this)
    ];

    private _structureData: any;

    constructor(
        public sourceObject: Record<string, any>,
        public arrayLoopStateManager: ArrayLoopExecutionStateManager
    ) { }

    execute(node: AstNode) {
        const [methodExecutor, pathExecutor] = this.childExecutorList;

        switch (node.type) {
            case TokenType.Method:
                return methodExecutor.execute(node.value as AstNode[])
            case TokenType.Path:
                return pathExecutor.execute(node.value as AstNode[])
        }
    }

    setStructureData(data: any): void {
        this._structureData = data
    }

    getStructureData(): any {
        return this._structureData
    }
}

export class LoopExecutor implements Executor {
    constructor(
        public context: IExecutorContext
    ) { }

    execute(node: AstNode[]) {
        const [path]: AstNode[] = [node[0].value as AstNode]

        const executedPath = this.context.execute(path);

        if (Array.isArray(executedPath)) {
            const structureData = (this.context as StructureExecutorContext).getStructureData();

            // TODO: make more browser-friendly clonning
            const mapped = executedPath.map(() => structuredClone(structureData));

            (this.context as StructureExecutorContext).arrayLoopStateManager.addState({
                fromArrayRef: executedPath,
                toArrayRef: mapped,
            })

            return mapped
        }
    }
}