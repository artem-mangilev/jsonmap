import { char, choice, letters, many, possibly, sequenceOf, str } from 'arcsecond';

export enum TokenType {
    Root = 'Root',
    Method = 'Method',
    MethodName = 'MethodName',
    OpenBracket = 'OpenBracket',
    CloseBracket = 'CloseBracket',

    Path = 'Path',
    PathRoot = 'PathRoot',
    PathItem = 'PathItem',
    PathItems = 'PathItems',

    ConditionExpression = 'ConditionExpression',
    EvaluationExpression = 'EvaluationExpression',
    TrueResult = 'TrueResult',
    FalseResult = 'FalseResult'
}

export interface AstNode {
    type: TokenType,
    value: string | AstNode[];
}

const tag = <T>(type: TokenType) => (value: T) => ({ type, value });

const pathParser = sequenceOf([
    char('$').map(tag(TokenType.PathRoot)),
    many(
        sequenceOf([char('.'), letters]).map((value) => value[1]).map(tag(TokenType.PathItem))
    ).map(tag(TokenType.PathItems))
]).map(tag(TokenType.Path))

const valueofParser = sequenceOf([
    str('#valueof').map(tag(TokenType.MethodName)),
    char('(').map(tag(TokenType.OpenBracket)),
    pathParser,
    char(')').map(tag(TokenType.CloseBracket))
]).map(tag(TokenType.Method));

const conditionParamParser = (isLast: boolean = false) => sequenceOf([
    choice([
        valueofParser,
        letters
    ]),
    isLast ? possibly(char(',')) : char(','),
]).map((value) => value[0])

const ifconditionParser = sequenceOf([
    str('#ifcondition').map(tag(TokenType.MethodName)),
    char('(').map(tag(TokenType.OpenBracket)), // TODO: maybe this information is useless
    conditionParamParser().map(tag(TokenType.ConditionExpression)),
    conditionParamParser().map(tag(TokenType.EvaluationExpression)),
    conditionParamParser().map(tag(TokenType.TrueResult)),
    conditionParamParser(true).map(tag(TokenType.FalseResult)),
    char(')').map(tag(TokenType.CloseBracket)), // TODO: maybe this information is useless
]).map(tag(TokenType.Method))

export const parser = choice([
    valueofParser,
    ifconditionParser
]).map(tag(TokenType.Root))


export type ParserResult = ReturnType<typeof parser.run>