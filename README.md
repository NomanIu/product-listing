# Product Listings

A small server-rendered product catalogue built with **Next.js (App Router)**, **TypeScript (strict)**, **Tailwind CSS**, **Prisma**, and **PostgreSQL (Neon)**. Products are fetched on the server from a public REST API; a "favourite" interaction is persisted to the database via a Server Action and the per-product favourite count is read back from the database.

## Features

- **`/products`** — server-rendered responsive grid (image, title, price, category). No client-side data fetching for the initial list.
- **`/products/[id]`** — server-rendered detail page, fetched by id, with a proper `404` for unknown/invalid ids.
- **Favourites** — each product card has a "Favourite" button. Clicking it writes a row to the `favourites` table through a Server Action and shows the current count read from the database.
- **Core Web Vitals** — images use `next/image` with explicit `width`/`height` (no layout shift); the only client JS is the small favourite button island, so the initial paint is not render-blocked. The listing is statically prerendered with ISR.
- **Accessibility (WCAG 2.2 AA)** — semantic landmarks, a skip link, alt text, visible `:focus-visible` states, AA-contrast colours, and a fully keyboard-operable favourite button with an `aria-live` count.
- **Structured data** — valid `ItemList` JSON-LD on `/products` and `Product` JSON-LD on the detail page.

## Tech stack

| Concern            | Choice                                            |
| ------------------ | ------------------------------------------------- |
| Framework          | Next.js 16 (App Router) + React 19                |
| Language           | TypeScript, `strict: true`                        |
| Styling            | Tailwind CSS v4                                    |
| Database           | PostgreSQL (developed against **Neon**)           |
| DB access          | Prisma 7 with the `@prisma/adapter-pg` driver     |
| Data source        | Public REST API — **https://dummyjson.com/products** |

## Architecture

The code is organised in layers so the framework and external services stay at the edges (a SOLID-driven, dependency-inversion design):

```
src/
  domain/            Entities + repository interfaces (no framework imports)
  infrastructure/
    api/             dummyjson HTTP repository, DTOs, and DTO -> domain mapper
    db/              Prisma client + Prisma-backed favourite repository
    container.ts     Composition root: binds concrete impls to the interfaces
  app/               Routes (Server Components), the favourite Server Action
  components/        Presentational components (one client island: FavouriteButton)
  lib/               Pure helpers (formatting, JSON-LD builders)
```

Pages and the Server Action depend only on the repository **interfaces** in `domain/`; the concrete `DummyJsonProductRepository` and `PrismaFavouriteRepository` are wired in one place (`infrastructure/container.ts`). Swapping the data source or storage engine is a one-line change there.

## Database schema & API contract

`favourites` is an append-only interaction log (one row per click):

| column       | type        | notes                          |
| ------------ | ----------- | ------------------------------ |
| `id`         | serial PK   |                                |
| `product_id` | integer     | the external API's product id  |
| `created_at` | timestamptz | defaults to `now()`            |

The favourite count for a product is `COUNT(*)` over its rows (a single `GROUP BY` query powers the whole grid — no N+1).

**API contract (Server Action):** `addFavourite(productId: number): Promise<{ ok: boolean; count: number }>` — validates the id, inserts one row, revalidates the affected routes, and returns the fresh count.

## Setup

### Prerequisites

- Node.js 20+
- A PostgreSQL database. This was built with a free [Neon](https://neon.tech) project; any Postgres works.

### Steps

```bash
# 1. Install dependencies (also runs `prisma generate` via postinstall)
npm install

# 2. Configure environment
cp .env.example .env
#   then set DATABASE_URL to your Neon connection string (keep ?sslmode=require)

# 3. Run the database migration (creates the `favourites` table)
npm run db:migrate        # for local dev (creates + applies the migration)
# or, against an already-migrated/prod DB:
npm run db:deploy

# 4. Start the app
npm run dev               # http://localhost:3000  (redirects to /products)
```

### Environment variables

| Variable               | Required | Description                                                        |
| ---------------------- | -------- | ------------------------------------------------------------------ |
| `DATABASE_URL`         | yes      | PostgreSQL connection string (Neon).                               |
| `NEXT_PUBLIC_SITE_URL` | no       | Public origin used for absolute URLs in JSON-LD. Defaults to localhost. |
| `PRODUCT_API_BASE_URL` | no       | REST API base URL. Defaults to `https://dummyjson.com`.            |

## Useful scripts

```bash
npm run dev         # start the dev server
npm run build       # production build
npm run start       # run the production build
npm run typecheck   # tsc --noEmit (strict)
npm run lint        # eslint
npm run db:migrate  # create + apply a migration (dev)
npm run db:deploy   # apply existing migrations (prod/CI)
npm run db:studio   # open Prisma Studio
```

## Trade-off note

Given the one-day limit, I made favourites **anonymous and append-only**: each click writes a row and the count is a global tally, which keeps the schema and the Server Action minimal and race-free (a single `INSERT`, no read-modify-write). The cost is that a user can favourite the same product repeatedly and can't un-favourite. With more time I'd add a session/user identifier with a unique constraint on `(user_id, product_id)` to make favouriting idempotent and toggleable, layer in rate limiting on the action, and add a test suite (the repository interfaces are already designed to be mocked, so unit-testing the pages and the action against in-memory fakes is straightforward).
