import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { render, screen, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import {
  profile,
  projects,
  competitive,
  experience,
  skills,
  certifications,
} from "./data";
import { mockIntersectionObserver, mockMatchMedia } from "./test/helpers";

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
  // App's hooks need both APIs; default to dark, no reduced motion.
  mockMatchMedia({
    "(prefers-color-scheme: light)": false,
    "(prefers-reduced-motion: reduce)": false,
  });
  mockIntersectionObserver();
  // Reset scroll position so back-to-top starts hidden in each test.
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("App rendering", () => {
  it("renders the hero name and tagline", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: profile.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(profile.tagline)).toBeInTheDocument();
  });

  it("renders all section headings", () => {
    render(<App />);
    for (const title of [
      "About",
      "Experience",
      "Skills",
      "Projects",
      "Competitive Programming",
      "Certifications",
      "Get in Touch",
    ]) {
      expect(
        screen.getByRole("heading", { level: 2, name: title }),
      ).toBeInTheDocument();
    }
  });

  it("renders every project with a Code link", () => {
    render(<App />);
    for (const p of projects) {
      expect(
        screen.getByRole("heading", { level: 3, name: p.name }),
      ).toBeInTheDocument();
    }
    const codeLinks = screen.getAllByRole("link", { name: /Code ↗/ });
    expect(codeLinks).toHaveLength(projects.length);
  });

  it("renders a Live Demo link only for projects that have one", () => {
    render(<App />);
    const demoCount = projects.filter((p) => p.demo).length;
    expect(screen.getAllByRole("link", { name: /Live Demo ↗/ })).toHaveLength(
      demoCount,
    );
  });

  it("renders a screenshot only for projects that have an image", () => {
    render(<App />);
    const withImage = projects.filter((p) => p.image);
    for (const p of withImage) {
      expect(
        screen.getByRole("img", { name: `${p.name} screenshot` }),
      ).toBeInTheDocument();
    }
    // A project without an image must not render a screenshot img.
    const withoutImage = projects.find((p) => !p.image);
    if (withoutImage) {
      expect(
        screen.queryByRole("img", { name: `${withoutImage.name} screenshot` }),
      ).toBeNull();
    }
  });

  it("renders experience entries and skill groups", () => {
    render(<App />);
    for (const e of experience) {
      expect(screen.getByText(e.period)).toBeInTheDocument();
    }
    for (const group of skills) {
      expect(
        screen.getByRole("heading", { level: 3, name: group.group }),
      ).toBeInTheDocument();
    }
  });

  it("renders competitive-programming entries linking out", () => {
    render(<App />);
    // Scope to the CP section, since platform names also appear as hero pills.
    const cpHeading = screen.getByRole("heading", {
      level: 2,
      name: "Competitive Programming",
    });
    const cpSection = cpHeading.closest("section")!;
    for (const c of competitive) {
      const link = within(cpSection).getByRole("link", {
        name: new RegExp(c.platform),
      });
      expect(link).toHaveAttribute("href", c.href);
      expect(within(cpSection).getByText(c.detail)).toBeInTheDocument();
    }
  });

  it("provides a skip-to-content link targeting main", () => {
    render(<App />);
    const skip = screen.getByRole("link", { name: /Skip to content/ });
    expect(skip).toHaveAttribute("href", "#main");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
  });

  it("lists every certification", () => {
    render(<App />);
    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Certifications",
    });
    const section = heading.closest("section")!;
    for (const c of certifications) {
      expect(within(section).getByText(c.name)).toBeInTheDocument();
    }
  });

  it("exposes a resume link in the hero pointing at the resume URL", () => {
    render(<App />);
    const resumeLinks = screen.getAllByRole("link", { name: /Resume/ });
    expect(resumeLinks.length).toBeGreaterThan(0);
    resumeLinks.forEach((l) =>
      expect(l).toHaveAttribute("href", profile.resumeUrl),
    );
  });

  it("points the contact CTA at LinkedIn", () => {
    render(<App />);
    const contact = screen.getByRole("link", {
      name: /Message me on LinkedIn/,
    });
    expect(contact).toHaveAttribute("href", profile.links.linkedin);
  });
});

describe("App theme toggle", () => {
  it("toggles the theme when the button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);
    // starts dark (OS dark, nothing stored)
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    const toggle = screen.getByRole("button", {
      name: /Switch to light theme/,
    });
    await user.click(toggle);

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
    // button label now offers switching back to dark
    expect(
      screen.getByRole("button", { name: /Switch to dark theme/ }),
    ).toBeInTheDocument();
  });
});

