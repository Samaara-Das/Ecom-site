# Kuwait Marketplace — An AI‑Built, Production‑Deployed Multi‑Vendor E‑Commerce Platform

> A fully‑functional, multi‑vendor e‑commerce marketplace for the Kuwait market — backend, storefront, admin, payments, auth, seed data, and live deployment — built end‑to‑end in **2 days** using orchestrated AI agent teams. **100% of the code is AI‑written.** The site is live and works.

**Live**
- Storefront: https://storefront-orpin-iota.vercel.app
- Backend / Admin API: https://medusa-backend-production-3732.up.railway.app
- Repo branch shipped to `main`: `feature/medusa-starter-storefront`

---

## What was built

A production marketplace with:

- **Multi‑vendor commerce** — custom Medusa v2 module for vendors, a vendor portal (registration, dashboard, product management, order management, settings), and an admin approval system. 12 seeded vendors across electronics, fashion, beauty, grocery, home, fitness, kids, and auto‑parts.
- **Storefront** — Amazon‑style dark UI on Next.js 15.3 / React 19 with hero carousel, category shortcuts, deal tiles, product carousels, and a vendor spotlight. 60 KWD‑priced products, 88 total variants, real Unsplash imagery.
- **Search** — debounced autocomplete, category dropdown, sidebar filters, sort, and a custom **synonym‑expansion + relevance‑scoring** layer (`expandQuery`, `scoreMatch`) over the Medusa Store API.
- **Store filters** — category, price buckets, and rating filters with URL‑param state, batched router pushes, and a "Clear all" affordance.
- **Authentication** — customer email/password (Medusa `emailpass` with `scrypt-kdf`), JWT‑based sessions, OTP scaffolding, vendor auth, admin auth.
- **Cart & checkout** — region‑aware (Kuwait region in KWD), shipping zones, fulfillment, manual + Stripe + PayPal payment provider scaffolding, full place‑order flow.
- **Account area** — profile, addresses, orders (parallel routes via `default.tsx` for `/kw/account/*`).
- **Internationalization** — `next-intl` EN/AR with full **RTL** layout support.
- **Static pages** — Contact, FAQ, Shipping, Customer Service, all themed.
- **Inventory** — Kuwait Main Warehouse stock location linked to the Default Sales Channel, 162 inventory levels seeded, 50 units per variant.
- **Seed pipeline** — idempotent scripts for vendors, products, customers, orders, inventory, plus a production `fix-auth-prod.ts` that re‑registers customer identities through the auth module to guarantee scrypt‑kdf hashing.
- **Production deployment** — Backend on **Railway** (PostgreSQL + Redis managed), storefront on **Vercel**, Docker image published to **GHCR** by GitHub Actions, conditional first‑boot seeding gated by `SEED_DEMO_DATA`.
- **Documentation suite** — `PRD.md`, `TECHNICAL_SPEC.md`, `API_REFERENCE.md`, `DATA_MODELS.md`, `INTEGRATION_GUIDE.md`, `DEPLOYMENT.md`, `UI_UX_SPEC.md`, `IMPLEMENTATION_GUIDE.md`, `ROADMAP.md` — all AI‑authored alongside the code.

By the numbers (this branch alone): **54 commits, 587 files changed, ~58,640 insertions, 15,498 deletions.**

---

## Tech stack

| Layer | Tech |
|---|---|
| Backend | Medusa v2, Node 20, TypeScript, Express, Awilix DI, custom modules |
| Database / Cache | PostgreSQL, Redis |
| Storefront | Next.js 15.3 (App Router, Server Components), React 19, Tailwind, `next-intl` |
| Payments | Stripe, PayPal, Manual provider |
| Infrastructure | Railway (backend, DB, Redis), Vercel (storefront), GHCR (Docker), GitHub Actions (CI) |
| Testing | Vitest, Playwright, custom Medusa exec verification scripts |
| Tooling | Docker Compose (local PG + Redis), Pyright/TS LSP, ESLint v8 + @typescript-eslint v8 |

