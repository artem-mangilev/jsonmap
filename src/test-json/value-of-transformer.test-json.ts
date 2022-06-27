export interface TestMap {
    [testName: string]: {
        input: string,
        transformer: string
    }
}

export const testMap: TestMap = {
    valueOf: {
        input: `{
            "menu": {
              "popup": {
                "menuitem": {
                  "open": "open-text",
                  "close": "close-text"
                }
              }
            }
          }`,
        transformer: `{
            "result": {
              "Open": "#valueof($.menu.popup.menuitem.open)",
              "Close": "#valueof($.menu.popup.menuitem.close)"
            }
          }`,
    },
    ifcondition: {
        input: `{
            "menu": {
              "id" : "github",
              "repository" : "JUST"
            } 
          }`,
        transformer: `{
            "ifconditiontesttrue": "#ifcondition(#valueof($.menu.id),github,#valueof($.menu.repository),fail)",
            "ifconditiontestfalse": "#ifcondition(#valueof($.menu.id),xml,#valueof($.menu.repository),fail)"
          }`
    }
}