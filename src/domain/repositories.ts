import type { FavouriteCounts } from "./favourite";
import type { Product, ProductId, ProductPage } from "./product";

/**
 * Repository abstractions (ports).
 *
 * The application depends on these interfaces, never on a concrete HTTP client or
 * ORM (Dependency Inversion). Each interface is deliberately small and focused on a
 * single capability (Interface Segregation) so a consumer that only needs counts is
 * not coupled to write operations.
 */

/** Read-only access to the catalogue of products from the external data source. */
export interface ProductRepository {
  /** Fetch a single page of product summaries for the listing grid. */
  list(params: { limit: number }): Promise<ProductPage>;
  /** Fetch one product by id, or `null` if it does not exist. */
  getById(id: ProductId): Promise<Product | null>;
}

/** The state of a single product's favourite after a toggle. */
export interface FavouriteState {
  /** Whether the acting session now has this product favourited. */
  readonly favourited: boolean;
  /** The product's total favourite count across all sessions. */
  readonly count: number;
}

/** Persistence of the "favourite" interaction and the counts derived from it. */
export interface FavouriteRepository {
  /**
   * Toggle the favourite for `(sessionId, productId)`: add it if absent, remove it
   * if present. Returns the resulting state (favourited + total count).
   */
  toggle(sessionId: string, productId: ProductId): Promise<FavouriteState>;
  /** Total favourites for a single product. */
  countFor(productId: ProductId): Promise<number>;
  /** Favourite counts for many products in one round-trip (avoids N+1 queries). */
  countForMany(productIds: readonly ProductId[]): Promise<FavouriteCounts>;
  /** Whether this session has favourited the given product. */
  isFavourited(sessionId: string, productId: ProductId): Promise<boolean>;
  /** Which of the given products this session has favourited (one query). */
  favouritedAmong(
    sessionId: string,
    productIds: readonly ProductId[],
  ): Promise<ReadonlySet<ProductId>>;
}
