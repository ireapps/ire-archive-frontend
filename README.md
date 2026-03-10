# IRE Archive Frontend

[![CI](https://github.com/ireapps/ire-archive-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/ireapps/ire-archive-frontend/actions/workflows/ci.yml)

A SvelteKit frontend for searching IRE's archive of journalism resources — tipsheets, contest entries, transcripts, datasets, and training materials from decades of investigative reporting conferences.

**Live URL:** [archive.ire.org](https://archive.ire.org)

---

## Tech Stack

- **[SvelteKit 5](https://svelte.dev/)** — Framework (Svelte 5 runes, not legacy `$:` syntax)
- **TypeScript** — Strict mode
- **SCSS** — Styling
- **Vitest** — Unit tests
- **Playwright** — E2E tests
- **Vite** — Build tool
- **Vercel** — Primary deployment target (static adapter)

---

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- npm

---

## Quick Start

```bash
git clone https://github.com/ireapps/ire-archive-frontend.git
cd ire-archive-frontend
cp .env.example .env.development
npm ci
npm run dev
```

The dev server starts at `http://localhost:5173`.

To use the app fully, you need a running backend — see [Connecting to a Backend](#connecting-to-a-backend) below.

---

## Environment Variables

| Variable                | Required | Default                                                              | Description                                               |
| ----------------------- | -------- | -------------------------------------------------------------------- | --------------------------------------------------------- |
| `VITE_API_BASE_URL`     | Yes      | —                                                                    | URL of the compatible FastAPI backend                     |
| `VITE_SITE_TITLE`       | No       | `"Archive Search"`                                                   | Site title for `<title>` and OG tags                      |
| `VITE_SITE_DESCRIPTION` | No       | `"Search thousands of tipsheets..."`                                 | Meta description                                          |
| `VITE_SITE_IMAGE`       | No       | `"/logo.png"`                                                        | OG image path (relative to `/static` or absolute URL)     |
| `VITE_CATEGORIES`       | No       | `["audio","contest entry","dataset","journal","tipsheet","webinar"]` | Valid resource categories (JSON array)                    |
| `VITE_AUTH_BYPASS`      | No       | `"false"`                                                            | Skip auth for local dev/testing (never use in production) |

See [.env.example](.env.example) for a documented template.

---

## Connecting to a Backend

Set `VITE_API_BASE_URL` in your `.env.development` file to point at a compatible API:

```env
VITE_API_BASE_URL=http://localhost:8000
```

The backend must implement the endpoints described in [docs/API_CONTRACT.md](docs/API_CONTRACT.md). The reference implementation is the FastAPI backend in [ireapps/archive.ire.org](https://github.com/ireapps/archive.ire.org).

**CORS:** The backend must include your frontend's origin in its CORS allowed origins. The reference backend supports runtime-configurable origins via the `ADDITIONAL_ALLOWED_ORIGINS` env var.

---

## Running Tests

### Unit Tests

```bash
npm run test              # Watch mode
npm run test:coverage     # Single run with coverage
npm run test:ui           # Vitest UI
```

### E2E Tests

E2E tests support an "auth bypass" mode that mocks all backend calls:

```bash
# Auth bypass mode (no backend needed)
VITE_AUTH_BYPASS=true npm run test:e2e

# With Playwright UI
VITE_AUTH_BYPASS=true npm run test:e2e:ui
```

### Type Check

```bash
npm run check
```

---

## Building for Production

```bash
npm run build
```

Output goes to `dist/`. The app uses SvelteKit's static adapter, so the output is a fully static site that can be hosted anywhere.

---

## Deploying

### Vercel

```bash
npm i -g vercel
vercel --prod
```

Set `VITE_API_BASE_URL` in your Vercel project's environment variables.

### Other Static Hosts

The `dist/` output works on any static host (Netlify, GitHub Pages, Cloudflare Pages, etc.). Configure your host to:

1. Build command: `npm run build`
2. Output directory: `dist`
3. Set the required environment variables

---

## Architecture

```
src/
├── routes/
│   ├── +layout.svelte       # Root layout (header, auth state, nav)
│   ├── +page.svelte          # Homepage (/)
│   ├── login/+page.svelte    # Login page (/login)
│   ├── search/+page.svelte   # Search results (/search?q=...)
│   └── resource/[id]/
│       └── +page.svelte      # Resource detail (/resource/:id)
├── lib/
│   ├── api.ts                # Backend API client
│   ├── auth.svelte.ts        # Auth state (Svelte 5 runes)
│   ├── config.ts             # Environment variables + site config
│   ├── types.ts              # TypeScript interfaces
│   ├── components/           # Reusable UI components
│   ├── styles/               # SCSS variables and mixins
│   └── utils/                # Helper functions
├── assets/                   # SVG logos and images
├── app.html                  # HTML shell
└── app.scss                  # Global styles
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines, code style, and how to submit pull requests.

---

## License

MIT — see [LICENSE](LICENSE) for details.

**Note:** IRE logos and brand assets included in this repository are the property of Investigative Reporters & Editors and are **not** covered by the MIT license. See the LICENSE file for details. If you fork this project, replace IRE brand assets with your own before deploying.

---

## About IRE

[Investigative Reporters & Editors (IRE)](https://www.ire.org/) is a grassroots nonprofit organization dedicated to improving the quality of investigative reporting. IRE provides resources, training, and support to journalists worldwide.
