import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useTypewriter } from "../useTypewriter";
import { mockMatchMedia } from "../../test/helpers";

const REDUCED = "(prefers-reduced-motion: reduce)";

describe("useTypewriter static paths", () => {
  beforeEach(() => mockMatchMedia({ [REDUCED]: false }));

  it("returns the only phrase when given a single phrase", () => {
    const { result } = renderHook(() => useTypewriter(["Hello"]));
    expect(result.current).toBe("Hello");
  });

  it("returns the first phrase under reduced motion", () => {
    mockMatchMedia({ [REDUCED]: true });
    const { result } = renderHook(() => useTypewriter(["One", "Two", "Three"]));
    expect(result.current).toBe("One");
  });

  it("handles an empty phrase list without throwing", () => {
    const { result } = renderHook(() => useTypewriter([]));
    expect(result.current).toBe("");
  });
});

describe("useTypewriter animation cycle", () => {
  // Real timers + waitFor: assert observable outcomes, not exact per-tick text
  // (which is brittle under React state batching).
  beforeEach(() => mockMatchMedia({ [REDUCED]: false }));

  it("starts on the full first phrase", () => {
    const { result } = renderHook(() => useTypewriter(["ab", "cd"], 5, 5, 10));
    expect(result.current).toBe("ab");
  });

  it("deletes the first phrase down to empty", async () => {
    const { result } = renderHook(() => useTypewriter(["ab", "cd"], 5, 5, 10));
    await waitFor(() => expect(result.current).toBe(""));
  });

  it("eventually types the next phrase in full", async () => {
    const { result } = renderHook(() => useTypewriter(["ab", "cd"], 5, 5, 10));
    await waitFor(() => expect(result.current).toBe("cd"));
  });

  it("cleans up its timer on unmount", () => {
    const cleared = vi.spyOn(globalThis, "clearTimeout");
    const { unmount } = renderHook(() => useTypewriter(["ab", "cd"], 5, 5, 10));
    unmount();
    expect(cleared).toHaveBeenCalled();
  });
});
