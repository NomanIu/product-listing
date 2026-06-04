import { config } from "@/config";
import type {
  FavouriteRepository,
  ProductRepository,
} from "@/domain/repositories";
import { DummyJsonProductRepository } from "./api/dummyjson-product.repository";
import { PrismaFavouriteRepository } from "./db/prisma-favourite.repository";

/**
 * Composition root.
 *
 * This is the single place where concrete implementations are constructed and bound
 * to their interfaces. Pages, components and server actions import only the typed
 * accessors below, so they depend on abstractions (Dependency Inversion) and have no
 * knowledge of Prisma or the HTTP client. To swap an implementation — a fake in a
 * test, a different API — you change one line here and nothing else.
 */
const productRepository: ProductRepository = new DummyJsonProductRepository(
  config.productApiBaseUrl,
);

const favouriteRepository: FavouriteRepository = new PrismaFavouriteRepository();

export function getProductRepository(): ProductRepository {
  return productRepository;
}

export function getFavouriteRepository(): FavouriteRepository {
  return favouriteRepository;
}
