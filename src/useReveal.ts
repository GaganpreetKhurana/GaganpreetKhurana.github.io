import { useEffect, useRef, useState } from "react";

/** True when the user prefers reduced motion or IntersectionObserver is absent. */
function shouldRevealImmediately(): boolean {
  if (!("IntersectionObserver" in window)) return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Reveal-on-scroll: returns a ref + a `shown` flag that flips true once the
 * element first enters the viewport. Plays only once. Users who prefer reduced
 * motion (or browsers without IntersectionObserver) start shown, so no content
 * is ever gated behind an animation. Sections already on screen at mount reveal
 * via the observer's initial callback.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  // Lazy init avoids calling setState synchronously inside the effect.
  const [shown, setShown] = useState<boolean>(shouldRevealImmediately);

  useEffect(() => {
    if (shown) return; // reduced-motion / no-IO path: nothing to observe
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shown]);

  return { ref, shown };
}
