import type { FavouriteCounts } from "@/domain/favourite";
import type { ProductSummary } from "@/domain/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: readonly ProductSummary[];
  favouriteCounts: FavouriteCounts;
}

/** Responsive grid of product cards. The first row is prioritised for LCP. */
export function ProductGrid({ products, favouriteCounts }: ProductGridProps) {
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            favouriteCount={favouriteCounts.get(product.id) ?? 0}
            priority={index < 4}
          />
        </li>
      ))}
    </ul>
  );
}
