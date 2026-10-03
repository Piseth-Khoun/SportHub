# Sport Hub

An ESPN-inspired sports website built with **Next.js 16 (App Router)**, **React 19** and **TypeScript**, powered by the Sport API described in `docs/Sport_postman_collection.json`.

## Quick start

```bash
npm install
cp .env.example .env.local   # then adjust if needed
npm run dev                  # http://localhost:3000
```

Production: `npm run build && npm start`. Type check: `npm run typecheck`. Requires Node 20.9+.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `API_BASE_URL` | `https://sport-api.eunglyzhia.com/api/v1` | Upstream Sport API (server only) |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Base URL for metadata / Open Graph |
| `REVALIDATE_SECONDS` | `60` | How long API data stays cached |
| `IMAGE_HOSTS` | `sport-hub.eunglyzhia.social,*.eunglyzhia.social,*.eunglyzhia.com` | Hosts optimized by `next/image` |

## Pages

| Route | What it shows |
| --- | --- |
| `/` | Event strip, lead story + headline rail, sports, categories, events |
| `/sports`, `/sports/[uuid]` | Search, category filter, pagination; detail with gallery and related sports |
| `/events`, `/events/[uuid]` | Same for events; detail adds a map, directions link and comments |
| `/categories` | Every category with sport and event counts |
| `/favorites` | Saved sports and events |

## Architecture

```
src/
  app/            Routes (server components) + /api proxy route handler
  components/     UI. Only the interactive pieces are client components
  lib/
    config.ts     Env + constants
    http.ts       Single fetch wrapper: timeout, error mapping, cache tags
    services.ts   Generic CRUD factory -> sports, events, categories, comments, favorites
    normalize.ts  Tolerant parsing of API responses into typed models
    stories.ts    Maps sports/events to one shape so Card/Hero render either
    catalog.ts    Search, filter, paginate helpers
```

Optimization and refactoring decisions:

- **Server-first.** Pages are server components; browsing, search, category filters and pagination are plain links and GET forms driven by URL params, so they need no client JavaScript. Client components are limited to favorites, comments, nav highlighting and image fallback.
- **One service layer.** `resource()` in `services.ts` generates list/get/create/update/remove for every endpoint in the Postman collection, so there is no per-endpoint boilerplate.
- **Caching.** Server fetches use the Next.js data cache (`REVALIDATE_SECONDS`) with tags. Home and favorites pages are ISR; identical fetches in one render (e.g. `generateMetadata` + page) are deduplicated.
- **Same-origin proxy** (`/api/*`). Browser code never calls the upstream API directly (no CORS issues, upstream URL stays on the server). Successful writes expire the matching cache tag immediately.
- **Resilience.** Home degrades gracefully if one endpoint fails, builds never depend on the API being reachable, 404s render a proper not-found page, and unreachable-API errors show a retry screen.
- **Images.** `next/image` (AVIF/WebP) for allow-listed hosts, plain lazy `<img>` for any other host, and a CSS turf-stripe placeholder when a photo is missing or fails to load.
- **Self-hosted fonts** via Fontsource (Barlow Condensed + Public Sans): no external font requests.
- **Accessibility.** Skip link, labelled forms, `aria-pressed` favorite buttons, visible focus, reduced-motion support.

## Things to know about the API

- The Postman collection doesn't include response examples, so `normalize.ts` accepts bare arrays and the common envelopes (`data`, `content`, `items`, `results`). If your API returns something different, that file is the only place to change.
- The collection lists favorite deletion as `DELETE /favorite/{uuid}` (singular) while other routes are plural. The client tries `/favorites/{uuid}` first and falls back to the singular path.
- Lists are fetched without paging parameters. If the API paginates by default, add `page`/`size` handling in `services.ts`.
- The API has no auth and no user concept, so favorites are global and anyone can delete comments. Add authentication before putting this in production.
- Events have no date/time fields in the API, so the UI presents them as venues and events without a schedule.
- Create/update/delete for sports, events and categories, and file upload (`POST /upload`), are implemented in the service layer and available through the proxy, but there is no admin UI yet.
