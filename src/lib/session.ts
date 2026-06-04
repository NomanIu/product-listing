import { cookies } from "next/headers";

/**
 * Anonymous visitor identity.
 *
 * Favourites are per-visitor but there is no login, so each browser gets a random,
 * opaque id stored in an httpOnly cookie. This is enough to make favouriting a
 * personal toggle without collecting any personal data.
 */
const COOKIE_NAME = "fav_session";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** Read the current session id, or `null` if this visitor has none yet. */
export async function getSessionId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

/**
 * Read the session id, creating and persisting one if absent. Must be called from a
 * Server Action or Route Handler (only those may set cookies).
 */
export async function getOrCreateSessionId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing) return existing;

  const id = crypto.randomUUID();
  store.set(COOKIE_NAME, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
  });
  return id;
}
