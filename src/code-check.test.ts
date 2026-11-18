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

import {
  RUNS_WHERE_NOTE,
  checkNote,
  checkSummary,
  findProblems,
  problemCount,
  problemLanguage,
  problemMark,
} from "./code-check";

describe("findProblems", () => {
  it("findet nichts in sauberem oder leerem Code", () => {
    expect(findProblems({ css: "a { color: red; }", js: "" }, {})).toEqual({ css: null, js: null });
  });

  it("nennt den Fehler je Sprache getrennt", () => {
    const problems = findProblems({ css: "a {", js: "const a = 1;" }, {});
    expect(problems.css).toEqual({ message: "Klammer wurde nicht geschlossen", line: 1 });
    expect(problems.js).toBeNull();
  });

  it("nimmt die Zeile des Parsers, wenn die Engine keine nennt", () => {
    const problems = findProblems({ css: "", js: "a(\n};" }, { js: 2 });
    expect(problems.js?.line).toBe(2);
  });

  it("lässt die Zeile der Engine stehen, wo es eine gibt", () => {
    const problems = findProblems({ css: "a {}\n}", js: "" }, { css: 1 });
    expect(problems.css?.line).toBe(2);
  });
});

describe("problemCount und checkSummary", () => {
  it("zählen und beschreiben wie im Panel „Prüfung“", () => {
    expect(problemCount(null)).toBe(0);
    expect(problemCount({ message: "x" })).toBe(1);
    expect(checkSummary(null)).toBe("keine Fehler");
    expect(checkSummary({ message: "x", line: 9 })).toBe("1 Fehler in Zeile 9");
    expect(checkSummary({ message: "x" })).toBe("1 Fehler");
  });
});

describe("problemMark", () => {
  it("stellt die Meldung mit Zeile unter die Fehlerzeile", () => {
    expect(problemMark({ message: "missing )", line: 9 })).toEqual({ line: 9, message: "Zeile 9: missing )" });
  });

  it("gibt ohne Zeile keine Markierung", () => {
    expect(problemMark({ message: "missing )" })).toBeNull();
    expect(problemMark(null)).toBeNull();
  });
});

describe("problemLanguage", () => {
  const clean = { css: null, js: null };

  it("bleibt in der gewählten Sprache, wenn sie einen Fehler hat", () => {
    expect(problemLanguage({ css: { message: "a" }, js: { message: "b" } }, "js")).toBe("js");
  });

  it("springt sonst zur ersten Sprache mit Fehler", () => {
    expect(problemLanguage({ ...clean, js: { message: "b" } }, "css")).toBe("js");
  });

  it("gibt null ohne Fehler", () => {
    expect(problemLanguage(clean, "css")).toBeNull();
  });
});

describe("checkNote", () => {
  it("sagt ohne Fehler, wo der Code läuft", () => {
    expect(checkNote({ css: null, js: null })).toBe(RUNS_WHERE_NOTE);
  });

  it("sagt mit Fehlern, dass Übernehmen geht, der fehlerhafte Teil aber nicht wirkt", () => {
    expect(checkNote({ css: null, js: { message: "x" } })).toBe(
      "„Übernehmen“ ist möglich, aber das JavaScript läuft erst, wenn der Fehler behoben ist.",
    );
    expect(checkNote({ css: { message: "x" }, js: null })).toBe(
      "„Übernehmen“ ist möglich, aber fehlerhafte CSS-Regeln wirken womöglich nicht.",
    );
    expect(checkNote({ css: { message: "x" }, js: { message: "y" } })).toContain(", und fehlerhafte CSS-Regeln");
  });
});
