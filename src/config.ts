/**
 * Centralised runtime configuration. Reading env vars in exactly one place makes the
 * app's external dependencies explicit and easy to audit.
 */
export const config = {
  /** Base URL of the public product REST API (no trailing slash). */
  productApiBaseUrl: process.env.PRODUCT_API_BASE_URL ?? "https://dummyjson.com",
  /** Public origin of this site, used to build absolute URLs in structured data. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** How many products to render in the listing grid. */
  listingPageSize: 12,
  /** Upper bound on product detail URLs to enumerate in the sitemap. */
  sitemapMaxProducts: 1000,
} as const;
