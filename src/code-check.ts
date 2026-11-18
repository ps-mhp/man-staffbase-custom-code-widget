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
 * Die Prüfung beider Sprachen als Daten: was als Marke am Reiter, in der
 * Statuszeile, unter der Fehlerzeile im Editor und im Panel „Prüfung“ steht.
 * Ohne React und ohne CodeMirror, damit es für sich prüfbar ist.
 *
 * Ein Fehler hält „Übernehmen“ nicht auf – so war es schon immer, und so
 * steht es in der Doku: fehlerhaftes JavaScript läuft auf der Seite einfach
 * nicht (siehe `code-runner.ts`), CSS wendet der Browser an, so weit er es
 * lesen kann. Deshalb meldet das Widget dem Rahmen keine Prüffehler, sondern
 * zeigt sie nur.
 */

import type { Language } from "./code-mirror";
import type { CustomCode } from "./custom-code";
import { SyntaxProblem, checkSyntax, formatProblem } from "./syntax-check";

/** Die Reihenfolge der Reiter und der Zeilen im Panel „Prüfung“. */
export const LANGUAGES: readonly Language[] = ["css", "js"];

export const LANGUAGE_LABELS: Readonly<Record<Language, string>> = { css: "CSS", js: "JavaScript" };

/**
 * Je Sprache die Zeile der ersten Markierung des Parsers. Die Engine nennt
 * für einen Syntaxfehler oft keine Zeile; dann gilt diese.
 */
export type ParsedLines = Readonly<Partial<Record<Language, number>>>;

/** Je Sprache der erste Fehler, oder `null`. */
export type CodeProblems = Readonly<Record<Language, SyntaxProblem | null>>;

/** Die Fehler beider Sprachen; fehlt der Engine die Zeile, nimmt sie die des Parsers. */
export function findProblems(code: Pick<CustomCode, "css" | "js">, parsed: ParsedLines): CodeProblems {
  const find = (language: Language): SyntaxProblem | null => {
    const found = checkSyntax(language, code[language]);
    return found === null ? null : { ...found, line: found.line ?? parsed[language] };
  };
  return { css: find("css"), js: find("js") };
}

/** Wie viele Fehler eine Sprache hat; die Prüfung nennt höchstens den ersten. */
export const problemCount = (problem: SyntaxProblem | null): number => (problem === null ? 0 : 1);

/** Was im Panel „Prüfung“ hinter der Sprache steht: „keine Fehler“, „1 Fehler in Zeile 9“. */
export function checkSummary(problem: SyntaxProblem | null): string {
  if (problem === null) return "keine Fehler";
  return problem.line === undefined ? "1 Fehler" : `1 Fehler in Zeile ${problem.line}`;
}

/**
 * Was unter der Fehlerzeile im Editor steht, etwa „Zeile 9: missing ) after
 * argument list“. `null`, wenn es keine Zeile gibt, unter der es stehen
 * könnte – dann nennt das Panel die Meldung selbst.
 */
export function problemMark(problem: SyntaxProblem | null): { line: number; message: string } | null {
  if (problem === null || problem.line === undefined) return null;
  return { line: problem.line, message: formatProblem(problem) };
}

/**
 * Wohin „Zur Fehlerstelle“ springt: die gewählte Sprache, wenn sie einen
 * Fehler hat, sonst die erste mit Fehler. `null`, wenn keine einen hat.
 */
export function problemLanguage(problems: CodeProblems, preferred: Language): Language | null {
  if (problems[preferred] !== null) return preferred;
  return LANGUAGES.find((language) => problems[language] !== null) ?? null;
}

/** Der Hinweis ohne Fehler: wo der Code läuft – und wo nicht. */
export const RUNS_WHERE_NOTE = "Der Code läuft auf der veröffentlichten Seite und in der Vorschau, nicht in diesem Fenster.";

/**
 * Der Hinweis unter der Prüfung. Mit Fehlern sagt er, was „Übernehmen“
 * bewirkt: es geht, aber der fehlerhafte Teil wirkt nicht.
 */
export function checkNote(problems: CodeProblems): string {
  const effects = [
    problems.js !== null && "das JavaScript läuft erst, wenn der Fehler behoben ist",
    problems.css !== null && "fehlerhafte CSS-Regeln wirken womöglich nicht",
  ].filter((effect): effect is string => effect !== false);
  if (effects.length === 0) return RUNS_WHERE_NOTE;
  return `„Übernehmen“ ist möglich, aber ${effects.join(", und ")}.`;
}
