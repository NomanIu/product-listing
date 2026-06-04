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

  const favouriteCount = await getFavouriteRepository().countFor(product.id);
  const productJsonLd = buildProductJsonLd(product, config.siteUrl);

  return (
    <>
      <JsonLd data={productJsonLd} />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <Link
          href="/products"
          className="text-slate-600 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        >
          ← Back to products
        </Link>
      </nav>

      <article className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="relative aspect-square bg-slate-50">
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

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              {formatCategory(product.category)}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {product.title}
            </h1>
            {product.brand && (
              <p className="mt-1 text-sm text-slate-600">by {product.brand}</p>
            )}
          </div>

          <p className="text-3xl font-bold">{formatPrice(product.price)}</p>

          <p className="flex items-center gap-2 text-sm text-slate-600">
            <span aria-hidden="true">★</span>
            <span>
              {product.rating.toFixed(2)} rating
              <span aria-hidden="true"> · </span>
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </span>
          </p>

          <p className="leading-relaxed text-slate-700">
            {product.description}
          </p>

          <div className="mt-2">
            <FavouriteButton
              productId={product.id}
              productTitle={product.title}
              initialCount={favouriteCount}
            />
          </div>
        </div>
      </article>
    </>
  );
}
