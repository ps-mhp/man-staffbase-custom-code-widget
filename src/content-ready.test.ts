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

import { whenContentReady } from "./content-ready";

/** Lets pending MutationObserver callbacks run before the timers do. */
const flushMutations = async (): Promise<void> => {
  await Promise.resolve();
};

describe("whenContentReady", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("fires once the document has been quiet long enough", () => {
    const onReady = jest.fn();
    whenContentReady(onReady, { quietPeriodMs: 100, maxWaitMs: 1000 });

    expect(onReady).not.toHaveBeenCalled();
    jest.advanceTimersByTime(100);
    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it("keeps waiting while the page is still building itself", async () => {
    const onReady = jest.fn();
    whenContentReady(onReady, { quietPeriodMs: 100, maxWaitMs: 10000 });

    for (let i = 0; i < 5; i += 1) {
      jest.advanceTimersByTime(60);
      document.body.appendChild(document.createElement("div"));
      await flushMutations();
    }
    expect(onReady).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it("gives up waiting for quiet rather than never running", async () => {
    const onReady = jest.fn();
    whenContentReady(onReady, { quietPeriodMs: 100, maxWaitMs: 500 });

    for (let i = 0; i < 20; i += 1) {
      jest.advanceTimersByTime(50);
      document.body.appendChild(document.createElement("div"));
      await flushMutations();
    }

    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it("fires only once", async () => {
    const onReady = jest.fn();
    whenContentReady(onReady, { quietPeriodMs: 100, maxWaitMs: 200 });

    jest.advanceTimersByTime(1000);
    document.body.appendChild(document.createElement("div"));
    await flushMutations();
    jest.advanceTimersByTime(1000);

    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it("can be called off before it fires", () => {
    const onReady = jest.fn();
    const cancel = whenContentReady(onReady, { quietPeriodMs: 100, maxWaitMs: 1000 });

    cancel();
    jest.advanceTimersByTime(5000);

    expect(onReady).not.toHaveBeenCalled();
  });
});
