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
 * Everything the editing view needs, and nothing the page does.
 *
 * This module is the widget's only user of React, and `index.tsx` reaches it
 * exclusively through `import()`. On a published page the widget renders
 * nothing at all — it only carries code — so making a reader download a UI
 * framework for it would be hard to defend.
 */

import React from "react";
import ReactDOM from "react-dom/client";

import { CustomCode } from "./custom-code";
import { EditorPlaceholder } from "./editor-placeholder";
import { startCodeEditorInjector } from "./code-editor-injector";

const roots = new WeakMap<HTMLElement, ReactDOM.Root>();

let stopInjector: (() => void) | null = null;

/**
 * Starts watching for the configuration dialog, once.
 *
 * Called from the editing view rather than at module load, because that is
 * where the dialog lives: a block is rendered in the editor before it can be
 * configured. Should a host ever open the dialog without rendering the block
 * first, the plain textarea RJSF renders stays as a fallback — degraded, but
 * not broken.
 */
export function ensureInjector(): void {
  stopInjector ??= startCodeEditorInjector();
}

/** Draws the editing view's placeholder into `container`. */
export function renderPlaceholder(container: HTMLElement, code: CustomCode): void {
  let root = roots.get(container);
  if (!root) {
    root = ReactDOM.createRoot(container);
    roots.set(container, root);
  }
  root.render(React.createElement(EditorPlaceholder, { code }));
}

/** Removes what {@link renderPlaceholder} drew. */
export function unmountPlaceholder(container: HTMLElement): void {
  const root = roots.get(container);
  if (!root) return;
  roots.delete(container);
  root.unmount();
}
