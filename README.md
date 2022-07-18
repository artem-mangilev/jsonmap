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

## Sandbox

https://artem-mangilev.github.io/jsonmap-repl/
