import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CodeTabs } from "./code-tabs";
import { CustomCode } from "./custom-code";

function Harness({ initial }: { initial: CustomCode }): React.ReactElement {
  const [value, setValue] = React.useState(initial);
  return (
    <>
      <CodeTabs value={value} onChange={setValue} onDone={jest.fn()} />
      <span data-testid="css-out">{value.css}</span>
      <span data-testid="js-out">{value.js}</span>
    </>
  );
}

/** Waits for the lazily imported editor to replace the textarea fallback. */
async function editorReady(): Promise<void> {
  await waitFor(() => {
    expect(document.querySelector('[data-testid="code-editor-css-host"]')).not.toBeNull();
  });
}

describe("CodeTabs", () => {
  it("starts on CSS and switches to JavaScript", async () => {
    render(<CodeTabs value={{ css: "", js: "" }} onChange={jest.fn()} onDone={jest.fn()} />);
    await editorReady();

    expect(screen.getByTestId("code-tab-css")).toHaveAttribute("aria-selected", "true");

    await act(async () => {
      await userEvent.click(screen.getByTestId("code-tab-js"));
    });

    expect(screen.getByTestId("code-tab-js")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTestId("code-tab-css")).toHaveAttribute("aria-selected", "false");
  });

  it("keeps both editors mounted so switching tabs loses nothing", async () => {
    render(<Harness initial={{ css: "body {}", js: "const a = 1;" }} />);
    await editorReady();

    expect(screen.getByTestId("code-editor-css")).toBeInTheDocument();
    expect(screen.getByTestId("code-editor-js")).toBeInTheDocument();
  });

  it("reports each language's syntax state separately", async () => {
    render(<Harness initial={{ css: "body {", js: "const a = 1;" }} />);
    await editorReady();

    await waitFor(() => {
      expect(screen.getByTestId("code-editor-css-status")).toHaveTextContent("Klammer wurde nicht geschlossen");
    });
    expect(screen.getByTestId("code-editor-js-status")).toHaveTextContent("Keine Syntaxfehler gefunden");
  });

  it("calls onDone when Fertig is clicked", async () => {
    const onDone = jest.fn();
    render(<CodeTabs value={{ css: "", js: "" }} onChange={jest.fn()} onDone={onDone} />);
    await editorReady();

    await act(async () => {
      await userEvent.click(screen.getByTestId("code-tabs-done"));
    });

    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
