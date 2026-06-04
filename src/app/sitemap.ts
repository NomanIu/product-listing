import type { MetadataRoute } from "next";
import { config } from "@/config";
import { getProductRepository } from "@/infrastructure/container";

/**
 * Dynamic sitemap.
 *
 * Enumerates the static routes plus every product detail page, so crawlers and AI
 * answer engines can discover the whole catalogue instead of only the products linked
 * from the first page of the listing grid.
 *
 * This is a cached Route Handler that reuses the same ISR-cached upstream fetch as the
 * listing, so generating it does not add load on the data source.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl } = config;
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/products`,
      lastModified,
      changeFrequency: "hourly",
      priority: 1,
    },
  ];

  const { items } = await getProductRepository().list({
    limit: config.sitemapMaxProducts,
  });

  const productRoutes: MetadataRoute.Sitemap = items.map((product) => ({
    url: `${siteUrl}/products/${product.id}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
