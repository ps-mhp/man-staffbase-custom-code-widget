import React from "react";
import { render, screen } from "@testing-library/react";

import { EditorPlaceholder, previewOf } from "./editor-placeholder";

describe("previewOf", () => {
  it("keeps a short snippet as it is", () => {
    expect(previewOf("body {}\n")).toBe("body {}");
  });

  it("cuts a long snippet and says so", () => {
    expect(previewOf("1\n2\n3\n4\n5\n6")).toBe("1\n2\n3\n4\n…");
  });
});

describe("EditorPlaceholder", () => {
  it("says that nothing is stored yet", () => {
    render(<EditorPlaceholder code={{ css: "", js: "", timing: "immediate" }} />);

    expect(screen.getByTestId("custom-code-placeholder")).toHaveTextContent("Noch kein Code hinterlegt");
  });

  it("previews only the language that has content", () => {
    const { container } = render(<EditorPlaceholder code={{ css: "body { color: red; }", js: "", timing: "immediate" }} />);

    const previews = Array.from(container.querySelectorAll("pre")).map((pre) => pre.textContent);
    expect(previews).toEqual(["CSS\nbody { color: red; }"]);
  });

  it("names where the code does run", () => {
    render(<EditorPlaceholder code={{ css: "", js: "const a = 1;", timing: "immediate" }} />);

    expect(screen.getByTestId("custom-code-placeholder")).toHaveTextContent(
      "Wird auf der veröffentlichten Seite und in der Vorschau ausgeführt, hier nicht.",
    );
  });

  it("names when the script starts", () => {
    const { rerender } = render(<EditorPlaceholder code={{ css: "", js: "const a = 1;", timing: "immediate" }} />);
    expect(screen.getByTestId("custom-code-timing")).toHaveTextContent("Skript startet sofort.");

    rerender(<EditorPlaceholder code={{ css: "", js: "const a = 1;", timing: "ready" }} />);
    expect(screen.getByTestId("custom-code-timing")).toHaveTextContent(
      "Skript startet, wenn die Seite fertig geladen ist.",
    );
  });
});
