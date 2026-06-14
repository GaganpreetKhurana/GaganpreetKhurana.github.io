import { useReveal } from "../hooks/useReveal";

/** A page section with a heading that fades + rises into view on scroll. */
export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  const { ref, shown } = useReveal<HTMLElement>();
  return (
    <section
      id={id}
      ref={ref}
      className={`scroll-mt-16 pt-11 transition-all duration-700 ease-out ${
        shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <h2 className="relative mb-6 pl-3.5 text-2xl font-semibold before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:rounded before:bg-accent">
        {title}
      </h2>
      {children}
    </section>
  );
}

/**
 * Wraps a grid/list item so it fades + rises into view on scroll, staggered by
 * `index` for a cascade effect. Reveal logic (and reduced-motion fallback) is
 * delegated to useReveal, so items are never hidden for reduced-motion users.
 */
export function RevealItem({
  index,
  className = "",
  children,
}: {
  index: number;
  className?: string;
  children: React.ReactNode;
}) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${className} ${
        shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
      style={{ transitionDelay: shown ? `${index * 60}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
