import { beforeEach, describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useActiveSection } from "../useActiveSection";
import {
  mockIntersectionObserver,
  removeIntersectionObserver,
} from "../../test/helpers";

function addSections(ids: string[]) {
  ids.forEach((id) => {
    const el = document.createElement("section");
    el.id = id;
    document.body.appendChild(el);
  });
}

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("useActiveSection", () => {
  it("defaults to the first id", () => {
    mockIntersectionObserver();
    addSections(["a", "b"]);
    const { result } = renderHook(() => useActiveSection(["a", "b"]));
    expect(result.current).toBe("a");
  });

  it("falls back to empty string when given no ids", () => {
    mockIntersectionObserver();
    const { result } = renderHook(() => useActiveSection([]));
    expect(result.current).toBe("");
  });

  it("returns early (no observer) when IntersectionObserver is absent", () => {
    const restore = removeIntersectionObserver();
    try {
      addSections(["a", "b"]);
      const { result } = renderHook(() => useActiveSection(["a", "b"]));
      expect(result.current).toBe("a"); // unchanged default
    } finally {
      restore();
    }
  });

  it("activates the topmost intersecting section", () => {
    const ios = mockIntersectionObserver();
    addSections(["a", "b", "c"]);
    const { result } = renderHook(() => useActiveSection(["a", "b", "c"]));

    act(() =>
      ios[0].emit([
        {
          isIntersecting: true,
          target: document.getElementById("c")!,
          boundingClientRect: { top: 300 } as DOMRectReadOnly,
        },
        {
          isIntersecting: true,
          target: document.getElementById("b")!,
          boundingClientRect: { top: 100 } as DOMRectReadOnly,
        },
      ]),
    );
    expect(result.current).toBe("b"); // top:100 wins over top:300
  });

  it("does not change when no entries are intersecting", () => {
    const ios = mockIntersectionObserver();
    addSections(["a", "b"]);
    const { result } = renderHook(() => useActiveSection(["a", "b"]));

    act(() =>
      ios[0].emit([
        {
          isIntersecting: false,
          target: document.getElementById("b")!,
          boundingClientRect: { top: 10 } as DOMRectReadOnly,
        },
      ]),
    );
    expect(result.current).toBe("a");
  });

  it("observes only ids that exist in the DOM", () => {
    const ios = mockIntersectionObserver();
    addSections(["a"]); // "missing" has no element
    renderHook(() => useActiveSection(["a", "missing"]));
    // Only the one existing element should be observed.
    expect(ios[0].observe).toHaveBeenCalledTimes(1);
  });

  it("disconnects on unmount", () => {
    const ios = mockIntersectionObserver();
    addSections(["a"]);
    const { unmount } = renderHook(() => useActiveSection(["a"]));
    unmount();
    expect(ios[0].disconnect).toHaveBeenCalledTimes(1);
  });
});
