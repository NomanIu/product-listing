import Image from "next/image";
import Link from "next/link";
import type { ProductSummary } from "@/domain/product";
import { formatCategory, formatPrice } from "@/lib/format";
import { FavouriteButton } from "./FavouriteButton";

interface ProductCardProps {
  product: ProductSummary;
  favouriteCount: number;
  /** Whether the current visitor has already favourited this product. */
  favourited: boolean;
  /** Set on above-the-fold cards so their image is eagerly loaded (helps LCP). */
  priority?: boolean;
}

/**
 * A single product in the listing grid. Pure presentation: it receives a domain
 * `ProductSummary` and a count and renders them — it does no data fetching itself.
 */
export function ProductCard({
  product,
  favouriteCount,
  favourited,
  priority = false,
}: ProductCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_16px_48px_-16px_rgba(0,0,0,0.18)]">
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-gradient-to-b from-neutral-50 to-neutral-100/60 p-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neutral-900"
        aria-label={product.title}
      >
        <Image
          src={product.thumbnail.url}
          alt={product.title}
          width={product.thumbnail.width}
          height={product.thumbnail.height}
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex-1">
          <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-neutral-500">
            {formatCategory(product.category)}
          </span>
          <h2 className="mt-2.5 text-sm font-semibold leading-snug text-neutral-900">
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

        <div className="flex items-center justify-between gap-2">
          <p className="text-lg font-bold tracking-tight text-neutral-900">
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
