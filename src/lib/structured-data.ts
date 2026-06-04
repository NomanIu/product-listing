import type { Product, ProductSummary } from "@/domain/product";

/**
 * Builders for schema.org structured data (JSON-LD).
 *
 * Kept as pure functions so the shape is easy to unit-test and reason about, and so
 * the page components stay declarative.
 */

/** `ItemList` schema for the product listing page. */
export function buildItemListJsonLd(
  products: readonly ProductSummary[],
  baseUrl: string,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${baseUrl}/products/${product.id}`,
      name: product.title,
    })),
  };
}

/** `Product` schema for a detail page. */
export function buildProductJsonLd(
  product: Product,
  baseUrl: string,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    category: product.category,
    image: product.images.map((image) => image.url),
    ...(product.brand
      ? { brand: { "@type": "Brand", name: product.brand } }
      : {}),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      bestRating: 5,
      ratingCount: Math.max(1, product.stock),
    },
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "USD",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${baseUrl}/products/${product.id}`,
    },
  };
}
