export const inputJson = `{
  "menu": {
    "popup": {
      "menuitem": {
        "open": "open-text",
        "close": "close-text"
      }
    }
  }
}`;

export const transformerJson = `{
  "result": {
    "Open": "#valueof($.menu.popup.menuitem.open)",
    "Close": "#valueof($.menu.popup.menuitem.close)"
  }
}`;