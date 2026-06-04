import type { Metadata } from "next";
import { config } from "@/config";
import { JsonLd } from "@/components/JsonLd";
import { ProductGrid } from "@/components/ProductGrid";
import {
  getFavouriteRepository,
  getProductRepository,
} from "@/infrastructure/container";
import { buildItemListJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "All products",
  description: "Browse our catalogue and favourite the products you love.",
};

/**
 * Product listing page (Server Component).
 *
 * All data is fetched on the server — the product catalogue from the REST API and
 * the favourite counts from the database — and composed here. No data is fetched on
 * the client for the initial render, so the page is fully server-rendered.
 */
export default async function ProductsPage() {
  const products = getProductRepository();
  const favourites = getFavouriteRepository();

  const page = await products.list({ limit: config.listingPageSize });
  const favouriteCounts = await favourites.countForMany(
    page.items.map((product) => product.id),
  );

  const itemListJsonLd = buildItemListJsonLd(page.items, config.siteUrl);

  return (
    <>
      <JsonLd data={itemListJsonLd} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Products
        </h1>
        <p className="mt-2 text-slate-600">
          Showing {page.items.length} of {page.total} products.
        </p>
      </div>

      <ProductGrid products={page.items} favouriteCounts={favouriteCounts} />
    </>
  );
}
