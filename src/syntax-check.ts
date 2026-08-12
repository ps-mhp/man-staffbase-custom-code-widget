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
 * The plain-language answer to "is this code broken?".
 *
 * CodeMirror marks errors in the text, but a mark is easy to scroll past. This
 * module produces the one sentence shown under the editor, and it does so
 * without CodeMirror so it can be tested on its own.
 *
 * For JavaScript the check is the engine's own parser via `new Function`: its
 * message is more precise than any parser we could bring along, and it is the
 * same parser that will refuse the code later on the page.
 *
 * For CSS there is no such parser at hand — a browser silently drops rules it
 * does not understand rather than reporting them. The check therefore covers
 * the one mistake that actually breaks a stylesheet's structure: unbalanced
 * braces. Everything finer is left to CodeMirror's marks.
 */

import type { Language } from "./code-mirror";

export interface SyntaxProblem {
  message: string;
  /** 1-based, if it could be determined. */
  line?: number;
}

/**
 * Digs the line out of a stack frame of the function `new Function` built.
 *
 * Only some engines put one there: V8 reports `at new Function (<anonymous>)`
 * without a position for a syntax error, so the message usually goes out
 * without a line. It is left to the editor to fill one in from the parser's
 * marks, which do know where they are. A wrong line would be worse than none.
 */
function lineFromStack(error: unknown): number | undefined {
  const stack = error instanceof Error ? error.stack : undefined;
  if (typeof stack !== "string") return undefined;

  const match = /<anonymous>:(\d+):\d+/.exec(stack);
  if (!match) return undefined;

  const line = Number(match[1]) - 2;
  return line > 0 ? line : undefined;
}

function checkJs(code: string): SyntaxProblem | null {
  try {
    new Function(code);
    return null;
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : String(error),
      line: lineFromStack(error),
    };
  }
}

/** Positions in `code` that are inside a string, a comment or an escape. */
function isStructural(code: string): boolean[] {
  const structural = new Array<boolean>(code.length).fill(true);
  let index = 0;

  while (index < code.length) {
    const rest = code.slice(index, index + 2);

    if (rest === "/*") {
      const end = code.indexOf("*/", index + 2);
      const stop = end === -1 ? code.length : end + 2;
      structural.fill(false, index, stop);
      index = stop;
      continue;
    }

    const char = code[index];
    if (char === '"' || char === "'") {
      let cursor = index + 1;
      while (cursor < code.length && code[cursor] !== char) {
        cursor += code[cursor] === "\\" ? 2 : 1;
      }
      structural.fill(false, index, Math.min(cursor + 1, code.length));
      index = cursor + 1;
      continue;
    }

    index += 1;
  }

  return structural;
}

const lineOf = (code: string, index: number): number => code.slice(0, index).split("\n").length;

function checkCss(code: string): SyntaxProblem | null {
  const structural = isStructural(code);
  const open: number[] = [];

  for (let index = 0; index < code.length; index += 1) {
    if (!structural[index]) continue;
    if (code[index] === "{") open.push(index);
    if (code[index] === "}") {
      if (open.length === 0) {
        return { message: "Schließende Klammer ohne öffnende", line: lineOf(code, index) };
      }
      open.pop();
    }
  }

  if (open.length > 0) {
    return { message: "Klammer wurde nicht geschlossen", line: lineOf(code, open[open.length - 1]) };
  }

  return null;
}

/** @returns the first problem found, or `null` when the code parses. */
export function checkSyntax(language: Language, code: string): SyntaxProblem | null {
  if (code.trim() === "") return null;
  return language === "css" ? checkCss(code) : checkJs(code);
}

/** The problem as it is shown under the editor. */
export function formatProblem(problem: SyntaxProblem): string {
  return problem.line === undefined ? problem.message : `Zeile ${problem.line}: ${problem.message}`;
}
