# Variables Editor (Prototype)

This sample extension showcases a variables editor using the [Webview API](https://code.visualstudio.com/api/extension-guides/webview).

## Build the sample extension

```bash
# Install dependencies for both the standalone integration and editor source code and build it
yarn
```

Remark: The standalone editor is built with `vite`.

## Run the standalone editor

Run the editor by doing the following:

1. Press `F5` to open the standalone editor in chrome
2. Edit variable keys and values, delete lines via the tail icon (🗑️) and add new lines via the tail icon (➕). The value fields try to guess the value type (i.e. string, float, integer or boolean).

## Remarks and possible extensions

-   General
    -   In general, webviews are only recommended to use if no other option fits one's needs, see also <https://code.visualstudio.com/api/extension-guides/webview#should-i-use-a-webview>.
-   Webview Toolkit (see also [interactive library](https://microsoft.github.io/vscode-webview-ui-toolkit/?path=/docs/library-data-grid--with-sticky-header))
    -   [+] Only very minor custom CSS styling needed. In our case only for table cell spacing and overall positioning of the table element.
    -   [+] Perfectly aligns with color themes without any customizations.
    -   Customizing the table cell elements gives a variety of possibilities to display variable data, however visualizing multiple level nesting of YAML variables should be sketched beforehand to retrieve the requirements, e.g. how to offer the user the possibility to add a nested level, which elements are suitable for nesting and so on.
-   Table editor
    -   Introduce adding new lines also in between existing ones.
    -   Add variable editing via the VS Code quick input box (e.g. as used by the keyboard shortcuts editor)
        -   This could be triggered via the API `await vscode.window.showInputBox({ prompt: '...', value: undefined });`
    -   Please note that there is a table editor within VS Code (e.g., for the Settings) but it is not exposed as a separate package or the API.
-   Usage in Theia
    -   Some adaptations will be needed, e.g. support of explorer toolbar icon does not work out of the box.
    -   WIP: The style sheets seem to not be accepted by the CSP
