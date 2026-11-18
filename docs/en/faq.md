# FAQ

**Question:** Does my code run in the CMS editor while I'm editing it?

Answer: No. The code only runs on the published page and in the
preview. In the editor, you’ll see a card with the first few lines
of your code instead. This prevents a faulty script from breaking the interface
where you’re currently correcting it.

**Question:** In the editor, I only see “No code entered yet. Edit via the
widget settings.”

Answer: The widget is in place but empty. Open the widget settings and
enter the code in the code editor.

**Question:** My script is supposed to interact with an element that isn’t there yet.

Answer: In the **Code** panel on the right, under **Execute**, select “When the page has finished
loading.” The script will then wait until the page content has fully
loaded.

**Question:** My CSS or JavaScript isn’t working.

Answer: Check the following one by one: Was it tested in the **Preview** rather than
in the editor? Does the **Validation** panel report an error? Was the widget setting also saved after
**Apply**? For JavaScript, additionally open the
browser console for the published page—you’ll see messages such as
“The JavaScript has a syntax error and was not executed” or “The
JavaScript failed to execute.”

**Question:** A syntax error is displayed—can I still apply the changes?

Answer: Yes, the validation doesn’t block anything. It’s a warning, not a block.
However, faulty JavaScript won’t be executed on the page in the first place.

**Question:** My CSS also changes other areas of the page.

Answer: That’s by design—the CSS applies globally. If you only want to target one area,
you’ll need to make the selector more specific.

**Question:** Can I place multiple Custom Code widgets on a single page?

Answer: Yes. Each one comes with its own CSS, which disappears when that
widget is removed without affecting the others. However, you shouldn’t rely on the
execution order of the scripts—
it’s better to place dependencies in a single widget.

**Question:** Why doesn’t my script run again after I save it?

Answer: The script won’t run again if the code hasn’t changed. Only an
actual change to the code will restart the script.

**Question:** My timer keeps running even though I’ve left the page.

Answer: Clicking through within the app does not reload
the page. Therefore, return a cleanup function in the script (see “Step
by Step”) that terminates timers and listeners.

**Question:** Who is allowed to use this widget?

Answer: Anyone who is authorized to edit the page—and they can use it to
modify the page as they wish. This is intentional, because the usual trigger is precisely
an element that does not belong to the widget itself. Who has permission
is determined exclusively by Staffbase.
