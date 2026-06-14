import { useEffect, useState } from "react";

/** True when the user has asked the OS to reduce motion. */
function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Cycles through `phrases` with a type-and-delete effect. Returns the text to
 * render. Under reduced motion (or with a single phrase) it simply returns the
 * first phrase, so the effect never animates for users who opt out.
 *
 * @param phrases    ordered list of strings to cycle through
 * @param typeMs     delay between typed characters
 * @param deleteMs   delay between deleted characters
 * @param holdMs     pause once a phrase is fully typed
 */
export function useTypewriter(
  phrases: readonly string[],
  typeMs = 70,
  deleteMs = 35,
  holdMs = 1400,
): string {
  const [text, setText] = useState(phrases[0] ?? "");
  // Depend on the phrases' *content* (JSON key), not the array reference, so
  // passing a fresh array literal with the same content won't restart the
  // animation. JSON (vs a delimiter join) handles phrases containing any char.
  const phrasesKey = JSON.stringify(phrases);

  useEffect(() => {
    // Drop empty strings: an empty phrase would desync the type/delete cycle
    // (char index starts at 0 and the delete branch never resets cleanly).
    const list: string[] = (JSON.parse(phrasesKey) as string[]).filter(Boolean);
    // Static path: the initial useState value already holds phrases[0], so
    // there is nothing to animate and no synchronous setState is needed.
    if (list.length <= 1 || prefersReducedMotion()) {
      return;
    }

    const s = { phrase: 0, char: list[0].length, deleting: true };
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const current = list[s.phrase];
      if (!s.deleting) {
        s.char += 1;
        setText(current.slice(0, s.char));
        if (s.char === current.length) {
          s.deleting = true;
          timer = setTimeout(tick, holdMs);
          return;
        }
        timer = setTimeout(tick, typeMs);
      } else {
        s.char -= 1;
        setText(current.slice(0, s.char));
        if (s.char === 0) {
          s.deleting = false;
          s.phrase = (s.phrase + 1) % list.length;
        }
        timer = setTimeout(tick, s.char === 0 ? typeMs : deleteMs);
      }
    };

    // Start by deleting the initial phrase so the cycle begins cleanly.
    timer = setTimeout(tick, holdMs);
    return () => clearTimeout(timer);
  }, [phrasesKey, typeMs, deleteMs, holdMs]);

  return text;
}
