import { char, letters, many, sequenceOf, str } from 'arcsecond';

export interface AstNode {
    type: string,
    value: string | AstNode[];
}

const tag = <T>(type: string) => (value: T) => ({ type, value });

const pathParser = sequenceOf([
    char('$').map(tag('path-root')),
    many(
        sequenceOf([char('.'), letters]).map((value) => value[1]).map(tag('path-item'))
    ).map(tag('path-items'))
]).map(tag('path'))

export const parser = sequenceOf([
    str('#valueof').map(tag('method-name')),
    char('(').map(tag('open-bracket')),
    pathParser,
    char(')').map(tag('close-bracket'))
]).map(tag('method'))

export type ParserResult = ReturnType<typeof parser.run>