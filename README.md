# SportHub

A community sports hub built with Next.js 16 (App Router) + React 19 +
TypeScript + Tailwind CSS v4, wired up to the "Sport" API from the Postman
collection you provided. Visually it borrows global.espn.com's confidence
in bold type and dense card grids, but the actual content in the API —
floodlit courts, riverside pitches, training gear — pointed toward a
grassroots, "find a game near you" feel rather than a broadcast-news one,
so that's the direction the design took: a night-pitch palette (deep navy,
floodlight amber, turf green) instead of a straight ESPN reskin.

## What's here

- **Home** — hero, category rail, upcoming events, featured gear
- **Events** (`/events`) — list with category filtering, detail page with an
  image gallery, an embedded map (OpenStreetMap, no API key needed), a
  favorite toggle, and comments
- **Gear** (`/gear`) — the API's `Sport` entity, labelled "Gear" in the UI
  since the sample data (training cones, footballs) is equipment, not a
  sport discipline — see **Naming** below
- **Categories** (`/categories`) — one page per sport, showing its events
  and gear together
- **Favorites** (`/favorites`) — saved on-device (see **Favorites & auth**)
- **Search** (`/search`) — matches events and gear by name/description
- **Add to SportHub** (`/submit`) — forms to create an event or gear item,
  including multi-image upload, calling the API's `POST` endpoints directly

## Getting started

```bash
npm install
cp .env.local.example .env.local   # adjust the API URL if needed
npm run dev
```

Open http://localhost:3000.

## Configuring the API

`NEXT_PUBLIC_API_BASE_URL` (see `.env.local.example`) points at the one
live host hardcoded inside the collection:
`https://sport-api.eunglyzhia.com/api/v1/`. Point it at
`http://localhost:8080/api/v1/` if you're running the backend locally —
that's the host the collection's own `create-favorite` request used.

All API calls live in `src/lib/api.ts`.

## Assumptions worth knowing about

The Postman collection only documents **request** bodies — there isn't a
single real response example beyond one 500 error for the upload endpoint.
So a few things here are reasonable best guesses, called out in code
comments, that you may need to adjust once you can see real responses:

- **Response envelope** — `unwrap()` in `api.ts` handles a bare array/object
  or one nested under `data`/`items`/`result`. If your API wraps
  differently, adjust that one function.
- **Upload response** — `extractUploadUrl()` in `api.ts` looks for a `url`,
  `imageUrl`, `path`, or `location` field (optionally nested under `data`).
  Update it to match your backend once you've hit the endpoint for real.
- **Favorites' delete path** — the collection's own `delete-favorite`
  request points at singular `favorite/{uuid}`, unlike every other
  `favorites` (plural) call. Kept as-is since that's what was documented.

## Favorites & auth

The `favorites` endpoint has no user field — a favorite is just
`{sportUuid | eventUuid}`, globally. There's no login anywhere in the
collection, so "My favorites" is implemented as: the real record is still
created via the API, but *which* records belong to "you" is tracked in
this browser's `localStorage` (`src/lib/local-favorites.ts`). That's a
reasonable default for a no-auth API, but the first thing to revisit if you
add real user accounts later.

## Naming: "Sport" vs "gear"

In the API, `Sport` is a piece of equipment ("Adidas Training Cones",
"Premier League Ball") tagged with a `categoryName`, while
`SportCategory` is the actual discipline (Football, Basketball, …). To
avoid confusing users with two things called "sport," the UI calls the
`Sport` entity **gear** everywhere, while still hitting `/sports` under the
hood.

## Project structure

```
src/
  app/                 routes (App Router)
  components/          UI components
  lib/
    api.ts             typed client for every endpoint in the collection
    types.ts            TypeScript interfaces
    format.ts           small display helpers (coordinates, map links…)
    local-favorites.ts  browser-side favorites tracking
    safe.ts             wraps a request so pages render even if the API is down
```

## Design tokens

Colors, fonts, and a few base styles live in `src/app/globals.css` as CSS
variables under `@theme inline` (Tailwind v4's CSS-first config) — change
`--floodlight`, `--turf`, etc. there to retheme the whole site.

## Notes

- Pages that call the API are marked `export const dynamic = "force-dynamic"`
  so they're server-rendered per request rather than at build time — useful
  since the backend's availability shouldn't block `next build`.
- `next.config.ts` allows images from any HTTPS host and `SmartImage`
  renders with `unoptimized`, since the real image host wasn't knowable
  ahead of time. Once you know it, you can remove `unoptimized` in
  `src/components/media.tsx` to get Next's image optimization back.
- If an image URL is missing or fails to load, `SmartImage` falls back to a
  colored placeholder panel instead of a broken-image icon.
