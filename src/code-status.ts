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
 * Die Wörter des Code-Editors: was am Status im Kopf, in der Statuszeile und
 * im Panel „Prüfung“ steht – ohne React und ohne CodeMirror, damit es für
 * sich prüfbar ist. Dazu die kleinste Ersetzung, mit der ein von außen
 * geänderter Text (Rückgängig im Kopf, Formatieren) in den Editor kommt.
 */

import type { CustomCode } from "./custom-code";

/** Eine Stelle im Text, beide Werte ab 1 gezählt. */
export interface CursorPosition {
  line: number;
  column: number;
}

/** „CSS“, „CSS und JavaScript“, „CSS, JavaScript und Startzeitpunkt“. */
function enumerate(parts: readonly string[]): string {
  if (parts.length <= 1) return parts.join("");
  return `${parts.slice(0, -1).join(", ")} und ${parts[parts.length - 1]}`;
}

/**
 * Was am Status im Kopf steht, solange etwas nicht übernommen ist, etwa
 * „CSS geändert“. `undefined`, wenn sich nichts unterscheidet – dann sagt
 * der Rahmen „Keine Änderungen“.
 */
export function codeChangesStatus(draft: CustomCode, saved: CustomCode): string | undefined {
  const parts = [
    draft.css !== saved.css && "CSS",
    draft.js !== saved.js && "JavaScript",
    draft.timing !== saved.timing && "Startzeitpunkt",
  ].filter((part): part is string => part !== false);
  return parts.length === 0 ? undefined : `${enumerate(parts)} geändert`;
}

/** „1 Zeile“, „13 Zeilen“; ein leerer Text hat wie im Editor eine Zeile. */
export function lineCountText(text: string): string {
  const lines = text.split("\n").length;
  return lines === 1 ? "1 Zeile" : `${lines} Zeilen`;
}

/** „Keine Fehler“ oder „1 Fehler“. */
export function problemCountText(count: number): string {
  return count === 0 ? "Keine Fehler" : `${count} Fehler`;
}

/** „Zeile 7, Spalte 32“. */
export function cursorText({ line, column }: CursorPosition): string {
  return `Zeile ${line}, Spalte ${column}`;
}

/**
 * Die erste Zeile einer Meldung. Prettier hängt an seine Meldung einen
 * Ausschnitt des Codes mit Markierung; in der Statuszeile zählt nur der
 * Satz davor.
 */
export function firstLine(message: string): string {
  return message.trim().split("\n")[0].trim();
}

/** Eine Änderung am Text: `from` bis `to` im alten Text wird zu `insert`. */
export interface Replacement {
  from: number;
  to: number;
  insert: string;
}

/**
 * Die kleinste Ersetzung, die `previous` zu `next` macht: gemeinsamer Anfang
 * und gemeinsames Ende bleiben stehen. So bleibt die Schreibmarke im Editor,
 * wo sie war, wenn ein Rückgängig im Kopf nur ein Wort zurücknimmt.
 *
 * @returns `null`, wenn beide gleich sind.
 */
export function minimalReplacement(previous: string, next: string): Replacement | null {
  if (previous === next) return null;
  const shorter = Math.min(previous.length, next.length);

  let start = 0;
  while (start < shorter && previous[start] === next[start]) start += 1;

  // Das Ende darf nicht in den schon gezählten Anfang greifen: bei „aa“ zu
  // „aaa“ wäre sonst jedes `a` zugleich Anfang und Ende.
  let end = 0;
  while (
    end < shorter - start &&
    previous[previous.length - 1 - end] === next[next.length - 1 - end]
  ) {
    end += 1;
  }

  return { from: start, to: previous.length - end, insert: next.slice(start, next.length - end) };
}
