# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Namesake is a website (namesake.fyi) that helps people with legal name changes and gender marker changes. It guides users through multi-step forms, collects their data locally in IndexedDB, and generates pre-filled PDF court documents for download. No form data is sent to a server.

Built with Astro (SSR on Cloudflare Workers), React for interactive components, Sanity CMS for content, and Cloudflare D1 for server-side data.

## Commands

```shell
pnpm dev              # Start dev server (localhost:4321)
pnpm build            # Full build (pdf:schema + wrangler types + astro check + astro build)
pnpm check            # Type check + Biome lint/format check
pnpm check:fix        # Same but auto-fix
pnpm lint:fix         # Biome lint with auto-fix
pnpm format:fix       # Biome format with auto-fix
pnpm test             # Vitest in watch mode
pnpm test:once        # Vitest single run
pnpm test src/pdfs    # Run tests for a specific directory
pnpm test:e2e         # Playwright end-to-end tests
pnpm storybook        # Component stories (port 6006)
```

### PDF Scripts

```shell
pnpm pdf:define ./path/to/form.pdf   # Generate PDF definition files from a prepared PDF
pnpm pdf:schema                      # Regenerate all PDF schemas
pnpm pdf:schema path/to/form.pdf     # Regenerate schema for one PDF
pnpm pdf:clean path/to/form.pdf      # Strip borders/backgrounds from PDF form fields
```

### Database Migrations

```shell
pnpm idb:add-migration <kebab-case-name>   # Scaffold a new IndexedDB migration
```

## Architecture

### Path Alias

`@/` maps to `./src/` (configured in tsconfig.json and vite).

### Multi-Step Forms (core feature)

Forms are the primary interactive feature. Each form is defined in `src/pages/forms/<slug>/config.ts` using `defineFormConfig()`:

- **Steps** — Ordered list of step objects, each with an id, title, field names, and a React component. Steps can have `guard` functions for conditional inclusion.
- **State machine** — XState drives form phases: title → filling → review → editing → submitting → complete.
- **Persistence** — `useFormData` saves field values and `useFormState` saves form progress to IndexedDB. Users can close the browser and resume.
- **Submission** — `createFormSubmitHandler` collects visible fields, generates PDFs via `@cantoo/pdf-lib`, and triggers a download.

Form configs are registered in `src/constants/forms.ts` (`FORM_CONFIGS` record keyed by slug).

### PDF Definitions

Each PDF lives in `src/pdfs/<jurisdiction>/<pdf-id>/` with:
- The `.pdf` file (prepared with named form fields)
- `index.ts` — PDF definition with a `resolver` function mapping PDF field names → form data values
- `schema.ts` — Auto-generated field schema (run `pnpm pdf:schema` to regenerate)
- `index.test.ts` — Tests using `expectPdfFieldsMatch` and `getPdfForm` helpers from `src/pdfs/utils/`

Field names follow conventions: `camelCase`, booleans prefixed with `is`/`should`/`has`, boolean checkbox pairs suffixed `True`/`False`.

### Field Definitions

`src/constants/fields.ts` contains `FIELD_DEFS` — the canonical list of all form field names, labels, and types. PDF resolvers and form steps both reference these fields.

### Content (Sanity CMS)

Sanity schemas in `src/sanity/schema/`. The studio is at `/studio`. Content types include guides, forms, posts, pages, states, partners, press, and categories.

### Component Structure

- `src/components/` — Astro components (`.astro` files)
- `src/components/react/common/` — Shared React components
- `src/components/react/forms/` — Form-specific React components (FormStep, field types, etc.)

UI components use **React Aria Components** for accessibility.

### IndexedDB (client-side storage)

Two stores in the `"namesake"` database:
- `formData` — keyed by field name, stores each field's saved value
- `formProgress` — keyed by form slug, stores XState machine state

Migrations are numbered files in `src/db/migrations/`. Use `pnpm idb:add-migration` to scaffold new ones.

### Styles

Global styles in `src/styles/`. PostCSS with `postcss-utopia` for fluid type/spacing. No CSS-in-JS for Astro components.

## Testing

- **Unit/integration**: Vitest with jsdom, Testing Library, and `@testing-library/jest-dom` matchers. Tests live alongside source files as `*.test.ts(x)`.
- **PDF tests**: Use `expectPdfFieldsMatch` to verify field mapping and `getPdfForm` to inspect individual fields. The test setup mocks `fetch` to read local PDF files.
- **E2E**: Playwright in `e2e/`, runs against `localhost:4321`.
- **Coverage thresholds**: 85% for lines, statements, functions, and branches.

## Code Style

- **Formatter/Linter**: Biome (space indentation, auto-organize imports, sorted properties)
- **Pre-commit hook**: Husky runs `biome check --write` via lint-staged on all changed files
- **TypeScript**: Strict mode via `astro/tsconfigs/strict`, `verbatimModuleSyntax` enabled
- Astro files have `noUnusedImports`/`noUnusedVariables` disabled due to false positives

## Deployment

PRs merged to `main` auto-deploy to Cloudflare Pages. The adapter is `@astrojs/cloudflare` with SSR output.

## Environment Variables

Copy `.env.example` to `.env`:
- `SANITY_AUTH_TOKEN` — Sanity API access
- `RESEND_API_KEY` — Email sending
