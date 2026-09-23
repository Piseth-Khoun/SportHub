import type {
  EventComment,
  Favorite,
  NewCategory,
  NewComment,
  NewEvent,
  NewFavorite,
  NewSport,
  Sport,
  SportCategory,
  SportEvent,
} from "./types";

/**
 * The Postman collection's own `base_url` variable is blank, so this
 * defaults to the one live host that appears hardcoded inside the
 * collection ("get-all-sport"). Override it with NEXT_PUBLIC_API_BASE_URL
 * in .env.local if your backend lives elsewhere (e.g. a local server).
 * Must end with a trailing slash — the collection builds every path as
 * `{{base_url}}resource`, with no slash of its own.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/?$/, "/") ??
  "https://sport-api.eunglyzhia.com/api/v1/";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * The collection never shows a real response body, so this unwraps the
 * common envelope shapes defensively: a bare array/object, or one nested
 * under `data`, `items`, or `result`.
 */
function unwrap<T>(json: unknown): T {
  if (json && typeof json === "object" && !Array.isArray(json)) {
    const obj = json as Record<string, unknown>;
    for (const key of ["data", "items", "result"]) {
      if (key in obj) return obj[key] as T;
    }
  }
  return json as T;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers:
        options.body && !(options.body instanceof FormData)
          ? { "Content-Type": "application/json", ...options.headers }
          : options.headers,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      `Could not reach the Sport API at ${url}. Check NEXT_PUBLIC_API_BASE_URL and that the server is running.`,
      0,
    );
  }

  if (!res.ok) {
    let reason = res.statusText;
    try {
      const body = await res.json();
      reason = body?.error?.reason ?? body?.message ?? reason;
    } catch {
      // response wasn't JSON — keep the status text
    }
    throw new ApiError(reason || `Request to ${path} failed`, res.status);
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  if (!text) return undefined as T;
  return unwrap<T>(JSON.parse(text));
}

const json = (body: unknown) => JSON.stringify(body);

/* ---------------------------- Sport categories --------------------------- */

export const getCategories = () =>
  request<SportCategory[]>("sport_categories");
export const getCategory = (uuid: string) =>
  request<SportCategory>(`sport_categories/${uuid}`);
export const createCategory = (body: NewCategory) =>
  request<SportCategory>("sport_categories", { method: "POST", body: json(body) });
export const updateCategory = (uuid: string, body: Partial<NewCategory>) =>
  request<SportCategory>(`sport_categories/${uuid}`, {
    method: "PATCH",
    body: json(body),
  });
export const deleteCategory = (uuid: string) =>
  request<void>(`sport_categories/${uuid}`, { method: "DELETE" });

/* --------------------------------- Sports (gear) -------------------------------- */

export const getSports = () => request<Sport[]>("sports");
export const getSport = (uuid: string) => request<Sport>(`sports/${uuid}`);
export const createSport = (body: NewSport) =>
  request<Sport>("sports", { method: "POST", body: json(body) });
export const updateSport = (uuid: string, body: Partial<NewSport>) =>
  request<Sport>(`sports/${uuid}`, { method: "PATCH", body: json(body) });
export const deleteSport = (uuid: string) =>
  request<void>(`sports/${uuid}`, { method: "DELETE" });

/* --------------------------------- Events -------------------------------- */

export const getEvents = () => request<SportEvent[]>("events");
export const getEvent = (uuid: string) => request<SportEvent>(`events/${uuid}`);
export const createEvent = (body: NewEvent) =>
  request<SportEvent>("events", { method: "POST", body: json(body) });
export const updateEvent = (uuid: string, body: Partial<NewEvent>) =>
  request<SportEvent>(`events/${uuid}`, { method: "PATCH", body: json(body) });
export const deleteEvent = (uuid: string) =>
  request<void>(`events/${uuid}`, { method: "DELETE" });

/* -------------------------------- Comments ------------------------------- */

export const getComments = () => request<EventComment[]>("comments");
export const getCommentsForEvent = (eventUuid: string) =>
  request<EventComment[]>(`comments/events/${eventUuid}`);
export const createComment = (body: NewComment) =>
  request<EventComment>("comments", { method: "POST", body: json(body) });
export const deleteComment = (uuid: string) =>
  request<void>(`comments/${uuid}`, { method: "DELETE" });

/* -------------------------------- Favorites ------------------------------- */

export const getFavorites = () => request<Favorite[]>("favorites");
export const createFavorite = (body: NewFavorite) =>
  request<Favorite>("favorites", { method: "POST", body: json(body) });
// The collection's own delete-favorite request points at the singular
// `favorite/{uuid}` path (as opposed to `favorites` everywhere else) —
// kept as-is since that's what's documented.
export const deleteFavorite = (uuid: string) =>
  request<void>(`favorite/${uuid}`, { method: "DELETE" });

/* --------------------------------- Upload -------------------------------- */

/**
 * The collection doesn't show a successful upload response, only a 500
 * error body. This tries the common shapes an upload endpoint returns a
 * URL under, and falls back to the raw body if it's already a string.
 */
function extractUploadUrl(body: unknown): string | null {
  if (typeof body === "string") return body;
  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    for (const key of ["url", "imageUrl", "path", "location"]) {
      if (typeof obj[key] === "string") return obj[key] as string;
    }
    if (obj.data) return extractUploadUrl(obj.data);
  }
  return null;
}

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_BASE_URL}upload`, { method: "POST", body: form });
  if (!res.ok) {
    throw new ApiError(`Image upload failed (${res.status})`, res.status);
  }
  const body = await res.json().catch(() => null);
  const url = extractUploadUrl(body);
  if (!url) {
    throw new ApiError(
      "Upload succeeded but the response didn't contain a recognizable URL field.",
      res.status,
    );
  }
  return url;
}

export async function uploadImages(files: File[]): Promise<string[]> {
  const form = new FormData();
  files.forEach((file) => form.append("files", file));
  const res = await fetch(`${API_BASE_URL}upload`, { method: "POST", body: form });
  if (!res.ok) {
    throw new ApiError(`Image upload failed (${res.status})`, res.status);
  }
  const body = await res.json().catch(() => null);
  if (Array.isArray(body)) return body.map((b) => extractUploadUrl(b)).filter(Boolean) as string[];
  const single = extractUploadUrl(body);
  return single ? [single] : [];
}
