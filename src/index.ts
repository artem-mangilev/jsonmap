import { transform } from './evaluator';
import { parser } from './parser';
import { testMap } from './test-json/value-of-transformer.test-json';
import { isJsonmapToken } from './utils';

class JsonMap {
    public transform(sourceJson: string, transformerJson: string): string {
        const parsedSource = JSON.parse(sourceJson)
        const parsedTransformer = JSON.parse(transformerJson, (key, value) => {
            if (isJsonmapToken(value)) {
                return transform(parser.run(value), parsedSource)
            }

            return value
        })

        return parsedTransformer
    }
}

const jsonmap = new JsonMap()
console.log(jsonmap.transform(testMap['valueOf'].input, testMap['valueOf'].transformer));
// console.log(jsonmap.transform(testMap['ifcondition'].input, testMap['ifcondition'].transformer));

