import { ApiError } from "./api";

export async function safe<T>(
  promise: Promise<T>,
  fallback: T,
): Promise<{ data: T; error: string | null }> {
  try {
    const data = await promise;
    return { data: data ?? fallback, error: null };
  } catch (err) {
    const message =
      err instanceof ApiError ? err.message : "Something went wrong talking to the Sport API.";
    return { data: fallback, error: message };
  }
}
