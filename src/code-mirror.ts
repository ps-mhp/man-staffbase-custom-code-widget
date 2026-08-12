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
 * The seam between the widget and CodeMirror.
 *
 * Only types cross it statically; the code itself arrives through the one
 * dynamic `import()` below and therefore lives in its own chunk. The
 * configuration dialog exists only in the editing view, so a reader of a
 * published page never fetches it — which matters, because the editor weighs
 * several times what the widget itself does.
 *
 * `setPublicPathFromBundle` in `index.tsx` makes sure the chunk is fetched
 * from the CDN the bundle came from and not from the hosting page, and the
 * production build writes it next to the bundle (see `webpack.prod.ts`).
 */

import type { Extension } from "@codemirror/state";
import type { Diagnostic } from "@codemirror/lint";
import type { EditorView } from "@codemirror/view";

export type Language = "css" | "js";

export interface CodeMirrorBundle {
  EditorView: typeof import("@codemirror/view").EditorView;
  EditorState: typeof import("@codemirror/state").EditorState;
  basicSetup: Extension;
  linter: typeof import("@codemirror/lint").linter;
  lintGutter: typeof import("@codemirror/lint").lintGutter;
  forLanguage: (language: Language) => Extension;
  /** Diagnostics the language's parser found, for the message under the editor. */
  parseDiagnostics: (language: Language, view: EditorView) => Diagnostic[];
}

/** Loads CodeMirror and everything the two languages need. */
export async function loadCodeMirror(): Promise<CodeMirrorBundle> {
  const { bundle } = await import("./code-mirror-bundle");
  return bundle;
}
