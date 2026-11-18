/*!
 * Copyright 2026, MHP Management und IT-Beratung GmbH and contributors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Der Rumpf des Config-Modals außerhalb des Rahmens: Reiter, Codeflächen,
 * Statuszeile und das Panel „Code“ – mit dem echten CodeMirror.
 */

import React from "react";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditorView } from "@codemirror/view";

import { CodeWorkspace } from "./code-workspace";
import { CustomCode } from "./custom-code";

const code = (patch: Partial<CustomCode> = {}): CustomCode => ({ css: "", js: "", timing: "immediate", ...patch });

function Harness({
  initial,
  onValue,
  onSubmit = () => undefined,
}: {
  initial: CustomCode;
  onValue?: (value: CustomCode) => void;
  onSubmit?: () => void;
}): React.ReactElement {
  const [value, setValue] = React.useState(initial);
  return (
    <>
      <CodeWorkspace
        value={value}
        onSubmit={onSubmit}
        onChange={(next) => {
          setValue(next);
          onValue?.(next);
        }}
      />
      <button type="button" onClick={() => setValue(initial)}>
        Zurücksetzen
      </button>
    </>
  );
}

/** Wartet, bis CodeMirror nachgeladen das Textfeld abgelöst hat. */
async function editorsReady(): Promise<void> {
  await waitFor(() => {
    expect(screen.getByTestId("code-editor-css-host").querySelector(".cm-editor")).not.toBeNull();
    expect(screen.getByTestId("code-editor-js-host").querySelector(".cm-editor")).not.toBeNull();
  });
}

const viewOf = (language: "css" | "js"): EditorView =>
  EditorView.findFromDOM(screen.getByTestId(`code-editor-${language}-host`).querySelector<HTMLElement>(".cm-editor")!)!;

