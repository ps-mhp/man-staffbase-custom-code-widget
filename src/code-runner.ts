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
 * Running the author's CSS and JavaScript, and taking it back.
 *
 * Deliberately free of React and of the widget SDK: what happens to the
 * document is the risky part of this widget, so it is kept where a test can
 * drive it directly.
 *
 * The code reaches the whole page, not just the widget's container. That is
 * the point of the widget — the usual reason to reach for it is an element
 * that belongs to Staffbase, not to us. The limit on who may do this is the
 * permission to edit the page, not anything enforced here.
 */

import { CustomCode } from "./custom-code";
import { whenContentReady } from "./content-ready";

/** Prefix of every message this widget logs, so a page's console stays readable. */
export const LOG_PREFIX = "[custom-code-widget]";

/** Marks the style element belonging to one widget instance. */
export const STYLE_MARKER = "data-custom-code";

/** What the author's script is handed. */
export interface RunnerContext {
  /** The widget's own element content, in case the script wants an anchor. */
  container: HTMLElement;
  /** The SDK's widget API, passed through unchanged. */
  widgetApi: unknown;
}

export interface RunHandle {
  /** Removes the style element and runs the script's own cleanup. */
  stop: () => void;
}

const report = (what: string, error: unknown): void => {
  // Swallowed on purpose: a typo in an author's snippet must not take the page
  // with it. The console is where the author looks; the page is where everyone
  // else is.
  console.error(`${LOG_PREFIX} ${what}`, error);
};

function applyCss(css: string, instanceId: string): () => void {
  if (css.trim() === "") return () => {};

  const style = document.createElement("style");
  style.setAttribute(STYLE_MARKER, instanceId);
  style.textContent = css;
  document.head.appendChild(style);

  return () => style.remove();
}

function runJs(js: string, ctx: RunnerContext): () => void {
  if (js.trim() === "") return () => {};

  let run: (ctx: RunnerContext) => unknown;
  try {
    // A function body, not a `<script>` tag: it gives the author a `return`
    // for their cleanup, and that return is the only way a script can be
    // taken back when the widget goes away — in a single-page app, leaving
    // the page does not reload it.
    run = new Function("ctx", js) as (ctx: RunnerContext) => unknown;
  } catch (error) {
    report("Das JavaScript hat einen Syntaxfehler und wurde nicht ausgeführt:", error);
    return () => {};
  }

  let cleanup: unknown;
  try {
    cleanup = run(ctx);
  } catch (error) {
    report("Das JavaScript ist beim Ausführen gescheitert:", error);
    return () => {};
  }

  if (typeof cleanup !== "function") return () => {};

  return () => {
    try {
      (cleanup as () => void)();
    } catch (error) {
      report("Das Aufräumen des JavaScript ist gescheitert:", error);
    }
  };
}

/**
 * Applies `code` to the page.
 *
 * The style element goes up at once whatever the timing says: CSS is
 * declarative, so applying it early can only prevent a flash of unstyled
 * content, never cause one. The timing governs the script, which is the part
 * that needs the page's elements to exist.
 *
 * @param instanceId distinguishes the style elements of several widgets on one
 * page, so stopping one leaves the others alone.
 * @returns a handle whose `stop` undoes what can be undone: the style element
 * always, the script's effects as far as it returned a cleanup function. A
 * script still waiting for the page is called off rather than run. Calling
 * `stop` more than once is harmless.
 */
export function runCustomCode(code: CustomCode, ctx: RunnerContext, instanceId: string): RunHandle {
  const removeCss = applyCss(code.css, instanceId);

  let stopJs: (() => void) | null = null;
  let cancelWait: (() => void) | null = null;

  if (code.timing === "ready" && code.js.trim() !== "") {
    cancelWait = whenContentReady(() => {
      cancelWait = null;
      stopJs = runJs(code.js, ctx);
    });
  } else {
    stopJs = runJs(code.js, ctx);
  }

  let stopped = false;
  return {
    stop: () => {
      if (stopped) return;
      stopped = true;
      removeCss();
      cancelWait?.();
      stopJs?.();
    },
  };
}
