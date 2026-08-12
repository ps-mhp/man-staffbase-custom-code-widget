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
 * "When the page is done" — for a page that is never done loading in the
 * classic sense.
 *
 * Staffbase renders client-side: `load` fires while the article is still an
 * empty shell, and the widgets a script wants to reach appear afterwards, at
 * no fixed moment. `DOMContentLoaded` is even earlier and therefore useless
 * here.
 *
 * What can be observed instead is the document coming to rest. This module
 * waits for `load` and then for a stretch in which nothing in the body changes
 * any more — a heuristic, but the one that matches what an author means by
 * "when the page is ready". A cap keeps it from waiting forever on a page with
 * a ticker or an animation that mutates the DOM for ever.
 */

/** How long the document must stay unchanged before it counts as settled. */
export const QUIET_PERIOD_MS = 400;

/** The longest we wait for quiet; after this the script runs regardless. */
export const MAX_WAIT_MS = 5000;

export interface ContentReadyOptions {
  quietPeriodMs?: number;
  maxWaitMs?: number;
}

/**
 * Calls `onReady` once the document has settled, and returns a function that
 * cancels the wait.
 *
 * Callback rather than promise: the caller is a widget that can be removed
 * from the page while waiting, and an unresolvable promise would leave its
 * script scheduled with no way to call it off.
 */
export function whenContentReady(onReady: () => void, options: ContentReadyOptions = {}): () => void {
  const quietPeriodMs = options.quietPeriodMs ?? QUIET_PERIOD_MS;
  const maxWaitMs = options.maxWaitMs ?? MAX_WAIT_MS;

  let cancelled = false;
  let observer: MutationObserver | null = null;
  let quietTimer: ReturnType<typeof setTimeout> | undefined;
  let capTimer: ReturnType<typeof setTimeout> | undefined;

  const cleanUp = (): void => {
    observer?.disconnect();
    observer = null;
    clearTimeout(quietTimer);
    clearTimeout(capTimer);
  };

  const fire = (): void => {
    if (cancelled) return;
    cancelled = true;
    cleanUp();
    onReady();
  };

  const watchForQuiet = (): void => {
    if (cancelled) return;

    const restartQuietTimer = (): void => {
      clearTimeout(quietTimer);
      quietTimer = setTimeout(fire, quietPeriodMs);
    };

    observer = new MutationObserver(restartQuietTimer);
    observer.observe(document.body, { childList: true, subtree: true });
    capTimer = setTimeout(fire, maxWaitMs);
    restartQuietTimer();
  };

  if (document.readyState === "complete") {
    watchForQuiet();
  } else {
    const onLoad = (): void => {
      window.removeEventListener("load", onLoad);
      watchForQuiet();
    };
    window.addEventListener("load", onLoad);
    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      cleanUp();
    };
  }

  return () => {
    cancelled = true;
    cleanUp();
  };
}
