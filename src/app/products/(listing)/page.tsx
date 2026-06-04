import type { Metadata } from "next";
import { config } from "@/config";
import { CatalogView } from "@/components/CatalogView";
import { JsonLd } from "@/components/JsonLd";
import {
  getFavouriteRepository,
  getProductRepository,
} from "@/infrastructure/container";
import { getSessionId } from "@/lib/session";
import { buildItemListJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "All products",
  description: "Browse our catalogue and favourite the products you love.",
};

/**
 * Product listing page (Server Component).
 *
 * All data is fetched on the server — the product catalogue from the REST API, the
 * favourite counts, and which products the current visitor has favourited — then
 * composed into a serializable list and handed to the client `CatalogView`, which
 * owns the grid/list toggle. No data is fetched on the client for the initial render.
 */
export default async function ProductsPage() {
  const products = getProductRepository();
  const favourites = getFavouriteRepository();

  const page = await products.list({ limit: config.listingPageSize });
  const productIds = page.items.map((product) => product.id);

  const sessionId = await getSessionId();
  const [favouriteCounts, favouritedIds] = await Promise.all([
    favourites.countForMany(productIds),
    sessionId
      ? favourites.favouritedAmong(sessionId, productIds)
      : Promise.resolve(new Set<number>()),
  ]);

  // Resolve per-product values on the server into a plain, serializable array
  // (Map/Set cannot cross the server -> client component boundary).
  const items = page.items.map((product) => ({
    product,
    count: favouriteCounts.get(product.id) ?? 0,
    favourited: favouritedIds.has(product.id),
  }));

  const itemListJsonLd = buildItemListJsonLd(page.items, config.siteUrl);

  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <CatalogView items={items} total={page.total} />
    </>
  );
}
