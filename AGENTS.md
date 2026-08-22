# Agent guide

## Project

This is a SvelteKit 5 static SPA deployed to Vercel. It uses TypeScript,
SCSS, Vitest, Playwright, and npm on Node.js 24.

## Setup

```bash
npm ci
npx playwright install chromium
cp .env.example .env.development
```

The app expects a compatible backend through `VITE_API_BASE_URL`. For
frontend work without a backend, run with `VITE_AUTH_BYPASS=true`; this uses
the mock data in `src/lib/api.ts`.

Never enable `VITE_AUTH_BYPASS` in production. Variables prefixed with
`VITE_` are public and are embedded into the browser bundle at build time.

## Repository boundaries

This repository is the static, member-facing search client. Follow
`docs/API_CONTRACT.md` as the definitive frontend/backend contract.

- `ire-archive-backend` owns MemberSuite authentication and the deployed
  search, resource, similar-resource, and stats API.
- `ire-archive-data` is the permanent editorial source of truth in Django and
  Postgres. It deliberately publishes approved snapshots for the backend to
  serve.
- Draft, withdrawn, or needs-review records must never be exposed by this
  client. Treat their absence as a publication guarantee, not a frontend
  filtering task.
- Django admin, publication jobs, seed cleanup, Qdrant index construction, and
  Fly.io admin deployment belong in the data or backend repositories.

Preserve endpoint shapes, credentialed cookie requests, CORS assumptions,
search modes and offset pagination, metadata types, category values, and
`vector_id` resource links. Prefer additive metadata fields over renaming or
removing existing fields. Taxonomy changes require coordinated data and
backend work plus either a frontend `VITE_CATEGORIES` redeploy or a separately
planned categories endpoint.

## Commands

```bash
npm run dev                 # Local development server
npm run verify              # Format, lint, types, unit tests, and build
npm test -- --run <file>    # Targeted unit test
npm run test:e2e            # Local Playwright suite with mock auth
npm run test:e2e:preview    # Build and test the production output locally
```

Run the smallest relevant test while working, then run `npm run verify`
before finishing. Run Playwright when behavior or navigation changes.
Set `PLAYWRIGHT_DEV_PORT` or `PLAYWRIGHT_PREVIEW_PORT` when another worktree
already uses the default port.

## Code map

- `src/routes/`: SvelteKit pages and the root layout.
- `src/lib/components/`: Reusable Svelte components.
- `src/lib/api.ts`: Backend client and auth-bypass mock data.
- `src/lib/auth.svelte.ts`: Shared authentication state.
- `src/lib/config.ts`: Build-time site configuration.
- `src/lib/analytics.ts`: Google Analytics initialization and events.
- `src/lib/utils/`: Shared helpers.
- `tests/e2e/`: Playwright browser tests.
- `docs/API_CONTRACT.md`: Frontend/backend API contract.

## Conventions

- Use Svelte 5 runes, not legacy `$:` statements.
- Keep TypeScript strict and avoid unsafe casts.
- Reuse existing components, types, styles, and helpers before adding new
  ones.
- Put shared SCSS values in `src/lib/styles/`.
- Add Vitest coverage for logic and Playwright coverage for user flows.
- Preserve the static-adapter SPA fallback and direct-route behavior.
- Keep Google Analytics production-only through
  `VITE_GOOGLE_ANALYTICS_ID`.
- Do not edit generated output in `dist/` or `.svelte-kit/`.

## Pull requests

Keep changes focused and explain behavior changes. Include screenshots for
visible UI work. A change is ready when `npm run verify` passes and relevant
Playwright tests pass.
