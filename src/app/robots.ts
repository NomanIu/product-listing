import type { MetadataRoute } from "next";
import { config } from "@/config";

/**
 * robots.txt.
 *
 * Allows every well-behaved crawler — search engines and AI answer engines alike —
 * over the whole site, and points them at the sitemap. There are no private or
 * user-specific URLs to exclude (favouriting happens via a Server Action, not a
 * crawlable page), so nothing is disallowed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${config.siteUrl}/sitemap.xml`,
    host: config.siteUrl,
  };
}
