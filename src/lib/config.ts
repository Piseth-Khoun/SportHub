export const SITE_NAME = 'Sport Hub'

/** Upstream Sport API. Server-side only; browsers go through the /api proxy. */
export const API_BASE_URL = (
  process.env.API_BASE_URL ?? 'https://sport-api.eunglyzhia.com/api/v1'
).replace(/\/+$/, '')

/** How long (seconds) server-rendered API data stays fresh. */
export const REVALIDATE_SECONDS = Number(process.env.REVALIDATE_SECONDS ?? 60)

export const REQUEST_TIMEOUT_MS = 8_000
export const UPLOAD_TIMEOUT_MS = 30_000
export const PAGE_SIZE = 12