describe("App reveal state", () => {
  it("renders sections in the shown state under reduced motion", () => {
    // Reduced motion -> useReveal starts shown=true, exercising the truthy
    // branch of the Section reveal className.
    mockMatchMedia({
      "(prefers-color-scheme: light)": false,
      "(prefers-reduced-motion: reduce)": true,
    });
    mockIntersectionObserver();
    render(<App />);
    const about = screen
      .getByRole("heading", { level: 2, name: "About" })
      .closest("section")!;
    expect(about.className).toContain("opacity-100");
    expect(about.className).not.toContain("opacity-0");
  });

  it("renders sections hidden initially when motion is allowed", () => {
    render(<App />); // beforeEach: reduced-motion false, IO never emits
    const about = screen
      .getByRole("heading", { level: 2, name: "About" })
      .closest("section")!;
    expect(about.className).toContain("opacity-0");
  });
});

describe("App back-to-top button", () => {
  it("is hidden near the top and appears after scrolling", () => {
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
    render(<App />);
    expect(screen.queryByRole("button", { name: "Back to top" })).toBeNull();

    Object.defineProperty(window, "scrollY", {
      value: 800,
      configurable: true,
    });
    act(() => window.dispatchEvent(new Event("scroll")));
    expect(
      screen.getByRole("button", { name: "Back to top" }),
    ).toBeInTheDocument();
  });

  it("scrolls to the top when clicked", async () => {
    const user = userEvent.setup();
    // spyOn auto-restores via vi.restoreAllMocks() in afterEach.
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    Object.defineProperty(window, "scrollY", {
      value: 800,
      configurable: true,
    });
    render(<App />);
    act(() => window.dispatchEvent(new Event("scroll")));

    await user.click(screen.getByRole("button", { name: "Back to top" }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("scrolls instantly when the user prefers reduced motion", async () => {
    const user = userEvent.setup();
    mockMatchMedia({
      "(prefers-color-scheme: light)": false,
      "(prefers-reduced-motion: reduce)": true,
    });
    mockIntersectionObserver();
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    Object.defineProperty(window, "scrollY", {
      value: 800,
      configurable: true,
    });
    render(<App />);
    act(() => window.dispatchEvent(new Event("scroll")));

    await user.click(screen.getByRole("button", { name: "Back to top" }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });
});

describe("App scroll progress bar", () => {
  function setLayout(
    scrollHeight: number,
    innerHeight: number,
    scrollY: number,
  ) {
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: scrollHeight,
      configurable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: innerHeight,
      configurable: true,
    });
    Object.defineProperty(window, "scrollY", {
      value: scrollY,
      configurable: true,
    });
  }

  it("reflects scroll position as a percentage width", () => {
    setLayout(2000, 1000, 500); // scrollable=1000, scrolled 500 => 50%
    render(<App />);
    act(() => window.dispatchEvent(new Event("scroll")));
    const bar = document.querySelector(".fixed.left-0.top-0") as HTMLElement;
    expect(bar.style.width).toBe("50%");
  });

  it("stays at 0% when the page is not scrollable", () => {
    setLayout(800, 1000, 0); // scrollable <= 0 => guard returns 0
    render(<App />);
    act(() => window.dispatchEvent(new Event("scroll")));
    const bar = document.querySelector(".fixed.left-0.top-0") as HTMLElement;
    expect(bar.style.width).toBe("0%");
  });
});

describe("App active-section nav", () => {
  it("marks a nav link active when its section intersects", () => {
    const ios = mockIntersectionObserver();
    render(<App />);
    // The active-section observer is uniquely identified by its rootMargin.
    const observer = ios.find(
      (io) => io.options?.rootMargin === "-20% 0px -70% 0px",
    );
    expect(observer).toBeDefined();
    act(() =>
      observer!.emit([
        {
          isIntersecting: true,
          target: document.getElementById("projects")!,
          boundingClientRect: { top: 50 } as DOMRectReadOnly,
        },
      ]),
    );
    const nav = screen.getByRole("navigation", { name: "Section navigation" });
    const active = within(nav).getByRole("link", { name: "Projects" });
    expect(active).toHaveAttribute("aria-current", "true");
  });
});
