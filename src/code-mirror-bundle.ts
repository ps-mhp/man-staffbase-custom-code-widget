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
 * Everything CodeMirror, in one module.
 *
 * The imports are static on purpose: this module is what the single dynamic
 * `import()` in `code-mirror.ts` points at, so webpack emits exactly one
 * chunk. Importing the seven packages dynamically instead produced seven
 * chunks with heavily overlapping contents — the shared parser and view code
 * was copied into each of them, which cost several times the download.
 */

import { Decoration, DecorationSet, EditorView, GutterMarker, WidgetType, gutterLineClass, keymap } from "@codemirror/view";
import { EditorState, Prec, RangeSet, StateEffect, StateField } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { linter, lintGutter, Diagnostic } from "@codemirror/lint";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { syntaxTree } from "@codemirror/language";
import type { Extension } from "@codemirror/state";

import type { CodeMirrorBundle, Language, ProblemMark } from "./code-mirror";

const forLanguage = (language: Language): Extension => (language === "css" ? css() : javascript());

/**
 * Turns the parser's error nodes into diagnostics.
 *
 * The Lezer parser never fails; it marks what it could not make sense of with
 * an error node. Those nodes are the syntax errors, and reading them out is
 * what makes a red mark appear in the text.
 */
const parseDiagnostics = (language: Language, view: EditorView): Diagnostic[] => {
  const diagnostics: Diagnostic[] = [];

  syntaxTree(view.state)
    .cursor()
    .iterate((node) => {
      if (!node.type.isError) return;
      diagnostics.push({
        from: node.from,
        to: Math.max(node.to, node.from + 1),
        severity: "error",
        message: language === "css" ? "Unerwartetes Zeichen im CSS" : "Unerwartetes Zeichen im JavaScript",
      });
    });

  return diagnostics;
};

/** Wie die Zeile im Screen: dieselbe Schrift wie der Rahmen, nicht die des Codes. */
const UI_FONT = "var(--default-font-family, system-ui, sans-serif)";
const CODE_FONT = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
/** Fehlerflächen aus dem Token des Rahmens gemischt statt als eigene Farbe. */
const PROBLEM_SURFACE = "color-mix(in srgb, var(--destructive) 8%, transparent)";
const PROBLEM_BORDER = "color-mix(in srgb, var(--destructive) 25%, transparent)";

/**
 * Das Aussehen im Config-Modal. Farben nur über die Variablen, die `UiRoot`
 * am Rahmen setzt; CodeMirror hängt seine Regeln in denselben Shadow Root.
 */
const editorTheme = EditorView.theme({
  "&": {
    height: "100%",
    maxWidth: "100%",
    fontSize: "13px",
    color: "var(--foreground)",
    backgroundColor: "var(--muted)",
  },
  // Sichtbar, aber leise: ein Ring nach innen, damit er nicht vom Rand der
  // Fläche abgeschnitten wird.
  "&.cm-focused": {
    outline: "2px solid color-mix(in srgb, var(--ring) 45%, transparent)",
    outlineOffset: "-2px",
  },
  // Horizontal scrollt CodeMirror selbst, vertikal ebenso: lange Zeilen
  // verbreitern so nie das Modal.
  ".cm-scroller": { overflow: "auto", fontFamily: CODE_FONT, lineHeight: "1.75" },
  ".cm-content": { minWidth: "max-content", padding: "12px 0" },
  ".cm-line": { padding: "0 16px 0 6px" },
  ".cm-gutters": {
    color: "var(--muted-foreground)",
    backgroundColor: "var(--muted)",
    border: "none",
  },
  // Wie im Screen: Nummern rechtsbündig mit Luft zum Code.
  ".cm-lineNumbers .cm-gutterElement": { minWidth: "36px", padding: "0 12px 0 4px", textAlign: "right" },
  ".cm-activeLine": { backgroundColor: "var(--primary-soft)" },
  ".cm-activeLineGutter": { color: "var(--foreground)", backgroundColor: "var(--primary-soft)" },
  // Nach der aktuellen Zeile, damit eine Fehlerzeile rot bleibt, auch wenn
  // die Schreibmarke in ihr steht.
  ".cm-man-problemLine": { backgroundColor: PROBLEM_SURFACE },
  ".cm-gutterElement.cm-man-problemGutter": { backgroundColor: PROBLEM_SURFACE },
  ".cm-lineNumbers .cm-gutterElement.cm-man-problemGutter": { color: "var(--destructive)", fontWeight: "700" },
  ".cm-man-problem": {
    display: "flex",
    alignItems: "flex-start",
    gap: "6px",
    padding: "6px 12px",
    borderTop: `1px solid ${PROBLEM_BORDER}`,
    color: "var(--destructive)",
    backgroundColor: PROBLEM_SURFACE,
    fontFamily: UI_FONT,
    fontSize: "13px",
    lineHeight: "1.45",
    whiteSpace: "normal",
  },
  ".cm-man-problem svg": {
    flex: "none",
    width: "14px",
    height: "14px",
    marginTop: "2px",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
});

const SVG_NS = "http://www.w3.org/2000/svg";
/** Die Pfade von lucides „triangle-alert“ – ein React-Icon kann CodeMirror nicht zeichnen. */
const ALERT_PATHS = ["m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3", "M12 9v4", "M12 17h.01"];

/** Die Meldung unter der Fehlerzeile. */
class ProblemWidget extends WidgetType {
  constructor(private readonly message: string) {
    super();
  }

  eq(other: ProblemWidget): boolean {
    return other.message === this.message;
  }

  toDOM(): HTMLElement {
    const box = document.createElement("div");
    box.className = "cm-man-problem";
    box.dataset.testid = "code-problem-line";
    const icon = document.createElementNS(SVG_NS, "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    for (const d of ALERT_PATHS) {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", d);
      icon.appendChild(path);
    }
    const text = document.createElement("span");
    text.textContent = this.message;
    box.append(icon, text);
    return box;
  }
}

