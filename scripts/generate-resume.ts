/**
 * Generates an ATS-friendly, single-column PDF resume from the same data that
 * powers the portfolio site (src/data.ts), so the two never drift.
 *
 * Run: npm run resume   (writes public/resume.pdf)
 *
 * ATS notes: single column, standard fonts, real selectable text (no images or
 * multi-column tables), and standard section headings — the layout automated
 * applicant-tracking parsers handle reliably.
 */
import { mkdirSync, createWriteStream, renameSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import PDFDocument from "pdfkit";
import {
  profile,
  experience,
  skills,
  projects,
  certifications,
  accomplishments,
} from "../src/data.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../public/resume.pdf");
// Render to a temp file first and only promote it to OUT once we've confirmed
// it's a single page — so an overflow can never leave a corrupt/2-page PDF on
// disk (which might otherwise get committed or deployed).
const TMP = `${OUT}.tmp`;
mkdirSync(dirname(OUT), { recursive: true });

// Palette + layout
const INK = "#1f2328";
const MUTED = "#57606a";
const ACCENT = "#0b5cad";
const RULE = "#cbd5e1";
const MARGIN = 44;

const doc = new PDFDocument({
  size: "A4",
  margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
  info: {
    Title: "Gaganpreet Khurana — Resume",
    Author: profile.name,
  },
});
const stream = createWriteStream(TMP);
doc.pipe(stream);

// Hard guarantee: this resume is always one page. If content ever overflows,
// the build fails loudly instead of silently producing a 2-page PDF.
let pageCount = 1;
doc.on("pageAdded", () => {
  pageCount += 1;
});

const PAGE_W = doc.page.width - MARGIN * 2;

// Fixed vertical gaps (in points) so every section heading has identical
// spacing regardless of the font size or trailing space of the section before
// it. Using absolute offsets — rather than font-relative moveDown — keeps the
// rhythm uniform (e.g. Education after Experience no longer gets extra space).
const GAP_ABOVE_HEADING = 7;
const GAP_BELOW_RULE = 4;

function heading(text: string) {
  // Set the heading font first so the gap above is measured consistently.
  doc.font("Helvetica-Bold").fontSize(11).fillColor(ACCENT);
  doc.y += GAP_ABOVE_HEADING;
  doc.text(text.toUpperCase(), MARGIN, doc.y, {
    characterSpacing: 0.5,
  });
  const y = doc.y + 1.5;
  doc
    .moveTo(MARGIN, y)
    .lineTo(MARGIN + PAGE_W, y)
    .strokeColor(RULE)
    .lineWidth(0.75)
    .stroke();
  doc.y = y + GAP_BELOW_RULE;
}

function bullet(text: string) {
  const x = MARGIN + 10;
  const startY = doc.y;
  doc.font("Helvetica").fontSize(9).fillColor(MUTED);
  doc.text("•", MARGIN + 2, startY, { lineBreak: false });
  doc.text(text, x, startY, { width: PAGE_W - 10, align: "left" });
  doc.moveDown(0.12);
}

// ---- Header -----------------------------------------------------------------
doc.font("Helvetica-Bold").fontSize(20).fillColor(INK).text(profile.name);
doc.font("Helvetica").fontSize(10.5).fillColor(ACCENT).text(profile.tagline);
doc.moveDown(0.15);
// Contact via LinkedIn/GitHub only — no personal email on the public resume.
const contact = [
  profile.location,
  profile.links.linkedin.replace("https://", ""),
  profile.links.github.replace("https://", ""),
].join("  |  ");
doc.font("Helvetica").fontSize(9).fillColor(MUTED).text(contact);

// ---- Summary ----------------------------------------------------------------
heading("Summary");
doc
  .font("Helvetica")
  .fontSize(9.5)
  .fillColor(INK)
  .text(profile.blurb, { align: "left" });

// Split work history from education (the degree entry has no bullets/focus and
// names a college). Education renders under its own ATS-standard heading.
const isEducation = (e: (typeof experience)[number]) =>
  /college|university|b\.?tech|b\.?e\.?|bachelor|m\.?tech|master/i.test(
    `${e.role} ${e.org}`,
  );
const workRoles = experience.filter((e) => !isEducation(e));
const eduRoles = experience.filter(isEducation);

