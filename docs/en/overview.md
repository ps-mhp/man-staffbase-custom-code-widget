# Custom Code

The Custom Code widget is the tool for anything that the CMS’s built-in features
can’t handle: special formatting, selectively hiding an
element, or a small interactive feature.

**It doesn’t display anything itself.** On the published page, it’s
invisible and takes up no space. It simply contains the code you enter in
the configuration dialog:

- **CSS** changes the appearance of the page. It applies to the **entire page**,
  not just the widget’s area.
- **JavaScript** changes the page’s behavior and can modify it
  as desired.

## Before You Begin

This widget requires programming knowledge. There is no check to
prevent an error from rendering the page unusable—while the widget
does catch errors, “incorrect but valid” code will still execute. If you just want to
embed an image, a table, or a post, you’re better off using the other
widgets.

Rule of thumb: First check whether you can achieve the desired result with a
standard widget. Custom code is a last resort, not the first option.

## Where the Code Runs

| Location | JavaScript | CSS |
| --- | --- | --- |
| Published page | runs | takes effect |
| Preview | runs | takes effect |
| CMS editor (edit view) | **does not** run | **does not** take effect |

In the editor, only a card with the first few lines
of the stored code appears where the widget would normally be. This is intentional: Otherwise, a faulty script would
break up the very interface you’re trying to fix. So,
always use the **Preview** for testing.

For the same reason, **no live example** is shown on this documentation page—
otherwise, the code would run against the documentation instead of your page.
