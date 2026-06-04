import type { ProductSummary } from "@/domain/product";
import { ProductCard } from "./ProductCard";
import type { ProductView } from "./ViewToggle";

/** A product plus the view-specific data needed to render its card. */
export interface ProductListItem {
  product: ProductSummary;
  count: number;
  favourited: boolean;
}

interface ProductCollectionProps {
  items: readonly ProductListItem[];
  /** Grid (responsive columns) or list (stacked rows). */
  view: ProductView;
}

/**
 * Renders the catalogue as either a responsive grid or a vertical list. The same
 * `ProductCard` is reused for both; only the container layout and the card's internal
 * orientation change. The first few items are prioritised for LCP.
 */
export function ProductCollection({ items, view }: ProductCollectionProps) {
  const isList = view === "list";

  return (
    <ul
      role="list"
      className={
        isList
          ? "flex flex-col gap-4"
          : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6"
      }
    >
      {items.map((item, index) => (
        <li key={item.product.id}>
          <ProductCard
            product={item.product}
            favouriteCount={item.count}
            favourited={item.favourited}
            layout={view}
            priority={index < 4}
          />
        </li>
      ))}
    </ul>
  );
}