function roleHeader(e: (typeof experience)[number]) {
  // Role (left) and period (right) share one baseline row. Draw both at the
  // same y in their own width-bounded boxes — this keeps the period flush to
  // the right margin regardless of how long the role title is, instead of
  // relying on pdfkit's fragile `continued` + `align: "right"` flow. The role
  // is drawn first so the ATS text stream reads "title, then dates"; the cursor
  // is then reset to below the (taller) role line before the org renders.
  const rowY = doc.y;
  doc
    .font("Helvetica-Bold")
    .fontSize(10.5)
    .fillColor(INK)
    .text(e.role, MARGIN, rowY, { width: PAGE_W * 0.72, align: "left" });
  const afterRoleY = doc.y;
  doc
    .font("Helvetica")
    .fontSize(9.5)
    .fillColor(MUTED)
    .text(e.period, MARGIN, rowY, { width: PAGE_W, align: "right" });
  doc.y = afterRoleY; // org sits below the role line, not the shorter date line
  doc.font("Helvetica-Bold").fontSize(9.5).fillColor(ACCENT).text(e.org, MARGIN);
  doc.moveDown(0.1);
  if (e.detail) {
    doc.font("Helvetica-Oblique").fontSize(9).fillColor(MUTED).text(e.detail);
    doc.moveDown(0.1);
  }
}

// ---- Experience -------------------------------------------------------------
// Separators fire *between* roles (before every entry after the first), never
// after the last one — so the section ends flush and the next heading's fixed
// gap is the only space before it.
heading("Experience");
workRoles.forEach((e, i) => {
  if (i > 0) doc.moveDown(0.4);
  roleHeader(e);
  // Cap bullets to keep the resume to one page; the site shows the full set.
  for (const b of (e.bullets ?? []).slice(0, 5)) bullet(b);
  if (e.focusAreas?.length) {
    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(MUTED)
      .text(`Focus areas: ${e.focusAreas.join(" · ")}`, MARGIN + 2);
  }
});

// ---- Education --------------------------------------------------------------
heading("Education");
eduRoles.forEach((e, i) => {
  if (i > 0) doc.moveDown(0.25);
  roleHeader(e);
});

// ---- Skills -----------------------------------------------------------------
heading("Skills");
skills.forEach((group, i) => {
  if (i > 0) doc.moveDown(0.1);
  doc
    .font("Helvetica-Bold")
    .fontSize(9.5)
    .fillColor(INK)
    .text(`${group.group}:  `, {
      continued: true,
    });
  doc.font("Helvetica").fillColor(MUTED).text(group.items.join(", "));
});

// ---- Projects ---------------------------------------------------------------
// SDE-II resume: experience leads; show only the two strongest projects.
heading("Projects");
projects.slice(0, 2).forEach((p, i) => {
  if (i > 0) doc.moveDown(0.22);
  // Name + tech on one line; description follows. Links live on the site.
  doc.font("Helvetica-Bold").fontSize(9.5).fillColor(INK).text(`${p.name}  `, {
    continued: true,
  });
  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor(MUTED)
    .text(`[${p.tech.join(", ")}]`, { continued: false });
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(INK)
    .text(p.description, { width: PAGE_W });
});

// ---- Certifications ---------------------------------------------------------
// Resume keeps this compact: highlight the strongest, collapse the rest to one
// line so student-era certs don't crowd the senior content. (Site shows all.)
heading("Certifications");
const highlightCerts = certifications.filter(
  (c) => !/coursera/i.test(c.issuer),
);
const courseraCount = certifications.length - highlightCerts.length;
for (const c of highlightCerts) bullet(`${c.name} - ${c.issuer}`);
if (courseraCount > 0) {
  bullet(
    `${courseraCount} Coursera certifications — Machine Learning, Open-Source/Linux/Git, Front-End frameworks`,
  );
}

// ---- Accomplishments --------------------------------------------------------
// Helvetica lacks the ★ glyph, so render it as the word "star".
heading("Accomplishments");
for (const a of accomplishments) bullet(a.replace(/★/g, "-star"));

doc.end();

// Wait for the temp file to finish flushing before validating and promoting it.
// This avoids exiting (and possibly shipping) while bytes are still in flight.
stream.on("finish", () => {
  if (pageCount > 1) {
    rmSync(TMP, { force: true }); // never leave an overflowing PDF behind
    console.error(
      `\nERROR: resume overflowed to ${pageCount} pages — it must be exactly 1.\n` +
        "Trim content in src/data.ts (fewer bullets/projects) or reduce font sizes\n" +
        "in scripts/generate-resume.ts, then re-run.",
    );
    process.exit(1);
  }
  renameSync(TMP, OUT); // atomically promote the validated single-page PDF
  console.log(`Resume written to ${OUT} (1 page).`);
});
