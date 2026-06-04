# Project: Product Listing

A server-rendered product catalogue. Products are fetched on the server from a public
REST API (dummyjson.com); a per-visitor "favourite" interaction is persisted to
PostgreSQL via a Server Action. Built to pass Core Web Vitals, WCAG 2.2 AA, and
structured-data checks.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript (`strict`) · Tailwind CSS v4
· Prisma 7 (`@prisma/adapter-pg`) · PostgreSQL (Neon).

> ⚠️ This is a newer Next.js than your training data. Before writing framework code,
> read the relevant guide under `node_modules/next/dist/docs/` and heed deprecation
> notices (see `AGENTS.md`). Example already hit: `priority` on `next/image` is
> deprecated — we use `loading="eager"` + `fetchPriority="high"` for the LCP image.

## Architecture: layered, dependency-inverted

The framework and external services stay at the edges. Dependencies point **inward**
toward `domain/`, which imports nothing from the framework, Prisma, or the HTTP client.

```
src/
  domain/            Entities + repository interfaces (ports). No framework imports.
  infrastructure/
    api/             dummyjson HTTP repository, DTOs, and DTO -> domain mapper
    db/              Prisma client + Prisma-backed favourite repository
    container.ts     Composition root: binds concrete impls to interfaces
  app/               Routes (Server Components) + the favourite Server Action
  components/        Presentational components (one client island: FavouriteButton)
  lib/               Pure helpers (formatting, JSON-LD builders, session)
  config.ts          All env-var reads, in one place
```

### Rules that keep the layering intact

- **Pages, components, and actions depend only on the interfaces in `src/domain/`** —
  never on Prisma or `fetch` directly. Resolve a repository through the accessors in
  `src/infrastructure/container.ts` (`getProductRepository`, `getFavouriteRepository`).
- **The composition root is the only place that constructs concrete implementations.**
  Swapping the data source or storage engine is a one-line change there. Don't `new`
  a repository anywhere else.
- **`domain/` types describe the product the way the *app* thinks about it**, not the
  API's JSON shape. The API payload is shaped by DTOs (`infrastructure/api/*.dto.ts`)
  and converted by a mapper (`*.mapper.ts`). If the upstream shape changes, only the
  mapper changes.
- **Read all env vars in `src/config.ts`** and import the frozen `config` object.
  Don't scatter `process.env` reads through the codebase.
- **Keep repository interfaces small and capability-focused** (Interface Segregation).
  Add a method only when a consumer needs it; provide batch variants (`countForMany`,
  `favouritedAmong`) to avoid N+1 queries rather than calling a single-item method in
  a loop.

## Server-first rendering

- **No client-side data fetching for initial content.** The listing and detail pages
  are async Server Components that fetch on the server. The initial list must never be
  fetched in the browser.
- **One client island only:** `components/FavouriteButton.tsx` (`"use client"`).
  Everything else is a Server Component so the initial paint isn't render-blocked.
  Before adding `"use client"`, ask whether the component truly needs interactivity;
  default to server.
- **The listing is statically prerendered with ISR** (`export const revalidate = 60`).
  Counts stay fresh via that interval and via `revalidatePath()` in the Server Action.
- **The detail page is rendered per request** (it reads the session cookie for
  per-visitor favourite highlighting).

## Favourites: data flow & contract

- **Identity:** anonymous, no login. Each visitor gets an opaque `httpOnly` cookie id
  via `src/lib/session.ts`. `getOrCreateSessionId()` may only be called from a Server
  Action / Route Handler (those may set cookies); pages use `getSessionId()` (read-only).
- **Schema:** `favourites(id, product_id, session_id, created_at)` with a unique
  constraint on `(session_id, product_id)` — one row per (visitor, product), which
  makes favouriting an idempotent toggle. `product_id` is the external API's id (no
  local FK; products aren't persisted).
- **Server Action contract** (`src/app/products/actions.ts`):
  `toggleFavourite(productId: number): Promise<{ ok; favourited; count }>`. It
  validates the id (a Server Action is a public endpoint — never trust the caller),
  toggles the row, calls `revalidatePath()` for `/products` and `/products/{id}`, and
  returns the fresh count.
- **The button never holds state in `useState`.** Server props are the source of
  truth; `useOptimistic` layers an instant predicted value during the request, then
  snaps to the revalidated server value.

## Core Web Vitals (don't regress these)

- Every image is `next/image` with explicit `width`/`height` (carried on the domain
  `ProductImage` type) → CLS stays 0. Never render a raw `<img>` or omit dimensions.
- Give images correct `sizes`. Mark only above-the-fold images as eager
  (`loading="eager"` + `fetchPriority="high"`); lazy-load the rest.
- `preconnect`/`dns-prefetch` to the image CDN in `app/layout.tsx`.
- Keep client JS minimal — adding a second client island is a perf decision, not a
  convenience.

## Accessibility (WCAG 2.2 AA — must stay clean)

- Semantic landmarks (`header`/`main`/`footer`/`nav`), a skip link to `#main-content`,
  alt text on every image, visible `:focus-visible` outlines on all interactive
  elements, and AA-contrast colours.
- Interactive controls are real `<button>`/`<a>` elements, keyboard-operable, with
  `aria-pressed` / `aria-label` / `aria-live` where state changes. Don't introduce
  click handlers on non-interactive elements.

## Structured data

- `ItemList` JSON-LD on `/products`, `Product` JSON-LD on the detail page, built by
  pure functions in `src/lib/structured-data.ts` and emitted via `components/JsonLd.tsx`.
  Output must validate in Google's Rich Results Test. Use absolute URLs (`config.siteUrl`).

## TypeScript conventions

- `strict: true`. No `any`; prefer precise types and `readonly` on domain shapes.
- Import via the `@/` alias (maps to `src/`).
- Domain entities and DTOs are separate types — don't leak API field names into the UI.

## Commands

```bash
npm run dev         # dev server (http://localhost:3000 -> /products)
npm run build       # production build
npm run typecheck   # tsc --noEmit (strict) — run before considering work done
npm run lint        # eslint
npm run db:migrate  # prisma migrate dev (create + apply a migration)
npm run db:deploy   # prisma migrate deploy (apply existing migrations, prod/CI)
npm run db:studio   # prisma studio
```

**Before finishing any change, run `npm run typecheck` and `npm run lint`.** When the
DB schema changes, create a migration with `npm run db:migrate` — never hand-edit a
file in `prisma/migrations/`.
