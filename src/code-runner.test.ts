import { runCustomCode, RunnerContext, STYLE_MARKER, LOG_PREFIX } from "./code-runner";

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
    const handle = runCustomCode({ css: "body { color: red; }", js: "" }, ctx(), "one");

    expect(styles()).toHaveLength(1);
    expect(styles()[0].textContent).toBe("body { color: red; }");
    expect(styles()[0].getAttribute(STYLE_MARKER)).toBe("one");

    handle.stop();
    expect(styles()).toHaveLength(0);
  });

  it("adds no style element for empty CSS", () => {
    runCustomCode({ css: "   ", js: "" }, ctx(), "one");

    expect(styles()).toHaveLength(0);
  });

  it("runs the JavaScript and hands it the context", () => {
    const context = ctx();

    runCustomCode({ css: "", js: "globalThis.__seen = ctx.widgetApi;" }, context, "one");

    expect((globalThis as Record<string, unknown>).__seen).toBe(context.widgetApi);
    delete (globalThis as Record<string, unknown>).__seen;
  });

  it("calls a returned cleanup function on stop", () => {
    const cleanup = jest.fn();
    (globalThis as Record<string, unknown>).__cleanup = cleanup;

    const handle = runCustomCode({ css: "", js: "return globalThis.__cleanup;" }, ctx(), "one");
    expect(cleanup).not.toHaveBeenCalled();

    handle.stop();
    expect(cleanup).toHaveBeenCalledTimes(1);

    delete (globalThis as Record<string, unknown>).__cleanup;
  });

  it("stops only once, however often stop is called", () => {
    const cleanup = jest.fn();
    (globalThis as Record<string, unknown>).__cleanup = cleanup;

    const handle = runCustomCode({ css: "body {}", js: "return globalThis.__cleanup;" }, ctx(), "one");
    handle.stop();
    handle.stop();

    expect(cleanup).toHaveBeenCalledTimes(1);
    delete (globalThis as Record<string, unknown>).__cleanup;
  });

  it("logs a syntax error instead of throwing, and still applies the CSS", () => {
    expect(() => runCustomCode({ css: "body { color: red; }", js: "function (" }, ctx(), "one")).not.toThrow();

    expect(styles()).toHaveLength(1);
    expect(errorSpy.mock.calls[0][0]).toContain(LOG_PREFIX);
  });

  it("logs a runtime error instead of throwing", () => {
    expect(() => runCustomCode({ css: "", js: "throw new Error('boom');" }, ctx(), "one")).not.toThrow();

    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it("logs a failing cleanup instead of throwing on stop", () => {
    const handle = runCustomCode({ css: "", js: "return () => { throw new Error('boom'); };" }, ctx(), "one");

    expect(() => handle.stop()).not.toThrow();
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it("keeps two instances on one page apart", () => {
    const first = runCustomCode({ css: "body { color: red; }", js: "" }, ctx(), "one");
    runCustomCode({ css: "body { color: blue; }", js: "" }, ctx(), "two");

    expect(styles()).toHaveLength(2);

    first.stop();

    expect(styles()).toHaveLength(1);
    expect(styles()[0].getAttribute(STYLE_MARKER)).toBe("two");
  });
});
