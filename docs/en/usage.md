# Step by Step

## Adding Your Own CSS

1. Place the **Custom Code** widget on the page—the position doesn’t
   matter because it’s invisible. Recommendation: place it at the very bottom so it doesn’t
   get in the way while editing.
2. Open the widget settings. The code editor appears in full-screen mode;
   if it’s closed, click the **Edit Code** button to bring it back.
3. Select the **CSS** tab and enter the rules.
4. Check the status bar below the code: If it says “No errors,” the
   structure is correct.
5. Click **Apply** in the upper-right corner and save the widget settings
  .
6. Check the result in the **Preview**—the CSS does not take effect in the editor.

## Adding Your Own JavaScript

1. Open the widget settings and select the **JavaScript** tab
   in the code editor.
2. Enter the code. Available options include `container` (the widget’s
   element on the page) and `widgetApi` (the Staffbase API).
3. In the **Code** panel on the right, under **Run**, select the execution time —
   default setting “Immediately upon rendering”; for scripts that modify existing
   page elements, select “When the page has finished loading.”
4. Optionally, click **Format**; the code will be automatically and neatly
   indented.
5. In the panel under **Validation**, check that both languages report “no errors,”
   click **Apply**, and save the widget settings.
6. Check the result in the **Preview**. If nothing happens, open the browser console
  — runtime errors are logged there.

## Don’t forget to clean up

Anything that continues to run—timers, event listeners, observers—must be terminated
as soon as the widget disappears. Otherwise, it will continue running as you navigate
through the app, because the page isn’t reloaded in the process.

1. In the script, store the currently running element in a variable.
2. At the end, return a function that clears it:

   ```js
   const timer = setInterval(() => console.log("tick"), 1000);
   return () => clearInterval(timer);
   ```

This function is automatically called when the widget is removed.

## If something goes wrong

1. In the **Code** panel, click **Go to Error**—the editor switches to
   the tab containing the error and jumps to the line; the message appears directly
   below it. A red number on the tab indicates which language is affected.
2. If that doesn’t help, copy the code to the clipboard, clear the editor,
   then click **Apply** and save.
3. Check whether the page is working normally again, and then
   paste the code back in piece by piece.
