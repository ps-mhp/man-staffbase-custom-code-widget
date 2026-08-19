# FAQ

**Question:** Does my code run in the CMS editor while I'm editing it?

Answer: No. The code is only executed on the published page and in the
preview. In the edit view, you’ll see a card displaying the
first few lines of the code instead—otherwise, a faulty script would
break the very interface you’re trying to fix.

**Question:** Who is allowed to add this widget to a page?

Answer: Anyone with Staffbase permission to edit the page can
use this widget to modify the page as they wish—this is intentional, since the
usual reason for doing so is to modify an element that isn’t part of the widget itself.
Permissions for this are managed exclusively by Staffbase, not by the widget.

**Question:** My script is supposed to manipulate an element that isn’t even there
yet—what should I do?

Answer: In the JavaScript tab, change the start time to “When the page has finished
loading.” This way, the script waits until the page content has
stabilized, instead of running immediately when the widget is rendered.

**Question:** My CSS or JavaScript suddenly disappears?

Answer: A syntax error doesn’t prevent saving, but it’s displayed in plain text below the
editor—check the message before closing the dialog.
For JavaScript runtime errors, it’s also worth checking the
browser console of the published page.
