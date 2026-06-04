import type { Metadata } from "next";
import { config } from "@/config";
import { JsonLd } from "@/components/JsonLd";
import { ProductGrid } from "@/components/ProductGrid";
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
 * favourite counts, and which products the current visitor has favourited — and
 * composed here. No data is fetched on the client for the initial render. Reading
 * the visitor's session cookie makes this route dynamic (rendered per request).
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

  const itemListJsonLd = buildItemListJsonLd(page.items, config.siteUrl);

  return (
    <>
      <JsonLd data={itemListJsonLd} />

      <div className="mb-10 flex flex-col gap-3 border-b border-neutral-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-neutral-400">
            Shop the collection
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            All Products
          </h1>
        </div>
        <p className="text-sm text-neutral-500">
          Showing{" "}
          <span className="font-semibold text-neutral-900">
            {page.items.length}
          </span>{" "}
          of {page.total} products
        </p>
      </div>

      <ProductGrid
        products={page.items}
        favouriteCounts={favouriteCounts}
        favouritedIds={favouritedIds}
      />
    </>
  );
}
