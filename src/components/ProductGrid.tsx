import type { FavouriteCounts } from "@/domain/favourite";
import type { ProductId, ProductSummary } from "@/domain/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: readonly ProductSummary[];
  favouriteCounts: FavouriteCounts;
  /** Ids the current visitor has favourited (drives the filled-heart state). */
  favouritedIds: ReadonlySet<ProductId>;
}

/** Responsive grid of product cards. The first row is prioritised for LCP. */
export function ProductGrid({
  products,
  favouriteCounts,
  favouritedIds,
}: ProductGridProps) {
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6"
    >
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            favouriteCount={favouriteCounts.get(product.id) ?? 0}
            favourited={favouritedIds.has(product.id)}
            priority={index < 4}
          />
        </li>
      ))}
    </ul>
  );
}
