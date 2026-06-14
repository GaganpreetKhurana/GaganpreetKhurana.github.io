import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom in this environment does not provide localStorage; add a minimal
// in-memory implementation so storage-backed code can run under test.
if (typeof globalThis.localStorage === "undefined") {
  let store: Record<string, string> = {};
  const localStorageMock: Storage = {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index) => Object.keys(store)[index] ?? null,
    get length() {
      return Object.keys(store).length;
    },
  };
  Object.defineProperty(globalThis, "localStorage", {
    value: localStorageMock,
    writable: true,
  });
}

// Unmount React trees, reset the DOM, and restore any stubbed globals
// (e.g. IntersectionObserver) between tests so stubs never leak across files.
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
});
