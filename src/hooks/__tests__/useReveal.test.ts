import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { act, render, renderHook } from "@testing-library/react";
import { useReveal } from "../useReveal";
import {
  mockIntersectionObserver,
  mockMatchMedia,
  removeIntersectionObserver,
} from "../../test/helpers";

const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Render a component that wires the hook's ref to a real <section> during
 * render, so the effect sees a mounted element on its first run (matching how
 * the hook is used in App). Exposes the latest `shown` value via a callback.
 */
function renderRevealWithElement() {
  let latestShown = false;
  function Probe() {
    const { ref, shown } = useReveal<HTMLElement>();
    latestShown = shown;
    return createElement("section", { ref, "data-testid": "sec" });
  }
  const utils = render(createElement(Probe));
  const el = utils.getByTestId("sec");
  return { el, getShown: () => latestShown, ...utils };
}

describe("useReveal immediate-reveal paths", () => {
  it("reveals immediately when the user prefers reduced motion", () => {
    mockMatchMedia({ [REDUCED]: true });
    mockIntersectionObserver();
    const { result } = renderHook(() => useReveal<HTMLElement>());
    expect(result.current.shown).toBe(true);
  });

  it("reveals immediately when IntersectionObserver is unavailable", () => {
    mockMatchMedia({ [REDUCED]: false });
    const restore = removeIntersectionObserver();
    try {
      const { result } = renderHook(() => useReveal<HTMLElement>());
      expect(result.current.shown).toBe(true);
    } finally {
      restore();
    }
  });
});

describe("useReveal scroll-triggered reveal", () => {
  it("starts hidden, then reveals when the element intersects", () => {
    mockMatchMedia({ [REDUCED]: false });
    const ios = mockIntersectionObserver();
    const { el, getShown } = renderRevealWithElement();

    expect(getShown()).toBe(false);
    expect(ios[ios.length - 1].observe).toHaveBeenCalledWith(el);

    act(() => ios[ios.length - 1].emit([{ isIntersecting: true }]));
    expect(getShown()).toBe(true);
  });

  it("stays hidden while the element is not intersecting", () => {
    mockMatchMedia({ [REDUCED]: false });
    const ios = mockIntersectionObserver();
    const { getShown } = renderRevealWithElement();

    act(() => ios[ios.length - 1].emit([{ isIntersecting: false }]));
    expect(getShown()).toBe(false);
  });

  it("does nothing when the ref is never attached (no element)", () => {
    mockMatchMedia({ [REDUCED]: false });
    const ios = mockIntersectionObserver();
    // renderHook never attaches ref.current -> effect returns before creating
    // an observer, so none should exist.
    const { result } = renderHook(() => useReveal<HTMLElement>());
    expect(result.current.shown).toBe(false);
    expect(ios).toHaveLength(0);
  });

  it("disconnects the observer on unmount", () => {
    mockMatchMedia({ [REDUCED]: false });
    const ios = mockIntersectionObserver();
    const { unmount } = renderRevealWithElement();
    const io = ios[ios.length - 1];
    unmount();
    expect(io.disconnect).toHaveBeenCalledTimes(1);
  });
});