describe("CodeWorkspace", () => {
  it("zeigt Reiter, Statuszeile und das Panel „Code“ wie im Screen", async () => {
    render(<Harness initial={code({ css: "a {\n  color: red;\n}" })} />);
    await editorsReady();

    expect(screen.getByRole("tab", { name: "CSS" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("button", { name: "Formatieren" })).toBeInTheDocument();
    expect(screen.getByTestId("code-status")).toHaveTextContent("CSS · 3 Zeilen · Keine Fehler");
    expect(screen.getByTestId("code-status")).toHaveTextContent("Zeile 1, Spalte 1");
    const panel = screen.getByRole("complementary", { name: "Code" });
    expect(within(panel).getByRole("radiogroup", { name: "Ausführen" })).toBeInTheDocument();
    expect(within(panel).getByTestId("code-check-css")).toHaveTextContent("CSS – keine Fehler");
    expect(within(panel).getByTestId("code-check-note")).toHaveTextContent("veröffentlichten Seite");
    expect(within(panel).queryByRole("button", { name: "Zur Fehlerstelle" })).toBeNull();
  });

  it("hält beide Editoren eingehängt und zeigt den Stand der gewählten Sprache", async () => {
    render(<Harness initial={code({ css: "a {}", js: "const a = 1;" })} />);
    await editorsReady();

    expect(viewOf("css").state.doc.toString()).toBe("a {}");
    expect(viewOf("js").state.doc.toString()).toBe("const a = 1;");

    await act(async () => {
      await userEvent.click(screen.getByRole("tab", { name: "JavaScript" }));
    });

    expect(screen.getByTestId("code-status")).toHaveTextContent("JavaScript · 1 Zeile");
    expect(screen.getByTestId("code-editor-css-host")).not.toBeVisible();
  });

  it("meldet Getipptes und übernimmt einen Wert von außen, ohne ihn zurückzumelden", async () => {
    const onValue = jest.fn();
    render(<Harness initial={code({ css: "a {}" })} onValue={onValue} />);
    await editorsReady();

    await act(async () => {
      const view = viewOf("css");
      view.dispatch({ changes: { from: view.state.doc.length, insert: "\nb {}" } });
    });
    expect(onValue).toHaveBeenLastCalledWith(code({ css: "a {}\nb {}" }));

    onValue.mockClear();
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Zurücksetzen" }));
    });

    expect(viewOf("css").state.doc.toString()).toBe("a {}");
    expect(onValue).not.toHaveBeenCalled();
  });

  it("zeigt einen Fehler am Reiter, unter der Zeile, in der Statuszeile und in der Prüfung", async () => {
    render(<Harness initial={code({ css: "a {\n  color: red;" })} />);
    await editorsReady();

    expect(screen.getByRole("tab", { name: "CSS 1 Fehler" })).toBeInTheDocument();
    expect(screen.getByTestId("code-status")).toHaveTextContent("CSS · 2 Zeilen · 1 Fehler");
    await waitFor(() => {
      expect(screen.getByTestId("code-problem-line")).toHaveTextContent("Zeile 1: Klammer wurde nicht geschlossen");
    });
    expect(screen.getByTestId("code-check-css")).toHaveTextContent("CSS – 1 Fehler in Zeile 1");
    expect(screen.getByTestId("code-check-note")).toHaveTextContent("„Übernehmen“ ist möglich");
  });

  it("springt mit „Zur Fehlerstelle“ in den Reiter mit dem Fehler", async () => {
    render(<Harness initial={code({ css: "a {}", js: "const = ;" })} />);
    await editorsReady();

    expect(screen.getByRole("tab", { name: "CSS" })).toHaveAttribute("aria-selected", "true");
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Zur Fehlerstelle" }));
    });

    expect(screen.getByRole("tab", { name: "JavaScript 1 Fehler" })).toHaveAttribute("aria-selected", "true");
  });

  it("stellt den Startzeitpunkt über die Wahlkarten um", async () => {
    const onValue = jest.fn();
    render(<Harness initial={code()} onValue={onValue} />);
    await editorsReady();

    await act(async () => {
      await userEvent.click(screen.getByRole("radio", { name: "Wenn die Seite fertig geladen ist" }));
    });

    expect(onValue).toHaveBeenLastCalledWith(code({ timing: "ready" }));
    expect(screen.getByRole("radio", { name: "Wenn die Seite fertig geladen ist" })).toBeChecked();
  });

  it("formatiert die gewählte Sprache und bringt das Ergebnis in den Editor", async () => {
    const onValue = jest.fn();
    render(<Harness initial={code({ css: "body{color:red}" })} onValue={onValue} />);
    await editorsReady();

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Formatieren" }));
    });

    const formatted = "body {\n  color: red;\n}\n";
    await waitFor(() => expect(onValue).toHaveBeenLastCalledWith(code({ css: formatted })));
    await waitFor(() => expect(viewOf("css").state.doc.toString()).toBe(formatted));
  });

  it("nennt in der Statuszeile, warum Formatieren scheiterte, und lässt den Text stehen", async () => {
    const onValue = jest.fn();
    render(<Harness initial={code({ js: "const = ;" })} onValue={onValue} />);
    await editorsReady();

    await act(async () => {
      await userEvent.click(screen.getByRole("tab", { name: "JavaScript 1 Fehler" }));
    });
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Formatieren" }));
    });

    await waitFor(() => {
      expect(screen.getByTestId("code-status")).toHaveTextContent("Formatieren nicht möglich:");
    });
    expect(onValue).not.toHaveBeenCalled();
    expect(viewOf("js").state.doc.toString()).toBe("const = ;");
  });

  it("ruft bei ⌘/Strg ↵ im Code onSubmit, statt eine Leerzeile einzufügen", async () => {
    const onSubmit = jest.fn();
    render(<Harness initial={code({ css: "a{}" })} onSubmit={onSubmit} />);
    await editorsReady();

    await act(async () => {
      viewOf("css").contentDOM.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", ctrlKey: true, bubbles: true, cancelable: true }),
      );
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(viewOf("css").state.doc.toString()).toBe("a{}");
  });
});
