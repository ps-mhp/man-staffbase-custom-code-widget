import { checkSyntax, formatProblem } from "./syntax-check";

describe("checkSyntax for JavaScript", () => {
  it("accepts valid code", () => {
    expect(checkSyntax("js", "const a = 1;\nreturn () => a;")).toBeNull();
  });

  it("accepts an empty document", () => {
    expect(checkSyntax("js", "\n  \n")).toBeNull();
  });

  it("reports the engine's message for a syntax error", () => {
    const problem = checkSyntax("js", "function (");

    expect(problem).not.toBeNull();
    expect(problem!.message).toMatch(/./);
  });

  it("leaves the line open where the engine does not report one", () => {
    // V8 reports no position for a syntax error out of `new Function`; the
    // editor fills the line in from the parser's marks instead of guessing.
    const problem = checkSyntax("js", "const a = 1;\nconst b = 2;\nconst = ;");

    expect(problem!.line).toBeUndefined();
  });

  it("does not run the code it checks", () => {
    (globalThis as Record<string, unknown>).__ran = false;

    expect(checkSyntax("js", "globalThis.__ran = true;")).toBeNull();
    expect((globalThis as Record<string, unknown>).__ran).toBe(false);

    delete (globalThis as Record<string, unknown>).__ran;
  });
});

describe("checkSyntax for CSS", () => {
  it("accepts a balanced stylesheet, including nested at-rules", () => {
    expect(checkSyntax("css", "@media (min-width: 40em) {\n  body { color: red; }\n}")).toBeNull();
  });

  it("reports an unclosed rule with its line", () => {
    const problem = checkSyntax("css", "body {\n  color: red;\n");

    expect(problem).toEqual({ message: "Klammer wurde nicht geschlossen", line: 1 });
  });

  it("reports a stray closing brace with its line", () => {
    const problem = checkSyntax("css", "body { color: red; }\n}\n");

    expect(problem).toEqual({ message: "Schließende Klammer ohne öffnende", line: 2 });
  });

  it("ignores braces inside strings", () => {
    expect(checkSyntax("css", 'a::after { content: "{"; }')).toBeNull();
  });

  it("ignores braces inside comments", () => {
    expect(checkSyntax("css", "/* } */ body { color: red; }")).toBeNull();
  });

  it("ignores an escaped quote inside a string", () => {
    expect(checkSyntax("css", 'a::after { content: "\\""; }')).toBeNull();
  });
});

describe("formatProblem", () => {
  it("prefixes the line when there is one", () => {
    expect(formatProblem({ message: "kaputt", line: 12 })).toBe("Zeile 12: kaputt");
  });

  it("leaves the message alone when there is no line", () => {
    expect(formatProblem({ message: "kaputt" })).toBe("kaputt");
  });
});
