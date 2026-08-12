import { runCustomCode, RunnerContext, STYLE_MARKER, LOG_PREFIX } from "./code-runner";
import { CustomCode, EMPTY_CODE } from "./custom-code";

/** Spares every case the members it does not care about. */
const code = (partial: Partial<CustomCode>): CustomCode => ({ ...EMPTY_CODE, ...partial });

const ctx = (): RunnerContext => ({ container: document.createElement("div"), widgetApi: { marker: 1 } });

const styles = (): HTMLStyleElement[] => Array.from(document.head.querySelectorAll(`style[${STYLE_MARKER}]`));

describe("runCustomCode", () => {
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    document.head.innerHTML = "";
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it("puts the CSS into the document head and takes it back on stop", () => {
    const handle = runCustomCode(code({ css: "body { color: red; }", js: "" }), ctx(), "one");

    expect(styles()).toHaveLength(1);
    expect(styles()[0].textContent).toBe("body { color: red; }");
    expect(styles()[0].getAttribute(STYLE_MARKER)).toBe("one");

    handle.stop();
    expect(styles()).toHaveLength(0);
  });

  it("adds no style element for empty CSS", () => {
    runCustomCode(code({ css: "   ", js: "" }), ctx(), "one");

    expect(styles()).toHaveLength(0);
  });

  it("runs the JavaScript and hands it the context", () => {
    const context = ctx();

    runCustomCode(code({ css: "", js: "globalThis.__seen = ctx.widgetApi;" }), context, "one");

    expect((globalThis as Record<string, unknown>).__seen).toBe(context.widgetApi);
    delete (globalThis as Record<string, unknown>).__seen;
  });

  it("calls a returned cleanup function on stop", () => {
    const cleanup = jest.fn();
    (globalThis as Record<string, unknown>).__cleanup = cleanup;

    const handle = runCustomCode(code({ css: "", js: "return globalThis.__cleanup;" }), ctx(), "one");
    expect(cleanup).not.toHaveBeenCalled();

    handle.stop();
    expect(cleanup).toHaveBeenCalledTimes(1);

    delete (globalThis as Record<string, unknown>).__cleanup;
  });

  it("stops only once, however often stop is called", () => {
    const cleanup = jest.fn();
    (globalThis as Record<string, unknown>).__cleanup = cleanup;

    const handle = runCustomCode(code({ css: "body {}", js: "return globalThis.__cleanup;" }), ctx(), "one");
    handle.stop();
    handle.stop();

    expect(cleanup).toHaveBeenCalledTimes(1);
    delete (globalThis as Record<string, unknown>).__cleanup;
  });

  it("logs a syntax error instead of throwing, and still applies the CSS", () => {
    expect(() => runCustomCode(code({ css: "body { color: red; }", js: "function (" }), ctx(), "one")).not.toThrow();

    expect(styles()).toHaveLength(1);
    expect(errorSpy.mock.calls[0][0]).toContain(LOG_PREFIX);
  });

  it("logs a runtime error instead of throwing", () => {
    expect(() => runCustomCode(code({ css: "", js: "throw new Error('boom');" }), ctx(), "one")).not.toThrow();

    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it("logs a failing cleanup instead of throwing on stop", () => {
    const handle = runCustomCode(code({ css: "", js: "return () => { throw new Error('boom'); };" }), ctx(), "one");

    expect(() => handle.stop()).not.toThrow();
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it("keeps two instances on one page apart", () => {
    const first = runCustomCode(code({ css: "body { color: red; }", js: "" }), ctx(), "one");
    runCustomCode(code({ css: "body { color: blue; }", js: "" }), ctx(), "two");

    expect(styles()).toHaveLength(2);

    first.stop();

    expect(styles()).toHaveLength(1);
    expect(styles()[0].getAttribute(STYLE_MARKER)).toBe("two");
  });
});

describe("runCustomCode with timing: ready", () => {
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    document.head.innerHTML = "";
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    delete (globalThis as Record<string, unknown>).__ran;
  });

  afterEach(() => {
    jest.useRealTimers();
    errorSpy.mockRestore();
  });

  it("applies the CSS at once but holds the script back", () => {
    runCustomCode(
      code({ css: "body { color: red; }", js: "globalThis.__ran = true;", timing: "ready" }),
      ctx(),
      "one",
    );

    expect(styles()).toHaveLength(1);
    expect((globalThis as Record<string, unknown>).__ran).toBeUndefined();

    jest.advanceTimersByTime(5000);

    expect((globalThis as Record<string, unknown>).__ran).toBe(true);
  });

  it("calls the waiting script off when the widget goes away first", () => {
    const handle = runCustomCode(
      code({ css: "", js: "globalThis.__ran = true;", timing: "ready" }),
      ctx(),
      "one",
    );

    handle.stop();
    jest.advanceTimersByTime(5000);

    expect((globalThis as Record<string, unknown>).__ran).toBeUndefined();
  });

  it("still runs the cleanup of a script that already started", () => {
    (globalThis as Record<string, unknown>).__cleanup = jest.fn();
    const handle = runCustomCode(
      code({ css: "", js: "return globalThis.__cleanup;", timing: "ready" }),
      ctx(),
      "one",
    );

    jest.advanceTimersByTime(5000);
    handle.stop();

    expect((globalThis as Record<string, unknown>).__cleanup).toHaveBeenCalledTimes(1);
    delete (globalThis as Record<string, unknown>).__cleanup;
  });
});
