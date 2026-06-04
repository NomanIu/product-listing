import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { config } from "@/config";
import { FavouriteButton } from "@/components/FavouriteButton";
import { JsonLd } from "@/components/JsonLd";
import type { Product } from "@/domain/product";
import {
  getFavouriteRepository,
  getProductRepository,
} from "@/infrastructure/container";
import { formatCategory, formatPrice } from "@/lib/format";
import { getSessionId } from "@/lib/session";
import { buildProductJsonLd } from "@/lib/structured-data";

type RouteParams = { id: string };

/** Parse the route segment into a positive integer id, or `null` if invalid. */
function parseProductId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/** Shared loader so the page and its metadata fetch the product exactly once. */
async function loadProduct(rawId: string): Promise<Product | null> {
  const id = parseProductId(rawId);
  if (id === null) return null;
  return getProductRepository().getById(id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await loadProduct(id);
  if (!product) return { title: "Product not found" };

  return {
    title: product.title,
    description: product.description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: { images: [product.thumbnail.url] },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { id } = await params;
  const product = await loadProduct(id);
  if (!product) notFound();

  const favourites = getFavouriteRepository();
  const sessionId = await getSessionId();
  const [favouriteCount, favourited] = await Promise.all([
    favourites.countFor(product.id),
    sessionId ? favourites.isFavourited(sessionId, product.id) : Promise.resolve(false),
  ]);
  const productJsonLd = buildProductJsonLd(product, config.siteUrl);

  return (
    <>
      <JsonLd data={productJsonLd} />

      <nav aria-label="Breadcrumb" className="mb-8 text-sm">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 font-medium text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
        >
          <span aria-hidden="true">←</span> Back to products
        </Link>
      </nav>

      <article className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-neutral-100/60">
          <div className="relative aspect-square p-8 sm:p-12">
            <Image
              src={product.images[0]?.url ?? product.thumbnail.url}
              alt={product.title}
              width={product.thumbnail.width}
              height={product.thumbnail.height}
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:py-4">
          <div>
            <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium uppercase tracking-wider text-neutral-600">
              {formatCategory(product.category)}
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {product.title}
            </h1>
            {product.brand && (
              <p className="mt-2 text-sm text-neutral-600">by {product.brand}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <p className="text-4xl font-bold tracking-tight text-neutral-900">
              {formatPrice(product.price)}
            </p>
            <span
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                product.stock > 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className={[
                  "h-1.5 w-1.5 rounded-full",
                  product.stock > 0 ? "bg-emerald-500" : "bg-red-500",
                ].join(" ")}
              />
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <p className="flex items-center gap-1.5 text-sm font-medium text-neutral-600">
            <span aria-hidden="true" className="text-amber-400">
              ★
            </span>
            {product.rating.toFixed(2)}
            <span className="text-neutral-600"> rating</span>
          </p>

          <p className="text-base leading-relaxed text-neutral-600">
            {product.description}
          </p>

          <div className="mt-2 border-t border-neutral-200 pt-6">
            <FavouriteButton
              productId={product.id}
              productTitle={product.title}
              initialCount={favouriteCount}
              initialFavourited={favourited}
              variant="full"
            />
            <p className="mt-3 text-xs text-neutral-600">
              Adds this product to the public favourites tally.
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
