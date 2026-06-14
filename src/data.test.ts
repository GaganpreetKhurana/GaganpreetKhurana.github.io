import { describe, expect, it } from "vitest";
import {
  profile,
  highlights,
  about,
  experience,
  skills,
  skillIconSlugs,
  projects,
  certifications,
  competitive,
} from "./data";

describe("data integrity", () => {
  it("exposes a complete profile with absolute links", () => {
    expect(profile.name).toBeTruthy();
    expect(profile.tagline).toBeTruthy();
    for (const url of Object.values(profile.links)) {
      expect(url).toMatch(/^https:\/\//);
    }
  });

  it("has non-empty highlights, about, experience, and skills", () => {
    expect(highlights.length).toBeGreaterThan(0);
    expect(about.length).toBeGreaterThan(0);
    expect(experience.length).toBeGreaterThan(0);
    expect(skills.length).toBeGreaterThan(0);
    skills.forEach((group) => {
      expect(group.group).toBeTruthy();
      expect(group.items.length).toBeGreaterThan(0);
    });
  });

  it("provides skill icon slugs as a comma-separated string", () => {
    expect(skillIconSlugs.split(",").length).toBeGreaterThan(1);
  });

  it("gives every project a name, description, tech, and GitHub href", () => {
    expect(projects.length).toBeGreaterThan(0);
    projects.forEach((p) => {
      expect(p.name).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(p.tech.length).toBeGreaterThan(0);
      expect(p.href).toMatch(/^https:\/\/github\.com\//);
      if (p.demo) expect(p.demo).toMatch(/^https:\/\//);
      if (p.image) expect(p.image.startsWith("/")).toBe(true);
    });
  });

  it("marks exactly one featured project", () => {
    expect(projects.filter((p) => p.featured)).toHaveLength(1);
  });

  it("provides a resume URL and named certifications", () => {
    expect(profile.resumeUrl).toBeTruthy();
    expect(certifications.length).toBeGreaterThan(0);
    certifications.forEach((c) => {
      expect(c.name).toBeTruthy();
      expect(c.issuer).toBeTruthy();
    });
  });

  it("links every competitive-programming entry", () => {
    competitive.forEach((c) => {
      expect(c.platform).toBeTruthy();
      expect(c.detail).toBeTruthy();
      expect(c.href).toMatch(/^https:\/\//);
    });
  });
});
