import Image from "next/image";
import Link from "next/link";
import type { ProductSummary } from "@/domain/product";
import { formatCategory, formatPrice } from "@/lib/format";
import { FavouriteButton } from "./FavouriteButton";

interface ProductCardProps {
  product: ProductSummary;
  favouriteCount: number;
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
  priority = false,
}: ProductCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
      >
        <Image
          src={product.thumbnail.url}
          alt={product.title}
          width={product.thumbnail.width}
          height={product.thumbnail.height}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {formatCategory(product.category)}
          </p>
          <h2 className="mt-1 text-sm font-semibold text-slate-900">
            <Link
              href={`/products/${product.id}`}
              className="rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
            >
              {product.title}
            </Link>
          </h2>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-lg font-bold text-slate-900">
            {formatPrice(product.price)}
          </p>
          <FavouriteButton
            productId={product.id}
            productTitle={product.title}
            initialCount={favouriteCount}
          />
        </div>
      </div>
    </article>
  );
}
