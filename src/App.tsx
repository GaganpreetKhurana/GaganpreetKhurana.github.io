import {
  profile,
  roles,
  highlights,
  about,
  experience,
  skills,
  skillIconSlugs,
  projects,
  certifications,
  competitive,
  type Project,
} from "./data";
import { useEffect, useState } from "react";
import { useTheme } from "./useTheme";
import { useReveal } from "./useReveal";
import { useActiveSection } from "./useActiveSection";
import { useTypewriter } from "./useTypewriter";

const linkPill =
  "rounded-full border border-line bg-surface px-4 py-2 font-medium transition hover:-translate-y-0.5 hover:border-accent";

const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "cp", label: "CP" },
  { id: "certifications", label: "Certs" },
  { id: "contact", label: "Contact" },
];

const navIds = navItems.map((n) => n.id);

function NavBar() {
  const { theme, toggle } = useTheme();
  const activeId = useActiveSection(navIds);
  return (
    <nav
      aria-label="Section navigation"
      className="sticky top-0 z-10 -mx-5 mb-2 border-b border-line/70 bg-bg/80 px-5 backdrop-blur"
    >
      <div className="flex items-center justify-between gap-3 py-2">
        <ul className="flex flex-wrap gap-x-3 text-sm text-muted">
          {navItems.map((n) => (
            <li key={n.id}>
              <a
                className={`inline-flex min-h-9 items-center rounded-md px-2 py-1.5 transition hover:text-accent ${
                  activeId === n.id ? "font-semibold text-accent" : ""
                }`}
                aria-current={activeId === n.id ? "true" : undefined}
                href={`#${n.id}`}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={toggle}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          className="shrink-0 rounded-lg border border-line bg-surface px-2.5 py-1 text-sm transition hover:border-accent"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}

function Header() {
  const typedRole = useTypewriter(roles);
  return (
    <header className="relative border-b border-line py-16 sm:py-20">
      {/* Subtle decorative glow behind the hero (purely visual). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-[120%] -translate-x-1/2 opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 30% 40%, color-mix(in oklab, var(--color-accent) 28%, transparent), transparent 70%), radial-gradient(50% 50% at 80% 30%, color-mix(in oklab, var(--color-gold) 20%, transparent), transparent 70%)",
        }}
      />
      <p className="text-sm font-semibold uppercase tracking-widest text-gold">
        {profile.tagline}
      </p>
      <h1 className="name-gradient mt-2 mb-3 text-4xl font-bold leading-tight sm:text-6xl">
        {profile.name}
      </h1>
      <p className="mt-2 font-mono text-base text-accent" aria-live="polite">
        <span className="text-muted">&gt;</span> {typedRole}
        <span className="ml-0.5 inline-block w-2 animate-pulse text-accent">
          ▎
        </span>
      </p>
      <p className="mt-3 max-w-2xl text-lg text-muted">{profile.blurb}</p>
      <p className="mt-2 text-sm text-muted">📍 {profile.location}</p>

      <nav className="mt-6 flex flex-wrap gap-2.5" aria-label="Profile links">
        <a
          className={linkPill}
          href={profile.links.github}
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <a
          className={linkPill}
          href={profile.links.linkedin}
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
        <a
          className={linkPill}
          href={profile.links.codechef}
          target="_blank"
          rel="noreferrer"
        >
          CodeChef
        </a>
        <a
          className={linkPill}
          href={profile.links.leetcode}
          target="_blank"
          rel="noreferrer"
        >
          LeetCode
        </a>
        <a
          className={`${linkPill} border-accent text-accent`}
          href={profile.resumeUrl}
          target="_blank"
          rel="noreferrer"
        >
          📄 Resume
        </a>
      </nav>

      <ul className="mt-5 flex flex-wrap gap-2">
        {highlights.map((h) => (
          <li
            key={h}
            className="rounded-lg border border-line bg-surface-2 px-3 py-1 text-sm text-muted"
          >
            {h}
          </li>
        ))}
      </ul>
    </header>
  );
}

function Section({
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
function RevealItem({
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

function About() {
  return (
    <Section id="about" title="About">
      <div className="space-y-4 text-muted">
        {about.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </Section>
  );
}

function ExperienceSection() {
  return (
    <Section id="experience" title="Experience">
      <ol className="space-y-5">
        {experience.map((e) => (
          <li
            key={`${e.org}-${e.role}`}
            className="rounded-xl border border-line bg-surface p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h3 className="text-base font-semibold">
                {e.role} <span className="text-accent">· {e.org}</span>
              </h3>
              <span className="text-sm text-muted">{e.period}</span>
            </div>
            {e.detail && <p className="mt-2 text-sm text-muted">{e.detail}</p>}
            {e.bullets && (
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted marker:text-accent">
                {e.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
            {e.focusAreas && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  Focus Areas
                </p>
                <ul className="flex flex-wrap gap-2">
                  {e.focusAreas.map((area) => (
                    <li
                      key={area}
                      className="rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-xs text-muted"
                    >
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}

const tag = "rounded-lg border border-line bg-surface px-3 py-1 text-sm";

function Skills() {
  return (
    <Section id="skills" title="Skills">
      <a
        href="https://skillicons.dev"
        target="_blank"
        rel="noreferrer"
        className="mb-6 inline-block"
        aria-label="Technology icons"
      >
        <img
          src={`https://skillicons.dev/icons?i=${skillIconSlugs}&perline=13`}
          alt="Java, TypeScript, Python, AWS, React, Node.js, Docker, Git, Go, Kotlin, C++, HTML, CSS"
          loading="lazy"
        />
      </a>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
        {skills.map((s, idx) => (
          <RevealItem key={s.group} index={idx}>
            <h3 className="mb-2.5 text-sm text-muted">{s.group}</h3>
            <ul className="flex flex-wrap gap-2">
              {s.items.map((i) => (
                <li key={i} className={tag}>
                  {i}
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}
      </div>
    </Section>
  );
}

function Certifications() {
  return (
    <Section id="certifications" title="Certifications">
      <ul className="space-y-2">
        {certifications.map((c) => (
          <li
            key={c.name}
            className="flex flex-wrap items-baseline gap-x-2 text-sm"
          >
            <span className="font-medium">{c.name}</span>
            <span className="text-muted">· {c.issuer}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition hover:-translate-y-0.5 hover:border-accent">
      {/* The featured column span is applied by the RevealItem wrapper. */}
      {project.image && (
        <img
          src={project.image}
          alt={`${project.name} screenshot`}
          loading="lazy"
          className="aspect-[16/9] w-full border-b border-line object-cover object-top"
        />
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-lg font-semibold">{project.name}</h3>
        <p className="mb-3.5 text-sm text-muted">{project.description}</p>
        <ul className="mb-4 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li
              key={t}
              className="rounded-lg border border-line bg-surface px-2 py-0.5 text-xs text-muted"
            >
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex gap-4 text-sm font-medium">
          <a
            className="text-accent hover:underline"
            href={project.href}
            target="_blank"
            rel="noreferrer"
          >
            Code ↗
          </a>
          {project.demo && (
            <a
              className="text-accent hover:underline"
              href={project.demo}
              target="_blank"
              rel="noreferrer"
            >
              Live Demo ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function Projects() {
  return (
    <Section id="projects" title="Projects">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {projects.map((p, idx) => (
          <RevealItem
            key={p.name}
            index={idx}
            className={p.featured ? "sm:col-span-2" : ""}
          >
            <ProjectCard project={p} />
          </RevealItem>
        ))}
      </div>
    </Section>
  );
}

function Competitive() {
  return (
    <Section id="cp" title="Competitive Programming">
      <div className="flex flex-wrap gap-3.5">
        {competitive.map((c) => (
          <a
            key={c.platform}
            href={c.href}
            target="_blank"
            rel="noreferrer"
            className="flex min-w-44 flex-col gap-0.5 rounded-xl border border-line bg-surface px-5 py-4 transition hover:-translate-y-0.5 hover:border-gold"
          >
            <span className="font-semibold">{c.platform}</span>
            <span className="text-sm text-muted">{c.detail}</span>
          </a>
        ))}
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <Section id="contact" title="Get in Touch">
      <p className="mb-5 max-w-xl text-muted">
        I'm always happy to connect — about engineering, GenAI, competitive
        programming, or just to say hi. The best place to reach me is LinkedIn.
      </p>
      <a
        href={profile.links.linkedin}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-accent bg-accent/10 px-6 py-3 font-medium text-accent transition hover:-translate-y-0.5 hover:bg-accent/20"
      >
        💬 Message me on LinkedIn ↗
      </a>
    </Section>
  );
}

function ScrollProgress() {
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

function BackToTop() {
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

export default function App() {
  return (
    <div className="mx-auto max-w-[880px] overflow-x-clip px-5 pb-16">
      <ScrollProgress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-20 focus:rounded-lg focus:border focus:border-accent focus:bg-surface focus:px-4 focus:py-2 focus:text-accent"
      >
        Skip to content
      </a>
      <Header />
      <NavBar />
      <main id="main">
        <About />
        <ExperienceSection />
        <Skills />
        <Projects />
        <Competitive />
        <Certifications />
        <Contact />
      </main>
      <footer className="mt-14 border-t border-line pt-6 text-center text-sm text-muted">
        <p>
          Built with React + Vite + Tailwind · Hosted on GitHub Pages ·{" "}
          <a
            className="text-accent hover:underline"
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
          >
            @GaganpreetKhurana
          </a>
        </p>
      </footer>
      <BackToTop />
    </div>
  );
}
