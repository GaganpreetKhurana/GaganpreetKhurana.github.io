# GaganpreetKhurana.github.io

Personal portfolio site → **https://gaganpreetkhurana.github.io**

Built with **React + Vite + TypeScript**, deployed to **GitHub Pages** via GitHub Actions.

## Develop

```bash
npm install
npm run dev            # local dev server
npm run build          # production build to dist/
npm run preview        # preview the production build
npm run lint           # ESLint
npm run format         # Prettier (write)
npm run test           # unit tests (Vitest)
npm run test:coverage  # unit tests + coverage (enforced at 100%)
```

> **Note:** If `npm install` fails with a `401`/auth error, your npm is
> pointed at a private registry. Install against the public registry:
> `npm install --registry=https://registry.npmjs.org/`

## Testing

Unit tests use **Vitest + React Testing Library** (jsdom). Coverage thresholds
are enforced at **100%** (lines, branches, functions, statements) for `src/`,
excluding the entry point and test helpers. Run `npm run test:coverage`.

## Edit content

All content lives in [`src/data.ts`](src/data.ts) — update profile, skills, projects, and competitive-programming entries there.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages. Enable Pages once under **Settings → Pages → Source: GitHub Actions**.
