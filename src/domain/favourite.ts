import type { ProductId } from "./product";

/**
 * A map from a product id to how many times it has been favourited.
 * Products with zero favourites may be absent from the map (treat missing as 0).
 */
export type FavouriteCounts = ReadonlyMap<ProductId, number>;
