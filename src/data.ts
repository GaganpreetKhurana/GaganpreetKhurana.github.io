// Single source of truth for portfolio content — edit here to update the site.

export const profile = {
  name: "Gaganpreet Khurana",
  tagline: "Full-Stack Software Engineer",
  blurb:
    "SDE-II @ Amazon. I build reliable, large-scale systems end-to-end — from backend services to the UI on top — and I'm hands-on with Generative AI.",
  location: "India",
  links: {
    github: "https://github.com/GaganpreetKhurana",
    linkedin: "https://linkedin.com/in/g-khurana",
    codechef: "https://www.codechef.com/users/darknight_1729",
    leetcode: "https://leetcode.com/u/Dark_Knight_1729/",
  },
  // Drop a resume.pdf into public/ to activate this link.
  resumeUrl: "/resume.pdf",
};

// Rotating roles for the hero typewriter effect.
export const roles: string[] = [
  "Full-Stack Engineer",
  "Backend · Java",
  "Frontend · React",
  "Cloud · AWS",
  "Building with GenAI",
];

export const highlights: string[] = [
  "SDE-II @ Amazon · Ex-Intern @ JPMorgan Chase",
  "Full-stack: Java · TypeScript · React · AWS",
  "Generative AI — LLMs, MCP servers & AI agents",
  "Competitive programmer — 4★ on CodeChef",
];

export const about: string[] = [
  "I'm a full-stack engineer who enjoys taking features from a blank design doc all the way to production — backend services, the cloud infrastructure they run on, and the interfaces people actually use.",
  "These days I work primarily in Java and TypeScript on large-scale, distributed systems, and I'm increasingly hands-on with Generative AI — integrating LLMs into products and building MCP servers and AI agents. Outside of work, I build small projects for fun and keep my problem-solving sharp with competitive programming.",
];

export type Experience = {
  role: string;
  org: string;
  period: string;
  detail?: string; // short summary line
  bullets?: string[]; // resume-style achievement bullets
  focusAreas?: string[]; // generic domain tags (no internal codenames)
};

export const experience: Experience[] = [
  {
    role: "Software Development Engineer II",
    org: "Amazon",
    period: "2022 — Present",
    detail:
      "Full-stack work on large, distributed subscription and purchase systems. Promoted from SDE I to SDE-II.",
    bullets: [
      "Take features from idea to launch — design, build, test, ship — working with other teams to hit deadlines.",
      "Write backend services in Java, set up cloud infrastructure with AWS (Lambda, DynamoDB, S3, SQS, CloudWatch) using AWS CDK, and build web UIs in React.",
      "Build Alexa skills, including rich screen experiences with APL (Alexa Presentation Language).",
      "Work with Generative AI — using LLMs (Amazon Bedrock), and building MCP servers and AI agents.",
      "Build and improve marketing and campaign tools used across the team.",
      "Run load and performance tests, speed up build/deploy pipelines, cut cloud costs, and write up post-incident reviews.",
      "Handle on-call, keep services healthy, review code for security, and mentor and interview engineers.",
    ],
    focusAreas: [
      "Subscriptions & Purchases",
      "Alexa Skills & Voice",
      "Generative AI",
      "AWS Cloud & Infrastructure",
      "Internationalization",
      "On-call & Service Health",
    ],
  },
  {
    role: "Technology Analyst Intern",
    org: "JPMorgan Chase & Co.",
    period: "2021",
    detail: "Software engineering internship across the development lifecycle.",
  },
  {
    role: "B.Tech, Computer Science & Engineering",
    org: "Punjab Engineering College (PEC), Chandigarh",
    period: "2018 — 2022",
    detail: "Executive Body Member, PEC ACM Student Chapter.",
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["Java", "TypeScript", "Python", "JavaScript", "Kotlin", "C++"],
  },
  { group: "Frontend", items: ["React", "HTML", "CSS", "Node.js"] },
  {
    group: "AWS & Cloud",
    items: [
      "Lambda",
      "DynamoDB",
      "S3",
      "SQS",
      "CloudWatch",
      "AWS CDK (IaC)",
      "Docker",
    ],
  },
  {
    group: "Generative AI",
    items: ["LLMs", "Amazon Bedrock", "MCP servers", "AI agents"],
  },
  { group: "Alexa", items: ["Alexa Skills", "APL"] },
  { group: "Exploring", items: ["Go"] },
];

// skillicons.dev slugs for a visual icon row (verified to render). Order is
// recent-work-first; only techs with a real icon are included here.
export const skillIconSlugs =
  "java,ts,python,aws,react,nodejs,docker,git,go,kotlin,cpp,html,css";

export type Project = {
  name: string;
  description: string;
  tech: string[];
  href: string; // source code (GitHub)
  demo?: string; // live demo, when available
  featured?: boolean; // render as a wider tile in the bento grid
  image?: string; // thumbnail path (relative to public/), when available
};

export const projects: Project[] = [
  {
    name: "CodeZone",
    description:
      "Full-stack platform for programming classrooms — a real-time collaborative code editor, discussion forum, 1:1 chat, and quizzes. My deepest dive into the MERN stack and real-time sync.",
    tech: ["React", "Node", "Express", "MongoDB"],
    href: "https://github.com/GaganpreetKhurana/CodeZone",
    featured: true,
  },
  {
    name: "Financial Assistant (DONNA)",
    description:
      "An expense-tracking assistant that helps users spend smarter and save more — my most-starred project. Built to practice data modelling and a clean Python UI.",
    tech: ["Python"],
    href: "https://github.com/GaganpreetKhurana/Financial_Assistant",
    demo: "https://gaganpreetkhurana.github.io/Financial_Assistant/",
    image: "/projects/donna.png",
  },
  {
    name: "E-Commerce",
    description:
      "A Django web app connecting customers with service providers — taught me server-side rendering, auth, and relational data design.",
    tech: ["Django", "Python", "SQLite"],
    href: "https://github.com/GaganpreetKhurana/E_Commerce",
  },
  {
    name: "WarZone",
    description:
      "A real-time multiplayer shooting game over a client–server socket connection — built around networking, concurrency, and a tight game loop.",
    tech: ["Python", "pygame", "sockets"],
    href: "https://github.com/GaganpreetKhurana/WarZone",
  },
];

export type Certification = { name: string; issuer: string };

export const certifications: Certification[] = [
  {
    name: "Software Engineering Virtual Experience",
    issuer: "JPMorgan Chase & Co. (Forage)",
  },
  { name: "Data for Machine Learning", issuer: "Coursera" },
  {
    name: "Machine Learning Algorithms: Supervised Learning",
    issuer: "Coursera",
  },
  {
    name: "Open Source Software Development, Linux & Git (Specialization)",
    issuer: "Coursera",
  },
  {
    name: "Front-End Web UI Frameworks & Tools: Bootstrap 4",
    issuer: "Coursera",
  },
];

export const competitive = [
  {
    platform: "CodeChef",
    detail: "4★ rated · peak 1851",
    href: profile.links.codechef,
  },
  {
    platform: "LeetCode",
    detail: "Active problem-solver",
    href: profile.links.leetcode,
  },
];
