import { AstNode, ParserResult, TokenType } from "./parser";
import { evalObject, pushMany } from "./utils";

/**
 * Transform sourceObject
 * 
 * @param transformerAst AST of transformer json
 * @param sourceObject object on which transformer applied
 * @returns transform result
 */
export function transform(transformerAst: ParserResult, sourceObject: Record<string, any>): string {
    if (!transformerAst.isError) {
        const stack: AstNode[] = []
        pushMany(transformerAst.result, stack)

        let item: AstNode | undefined
        while (item = stack.pop()) {
            if (item.type === TokenType.PathItems && Array.isArray(item.value)) {
                return evalObject(sourceObject, item.value.map(({ value }: AstNode) => value as string))
            }

            if (typeof item.value === 'object') {
                pushMany(item.value, stack);
            }
        }

        throw new Error('Error: expression not evaluated');
    } else {
        throw new Error(transformerAst.error)
    }
}