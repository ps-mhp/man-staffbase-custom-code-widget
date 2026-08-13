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

import { formatCode } from "./format-code";

describe("formatCode", () => {
  it("indents CSS", async () => {
    const result = await formatCode("css", "body{color:red;background:blue}");

    expect(result).toEqual({ ok: true, code: "body {\n  color: red;\n  background: blue;\n}\n" });
  });

  it("indents JavaScript", async () => {
    const result = await formatCode("js", "const a=[1,2,3];if(a){console.log( 'x' )}");

    expect(result.ok).toBe(true);
    expect(result.ok && result.code).toContain("const a = [1, 2, 3];");
    expect(result.ok && result.code).toContain('console.log("x");');
  });

  it("leaves already formatted code alone", async () => {
    const once = await formatCode("js", "const a = 1;\n");
    expect(once).toEqual({ ok: true, code: "const a = 1;\n" });
  });

  it("reports a syntax error instead of throwing", async () => {
    const result = await formatCode("js", "const = ;");

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.message).not.toBe("");
  });

  it("reports broken CSS instead of throwing", async () => {
    const result = await formatCode("css", "body { color: red;");

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.message).not.toBe("");
  });
});
