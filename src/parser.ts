import { between, char, choice, letters, many, parse, Parser, recursiveParser, sepBy, sequenceOf } from 'arcsecond'

export enum TokenType {
    Method = 'Method',
    MethodName = 'MethodName',
    MethodParameterList = 'MethodParameterList',
    MethodParameter = 'MethodParameter',

    Path = 'Path',
    PathRoot = 'PathRoot',
    PathItem = 'PathItem',
    PathItems = 'PathItems',
}

export interface AstNode {
    type: TokenType,
    // TODO: too hard structure
    value: string | AstNode | AstNode[]
}

const tag = <T>(type: TokenType) => (value: T) => ({ type, value })

const pathParser = sequenceOf([
    char('$').map(tag(TokenType.PathRoot)),
    many(
        sequenceOf([char('.'), letters]).map((value) => value[1]).map(tag(TokenType.PathItem))
    ).map(tag(TokenType.PathItems))
]).map(tag(TokenType.Path))

const methodNameParser = sequenceOf([
    char('#'),
    letters
]).map(([char, name]) => char + name)

const methodParameterParser: any = recursiveParser(() => choice([
    // method parser itself could be a parameter
    parser,
    pathParser,
    letters,
]).map(tag(TokenType.MethodParameter)))

export const parser = sequenceOf([
    methodNameParser.map(tag(TokenType.MethodName)),
    between(char('('))(char(')'))(
        sepBy(char(','))(
            methodParameterParser
        ).map(tag(TokenType.MethodParameterList))
    )
]).map(tag(TokenType.Method))

export type ParserResult = ReturnType<typeof parser.run>