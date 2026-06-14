import {
  about,
  experience,
  skills,
  skillIconSlugs,
  projects,
  moreProjectsUrl,
  certifications,
  competitive,
  accomplishments,
  profile,
  type Project,
} from "../data";
import { Section, RevealItem } from "./Section";

const tag = "rounded-lg border border-line bg-surface px-3 py-1 text-sm";

export function About() {
  return (
    <Section id="about" title="About">
      <div className="space-y-4 text-muted">
        {about.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </Section>
  );
}

export function ExperienceSection() {
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

export function Skills() {
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

export function Projects() {
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
      <a
        href={moreProjectsUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
      >
        More projects on GitHub ↗
      </a>
    </Section>
  );
}

export function Competitive() {
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
      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted marker:text-gold">
        {accomplishments.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    </Section>
  );
}

export function Certifications() {
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

export function Contact() {
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
