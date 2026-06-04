import type { Metadata } from "next";
import { config } from "@/config";
import { CatalogView } from "@/components/CatalogView";
import { JsonLd } from "@/components/JsonLd";
import {
  getFavouriteRepository,
  getProductRepository,
} from "@/infrastructure/container";
import { buildItemListJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "All products",
  description: "Browse our catalogue and favourite the products you love.",
};

// Statically prerender the listing and refresh it periodically (ISR). The page does
// no per-request work, so the HTML — including the LCP hero image — is served from
// cache instantly instead of being delayed by a database round-trip. The favourite
// counts stay fresh via this interval and via revalidatePath() on every favourite.
export const revalidate = 60;

/**
 * Product listing page (Server Component, statically rendered).
 *
 * The catalogue is fetched from the REST API and the favourite counts from the
 * database, then composed into a serializable list for the client `CatalogView`,
 * which owns the grid/list toggle. No data is fetched on the client for the initial
 * render. Per-visitor favourite highlighting lives on the detail page (which is
 * rendered per request); here we show the public count for each product.
 */
export default async function ProductsPage() {
  const products = getProductRepository();
  const favourites = getFavouriteRepository();

  const page = await products.list({ limit: config.listingPageSize });
  const favouriteCounts = await favourites.countForMany(
    page.items.map((product) => product.id),
  );

  const items = page.items.map((product) => ({
    product,
    count: favouriteCounts.get(product.id) ?? 0,
    favourited: false,
  }));

  const itemListJsonLd = buildItemListJsonLd(page.items, config.siteUrl);

  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <CatalogView items={items} total={page.total} />
    </>
  );
}
