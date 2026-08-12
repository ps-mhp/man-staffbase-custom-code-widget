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
 * The seam between the widget and Prettier.
 *
 * Prettier with both parsers weighs about as much as CodeMirror, and unlike
 * CodeMirror it is not needed to edit anything — only to tidy up. It therefore
 * sits behind its own `import()`, which runs on the first press of the button
 * and never on a page that is merely being read.
 *
 * Failure is a value, not an exception: the one thing that reliably makes
 * Prettier throw is a syntax error, which is exactly what an author is most
 * likely to have in front of them when reaching for the button.
 */

import type { Language } from "./code-mirror";

export type FormatResult = { ok: true; code: string } | { ok: false; message: string };

/**
 * Reads a message out of whatever Prettier threw.
 *
 * Its errors carry the parser's own text — `Unexpected token (3:15)` and the
 * like — which is more useful than anything this module could add.
 */
function messageOf(error: unknown): string {
  if (error instanceof Error && error.message.trim() !== "") return error.message;
  return String(error);
}

/** Formats `source`, or explains why it could not be formatted. */
export async function formatCode(language: Language, source: string): Promise<FormatResult> {
  try {
    const { format } = await import("./format-code-bundle");
    return { ok: true, code: await format(language, source) };
  } catch (error) {
    return { ok: false, message: messageOf(error) };
  }
}
