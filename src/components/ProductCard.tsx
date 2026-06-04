import Image from "next/image";
import Link from "next/link";
import type { ProductSummary } from "@/domain/product";
import { formatCategory, formatPrice } from "@/lib/format";
import type { ProductView } from "./ViewToggle";
import { FavouriteButton } from "./FavouriteButton";

interface ProductCardProps {
  product: ProductSummary;
  favouriteCount: number;
  /** Whether the current visitor has already favourited this product. */
  favourited: boolean;
  /** Grid (vertical) or list (horizontal) presentation. */
  layout?: ProductView;
  /** Set on above-the-fold cards so their image is eagerly loaded (helps LCP). */
  priority?: boolean;
}

/**
 * A single product. Pure presentation: it receives a domain `ProductSummary` and a
 * count and renders them. It supports two layouts — a vertical grid card and a
 * horizontal list row — sharing the same data and interactive favourite control.
 */
export function ProductCard({
  product,
  favouriteCount,
  favourited,
  layout = "grid",
  priority = false,
}: ProductCardProps) {
  const isList = layout === "list";

  return (
    <article
      className={[
        "group relative flex overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:border-neutral-300",
        isList
          ? "flex-row items-stretch hover:shadow-md"
          : "h-full flex-col hover:-translate-y-1 hover:shadow-[0_16px_48px_-16px_rgba(0,0,0,0.18)]",
      ].join(" ")}
    >
      <Link
        href={`/products/${product.id}`}
        aria-label={product.title}
        className={[
          "relative block shrink-0 overflow-hidden bg-gradient-to-b from-neutral-50 to-neutral-100/60",
          "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neutral-900",
          isList ? "aspect-square w-28 p-3 sm:w-40 sm:p-5" : "aspect-square w-full p-6",
        ].join(" ")}
      >
        <Image
          src={product.thumbnail.url}
          alt={product.title}
          width={product.thumbnail.width}
          height={product.thumbnail.height}
          sizes={
            isList
              ? "(min-width: 640px) 160px, 112px"
              : "(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          }
          priority={priority}
          className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </Link>

      <div
        className={[
          "flex flex-1 flex-col",
          isList ? "gap-2 p-4 sm:p-5" : "gap-3 p-5",
        ].join(" ")}
      >
        <div className="flex-1">
          <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-neutral-500">
            {formatCategory(product.category)}
          </span>
          <h2
            className={[
              "mt-2.5 font-semibold leading-snug text-neutral-900",
              isList ? "text-base" : "text-sm",
            ].join(" ")}
          >
            <Link
              href={`/products/${product.id}`}
              className="line-clamp-2 rounded transition-colors hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            >
              {/* Stretch the link over the whole card for an easy click target. */}
              <span className="absolute inset-0" aria-hidden="true" />
              {product.title}
            </Link>
          </h2>
        </div>

        <div
          className={[
            "flex items-center justify-between gap-2",
            isList ? "sm:gap-6" : "",
          ].join(" ")}
        >
          <p
            className={[
              "font-bold tracking-tight text-neutral-900",
              isList ? "text-xl" : "text-lg",
            ].join(" ")}
          >
            {formatPrice(product.price)}
          </p>
          {/* Above the card-wide link in the stacking context so it stays clickable. */}
          <div className="relative z-10">
            <FavouriteButton
              productId={product.id}
              productTitle={product.title}
              initialCount={favouriteCount}
              initialFavourited={favourited}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
