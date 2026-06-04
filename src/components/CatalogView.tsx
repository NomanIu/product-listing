"use client";

import { useState } from "react";
import {
  ProductCollection,
  type ProductListItem,
} from "./ProductCollection";
import { ViewToggle, type ProductView } from "./ViewToggle";

interface CatalogViewProps {
  items: readonly ProductListItem[];
  total: number;
}

/**
 * Client wrapper that owns the grid/list view state.
 *
 * The products are fetched on the server and passed in as props (no client data
 * fetching). The view starts as "grid" and toggling is purely a local state change,
 * so switching layouts is instant — it re-lays-out the already-rendered products
 * without any navigation or server round-trip.
 */
export function CatalogView({ items, total }: CatalogViewProps) {
  const [view, setView] = useState<ProductView>("grid");

  return (
    <>
      <div className="mb-10 flex flex-col gap-4 border-b border-neutral-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-neutral-400">
            Shop the collection
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            All Products
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-neutral-500">
            Showing{" "}
            <span className="font-semibold text-neutral-900">{items.length}</span>{" "}
            of {total} products
          </p>
          <ViewToggle value={view} onChange={setView} />
        </div>
      </div>

      <ProductCollection items={items} view={view} />
    </>
  );
}
