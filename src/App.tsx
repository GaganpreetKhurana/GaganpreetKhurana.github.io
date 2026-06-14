import { profile, highlights } from "./data";
import { Sidebar } from "./components/Sidebar";
import {
  About,
  ExperienceSection,
  Skills,
  Projects,
  Competitive,
  Certifications,
  Contact,
} from "./components/sections";
import { ScrollProgress, BackToTop, SkipLink } from "./components/layout";

export default function App() {
  return (
    <div className="mx-auto max-w-6xl overflow-x-clip px-6 sm:px-10 lg:px-16">
      <ScrollProgress />
      <SkipLink />
      <div className="lg:flex lg:justify-between">
        <Sidebar />
        <main id="main" className="pb-16 lg:w-[54%] lg:py-24">
          {/* Quick-scan facts that lead into the detailed sections below. */}
          <ul className="mb-12 flex flex-wrap gap-2">
            {highlights.map((h) => (
              <li
                key={h}
                className="rounded-lg border border-line bg-surface-2 px-3 py-1 text-sm text-muted"
              >
                {h}
              </li>
            ))}
          </ul>
          <About />
          <ExperienceSection />
          <Skills />
          <Projects />
          <Competitive />
          <Certifications />
          <Contact />
          <footer className="mt-14 border-t border-line pt-6 text-sm text-muted">
            <p>
              Built with React + Vite + Tailwind · Hosted on GitHub Pages ·{" "}
              <a
                className="text-accent underline"
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
              >
                @GaganpreetKhurana
              </a>
            </p>
          </footer>
        </main>
      </div>
      <BackToTop />
    </div>
  );
}
