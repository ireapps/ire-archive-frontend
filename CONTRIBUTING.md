# Contributing to IRE Archive Frontend

Thank you for your interest in contributing! This project is maintained by
[Investigative Reporters & Editors (IRE)](https://www.ire.org/) and welcomes
contributions from the community.

---

## Code of Conduct

Be respectful and constructive. We follow the spirit of the
[Contributor Covenant](https://www.contributor-covenant.org/).

---

## Reporting Issues

Open an issue on [GitHub Issues](https://github.com/ireapps/ire-archive-frontend/issues)
with:

- A clear, descriptive title
- Steps to reproduce (if it's a bug)
- Expected vs. actual behavior
- Browser and OS version
- Screenshots if applicable

---

## Submitting Pull Requests

1. **Fork** the repository and create a branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** following the code style guidelines below.

3. **Add tests** for new functionality:
   - Unit tests (Vitest) for utilities and logic
   - E2E tests (Playwright) for new user flows

4. **Run the checks** before submitting:
   ```bash
   npm run check          # Type check
   npm run test:coverage  # Unit tests
   VITE_AUTH_BYPASS=true npm run test:e2e  # E2E tests
   ```

5. **Open a PR** against `main` with:
   - A clear description of what changed and why
   - Screenshots for UI changes
   - Link to any related issues

---

## Development Setup

```bash
git clone https://github.com/ireapps/ire-archive-frontend.git
cd ire-archive-frontend
cp .env.example .env.development
npm ci
npm run dev
```

See the [README](README.md) for full details on environment variables and connecting
to a backend.

---

## Code Style

- **Formatter:** [Prettier](https://prettier.io/) — run `npx prettier --write .` or use
  editor integration. Config is in [.prettierrc](.prettierrc).
- **TypeScript:** Strict mode enabled. Use explicit types for function parameters and
  return values. Prefer shorthand type syntax (`string[]` over `Array<string>`,
  `A | B` over `Union<A, B>`).
- **Svelte:** Use Svelte 5 runes (`$state`, `$derived`, `$effect`) — not the legacy
  `$:` reactive syntax.
- **CSS:** SCSS with variables and mixins from `src/lib/styles/`.

---

## Commit Messages

We recommend [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add dark mode toggle
fix: correct search pagination offset
docs: update API contract for /stats endpoint
test: add E2E test for resource detail page
refactor: extract search result card component
```

---

## Questions?

Open a [discussion](https://github.com/ireapps/ire-archive-frontend/discussions) or
reach out to the IRE team at [info@ire.org](mailto:info@ire.org).
