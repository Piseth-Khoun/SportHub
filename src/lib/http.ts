import { API_BASE_URL, REQUEST_TIMEOUT_MS, REVALIDATE_SECONDS } from './config'

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  /** Cache tags (server only). Writes through the /api proxy revalidate them. */
  tags?: string[]
  /** Seconds before server data is revalidated. Defaults to REVALIDATE_SECONDS. */
  revalidate?: number | false
}

/** `{ error: { code, reason } }`, `{ message }`, or plain text. */
async function readReason(res: Response): Promise<string> {
  const fallback = `Request failed (${res.status})`
  try {
    const text = await res.text()
    if (!text) return fallback
    try {
      const json = JSON.parse(text) as { error?: { reason?: string }; message?: string }
      return json.error?.reason ?? json.message ?? fallback
    } catch {
      return text.slice(0, 200)
    }
  } catch {
    return fallback
  }
}

/**
 * One HTTP entry point for the whole app.
 * - On the server it talks to the upstream API and uses the Next.js data cache.
 * - In the browser it talks to the same-origin `/api` proxy (no CORS, no cache).
 */
export async function request<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, tags, revalidate, headers, method = 'GET', ...rest } = options
  const isServer = typeof window === 'undefined'
  const url = `${isServer ? API_BASE_URL : '/api'}/${path.replace(/^\/+/, '')}`
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData

  const init: RequestInit = {
    ...rest,
    method,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined && !isForm ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
    signal: rest.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  }

  if (method === 'GET' && isServer) {
    init.next = { revalidate: revalidate ?? REVALIDATE_SECONDS, tags }
  } else {
    init.cache = 'no-store'
  }

  let res: Response
  try {
    res = await fetch(url, init)
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === 'TimeoutError'
    throw new ApiError(timedOut ? 504 : 502, timedOut ? 'The Sport API timed out' : 'The Sport API is unreachable')
  }

  if (!res.ok) throw new ApiError(res.status, await readReason(res))
  if (res.status === 204) return undefined as T

  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export function errorMessage(error: unknown, fallback = 'Something went wrong. Try again.'): string {
  return error instanceof Error && error.message ? error.message : fallback
}
