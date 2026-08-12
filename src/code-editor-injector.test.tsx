import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import userEvent from "@testing-library/user-event";

import { startCodeEditorInjector } from "./code-editor-injector";
import { configurationSchema, uiSchema } from "./configuration-schema";
import { encodeCustomCode, parseCustomCode } from "./custom-code";

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
    expect(document.body.querySelector('[data-testid="code-editor-css-host"]')).not.toBeNull();
  });

  return { container, stop, onSubmit };
}

describe("startCodeEditorInjector", () => {
  it("hides the raw field and opens the editor on the code field", async () => {
    const { container, stop } = await inject();

    expect(container.querySelector<HTMLTextAreaElement>("#root_code")!.style.display).toBe("none");
    expect(document.body.querySelector('[data-testid="code-editor-modal"]')).not.toBeNull();
    expect(document.body.querySelector('[data-testid="code-tabs"]')).not.toBeNull();

    await act(async () => stop());
  });

  it("seeds both editors from the stored value", async () => {
    const stored = encodeCustomCode({ css: "body { color: red; }", js: "const a = 1;", timing: "immediate" });
    const { stop } = await inject({ code: stored });

    expect(document.body.querySelector('[data-testid="code-editor-css"]')).toHaveTextContent("body { color: red; }");
    expect(document.body.querySelector('[data-testid="code-editor-js"]')).toHaveTextContent("const a = 1;");

    await act(async () => stop());
  });

  it("writes edits back into the field encoded, so RJSF submits them", async () => {
    const { container, stop, onSubmit } = await inject({ code: encodeCustomCode({ css: "a{}", js: "", timing: "immediate" }) });

    const editable = document.body.querySelector<HTMLElement>('[data-testid="code-editor-css-host"] [contenteditable]')!;
    await act(async () => {
      editable.focus();
      await userEvent.type(editable, "b");
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
      (document.body.querySelector('[data-testid="code-tabs-done"]') as HTMLButtonElement).click();
    });
    expect(document.body.querySelector('[data-testid="code-editor-modal"]')).toBeNull();

    const reopen = container.querySelector<HTMLButtonElement>('[data-testid="code-editor-reopen"]')!;
    expect(reopen).toHaveTextContent("Code bearbeiten");

    await act(async () => reopen.click());
    expect(document.body.querySelector('[data-testid="code-editor-modal"]')).not.toBeNull();

    await act(async () => stop());
  });
});
