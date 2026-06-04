import type { FavouriteCounts } from "@/domain/favourite";
import type { ProductId } from "@/domain/product";
import type { FavouriteRepository } from "@/domain/repositories";
import { prisma } from "./prisma";

/**
 * Prisma-backed implementation of {@link FavouriteRepository}.
 *
 * This is the only place that knows about the `favourites` table. The rest of the
 * app talks to the `FavouriteRepository` interface, so the storage engine could be
 * replaced (e.g. with a different ORM or a cache) without touching any caller.
 */
export class PrismaFavouriteRepository implements FavouriteRepository {
  async add(productId: ProductId): Promise<void> {
    await prisma.favourite.create({ data: { productId } });
  }

  async countFor(productId: ProductId): Promise<number> {
    return prisma.favourite.count({ where: { productId } });
  }

  async countForMany(productIds: readonly ProductId[]): Promise<FavouriteCounts> {
    if (productIds.length === 0) return new Map();

    // A single GROUP BY round-trip rather than one query per product (no N+1).
    const rows = await prisma.favourite.groupBy({
      by: ["productId"],
      where: { productId: { in: [...productIds] } },
      _count: { _all: true },
    });

    return new Map(rows.map((row) => [row.productId, row._count._all]));
  }
}
