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

import { startFieldModalInjector } from "@shared/config-modal";
import { CodeTabs } from "./code-tabs";
import { CustomCode, encodeCustomCode, parseCustomCode } from "./custom-code";
import { CODE_ATTRIBUTE } from "./attributes";

/**
 * Watches for the widget's configuration dialog and puts the code editor in
 * front of its `code` field.
 *
 * Everything about surviving the host's dialog lives in
 * `@shared/config-modal`; what remains here is the code.
 *
 * @param root the subtree to watch; defaults to the document. Exposed so tests
 * can scope the observer to a detached container.
 * @returns a function that stops watching and unmounts the editor.
 */
export function startCodeEditorInjector(root: ParentNode = document): () => void {
  return startFieldModalInjector<CustomCode>({
    fieldKey: CODE_ATTRIBUTE,
    root,
    reopenLabel: "Code bearbeiten",
    modalTestId: "code-editor-modal",
    reopenTestId: "code-editor-reopen",
    parse: parseCustomCode,
    serialize: encodeCustomCode,
    render: ({ value, onChange, onSave }) => React.createElement(CodeTabs, { value, onChange, onDone: onSave }),
  });
}
