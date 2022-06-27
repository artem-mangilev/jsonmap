import { char, letters, many, ResultType, sequenceOf, startOfInput, str } from 'arcsecond';

const tag = <T>(type: string) => (value: T) => ({ type, value });

export const pathParser = sequenceOf([
    char('$').map(tag('path-root')),
    many(
        sequenceOf([char('.'), letters]).map((value) => value[1]).map(tag('path-item'))
    ).map(tag('path-items'))
]).map(tag('path'))

export const valueOfParser = sequenceOf([
    str('#valueof').map(tag('method-name')),
    char('(').map(tag('open-bracket')),
    pathParser,
    char(')').map(tag('close-bracket'))
]).map(tag('method'))