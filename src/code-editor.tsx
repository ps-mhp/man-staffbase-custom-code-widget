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

import * as React from "react";

import type { EditorView } from "@codemirror/view";
import { loadCodeMirror, CodeMirrorBundle, Language } from "./code-mirror";
import { formatCode } from "./format-code";
import { checkSyntax, formatProblem } from "./syntax-check";

export interface CodeEditorProps {
  language: Language;
  value: string;
  onChange: (value: string) => void;
  /** Identifies the editor in tests. */
  testId?: string;
}

const wrapperStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  // Without this a long line makes the editor wider than the modal instead of
  // scrollable inside it: a flex item's automatic minimum size is its content.
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  border: "1px solid #d5d9de",
  borderRadius: "4px",
  overflow: "hidden",
};

const hostStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  // Vertically the host scrolls, horizontally CodeMirror's own scroller does —
  // letting both scroll sideways would produce two scrollbars for one axis.
  overflowY: "auto",
  overflowX: "hidden",
  fontSize: "13px",
};

const fallbackStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  width: "100%",
  border: "none",
  padding: "8px",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: "13px",
  boxSizing: "border-box",
  resize: "none",
  // Code is read by its indentation; wrapping long lines would destroy it.
  whiteSpace: "pre",
  overflowWrap: "normal",
  overflowX: "auto",
};

const problemStyle: React.CSSProperties = {
  padding: "6px 10px",
  background: "#fdf1f0",
  color: "#8c1c13",
  borderTop: "1px solid #f0c4c0",
  fontSize: "12px",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  // An engine's message can be a single very long token; it wraps rather than
  // widening the modal it sits in.
  overflowWrap: "anywhere",
};

const okStyle: React.CSSProperties = {
  padding: "6px 10px",
  background: "#f3f5f7",
  color: "#5a6570",
  borderTop: "1px solid #e2e6ea",
  fontSize: "12px",
};

/** Holds the message and the button on one line, message first. */
const statusRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const statusTextStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const formatButtonStyle = (isBusy: boolean): React.CSSProperties => ({
  flex: "none",
  border: "1px solid #c3c9d0",
  borderRadius: "4px",
  background: "#fff",
  color: "#3a4148",
  cursor: isBusy ? "progress" : "pointer",
  padding: "3px 10px",
  fontSize: "12px",
});

/**
 * A CodeMirror editor for one language, with the first syntax problem spelled
 * out underneath.
 *
 * Uncontrolled towards CodeMirror: the editor owns its document once created,
 * and `value` is only the seed. Pushing every keystroke back in would fight
 * the editor for the cursor.
 *
 * Until the chunk has arrived — and in a browser where it fails to — a plain
 * textarea holds the same value. Losing highlighting is an inconvenience;
 * losing the ability to edit at all would make the widget unusable.
 */
export function CodeEditor({ language, value, onChange, testId }: CodeEditorProps): React.ReactElement {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const viewRef = React.useRef<EditorView | null>(null);
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  const [bundle, setBundle] = React.useState<CodeMirrorBundle | null>(null);
  const [failed, setFailed] = React.useState(false);
  const [text, setText] = React.useState(value);
  /** Line of the parser's first mark, used where the engine reports none. */
  const [parsedErrorLine, setParsedErrorLine] = React.useState<number | undefined>(undefined);
  const [isFormatting, setIsFormatting] = React.useState(false);
  /** Why the last formatting attempt failed, shown instead of the syntax line. */
  const [formatError, setFormatError] = React.useState<string | null>(null);

  /**
   * Replaces the whole document with `next`.
   *
   * Goes through a transaction rather than a fresh editor state, because a
   * transaction is what CodeMirror can map the selection through — the cursor
   * survives reformatting instead of jumping to the top. The update listener
   * reports the change onwards, which is why `onChange` is called here only
   * for the textarea fallback.
   */
  const replaceDocument = (next: string): void => {
    const view = viewRef.current;
    if (view) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: next } });
      return;
    }
    setText(next);
    onChangeRef.current(next);
  };

  const handleFormat = (): void => {
    if (isFormatting) return;
    setIsFormatting(true);
    void formatCode(language, text).then((result) => {
      setIsFormatting(false);
      setFormatError(result.ok ? null : result.message);
      if (result.ok) replaceDocument(result.code);
    });
  };

  React.useEffect(() => {
    let cancelled = false;
    loadCodeMirror().then(
      (loaded) => {
        if (!cancelled) setBundle(loaded);
      },
      (error) => {
        console.error("[custom-code-widget] Der Code-Editor konnte nicht geladen werden:", error);
        if (!cancelled) setFailed(true);
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  // The seed is read through a ref so that a change of `value` from the
  // outside does not tear the editor down and rebuild it mid-typing.
  const seedRef = React.useRef(value);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!bundle || !host) return;

    const view = new bundle.EditorView({
      parent: host,
      state: bundle.EditorState.create({
        doc: seedRef.current,
        extensions: [
          bundle.basicSetup,
          bundle.forLanguage(language),
          bundle.lintGutter(),
          bundle.linter((linted) => {
            const diagnostics = bundle.parseDiagnostics(language, linted);
            setParsedErrorLine(
              diagnostics.length === 0 ? undefined : linted.state.doc.lineAt(diagnostics[0].from).number,
            );
            return diagnostics;
          }),
          bundle.EditorView.updateListener.of((update) => {
            if (!update.docChanged) return;
            const next = update.state.doc.toString();
            setText(next);
            setFormatError(null);
            onChangeRef.current(next);
          }),
          // CodeMirror measures itself against its host. Pinning it to the
          // host's box is what turns a long line into a scroll instead of
          // growth: `.cm-scroller` then has a width to scroll within, and
          // `.cm-content` is allowed to be wider than it.
          bundle.EditorView.theme({
            "&": { height: "100%", maxWidth: "100%" },
            ".cm-scroller": { overflow: "auto" },
            ".cm-content": { minWidth: "max-content" },
          }),
        ],
      }),
    });

    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [bundle, language]);

  const found = checkSyntax(language, text);
  const problem = found === null ? null : { ...found, line: found.line ?? parsedErrorLine };
  // A failed reformat has the more specific message of the two: it names the
  // position the parser stopped at, where the syntax check only names the
  // problem.
  const message = formatError ?? (problem ? formatProblem(problem) : "Keine Syntaxfehler gefunden");
  const isBad = formatError !== null || problem !== null;

  return (
    <div style={wrapperStyle} data-testid={testId}>
      {bundle && !failed ? (
        <div ref={hostRef} style={hostStyle} data-testid={testId && `${testId}-host`} />
      ) : (
        <textarea
          style={fallbackStyle}
          spellCheck={false}
          aria-label={language === "css" ? "CSS" : "JavaScript"}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setFormatError(null);
            onChange(event.target.value);
          }}
        />
      )}
      <div style={{ ...(isBad ? problemStyle : okStyle), ...statusRowStyle }} data-testid={testId && `${testId}-status`}>
        <span style={statusTextStyle}>{message}</span>
        <button
          type="button"
          data-testid={testId && `${testId}-format`}
          style={formatButtonStyle(isFormatting)}
          disabled={isFormatting}
          title="Code einrücken und umbrechen (Prettier)"
          onClick={handleFormat}
        >
          {isFormatting ? "Formatiere…" : "Formatieren"}
        </button>
      </div>
    </div>
  );
}
