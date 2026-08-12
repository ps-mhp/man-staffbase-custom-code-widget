/*!
 * Copyright 2026, Staffbase SE and contributors.
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
  display: "flex",
  flexDirection: "column",
  border: "1px solid #d5d9de",
  borderRadius: "4px",
  overflow: "hidden",
};

const hostStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflow: "auto",
  fontSize: "13px",
};

const fallbackStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  border: "none",
  padding: "8px",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: "13px",
  boxSizing: "border-box",
  resize: "none",
};

const problemStyle: React.CSSProperties = {
  padding: "6px 10px",
  background: "#fdf1f0",
  color: "#8c1c13",
  borderTop: "1px solid #f0c4c0",
  fontSize: "12px",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

const okStyle: React.CSSProperties = {
  padding: "6px 10px",
  background: "#f3f5f7",
  color: "#5a6570",
  borderTop: "1px solid #e2e6ea",
  fontSize: "12px",
};

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
            onChangeRef.current(next);
          }),
          bundle.EditorView.theme({ "&": { height: "100%" } }),
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
            onChange(event.target.value);
          }}
        />
      )}
      <div style={problem ? problemStyle : okStyle} data-testid={testId && `${testId}-status`}>
        {problem ? formatProblem(problem) : "Keine Syntaxfehler gefunden"}
      </div>
    </div>
  );
}
