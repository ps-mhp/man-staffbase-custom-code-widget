import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CodeEditor } from "./code-editor";

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
      expect(screen.getByLabelText("CSS")).toBeInTheDocument();
    });
    expect(screen.getByLabelText("CSS")).toHaveValue("body {}");
  });

  it("still reports changes from the fallback", async () => {
    const onChange = jest.fn();
    render(<CodeEditor language="js" value="" onChange={onChange} testId="editor" />);

    const textarea = await screen.findByLabelText("JavaScript");
    await act(async () => {
      await userEvent.type(textarea, "1");
    });

    expect(onChange).toHaveBeenLastCalledWith("1");
  });

  it("still reports syntax problems from the fallback", async () => {
    render(<CodeEditor language="css" value="body {" onChange={jest.fn()} testId="editor" />);

    await waitFor(() => {
      expect(screen.getByTestId("editor-status")).toHaveTextContent("Zeile 1: Klammer wurde nicht geschlossen");
    });
  });
});
