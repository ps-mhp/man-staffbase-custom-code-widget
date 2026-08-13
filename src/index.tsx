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

import { setPublicPathFromBundle } from "@shared/public-path";

// Must run before any dynamic `import()`, so that lazily loaded chunks come
// from the CDN the bundle was served from and not from the hosting page.
setPublicPathFromBundle("custom-code-widget.js");

import { BlockFactory, BlockDefinition, ExternalBlockDefinition, BaseBlock } from "widget-sdk";
import { configurationSchema, uiSchema } from "./configuration-schema";
import { CODE_ATTRIBUTE } from "./attributes";
import { CustomCode, encodeCustomCode, parseCustomCode } from "./custom-code";
import { RunHandle, runCustomCode, LOG_PREFIX } from "./code-runner";
import icon from "../resources/custom-code-widget.svg";
import pkg from "../package.json";

/** Attributes handled by the widget; mirrored in the configuration schema. */
const widgetAttributes: string[] = [CODE_ATTRIBUTE];

let instanceCounter = 0;

// React, the placeholder and the whole configuration editor live behind this
// one `import()`, so a reader of a published page downloads none of it. What
// remains in the bundle is the code runner and this file.
//
// A failure here is reported rather than swallowed: the chunk sits next to the
// bundle, so it goes missing whenever the two come from different builds — and
// the symptom is an editor that simply never appears, with nothing in the
// console to connect it to a stale `dist/`.
const editorView = (): Promise<typeof import("./editor-view") | null> =>
  import("./editor-view").catch((error: unknown) => {
    console.error(
      `${LOG_PREFIX} Die Editor-Ansicht konnte nicht geladen werden. ` +
        `Meist liegt neben dem Bundle ein Chunk aus einem anderen Build — dist/ neu bauen.`,
      error,
    );
    return null;
  });

const factory: BlockFactory = (BaseBlockClass, widgetApi) => {
  return class CustomCodeWidgetBlock extends BaseBlockClass implements BaseBlock {
    private _handle: RunHandle | null = null;
    /** What is currently running, so unchanged code is left alone. */
    private _running: string | null = null;
    private readonly _instanceId = `i${(instanceCounter += 1)}`;

    private readCode(): CustomCode {
      const attrs = this.parseAttributes<Record<string, unknown>>();
      return parseCustomCode(attrs[CODE_ATTRIBUTE]);
    }

    /**
     * Runs the code on the published page and in the preview.
     *
     * The host renders both through `renderBlock` and the editing view through
     * `renderBlockInEditor`, so no check for the mode is needed here — being
     * called at all is the mode.
     *
     * The container is taken out of the layout: this widget shows nothing, it
     * only carries code.
     */
    public renderBlock(container: HTMLElement): void {
      container.style.display = "none";

      const code = this.readCode();
      // Re-rendering with unchanged code must not run the script a second
      // time: a script that registers a listener would then register two.
      const fingerprint = encodeCustomCode(code);
      if (this._handle && this._running === fingerprint) return;

      this._handle?.stop();
      this._handle = runCustomCode(code, { container, widgetApi }, this._instanceId);
      this._running = fingerprint;
    }

    /**
     * Shows what is stored, and runs none of it. See `editor-placeholder.tsx`
     * for why.
     */
    public renderBlockInEditor(container: HTMLElement): void {
      container.style.display = "";
      const code = this.readCode();
      void editorView().then((view) => {
        if (!view) return;
        view.ensureInjector();
        view.renderPlaceholder(container, code);
      });
    }

    public unmountBlock(container: HTMLElement): void {
      this._handle?.stop();
      this._handle = null;
      this._running = null;
      void editorView().then((view) => view?.unmountPlaceholder(container));
    }

    public static get observedAttributes(): string[] {
      return widgetAttributes;
    }

    public attributeChangedCallback(...args: [string, string | undefined, string | undefined]): void {
      super.attributeChangedCallback.apply(this, args);
    }
  };
};

const blockDefinition: BlockDefinition = {
  name: "custom-code-widget",
  factory: factory,
  attributes: widgetAttributes,
  blockLevel: "block",
  configurationSchema: configurationSchema,
  uiSchema: uiSchema,
  label: "Eigener Code",
  iconUrl: icon,
};

const externalBlockDefinition: ExternalBlockDefinition = {
  blockDefinition,
  author: pkg.author,
  version: pkg.version,
};

// The guard lets the module load in Jest/jsdom where defineBlock is absent,
// while keeping the call unconditional in the real Staffbase host, where it is
// always present — in the editor and on a published page alike.
if (typeof window.defineBlock === "function") {
  window.defineBlock(externalBlockDefinition);
}
