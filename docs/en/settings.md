# Settings

The configuration dialog opens the code editor in full-screen mode. The
**Code** field behind it is never edited manually; if the editor is closed,
the **Edit Code** button reopens it. **Apply** saves the
current state to the field; **Cancel** discards it (with a confirmation prompt if anything
has been changed). Changes are not saved until the widget settings are saved.

## Tabs above the code area

| Tab | Description |
| --- | --- |
| CSS | Is inserted into the page as a stylesheet and applies to the **entire page**, not just the widget area. If the widget is removed, the CSS is also removed. |
| JavaScript | Runs with access to `container` (the widget element) and `widgetApi` (the Staffbase interface). |

A red number on the tab indicates an error in that language.

## Execute (the “Code” panel on the right)

| Option | Meaning |
| --- | --- |
| Immediately upon rendering | Default setting. The script starts as soon as the widget appears. Suitable for anything that doesn’t require other page elements. |
| When the page has finished loading | The script waits until the page content stops changing—for scripts that manipulate elements that are loaded later. It starts after 5 seconds at the latest in any case. |

The CSS takes effect immediately in both cases. This is intentional: it prevents the page from
briefly flashing without styling.

## Editor Features

| Feature | Description |
| --- | --- |
| Syntax Check | Runs as you type. An error line is highlighted in red, with the message directly below it. In the **Check** panel, it displays “no errors” or “1 error on line …” depending on the language; it jumps **to the error location**. The check **does not prevent you from saving**. For CSS, only the bracket structure is checked, not every property. |
| Status Bar | Below the code: language, number of lines, errors, and the cursor position (“Line 7, Column 32”). |
| Format | Automatically indents the code for the selected language neatly. If the code cannot be read, it remains unchanged, and the status bar explains why. |
| Undo | The arrow in the header undoes entire editing steps; within the code itself, use the editor’s ⌘/Ctrl+Z. |
| Help | The question mark in the header (F1) explains languages, start time, and verification. |
