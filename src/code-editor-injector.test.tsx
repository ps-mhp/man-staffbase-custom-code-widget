/**
 * Der Code-Editor im gemeinsamen Rahmen von `@man/config-ui`: Kopf, Status,
 * Übernehmen, Rückgängig, Hilfe und Rückfrage kommen vom Rahmen; der Editor
 * zeichnet keine eigenen Knöpfe dafür mehr.
 */

import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import { EditorView } from "@codemirror/view";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";

import { customCodeShell, startCodeEditorInjector } from "./code-editor-injector";
import { configurationSchema, uiSchema } from "./configuration-schema";
import { CustomCode, encodeCustomCode, parseCustomCode } from "./custom-code";
import { clickInModal, modalRoot, queryDeep, queryInModal, settleModal } from "@shared/ui/config-modal.testing";

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

  // Das Modal lädt nach, der Arbeitsbereich darin noch einmal, CodeMirror ein drittes Mal.
  await waitFor(() => {
    expect(queryInModal('[data-testid="code-editor-css-host"] .cm-editor')).not.toBeNull();
  });

  return { container, stop, onSubmit };
}

const field = (container: HTMLElement): HTMLTextAreaElement => container.querySelector<HTMLTextAreaElement>("#root_code")!;

async function typeIntoCss(text: string): Promise<EditorView> {
  const editable = queryInModal<HTMLElement>('[data-testid="code-editor-css-host"] [contenteditable]')!;
  const view = EditorView.findFromDOM(editable)!;
  // Through the editor view rather than simulated typing: in jsdom's shadow
  // root CodeMirror has no selection to map typed DOM changes onto.
  await act(async () => {
    view.dispatch({ changes: { from: view.state.doc.length, insert: text } });
  });
  return view;
}

describe("startCodeEditorInjector", () => {
  it("hides the raw field and opens the code workspace in the shared frame", async () => {
    const { container, stop } = await inject();

    expect(field(container).style.display).toBe("none");
    expect(queryInModal('[data-testid="code-editor-modal"]')).not.toBeNull();
    expect(queryInModal('[data-testid="config-shell"]')).not.toBeNull();
    expect(queryInModal('[data-testid="code-workspace"]')).not.toBeNull();
    expect(modalRoot()!.querySelector("h1")).toHaveTextContent("Code bearbeiten");
    expect(modalRoot()!.textContent).toContain("Custom-Code");
    expect(queryInModal('aside[aria-label="Code"]')).not.toBeNull();

    await act(async () => stop());
  });

  it("offers no preview: the code only runs on the page", async () => {
    const { stop } = await inject();

    expect(customCodeShell.preview).toBe(false);
    expect(queryInModal('[aria-label="Ansicht"]')).toBeNull();

    await act(async () => stop());
  });

  it("draws no buttons of its own for saving or closing any more", async () => {
    const { stop } = await inject();

    expect(queryInModal('[data-testid="code-tabs-done"]')).toBeNull();
    expect(modalRoot()!.textContent).not.toContain("Fertig");

    await act(async () => stop());
  });

  it("seeds both editors from the stored value", async () => {
    const stored = encodeCustomCode({ css: "body { color: red; }", js: "const a = 1;", timing: "immediate" });
    const { stop } = await inject({ code: stored });

    expect(queryInModal('[data-testid="code-editor-css"]')).toHaveTextContent("body { color: red; }");
    expect(queryInModal('[data-testid="code-editor-js"]')).toHaveTextContent("const a = 1;");

    await act(async () => stop());
  });

  it("writes applied edits back into the field encoded, so RJSF submits them", async () => {
    const { container, stop, onSubmit } = await inject({ code: encodeCustomCode({ css: "a{}", js: "", timing: "immediate" }) });

    await typeIntoCss("b");
    // Edits stay in the modal's draft until they are applied.
    expect(parseCustomCode(field(container).value).css).toBe("a{}");
    await clickInModal('[data-testid="config-shell-apply"]');

    await act(async () => {
      container.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    const submitted = onSubmit.mock.calls[0][0].formData.code as string;
    expect(submitted.startsWith("b64:")).toBe(true);
    expect(parseCustomCode(submitted).css).toBe("a{}b");

    await act(async () => stop());
  });

  it("leaves a stored block untouched when it is opened and applied without a change", async () => {
    // Von Hand eingetragen, unkodiert und mit unbekanntem Startzeitpunkt:
    // gelesen wird es, geschrieben nichts.
    const raw = JSON.stringify({ css: "a{}", js: "1;", timing: "later" });
    const { container, stop } = await inject({ code: raw });

    expect(queryInModal('[data-testid="config-shell-apply"]')).toBeDisabled();
    await act(async () => {
      queryInModal('[data-testid="config-shell"]')!.dispatchEvent(
        new KeyboardEvent("keydown", { key: "s", ctrlKey: true, bubbles: true, cancelable: true }),
      );
    });

    expect(field(container).value).toBe(raw);

    await act(async () => stop());
  });

  it("names the changed language in the status", async () => {
    const { stop } = await inject();

    await typeIntoCss("a {}");

    expect(queryInModal('[data-testid="config-shell"] [role="status"]')).toHaveTextContent("CSS geändert – nicht übernommen");
    expect(customCodeShell.statusText!(
      { css: "", js: "1", timing: "ready" } as CustomCode,
      { css: "", js: "", timing: "immediate" } as CustomCode,
    )).toBe("JavaScript und Startzeitpunkt geändert");

    await act(async () => stop());
  });

  it("applies and closes on ⌘/Ctrl Enter inside the code, instead of inserting a blank line", async () => {
    const { container, stop } = await inject({ code: encodeCustomCode({ css: "a{}", js: "", timing: "immediate" }) });

    const view = await typeIntoCss("b");
    await act(async () => {
      view.contentDOM.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", ctrlKey: true, bubbles: true, cancelable: true }));
    });

    expect(parseCustomCode(field(container).value).css).toBe("a{}b");
    expect(queryInModal('[data-testid="code-editor-modal"]')).toBeNull();

    await act(async () => stop());
  });

  it("shows the widget's help in the frame's help panel", async () => {
    const { stop } = await inject();

    await clickInModal('[data-testid="config-shell-help"]');
    await settleModal();

    const help = queryInModal('aside[aria-label="Hilfe"]');
    expect(help).toHaveTextContent("Wo der Code läuft");
    expect(help).toHaveTextContent("Tasten");

    await act(async () => stop());
  });

  it("closes to a placeholder button and reopens with the workspace", async () => {
    const { container, stop } = await inject();

    await clickInModal('[data-testid="config-shell-close"]');
    expect(queryInModal('[data-testid="code-editor-modal"]')).toBeNull();

    const reopen = queryDeep<HTMLButtonElement>(container, '[data-testid="code-editor-reopen"]')!;
    expect(reopen).toHaveTextContent("Code bearbeiten");

    await act(async () => reopen.click());
    await waitFor(() => {
      expect(queryInModal('[data-testid="code-workspace"]')).not.toBeNull();
    });

    await act(async () => stop());
  });
});
