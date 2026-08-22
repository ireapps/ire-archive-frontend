# Copilot instructions

This is the static SvelteKit member search client. Read `AGENTS.md` for
development guidance and treat `docs/API_CONTRACT.md` as the definitive API
contract.

Keep changes within the frontend boundary. `ire-archive-backend` owns
MemberSuite authentication and the search API; `ire-archive-data` owns
editorial records, approval, publication, Django admin, and index-building
work. Never solve publication-state problems by filtering drafts, withdrawn
records, or needs-review records in this app.

Preserve credentialed cookie requests, CORS requirements, endpoint and
pagination shapes, search modes, metadata types, category behavior, and stable
`vector_id` deep links. Prefer additive metadata over field renames. Coordinate
taxonomy changes across repositories and redeploy frontend category config
unless a categories endpoint is explicitly planned. Never enable
`VITE_AUTH_BYPASS` in production.
