// Single source of truth for portfolio content — edit here to update the site.

export const profile = {
  name: "Gaganpreet Khurana",
  tagline: "Full-Stack Software Engineer",
  blurb:
    "SDE-II at Amazon building reliable, large-scale systems end-to-end — backend, cloud, and the interfaces on top — now working hands-on with Generative AI.",
  location: "India",
  links: {
    github: "https://github.com/GaganpreetKhurana",
    linkedin: "https://linkedin.com/in/g-khurana",
    codechef: "https://www.codechef.com/users/darknight_1729",
    leetcode: "https://leetcode.com/u/Dark_Knight_1729/",
  },
  // The resume PDF is built from this same data by scripts/generate-resume.ts.
  resumeUrl: "/resume.pdf",
};

// Rotating roles for the hero typewriter effect.
export const roles: string[] = [
  "Full-Stack Engineer",
  "Backend · Java",
  "Frontend · React",
  "Cloud · AWS",
  "GenAI · LLMs",
];

export const highlights: string[] = [
  "SDE-II @ Amazon · ex-JPMorgan Chase",
  "Full-stack: Java · TypeScript · React · AWS",
  "Generative AI — LLMs, MCP servers & AI agents",
  "Competitive programmer — 4★ on CodeChef",
];

export const about: string[] = [
  "I'm a full-stack engineer who enjoys taking features from a blank design doc all the way to production — backend services, the cloud infrastructure they run on, and the interfaces people use every day.",
  "I work primarily in Java and TypeScript on large-scale distributed systems, and I build Generative-AI capabilities into products — integrating LLMs and shipping MCP servers and AI agents. Outside of work, I build small projects for fun and keep my problem-solving sharp with competitive programming.",
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
    period: "2022 - Present",
    detail:
      "Full-stack work on large, distributed subscription and purchase systems. Promoted from SDE I to SDE-II.",
    bullets: [
      "Own features end-to-end — design, implementation, testing, and launch — coordinating across multiple partner teams to ship customer-facing capabilities on large, distributed systems.",
      "Design and operate distributed backend services in Java on AWS (Lambda, DynamoDB, S3, SQS, CloudWatch), provisioned as code with AWS CDK, plus React web UIs.",
      "Built Generative-AI capabilities — integrated LLMs (Amazon Bedrock) into products and authored MCP servers and AI agents adopted by the team.",
      "Delivered customer-facing Alexa voice and multimodal (APL — Alexa Presentation Language) experiences, plus internal tooling adopted across the team.",
      "Improved operational excellence: led load & performance testing, optimized CI/CD pipelines, reduced cloud cost, and authored post-incident reviews that prevented repeat issues.",
      "Trusted as a security code reviewer; mentor new engineers and interview for engineering roles.",
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
    period: "Jan 2021 - Jun 2021",
    detail: "Built automation tooling that replaced repetitive manual work.",
    bullets: [
      "Built Python and VBA automation — web, email, and PDF scrapers plus MS Office tooling — that replaced repetitive manual workflows and freed analysts for higher-value analysis.",
    ],
  },
  {
    role: "B.Tech, Computer Science & Engineering",
    org: "Punjab Engineering College (PEC), Chandigarh",
    period: "2018 - 2022",
    detail: "CGPA 8.64/10. Executive Body Member, PEC ACM Student Chapter.",
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: [
      "Java",
      "TypeScript",
      "Python",
      "JavaScript",
      "Kotlin",
      "C++",
      "VBA (Visual Basic for Applications)",
    ],
  },
  {
    group: "Backend",
    items: [
      "REST APIs",
      "Microservices",
      "Distributed Systems",
      "Node.js",
      "System Design",
    ],
  },
  { group: "Frontend", items: ["React", "HTML", "CSS"] },
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
  { group: "Alexa", items: ["Alexa Skills", "APL (Alexa Presentation Language)"] },
  {
    group: "Practices",
    items: [
      "Data Structures & Algorithms",
      "CI/CD",
      "Unit & Integration Testing",
      "Agile",
    ],
  },
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

// Link to the full repo list, shown after the featured projects.
export const moreProjectsUrl =
  "https://github.com/GaganpreetKhurana?tab=repositories";

export type Certification = { name: string; issuer: string };

export const certifications: Certification[] = [
  { name: "Data for Machine Learning", issuer: "Coursera" },
  {
    name: "Machine Learning Algorithms: Supervised Learning",
    issuer: "Coursera",
  },
  {
    name: "Open Source Software Development, Linux & Git (Specialization)",
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
    detail: "350+ problems solved",
    href: profile.links.leetcode,
  },
];

// Competitive-programming / coding accomplishments (public). The CodeChef
// rating is intentionally omitted here — it's already shown in the cards above.
export const accomplishments: string[] = [
  "Rank 2055 in Google Kick Start",
  "Qualified for Facebook Hacker Cup Round 2",
  "5th place — Ultimate Coding Showdown (PEC ACM Student Chapter)",
];
