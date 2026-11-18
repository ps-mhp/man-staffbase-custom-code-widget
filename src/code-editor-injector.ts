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
import { Code } from "lucide-react";

import { FieldModalShellOptions, startFieldModalInjector } from "@shared/config-modal";
import { CODE_ATTRIBUTE } from "./attributes";
import { codeChangesStatus } from "./code-status";
import { CustomCode, encodeCustomCode, parseCustomCode } from "./custom-code";

/**
 * Der Arbeitsbereich kommt erst, wenn ein Dialog ihn zeigt: er baut auf
 * `@man/config-ui` (Radix, react-aria, Tailwind) und lädt CodeMirror nach.
 * Dieses Modul liegt im Chunk der Bearbeitungsansicht, den schon die
 * Platzhalter-Karte jedes Blocks braucht; dort bleibt nur, was der Rahmen
 * vor dem Arbeitsbereich wissen muss: Name, Icon, Status.
 */
const loadWorkspace = () => import("./code-workspace");

const LazyCodeWorkspace = React.lazy(() => loadWorkspace().then((module) => ({ default: module.CodeWorkspace })));

/** Die Hilfe aus demselben Chunk wie der Arbeitsbereich. */
const LazyCodeHelp = React.lazy(() => loadWorkspace().then((module) => ({ default: module.CodeHelp })));

const LOADING = React.createElement("p", { className: "p-6 text-sm text-muted-foreground" }, "Editor wird geladen …");

/**
 * Was der gemeinsame Rahmen vom Widget wissen muss. Offengelegt für Tests.
 *
 * Keine Vorschau: das Widget zeigt nichts an, sein Code läuft nur auf der
 * Seite. Keine Prüfung, die „Übernehmen“ aufhält: Syntaxfehler zeigt der
 * Arbeitsbereich, gespeichert werden darf trotzdem – wie bisher (siehe
 * `code-check.ts`).
 */
export const customCodeShell: FieldModalShellOptions<CustomCode> = {
  widgetName: "Custom-Code",
  title: "Code bearbeiten",
  icon: Code,
  preview: false,
  help: React.createElement(React.Suspense, { fallback: null }, React.createElement(LazyCodeHelp)),
  statusText: codeChangesStatus,
};

/**
 * Watches for the widget's configuration dialog and puts the code editor in
 * front of its `code` field.
 *
 * Everything about surviving the host's dialog lives in
 * `@shared/config-modal`; Kopf, Übernehmen, Rückgängig, Hilfe und Rückfrage
 * im Rahmen von `@man/config-ui`. What remains here is the code.
 *
 * Das Datenformat bleibt: ein Attribut `code` mit `{css, js, timing}` als
 * kodierte Nutzlast. Öffnen und „Übernehmen“ ohne Änderung schreibt nichts –
 * der Rahmen übernimmt nur einen geänderten Entwurf.
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
    shell: customCodeShell,
    render: ({ value, onChange }) =>
      React.createElement(React.Suspense, { fallback: LOADING }, React.createElement(LazyCodeWorkspace, { value, onChange })),
  });
}
