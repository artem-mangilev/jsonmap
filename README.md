# jsonmap

This is a javascript data mapping library. It allows you to create complex transferable logic and apply it to your data.

The idea was taken from [this](https://github.com/WorkMaze/JUST.net) awesome repo. The initial goal of jsonmap is to create
compatibility with JUST.net, but then it could be more adapted for JavaScript world.

## How to use?

You should provide some input raw data and transformer data that has jsonmap instructions that will be applied to input.

```js
// your code for fetching json here, this is an example
const inputJson = fs.readFileSync(path.resolve(__dirname, `./input.json`), 'utf-8')
const transformerJson = fs.readFileSync(path.resolve(__dirname, `transformer.json`), 'utf-8')

const transformed = new JsonMap().transform(inputJson, transformerJson)
```

### #valueof

Extracts value by provided path.

**Input:**
```json
{
    "menu": {
        "popup": {
            "menuitem": {
                "open": "open-text",
                "close": "close-text"
            }
        }
    }
}
```

**Transformer:**
```json
{
    "result": {
        "Open": "#valueof($.menu.popup.menuitem.open)",
        "Close": "#valueof($.menu.popup.menuitem.close)"
    }
}
```

**Result:**
```json
{
    "result": {
        "Open": "open-text",
        "Close": "close-text"
    }
}
```

### #ifcondition

Executes condition. Format: ifcondition(firstCompareArgument, secondCompareArgument, trueResult, falseResult)

**Input:**
```json
{
    "menu": {
        "id": "github",
        "repository": "jsonmap"
    }
}
```

**Transformer:**
```json
{
    "ifconditiontesttrue": "#ifcondition(#valueof($.menu.id),github,#valueof($.menu.repository),fail)",
    "ifconditiontestfalse": "#ifcondition(#valueof($.menu.id),xml,#valueof($.menu.repository),fail)"
}
```

**Result:**
```json
{
    "ifconditiontesttrue": "jsonmap",
    "ifconditiontestfalse": "fail"
}
```

### #loop

Tranverses an array:

**Input:**
```json
{
    "numbers": [
        1,
        2,
        3,
        4
    ]
}
```

**Transformer:**
```json
{
    "iteration": {
        "#loop($.numbers)": {
            "CurrentValue": "#currentvalue()",
            "CurrentIndex": "#currentindex()"
        }
    }
}
```

**Result:**
```json
{
    "iteration": [
        {
            "CurrentValue": 1,
            "CurrentIndex": 0
        },
        {
            "CurrentValue": 2,
            "CurrentIndex": 1
        },
        {
            "CurrentValue": 3,
            "CurrentIndex": 2
        },
        {
            "CurrentValue": 4,
            "CurrentIndex": 3
        }
    ]
}
```

## Type utils

### String

**Input:**
```json
{
    "string": "hello world",
    "equalString": "hello world"
}
```

**Transformer:**
```json
{
    "length": "#length($.string)",
    "firstindexof": "#firstindexof($.string,world)",
    "lastindexof": "#lastindexof($.string,o)",
    "concat": "#concat($.string,abcd)",
    "equals": "#stringequals($.string,$.equalString)",
    "contains": "#stringcontains($.string,world)"
}
```

**Result:**
```json
{
    "length": 11,
    "firstindexof": 6,
    "lastindexof": 7,
    "concat": "hello worldabcd",
    "equals": true,
    "contains": true
}
```

### Math

**Input:**
```json
{
    "numbers": [
        2,
        4,
        8,
        1.08
    ]
}
```

**Transformer:**
```json
{
    "add": "#add($.numbers[0],$.numbers[1],2)",
    "subtract": "#subtract($.numbers[2],$.numbers[1],$.numbers[0],1)",
    "multiply": "#multiply($.numbers[0],$.numbers[1],$.numbers[2])",
    "divide": "#divide($.numbers[2],$.numbers[1],$.numbers[0])",
    "round": "#round($.numbers[3],1)",
    "equals": "#mathequals($.numbers[0],2)",
    "greater": "#mathgreaterthan(5,2)",
    "less": "#mathlessthan(2,4)",
    "greaterOrEqual": "#mathgreaterthanorequalto(4,4)",
    "lessOrEqual": "#mathlessthanorequalto(4,4)"
} 
```

**Result:**
```json
{
    "add": 8,
    "subtract": 1,
    "multiply": 64,
    "divide": 1,
    "round": 1.1,
    "equals": true,
    "greater": true,
    "less": true,
    "greaterOrEqual": true,
    "lessOrEqual": true
} 
```

### Array

**Input:**
```json
{
    "array": [
        1,
        2,
        3
    ],
    "stringArray": [
        "hello",
        " ",
        "world"
    ]
} 
```

**Transformer:**
```json
{
    "length": "#length($.array)",
    "concat": "#concatAll($.stringArray)",
    "sum": "#sum(#valueof($.array))",
    "average": "#average($.array)",
    "min": "#min($.array)",
    "max": "#max($.array)"
} 
```

**Result:**
```json
{
    "length": 3,
    "concat": "hello world",
    "sum": 6,
    "average": 2,
    "min": 1,
    "max": 3
} 
```

### Type checking

**Input:**
```json
{
    "integer": 10,
    "string": "",
    "array": [
        100
    ],
    "boolean": false
}
```

**Transformer:**
```json
{
    "isNumberTrue": "#isnumber(#valueof($.integer))",
    "isNumberFalse": "#isnumber(#valueof($.string))",
    "isStringTrue": "#isstring(#valueof($.string))",
    "isStringFalse": "#isstring(#valueof($.integer))",
    "isBooleanTrue": "#isboolean(#valueof($.boolean))",
    "isArrayTrue": "#isarray(#valueof($.array))"
} 
```

**Result:**
```json
{
    "isNumberTrue": true,
    "isNumberFalse": false,
    "isStringTrue": true,
    "isStringFalse": false,
    "isBooleanTrue": true,
    "isArrayTrue": true
} 
```

Type conversions

**Input:**
```json
{
    "booleans": {
        "affirmative_string": "true",
        "negative_string": "false",
        "affirmative_int": 123,
        "negative_int": 0
    },
    "strings": {
        "integer": 123,
        "decimal": 12.34,
        "affirmative_boolean": true,
        "negative_boolean": false
    },
    "integers": {
        "string": "123",
        "decimal": 1.23,
        "affirmative_boolean": true,
        "negative_boolean": false
    },
    "decimals": {
        "integer": 123,
        "string": "1.23"
    }
} 
 24  
```

**Transformer:**
```json
{
    "booleans": {
        "affirmative_string": "#toboolean(#valueof($.booleans.affirmative_string))",
        "negative_string": "#toboolean(#valueof($.booleans.negative_string))",
        "affirmative_int": "#toboolean(#valueof($.booleans.affirmative_int))",
        "negative_int": "#toboolean(#valueof($.booleans.negative_int))"
    },
    "strings": {
        "integer": "#tostring(#valueof($.strings.integer))",
        "decimal": "#tostring(#valueof($.strings.decimal))",
        "affirmative_boolean": "#tostring(#valueof($.strings.affirmative_boolean))",
        "negative_boolean": "#tostring(#valueof($.strings.negative_boolean))"
    },
    "integers": {
        "string": "#tointeger(#valueof($.integers.string))",
        "decimal": "#tointeger(#valueof($.integers.decimal))",
        "affirmative_boolean": "#tointeger(#valueof($.integers.affirmative_boolean))",
        "negative_boolean": "#tointeger(#valueof($.integers.negative_boolean))"
    },
    "decimals": {
        "integer": "#todecimal(#valueof($.decimals.integer))",
        "string": "#todecimal(#valueof($.decimals.string))"
    }
} 
```

**Result:**
```json
{
    "booleans": {
        "affirmative_string": true,
        "negative_string": false,
        "affirmative_int": true,
        "negative_int": false
    },
    "strings": {
        "integer": "123",
        "decimal": "12.34",
        "affirmative_boolean": "true",
        "negative_boolean": "false"
    },
    "integers": {
        "string": 123,
        "decimal": 1,
        "affirmative_boolean": 1,
        "negative_boolean": 0
    },
    "decimals": {
        "integer": 123.0,
        "string": 1.23
    }
}
```

## Sandbox

https://artem-mangilev.github.io/jsonmap-repl/
