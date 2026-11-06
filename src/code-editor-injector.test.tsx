import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import { EditorView } from "@codemirror/view";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";

import { startCodeEditorInjector } from "./code-editor-injector";
import { configurationSchema, uiSchema } from "./configuration-schema";
import { encodeCustomCode, parseCustomCode } from "./custom-code";
import { queryDeep, queryInModal } from "@shared/ui/config-modal.testing";

// jsdom reports `navigator.vendor` "Apple Computer, Inc.", so CodeMirror
// treats it as Safari and, inside a shadow root, reads the selection through
// `document.execCommand("indent")` — which jsdom does not implement.
const hadExecCommand = "execCommand" in document;
beforeAll(() => {
  if (!hadExecCommand) Object.defineProperty(document, "execCommand", { configurable: true, value: () => false });
});
afterAll(() => {
  if (!hadExecCommand) delete (document as Partial<Document>).execCommand;
});

async function inject(formData?: Record<string, unknown>): Promise<{
  container: HTMLElement;
  stop: () => void;
  onSubmit: jest.Mock;
}> {
  const onSubmit = jest.fn();
  const { container } = render(
    <Form schema={configurationSchema} uiSchema={uiSchema} validator={validator} formData={formData} onSubmit={onSubmit} />,
  );

  let stop = (): void => {};
  await act(async () => {
    stop = startCodeEditorInjector(container);
  });

  await waitFor(() => {
    expect(queryInModal('[data-testid="code-editor-css-host"]')).not.toBeNull();
  });

  return { container, stop, onSubmit };
}

describe("startCodeEditorInjector", () => {
  it("hides the raw field and opens the editor on the code field", async () => {
    const { container, stop } = await inject();

    expect(container.querySelector<HTMLTextAreaElement>("#root_code")!.style.display).toBe("none");
    expect(queryInModal('[data-testid="code-editor-modal"]')).not.toBeNull();
    expect(queryInModal('[data-testid="code-tabs"]')).not.toBeNull();

    await act(async () => stop());
  });

  it("seeds both editors from the stored value", async () => {
    const stored = encodeCustomCode({ css: "body { color: red; }", js: "const a = 1;", timing: "immediate" });
    const { stop } = await inject({ code: stored });

    expect(queryInModal('[data-testid="code-editor-css"]')).toHaveTextContent("body { color: red; }");
    expect(queryInModal('[data-testid="code-editor-js"]')).toHaveTextContent("const a = 1;");

    await act(async () => stop());
  });

  it("writes saved edits back into the field encoded, so RJSF submits them", async () => {
    const { container, stop, onSubmit } = await inject({ code: encodeCustomCode({ css: "a{}", js: "", timing: "immediate" }) });

    const editable = queryInModal<HTMLElement>('[data-testid="code-editor-css-host"] [contenteditable]')!;
    // Through the editor view rather than simulated typing: in jsdom's shadow
    // root CodeMirror has no selection to map typed DOM changes onto.
    await act(async () => {
      const view = EditorView.findFromDOM(editable)!;
      view.dispatch({ changes: { from: view.state.doc.length, insert: "b" } });
    });

    // Edits stay in the modal's draft until they are saved.
    await act(async () => {
      (queryInModal('[data-testid="code-tabs-done"]') as HTMLButtonElement).click();
    });

    await act(async () => {
      container.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    const submitted = onSubmit.mock.calls[0][0].formData.code as string;
    expect(submitted.startsWith("b64:")).toBe(true);
    expect(parseCustomCode(submitted).css).not.toBe("a{}");

    await act(async () => stop());
  });

  it("closes to a placeholder button and reopens", async () => {
    const { container, stop } = await inject();

    await act(async () => {
      (queryInModal('[data-testid="code-tabs-done"]') as HTMLButtonElement).click();
    });
    expect(queryInModal('[data-testid="code-editor-modal"]')).toBeNull();

    const reopen = queryDeep<HTMLButtonElement>(container, '[data-testid="code-editor-reopen"]')!;
    expect(reopen).toHaveTextContent("Code bearbeiten");

    await act(async () => reopen.click());
    expect(queryInModal('[data-testid="code-editor-modal"]')).not.toBeNull();

    await act(async () => stop());
  });
});
