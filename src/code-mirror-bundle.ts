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

/**
 * Everything CodeMirror, in one module.
 *
 * The imports are static on purpose: this module is what the single dynamic
 * `import()` in `code-mirror.ts` points at, so webpack emits exactly one
 * chunk. Importing the seven packages dynamically instead produced seven
 * chunks with heavily overlapping contents — the shared parser and view code
 * was copied into each of them, which cost several times the download.
 */

import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { linter, lintGutter, Diagnostic } from "@codemirror/lint";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { syntaxTree } from "@codemirror/language";
import type { Extension } from "@codemirror/state";

import type { CodeMirrorBundle, Language } from "./code-mirror";

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

export const bundle: CodeMirrorBundle = {
  EditorView,
  EditorState,
  basicSetup,
  linter,
  lintGutter,
  forLanguage,
  parseDiagnostics,
};
