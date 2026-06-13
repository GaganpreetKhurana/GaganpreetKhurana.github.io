import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view and returns its id, so the nav can
 * highlight the active link. Falls back to the first id until one intersects.
 *
 * @param ids - section element ids, in document order
 */
export function useActiveSection(ids: readonly string[]): string {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest the top of the viewport that is intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      // A band near the top of the viewport so the "current" section is the
      // one the reader is actually looking at.
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
