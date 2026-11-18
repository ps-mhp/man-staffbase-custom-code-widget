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

import { CustomCode } from "./custom-code";
import { codeChangesStatus, cursorText, firstLine, lineCountText, minimalReplacement, problemCountText } from "./code-status";

const code = (patch: Partial<CustomCode> = {}): CustomCode => ({ css: "", js: "", timing: "immediate", ...patch });

describe("codeChangesStatus", () => {
  it("nennt nichts, solange nichts geändert ist", () => {
    expect(codeChangesStatus(code({ css: "a{}" }), code({ css: "a{}" }))).toBeUndefined();
  });

  it("nennt die eine geänderte Sprache", () => {
    expect(codeChangesStatus(code({ css: "a{}" }), code())).toBe("CSS geändert");
    expect(codeChangesStatus(code({ js: "1" }), code())).toBe("JavaScript geändert");
    expect(codeChangesStatus(code({ timing: "ready" }), code())).toBe("Startzeitpunkt geändert");
  });

  it("zählt zwei und drei Änderungen in einem Satz auf", () => {
    expect(codeChangesStatus(code({ css: "a{}", js: "1" }), code())).toBe("CSS und JavaScript geändert");
    expect(codeChangesStatus(code({ css: "a{}", js: "1", timing: "ready" }), code())).toBe(
      "CSS, JavaScript und Startzeitpunkt geändert",
    );
  });
});

describe("lineCountText", () => {
  it("zählt auch das leere Dokument als eine Zeile", () => {
    expect(lineCountText("")).toBe("1 Zeile");
    expect(lineCountText("a\nb\nc")).toBe("3 Zeilen");
  });
});

describe("problemCountText", () => {
  it("sagt, ob es Fehler gibt", () => {
    expect(problemCountText(0)).toBe("Keine Fehler");
    expect(problemCountText(1)).toBe("1 Fehler");
  });
});

describe("cursorText", () => {
  it("nennt Zeile und Spalte", () => {
    expect(cursorText({ line: 7, column: 32 })).toBe("Zeile 7, Spalte 32");
  });
});

describe("firstLine", () => {
  it("kürzt eine Meldung mit Codeausschnitt auf ihre erste Zeile", () => {
    expect(firstLine("';' expected. (1:7)\n> 1 | const = ;\n    |       ^")).toBe("';' expected. (1:7)");
    expect(firstLine("  einzeilig  ")).toBe("einzeilig");
  });
});

describe("minimalReplacement", () => {
  it("ersetzt nur den Teil, der sich unterscheidet", () => {
    expect(minimalReplacement("body { color: red; }", "body { color: blue; }")).toEqual({
      from: 14,
      to: 17,
      insert: "blue",
    });
  });

  it("fügt ein und löscht am Rand", () => {
    expect(minimalReplacement("abc", "abcd")).toEqual({ from: 3, to: 3, insert: "d" });
    expect(minimalReplacement("abcd", "bcd")).toEqual({ from: 0, to: 1, insert: "" });
    expect(minimalReplacement("", "neu")).toEqual({ from: 0, to: 0, insert: "neu" });
  });

  it("überlappt Anfang und Ende nicht, wenn sich Wiederholungen ändern", () => {
    expect(minimalReplacement("aa", "aaa")).toEqual({ from: 2, to: 2, insert: "a" });
    expect(minimalReplacement("aaa", "aa")).toEqual({ from: 2, to: 3, insert: "" });
  });

  it("gibt null, wenn beide gleich sind", () => {
    expect(minimalReplacement("gleich", "gleich")).toBeNull();
  });
});
