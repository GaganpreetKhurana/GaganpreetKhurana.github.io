import { profile, roles } from "../data";
import { useTypewriter } from "../hooks/useTypewriter";
import { useTheme } from "../hooks/useTheme";
import { useActiveSection } from "../hooks/useActiveSection";

// Section anchors, in document order — drives the nav and active-link state.
export const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "cp", label: "CP" },
  { id: "certifications", label: "Certs" },
  { id: "contact", label: "Contact" },
];

const navIds = navItems.map((n) => n.id);

const socials = [
  { label: "GitHub", href: profile.links.github },
  { label: "LinkedIn", href: profile.links.linkedin },
  { label: "CodeChef", href: profile.links.codechef },
  { label: "LeetCode", href: profile.links.leetcode },
];

/**
 * Fixed-height left rail (Brittany-Chiang style): intro, in-page section nav
 * with an active-link indicator, social links + résumé, and a theme toggle.
 * It sticks beside the scrolling content on large screens and collapses to a
 * normal stacked header on smaller ones.
 */
export function Sidebar() {
  const typedRole = useTypewriter(roles);
  const { theme, toggle } = useTheme();
  const activeId = useActiveSection(navIds);

  return (
    <header className="py-12 lg:sticky lg:top-0 lg:flex lg:h-screen lg:max-h-screen lg:w-[42%] lg:flex-col lg:justify-between lg:overflow-y-auto lg:py-24">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          {profile.tagline}
        </p>
        <h1 className="name-gradient mt-2 mb-3 text-4xl font-bold leading-tight sm:text-5xl">
          {profile.name}
        </h1>
        <p className="mt-2 font-mono text-base text-accent" aria-live="polite">
          <span className="text-muted">&gt;</span> {typedRole}
          <span className="ml-0.5 inline-block w-2 animate-pulse text-accent">
            ▎
          </span>
        </p>
        <p className="mt-4 max-w-sm text-base leading-relaxed text-muted">
          {profile.blurb}
        </p>
        <p className="mt-3 text-sm text-muted">📍 {profile.location}</p>

        {/* In-page navigation with an active-section indicator. */}
        <nav aria-label="Section navigation" className="mt-10">
          <ul className="flex flex-row flex-wrap gap-x-4 gap-y-1 lg:flex-col lg:gap-y-3">
            {navItems.map((n) => {
              const active = activeId === n.id;
              return (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    aria-current={active ? "page" : undefined}
                    className={`group inline-flex min-h-9 items-center gap-3 text-sm font-medium uppercase tracking-widest transition ${
                      active ? "text-content" : "text-muted hover:text-content"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-px bg-current transition-all ${
                        active
                          ? "w-12 text-accent"
                          : "w-6 group-hover:w-10 group-hover:text-content"
                      }`}
                    />
                    {n.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="mt-10 lg:mt-0">
        <nav
          aria-label="Profile and social links"
          className="flex flex-wrap items-center gap-2.5"
        >
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:border-accent"
            >
              {s.label}
            </a>
          ))}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-accent px-4 py-2 text-sm font-medium text-accent transition hover:-translate-y-0.5 hover:bg-accent/10"
          >
            📄 Resume
          </a>
          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="rounded-full border border-line bg-surface px-3 py-2 text-sm transition hover:border-accent"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </nav>
      </div>
    </header>
  );
}
