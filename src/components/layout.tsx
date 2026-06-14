import { useEffect, useState } from "react";

/** Thin accent bar at the top of the viewport that fills with scroll position. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const options: AddEventListenerOptions = { passive: true };
    const onScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, options);
    window.addEventListener("resize", onScroll, options);
    return () => {
      window.removeEventListener("scroll", onScroll, options);
      window.removeEventListener("resize", onScroll, options);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 z-30 h-0.5 bg-accent"
      style={{ width: `${progress}%` }}
    />
  );
}

function scrollToTop() {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
}

/** Floating button that appears after scrolling and returns to the top. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const options: AddEventListenerOptions = { passive: true };
    const onScroll = () => {
      const show = window.scrollY > 600;
      // Only update on a state change to avoid needless re-renders per tick.
      setVisible((prev) => (prev === show ? prev : show));
    };
    onScroll(); // set initial state
    window.addEventListener("scroll", onScroll, options);
    return () => window.removeEventListener("scroll", onScroll, options);
  }, []);

  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className="fixed bottom-6 right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-lg shadow-lg transition hover:-translate-y-0.5 hover:border-accent"
    >
      ↑
    </button>
  );
}

/** Accessibility: lets keyboard/screen-reader users jump past the nav to main. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-20 focus:rounded-lg focus:border focus:border-accent focus:bg-surface focus:px-4 focus:py-2 focus:text-accent"
    >
      Skip to content
    </a>
  );
}
