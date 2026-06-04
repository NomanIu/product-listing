/**
 * Domain entities for products.
 *
 * These types are intentionally framework- and source-agnostic: they describe a
 * product the way the *application* thinks about it, not the way the external REST
 * API happens to shape its JSON. The mapping from the API's payload lives in the
 * infrastructure layer (see `dummyjson.mapper.ts`), so swapping the data source
 * never ripples into the UI.
 */

export type ProductId = number;

/** A product image with intrinsic dimensions, required to render without layout shift. */
export interface ProductImage {
  readonly url: string;
  readonly width: number;
  readonly height: number;
}

/** The fields needed to render a product in the listing grid. */
export interface ProductSummary {
  readonly id: ProductId;
  readonly title: string;
  readonly price: number;
  readonly category: string;
  readonly thumbnail: ProductImage;
}

/** The full product, used on the detail page. Extends the summary with rich fields. */
export interface Product extends ProductSummary {
  readonly description: string;
  readonly brand: string | null;
  readonly rating: number;
  readonly stock: number;
  readonly images: readonly ProductImage[];
}

/** A page of product summaries plus the total available, for the listing route. */
export interface ProductPage {
  readonly items: readonly ProductSummary[];
  readonly total: number;
}
