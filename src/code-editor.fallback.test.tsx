import React from "react";
import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CodeEditor, CodeEditorHandle } from "./code-editor";

jest.mock("./code-mirror", () => ({
  loadCodeMirror: (): Promise<never> => Promise.reject(new Error("offline")),
}));

describe("CodeEditor without CodeMirror", () => {
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it("falls back to a plain textarea rather than leaving the author with nothing", async () => {
    render(<CodeEditor language="css" value="body {}" onChange={jest.fn()} testId="editor" />);

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalled();
    });
    expect(screen.getByLabelText("CSS-Code")).toHaveValue("body {}");
  });

  it("still reports changes from the fallback", async () => {
    const onChange = jest.fn();
    render(<CodeEditor language="js" value="" onChange={onChange} testId="editor" />);

    const textarea = await screen.findByLabelText("JavaScript-Code");
    await act(async () => {
      await userEvent.type(textarea, "1");
    });

    expect(onChange).toHaveBeenLastCalledWith("1");
  });

  it("shows a value that changes from the outside, such as an undo in the header", async () => {
    const { rerender } = render(<CodeEditor language="css" value="a {}" onChange={jest.fn()} />);

    rerender(<CodeEditor language="css" value="b {}" onChange={jest.fn()} />);

    expect(await screen.findByLabelText("CSS-Code")).toHaveValue("b {}");
  });

  it("reports where the cursor is", async () => {
    const onCursor = jest.fn();
    render(<CodeEditor language="css" value={"a {\n  color: red;\n}"} onChange={jest.fn()} onCursor={onCursor} />);

    const textarea = await screen.findByLabelText<HTMLTextAreaElement>("CSS-Code");
    await act(async () => {
      textarea.focus();
      textarea.setSelectionRange(9, 9);
      // React meldet `onSelect` nach Tasten und Klicks, nicht beim nativen `select`.
      fireEvent.keyUp(textarea, { key: "ArrowRight" });
    });

    expect(onCursor).toHaveBeenLastCalledWith({ line: 2, column: 6 });
  });

  it("jumps to a line on request", async () => {
    const handle = React.createRef<CodeEditorHandle>();
    render(<CodeEditor ref={handle} language="js" value={"a();\nb(;\nc();"} onChange={jest.fn()} />);

    const textarea = await screen.findByLabelText<HTMLTextAreaElement>("JavaScript-Code");
    act(() => handle.current!.revealLine(2));

    expect(textarea).toHaveFocus();
    expect(textarea.selectionStart).toBe(5);
  });
});