---

## How I used AI to build it end‑to‑end

I treated Claude Code not as autocomplete but as an **agent team** I orchestrated. The whole project — architecture, code, tests, docs, infrastructure, debugging, deployment — was produced by AI. I provided direction, requirements, and judgment; agents produced the artifacts.

### 1. Specification first

Before any code, I had AI generate a complete documentation set in `/docs/` — PRD, technical spec, API reference, data models, integration guide, deployment guide, UI/UX spec, implementation guide, and roadmap. This became the durable contract every later agent worked against. A second PRD (`PRD-dummy-data.md`) defined exact vendors, products, customers, orders, components, and 13 numbered verification steps (`VERIFY-001` … `VERIFY-013`).

### 2. Task Master AI for planning

I used **Task Master AI** (MCP server) to parse the PRDs into 70 atomic tasks with dependencies, complexity scoring, and per‑task test strategies. Daily loop: `task-master next` → `task-master show <id>` → implement → `update-subtask` to log what worked → `set-status done`. This kept work coherent across many sessions and many agents.

### 3. Multi‑agent swarms for parallel execution

For independent work I ran **agent swarms in parallel**:

- A 4‑agent verification swarm covered Navigation/Layout, Product/Cart, Checkout/Auth, and Account/Vendor in one pass — 39 features verified, 2 critical bugs and 4 partials surfaced.
- An autonomous **Ralph Wiggum loop** (`ralph-dummy-data.sh`, `ralph-storefront-fixes.sh`) ran Claude Code in a fresh‑context loop overnight, picking the next pending task, implementing it, and looping until a `RALPH_ALL_DONE` sentinel. This produced commit `686e952` (the Amazon UI + seed scripts, 18 files, ~2,883 LOC) without supervision.
- I solved two real Ralph bugs along the way: a heredoc fix for multi‑line `claude -p` prompts, and `env -u CLAUDECODE` to allow nested Claude Code subprocesses.

### 4. Specialized sub‑agents and skills

I leaned heavily on Claude Code's skill + sub‑agent system:

- `feature-dev` (code‑explorer / code‑architect / code‑reviewer) for design and review.
- `codebase-locator`, `codebase-analyzer`, `codebase-pattern-finder`, `Explore` for surgical search instead of dumping whole files into context.
- `medusa` skill for Medusa v2 conventions; `senior-developer` skill for frontend judgment with TDD as the default; `playwright-skill` and **Chrome DevTools MCP** for UI verification.
- `skill-creator` to author new skills when patterns repeated (`/ship-it`, `/start-testing`, `/get-context`, `/update-context`).
- **Context7 MCP** for current library docs, **MongoDB MCP** for data inspection, **MemPalace** as a persistent memory layer across sessions.

### 5. Model strategy

- **Opus** for architecture, complex refactors, and root‑cause debugging.
- **Sonnet** sub‑agents for coding tasks, boilerplate, and tests, with narrow scopes and concise return contracts.
- **Surgical reads** (Glob/Grep first, then targeted file ranges) rather than reading whole repos — kept context windows lean and runs cheap.

### 6. Persistent context across sessions

A custom context system kept agents coherent over many sessions:

- `CLAUDE.md` per project (auto‑loaded), `.claude/task-context.md` as the running session log (now ~960 lines of decisions, fixes, patterns, environment status).
- Slash commands `/get-context` and `/update-context` to read/write that log.
- **MemPalace** wing/room/drawer memory + a knowledge graph for project state (`current_focus`, `next_task`, `auth_provider`, etc.) — invalidated and updated as facts changed.
- Every non‑trivial decision saved with **why** + alternatives considered, so future sessions built on prior reasoning instead of rediscovering it.

### 7. Verification loop

Every feature shipped with verification:

