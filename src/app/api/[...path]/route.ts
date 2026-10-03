import { revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'
import { API_BASE_URL, REQUEST_TIMEOUT_MS, UPLOAD_TIMEOUT_MS } from '@/lib/config'

/**
 * Same-origin proxy to the Sport API. Browser code calls `/api/...` so there are
 * no CORS problems and the upstream URL stays on the server. After any
 * successful write, the matching cache tag is revalidated so server-rendered
 * pages pick up the change immediately.
 */
const RESOURCE_TAGS: Record<string, string | null> = {
  sports: 'sports',
  events: 'events',
  comments: 'comments',
  sport_categories: 'categories',
  favorites: 'favorites',
  favorite: 'favorites',
  upload: null,
}

type Context = { params: Promise<{ path: string[] }> }

const problem = (status: number, reason: string) =>
  NextResponse.json({ error: { code: status, reason } }, { status })

async function forward(request: NextRequest, { params }: Context) {
  const { path } = await params
  const resource = path[0] ?? ''
  if (!Object.hasOwn(RESOURCE_TAGS, resource)) return problem(404, 'Unknown resource')

  const target = new URL(`${API_BASE_URL}/${path.map(encodeURIComponent).join('/')}`)
  target.search = request.nextUrl.search

  const isWrite = request.method !== 'GET' && request.method !== 'HEAD'
  const headers = new Headers({ Accept: 'application/json' })
  const contentType = request.headers.get('content-type')
  if (contentType) headers.set('content-type', contentType)

  let upstream: Response
  try {
    upstream = await fetch(target, {
      method: request.method,
      headers,
      body: isWrite ? await request.arrayBuffer() : undefined,
      cache: 'no-store',
      signal: AbortSignal.timeout(resource === 'upload' ? UPLOAD_TIMEOUT_MS : REQUEST_TIMEOUT_MS),
    })
  } catch {
    return problem(502, 'The Sport API is unreachable')
  }

  const tag = RESOURCE_TAGS[resource]
  // expire: 0 -> the next page load after a write is never stale (read-your-writes).
  if (isWrite && upstream.ok && tag) revalidateTag(tag, { expire: 0 })

  return new NextResponse(upstream.status === 204 ? null : upstream.body, {
    status: upstream.status,
    headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
  })
}

export { forward as GET, forward as POST, forward as PATCH, forward as DELETE }
