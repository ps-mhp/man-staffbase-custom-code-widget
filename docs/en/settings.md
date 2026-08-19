# Settings

The configuration dialog displays a **Code** field that is never edited manually.
Editing is done in the code editor above it; the **Edit Code** button
reopens it, and **Done** applies the changes to the field.

## Tabs in the Code Editor

| Tab | Description |
| --- | --- |
| CSS | Is inserted into the page as a stylesheet and applies to the **entire page**, not just the widget area. If the widget is removed, the CSS is also removed. |
| JavaScript | Runs with access to `container` (the widget element) and `widgetApi` (the Staffbase interface). |

## Start Time (“Execute:”, only in the JavaScript tab)

| Value | Meaning |
| --- | --- |
| Immediately upon rendering | Default setting. The script starts as soon as the widget appears. Suitable for anything that doesn’t require other page elements. |
| when the page has finished loading | The script waits until the page content stops changing—for scripts that manipulate elements that are loaded later. It starts after 5 seconds at the latest, in any case. |

The CSS takes effect immediately in both cases. This is intentional: it prevents the page from
briefly flashing with no styling.

## Editor Help

| Feature | Description |
| --- | --- |
| Syntax Check | Runs as you type. Below the editor, you’ll see “No syntax errors found” or the error location with a line number. It **does not prevent you from saving**. For CSS, only the bracket structure is checked, not every property. |
| Formatting | Automatically indents the code neatly. |