const setProblem = StateEffect.define<ProblemMark | null>();

/** Färbt die Zeilennummer der Fehlerzeile, wie `.cm-man-problemLine` die Zeile. */
class ProblemGutterMarker extends GutterMarker {
  elementClass = "cm-man-problemGutter";
}

const PROBLEM_GUTTER = new ProblemGutterMarker();

interface ProblemState {
  decorations: DecorationSet;
  gutter: RangeSet<GutterMarker>;
}

const NO_PROBLEM: ProblemState = { decorations: Decoration.none, gutter: RangeSet.empty };

function problemState(state: EditorState, mark: ProblemMark | null): ProblemState {
  if (mark === null || mark.line < 1 || mark.line > state.doc.lines) return NO_PROBLEM;
  const line = state.doc.line(mark.line);
  return {
    decorations: Decoration.set(
      [
        Decoration.line({ class: "cm-man-problemLine" }).range(line.from),
        Decoration.widget({ widget: new ProblemWidget(mark.message), block: true, side: 1 }).range(line.to),
      ],
      true,
    ),
    gutter: RangeSet.of([PROBLEM_GUTTER.range(line.from)]),
  };
}

/**
 * Hält die Fehlerzeile. Ein Feld statt eines Plugins, weil nur ein Feld
 * Block-Dekorationen liefern darf – die Meldung steht als eigene Zeile unter
 * der fehlerhaften. Bis die nächste Meldung kommt, wandert sie mit dem Text.
 */
const problemMarks = StateField.define<ProblemState>({
  create: () => NO_PROBLEM,
  update(value, transaction) {
    let next = transaction.docChanged
      ? { decorations: value.decorations.map(transaction.changes), gutter: value.gutter.map(transaction.changes) }
      : value;
    for (const effect of transaction.effects) {
      if (effect.is(setProblem)) next = problemState(transaction.state, effect.value);
    }
    return next;
  },
  provide: (field) => [
    EditorView.decorations.from(field, (value) => value.decorations),
    gutterLineClass.from(field, (value) => value.gutter),
  ],
});

const setProblemMark = (view: EditorView, mark: ProblemMark | null): void => {
  view.dispatch({ effects: setProblem.of(mark) });
};

const shortcut = (key: string, run: () => void): Extension =>
  Prec.highest(
    keymap.of([
      {
        key,
        run: () => {
          run();
          return true;
        },
      },
    ]),
  );

export const bundle: CodeMirrorBundle = {
  EditorView,
  EditorState,
  basicSetup,
  linter,
  lintGutter,
  forLanguage,
  parseDiagnostics,
  editorTheme,
  problemMarks,
  setProblemMark,
  shortcut,
};
