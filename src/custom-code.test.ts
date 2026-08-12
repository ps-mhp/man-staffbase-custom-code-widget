import { parseCustomCode, encodeCustomCode, isEmptyCode, EMPTY_CODE } from "./custom-code";

describe("parseCustomCode", () => {
  it("reverses encodeCustomCode, including characters an attribute would mangle", () => {
    const code = {
      css: 'a[href="x"] { content: "<&>"; }',
      js: 'console.log("hi & bye");',
      timing: "ready" as const,
    };

    expect(parseCustomCode(encodeCustomCode(code))).toEqual(code);
  });

  it("encodes to a value free of quotes and angle brackets", () => {
    const encoded = encodeCustomCode({ css: '"<&>"', js: "'\"'", timing: "immediate" });

    expect(encoded).toMatch(/^b64:[A-Za-z0-9+/]*={0,2}$/);
  });

  it("reads plain JSON that was typed into the raw field", () => {
    expect(parseCustomCode('{"css":"body{}","js":"1"}')).toEqual({
      css: "body{}",
      js: "1",
      timing: "immediate",
    });
  });

  it("falls back to running immediately when the timing is missing or unknown", () => {
    expect(parseCustomCode('{"css":"","js":"","timing":"whenever"}').timing).toBe("immediate");
    expect(parseCustomCode('{"css":"","js":"","timing":"ready"}').timing).toBe("ready");
  });

  it.each([
    ["undefined", undefined],
    ["a number", 42],
    ["an empty string", ""],
    ["whitespace", "   "],
    ["a corrupt payload", "b64:not base64!"],
    ["broken JSON", "{"],
    ["JSON that is not an object", "b64:" + btoa("42")],
  ])("yields empty code for %s", (_label, raw) => {
    expect(parseCustomCode(raw)).toEqual(EMPTY_CODE);
  });

  it("ignores non-string members instead of carrying them into the runner", () => {
    expect(parseCustomCode('{"css":5,"js":{"a":1}}')).toEqual(EMPTY_CODE);
  });
});

describe("isEmptyCode", () => {
  it("treats whitespace-only code as empty", () => {
    expect(isEmptyCode({ css: "  \n", js: "\t" })).toBe(true);
  });

  it("is false as soon as one language has content", () => {
    expect(isEmptyCode({ css: "", js: "1" })).toBe(false);
  });
});
