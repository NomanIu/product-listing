/** Raised when an upstream HTTP request fails, carrying the status for callers. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly url: string,
  ) {
    super(`HTTP ${status} for ${url}`);
    this.name = "HttpError";
  }
}

/**
 * A thin typed wrapper over `fetch` for reading JSON from the data source.
 *
 * Centralising the fetch here keeps caching policy and error handling in one place
 * (Single Responsibility): repositories describe *what* to fetch, this decides *how*.
 */
export async function getJson<T>(
  url: string,
  init?: RequestInit & { revalidateSeconds?: number },
): Promise<T> {
  const { revalidateSeconds, ...rest } = init ?? {};

  const response = await fetch(url, {
    ...rest,
    // Cache the catalogue on the server and refresh periodically (ISR). This keeps
    // the listing fast (good LCP) without serving permanently stale data.
    next: { revalidate: revalidateSeconds ?? 3600 },
  });

  if (!response.ok) {
    throw new HttpError(response.status, url);
  }

  return response.json() as Promise<T>;
}
