import { vi } from "vitest";

/** Captured matchMedia listeners, keyed by the media query string. */
type MediaState = {
  matches: boolean;
  listeners: Set<(e: MediaQueryListEvent) => void>;
};

const mediaStates = new Map<string, MediaState>();

/**
 * Installs a configurable `window.matchMedia` mock. `matchers` maps a media
 * query string to whether it currently matches. Returns a helper to emit a
 * `change` event for a query (simulating an OS preference flip).
 */
export function mockMatchMedia(matchers: Record<string, boolean>) {
  mediaStates.clear();

  window.matchMedia = vi.fn((query: string) => {
    const state: MediaState = mediaStates.get(query) ?? {
      matches: matchers[query] ?? false,
      listeners: new Set(),
    };
    mediaStates.set(query, state);
    return {
      get matches() {
        return state.matches;
      },
      media: query,
      onchange: null,
      addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) =>
        state.listeners.add(cb),
      removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) =>
        state.listeners.delete(cb),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;
  }) as unknown as typeof window.matchMedia;

  /** Flip a query's match state and notify its listeners. */
  return function emitChange(query: string, matches: boolean) {
    const state = mediaStates.get(query);
    if (!state) return;
    state.matches = matches;
    state.listeners.forEach((cb) => cb({ matches } as MediaQueryListEvent));
  };
}

/** Most-recently-created IntersectionObserver mock instance. */
export type MockIO = {
  callback: IntersectionObserverCallback;
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  options?: IntersectionObserverInit;
  /** Drive the observer with synthetic entries. */
  emit: (entries: Partial<IntersectionObserverEntry>[]) => void;
};

let instances: MockIO[] = [];

/** Installs a fake IntersectionObserver and returns the list of instances. */
export function mockIntersectionObserver(): MockIO[] {
  instances = [];
  class FakeIO {
    callback: IntersectionObserverCallback;
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
    takeRecords = vi.fn(() => []);
    options?: IntersectionObserverInit;
    constructor(
      cb: IntersectionObserverCallback,
      options?: IntersectionObserverInit,
    ) {
      this.callback = cb;
      this.options = options;
      instances.push({
        callback: cb,
        observe: this.observe,
        disconnect: this.disconnect,
        options,
        emit: (entries) =>
          cb(
            entries as IntersectionObserverEntry[],
            this as unknown as IntersectionObserver,
          ),
      });
    }
  }
  vi.stubGlobal("IntersectionObserver", FakeIO);
  return instances;
}

/**
 * Removes IntersectionObserver so the "absent" branch (`"IntersectionObserver"
 * in window` === false) runs. Deleting the property — not stubbing it to
 * undefined — is required, since the code uses an `in` check. Returns a restore
 * function; afterEach also restores via vi.unstubAllGlobals for stubbed cases.
 */
export function removeIntersectionObserver() {
  const original = (
    globalThis as { IntersectionObserver?: typeof IntersectionObserver }
  ).IntersectionObserver;
  delete (globalThis as { IntersectionObserver?: unknown })
    .IntersectionObserver;
  return function restore() {
    if (original !== undefined) {
      (
        globalThis as { IntersectionObserver?: typeof IntersectionObserver }
      ).IntersectionObserver = original;
    }
  };
}