- **Chrome DevTools MCP** for browser interaction (`navigate_page`, `take_screenshot`, `take_snapshot`, `wait_for`, `evaluate_script`, `fill`, `click`, `list_console_messages`).
- **Playwright** for E2E (`homepage.spec.ts`, `cart.spec.ts`, `checkout.spec.ts`, `admin-panel.spec.ts`).
- 218 Vitest tests on the backend, all green; 10 of 14 storefront E2E green (the 4 needed a running backend).
- 24 verification screenshots in `demo-screenshots/`, 33 stakeholder screenshots in `screenshots/storefront/` and `screenshots/admin/`.

### 8. Deployment, also AI‑driven

The agent team handled the production cutover:

- Wrote a multi‑stage Dockerfile, then iterated to **Nixpacks** for better cache, then back to a slim Node 20 image with BuildKit cache mounts.
- Authored `railway.toml`, a `start.sh` that runs migrations, creates the admin user on first boot, and runs the seed pipeline conditionally on `SEED_DEMO_DATA`.
- Set up GitHub Actions to publish the backend image to `ghcr.io/samaara-das/kuwait-marketplace-backend:latest`.
- Diagnosed and fixed a Vercel `npm ERESOLVE` (`@types/node@17` vs `vite@5`) by adding `storefront/.npmrc` with `legacy-peer-deps=true`.

### 9. Hard bugs the agents actually root‑caused

Not "make it look right" — **find why**:

- **Customer login failed on prod.** Root cause: `seed-customers-v2.ts` hashed passwords with Node's `crypto.scrypt` while Medusa's emailpass provider uses the `scrypt-kdf` library (different format, base64 output, stored on `provider_identity.provider_metadata.password`). Fix: `fix-auth-prod.ts` deletes wrong‑format identities and re‑registers all 25 customers via `authModule.register("emailpass", …)`.
- **All auth endpoints returning HTTP 500 with `success: true` underneath.** Root cause: `medusa-config.ts` was missing `jwtExpiresIn`; the module returned a valid identity but the HTTP handler threw "JWT secret and expiresIn must be provided" while signing the token. Fix: `jwtExpiresIn: process.env.JWT_EXPIRES_IN || "30d"` (commit b256492).
- **Inventory present but storefront showed "Out of stock".** Root cause: stock location wasn't linked to the Default Sales Channel. Fix: `POST /admin/stock-locations/{id}/sales-channels`. Also flipped storefront cache from `force-cache` to `revalidate: 60`.
- **All `/kw/products/*` returning 500 in production.** Diagnosed to a Server Component using `Math.random()` at render time — fixed by moving non‑deterministic logic to a Client Component (commit 4521b58).
- **Admin panel blank.** Missing peer dep `@medusajs/admin-sdk`.
- **Vendor form 400.** Missing `x-publishable-api-key` header on storefront POST.

### 10. Outcome

A live, multi‑vendor marketplace with real product catalogues, working auth, working cart/checkout, working admin, RTL Arabic, KWD pricing, seeded inventory, payment provider scaffolding, CI/CD, and a full doc set — every line generated, reviewed, tested, and deployed by AI agents under my orchestration, in 2 days.

---

## Key takeaways from the build

1. **Spec → tasks → agents** is the unlock. PRD first, Task Master to atomize, agents to execute.
2. **Parallel sub‑agents** beat one long context. Independent work runs concurrently; the main thread keeps context lean.
3. **Persistent memory** (`CLAUDE.md`, task‑context log, MemPalace) is what makes a multi‑day AI build coherent — without it, every session starts from zero.
4. **Verification has to be a tool**, not a vibe. Chrome DevTools MCP + Playwright + Vitest in the loop is what turned "looks done" into "is done."
5. **Root‑cause discipline** is what separated working AI code from "AI slop." Every prod bug was traced through stack, library, and DB schema — not patched at the symptom.

---

*Repo highlights: `backend/src/modules/vendor/` (custom Medusa module), `backend/src/scripts/` (seed + fix pipeline), `storefront/src/components/{home,search,product}/`, `storefront/src/lib/search-synonyms.ts`, `backend/start.sh`, `.github/workflows/`, `docs/`.*
