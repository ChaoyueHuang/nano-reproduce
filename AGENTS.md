# Repository Guidelines

This repo currently ships the Next.js project as a single artifact: `nano-banana-website-clone.zip`. For development, extract it into a working directory and treat that directory as the app root.

## Project Structure & Module Organization

After extracting, the project layout is:

- `app/`: Next.js App Router pages (entry: `app/page.tsx`, shared layout: `app/layout.tsx`)
- `components/`: Feature components (kebab-case files like `components/hero.tsx`)
- `components/ui/`: Reusable UI primitives
- `hooks/`, `lib/`: Shared hooks/utilities (path alias `@/*` maps to the app root)
- `public/`: Static assets (images, icons)
- `styles/`: Global styles (Tailwind/CSS)

## Build, Test, and Development Commands

Recommended local setup:

```sh
mkdir -p site && unzip nano-banana-website-clone.zip -d site
cd site
corepack enable  # optional, for pnpm
pnpm install
pnpm dev         # start dev server
pnpm lint        # run ESLint
pnpm build       # production build
pnpm start       # serve built app
```

## Coding Style & Naming Conventions

- Language: TypeScript + React (`.tsx`), Next.js App Router.
- Formatting: follow existing patterns (2-space indentation, no semicolons).
- Naming: React components use `PascalCase` exports; filenames are typically `kebab-case.tsx`.

## Testing Guidelines

No dedicated test runner is included in the shipped project. For changes, ensure `pnpm lint` and `pnpm build` pass; add a test setup in a focused PR if needed.

## Commit & Pull Request Guidelines

No Git history is included in this repository snapshot. Use Conventional Commits (e.g., `feat: …`, `fix: …`, `chore: …`) and keep PRs small.

PRs should include: what changed, how to verify (commands/steps), and screenshots for any UI changes.

## Security & Configuration Tips

- Store secrets in `.env.local` (ignored by `.gitignore`); do not commit `.env*`.
- If you change shipped source, clarify whether the zip artifact should be regenerated and included in the PR.
