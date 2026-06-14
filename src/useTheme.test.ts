import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useTheme } from "./useTheme";
import { mockMatchMedia } from "./test/helpers";

const LIGHT_QUERY = "(prefers-color-scheme: light)";

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

afterEach(() => {
  localStorage.clear();
});

describe("useTheme initial theme", () => {
  it("uses a stored 'light' choice over the OS preference", () => {
    localStorage.setItem("theme", "light");
    mockMatchMedia({ [LIGHT_QUERY]: false }); // OS says dark
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("uses a stored 'dark' choice over the OS preference", () => {
    localStorage.setItem("theme", "dark");
    mockMatchMedia({ [LIGHT_QUERY]: true }); // OS says light
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
  });

  it("ignores an invalid stored value and falls back to OS (light)", () => {
    localStorage.setItem("theme", "banana");
    mockMatchMedia({ [LIGHT_QUERY]: true });
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");
  });

  it("follows OS dark preference when nothing is stored", () => {
    mockMatchMedia({ [LIGHT_QUERY]: false });
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});

describe("useTheme toggle", () => {
  it("flips dark -> light and persists the choice", () => {
    mockMatchMedia({ [LIGHT_QUERY]: false }); // start dark
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");

    act(() => result.current.toggle());

    expect(result.current.theme).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("flips light -> dark and persists the choice", () => {
    localStorage.setItem("theme", "light");
    mockMatchMedia({ [LIGHT_QUERY]: true });
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggle());

    expect(result.current.theme).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });
});

describe("useTheme live OS changes", () => {
  it("follows OS change when the user has NOT chosen explicitly", () => {
    const emit = mockMatchMedia({ [LIGHT_QUERY]: false }); // start dark, no stored
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");

    act(() => emit(LIGHT_QUERY, true)); // OS flips to light
    expect(result.current.theme).toBe("light");

    act(() => emit(LIGHT_QUERY, false)); // OS flips back to dark
    expect(result.current.theme).toBe("dark");
  });

  it("ignores OS changes once the user has chosen explicitly", () => {
    localStorage.setItem("theme", "dark");
    const emit = mockMatchMedia({ [LIGHT_QUERY]: false });
    const { result } = renderHook(() => useTheme());

    act(() => emit(LIGHT_QUERY, true)); // OS says light, but user chose dark
    expect(result.current.theme).toBe("dark");
  });

  it("removes its listener on unmount", () => {
    const emit = mockMatchMedia({ [LIGHT_QUERY]: false });
    const { result, unmount } = renderHook(() => useTheme());
    unmount();
    // After unmount, an OS change must not throw or affect anything.
    act(() => emit(LIGHT_QUERY, true));
    expect(result.current.theme).toBe("dark");
  });
});
