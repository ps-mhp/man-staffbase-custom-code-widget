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

import { act, waitFor } from "@testing-library/react";
import type { BaseBlock, ExternalBlockDefinition } from "widget-sdk";

import { CODE_ATTRIBUTE } from "./attributes";
import { encodeCustomCode, RunTiming } from "./custom-code";
import { STYLE_MARKER } from "./code-runner";

/**
 * The block class as the host builds it.
 *
 * `defineBlock` is stubbed before the module is imported, which is how the
 * definition is captured without the widget needing a test-only export.
 */
let definition: ExternalBlockDefinition;

/** The bare minimum of the host's base class that the widget touches. */
class FakeBaseBlock {
  private _attributes: Record<string, unknown> = {};

  public setAttributes(attributes: Record<string, unknown>): void {
    this._attributes = attributes;
  }

  public parseAttributes<T extends Record<string, unknown>>(): T {
    return this._attributes as T;
  }

  public attributeChangedCallback(): void {}
}

type Block = BaseBlock & FakeBaseBlock;

const widgetApi = { marker: "api" };

function newBlock(): Block {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const BlockClass = definition.blockDefinition.factory(FakeBaseBlock as any, widgetApi as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new (BlockClass as any)() as Block;
}

const withCode = (css: string, js: string, timing: RunTiming = "immediate"): Record<string, unknown> => ({
  [CODE_ATTRIBUTE]: encodeCustomCode({ css, js, timing }),
});

const styles = (): HTMLStyleElement[] => Array.from(document.head.querySelectorAll(`style[${STYLE_MARKER}]`));

beforeAll(async () => {
  // Captured before the import, because the module calls defineBlock while it
  // is being evaluated.
  (window as unknown as { defineBlock: (d: ExternalBlockDefinition) => void }).defineBlock = (d) => {
    definition = d;
  };
  await act(async () => {
    await import("./index");
  });
});

beforeEach(() => {
  document.head.querySelectorAll(`style[${STYLE_MARKER}]`).forEach((style) => style.remove());
  delete (globalThis as Record<string, unknown>).__ran;
});

describe("the block definition", () => {
  it("declares exactly the attribute the schema stores under", () => {
    expect(definition.blockDefinition.attributes).toEqual([CODE_ATTRIBUTE]);
  });
});

describe("the configuration dialog", () => {
  // The Content Designer shows its own placeholder for the block and never
  // calls `renderBlockInEditor`; the editor still has to appear.
  it("gets the code editor without the block having been rendered", async () => {
    const field = document.createElement("textarea");
    field.id = "root_code";
    await act(async () => {
      document.body.appendChild(field);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(document.body.querySelector('[data-testid="code-editor-modal"]')).not.toBeNull();
    });
    expect(field.style.display).toBe("none");

    await act(async () => {
      (document.body.querySelector('[data-testid="code-tabs-done"]') as HTMLButtonElement).click();
    });
    await act(async () => {
      field.remove();
      await Promise.resolve();
    });
  });
});

describe("renderBlock", () => {
  it("runs the code and hides the container", () => {
    const block = newBlock();
    block.setAttributes(withCode("body { color: red; }", "globalThis.__ran = true;"));
    const container = document.createElement("div");

    block.renderBlock(container);

    expect(container.style.display).toBe("none");
    expect(styles()).toHaveLength(1);
    expect((globalThis as Record<string, unknown>).__ran).toBe(true);
  });

  it("does not run the script again when nothing changed", () => {
    const block = newBlock();
    block.setAttributes(withCode("", "globalThis.__runs = (globalThis.__runs ?? 0) + 1;"));
    const container = document.createElement("div");

    block.renderBlock(container);
    block.renderBlock(container);

    expect((globalThis as Record<string, unknown>).__runs).toBe(1);
    delete (globalThis as Record<string, unknown>).__runs;
  });

  it("stops the previous code before running changed code", () => {
    const block = newBlock();
    const container = document.createElement("div");

    block.setAttributes(withCode("body { color: red; }", ""));
    block.renderBlock(container);

    block.setAttributes(withCode("body { color: blue; }", ""));
    block.renderBlock(container);

    expect(styles()).toHaveLength(1);
    expect(styles()[0].textContent).toBe("body { color: blue; }");
  });

  it("survives a broken script", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const block = newBlock();
    block.setAttributes(withCode("", "function ("));

    expect(() => block.renderBlock(document.createElement("div"))).not.toThrow();

    errorSpy.mockRestore();
  });
});

describe("renderBlockInEditor", () => {
  it("shows the placeholder and runs nothing", async () => {
    const block = newBlock();
    block.setAttributes(withCode("body { color: red; }", "globalThis.__ran = true;"));
    const container = document.createElement("div");
    document.body.appendChild(container);

    await act(async () => {
      block.renderBlockInEditor!(container);
    });

    expect(container.querySelector('[data-testid="custom-code-placeholder"]')).not.toBeNull();
    expect(styles()).toHaveLength(0);
    expect((globalThis as Record<string, unknown>).__ran).toBeUndefined();

    await act(async () => block.unmountBlock(container));
    container.remove();
  });

  it("starts watching for the configuration dialog", async () => {
    // The classic editor renders the block before its dialog can open; that
    // path has to keep working next to the field watcher.
    const block = newBlock();
    block.setAttributes(withCode("", ""));
    const container = document.createElement("div");
    document.body.appendChild(container);

    await act(async () => {
      block.renderBlockInEditor!(container);
    });

    const field = document.createElement("textarea");
    field.id = "root_code";
    await act(async () => {
      document.body.appendChild(field);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(document.body.querySelector('[data-testid="code-editor-modal"]')).not.toBeNull();
    });
    expect(field.style.display).toBe("none");

    await act(async () => {
      (document.body.querySelector('[data-testid="code-tabs-done"]') as HTMLButtonElement).click();
    });
    field.remove();
    await act(async () => block.unmountBlock(container));
    container.remove();
  });
});

describe("unmountBlock", () => {
  it("removes the style and calls the script's cleanup", async () => {
    const cleanup = jest.fn();
    (globalThis as Record<string, unknown>).__cleanup = cleanup;

    const block = newBlock();
    block.setAttributes(withCode("body { color: red; }", "return globalThis.__cleanup;"));
    const container = document.createElement("div");

    block.renderBlock(container);
    await act(async () => block.unmountBlock(container));

    expect(styles()).toHaveLength(0);
    expect(cleanup).toHaveBeenCalledTimes(1);

    delete (globalThis as Record<string, unknown>).__cleanup;
  });

  it("lets the block run again afterwards", async () => {
    const block = newBlock();
    block.setAttributes(withCode("body { color: red; }", ""));
    const container = document.createElement("div");

    block.renderBlock(container);
    await act(async () => block.unmountBlock(container));
    block.renderBlock(container);

    expect(styles()).toHaveLength(1);
  });
});
