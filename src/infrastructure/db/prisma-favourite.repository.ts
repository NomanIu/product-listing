import type { FavouriteCounts } from "@/domain/favourite";
import type { ProductId } from "@/domain/product";
import type {
  FavouriteRepository,
  FavouriteState,
} from "@/domain/repositories";
import { prisma } from "./prisma";

/**
 * Prisma-backed implementation of {@link FavouriteRepository}.
 *
 * This is the only place that knows about the `favourites` table. The rest of the
 * app talks to the `FavouriteRepository` interface, so the storage engine could be
 * replaced (e.g. with a different ORM or a cache) without touching any caller.
 */
export class PrismaFavouriteRepository implements FavouriteRepository {
  async toggle(
    sessionId: string,
    productId: ProductId,
  ): Promise<FavouriteState> {
    const where = { sessionId_productId: { sessionId, productId } };

    // Run the read-then-write atomically so a double-click can't create two rows.
    const favourited = await prisma.$transaction(async (tx) => {
      const existing = await tx.favourite.findUnique({ where });
      if (existing) {
        await tx.favourite.delete({ where });
        return false;
      }
      await tx.favourite.create({ data: { sessionId, productId } });
      return true;
    });

    const count = await this.countFor(productId);
    return { favourited, count };
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

  async isFavourited(sessionId: string, productId: ProductId): Promise<boolean> {
    const row = await prisma.favourite.findUnique({
      where: { sessionId_productId: { sessionId, productId } },
      select: { id: true },
    });
    return row !== null;
  }

  async favouritedAmong(
    sessionId: string,
    productIds: readonly ProductId[],
  ): Promise<ReadonlySet<ProductId>> {
    if (productIds.length === 0) return new Set();

    const rows = await prisma.favourite.findMany({
      where: { sessionId, productId: { in: [...productIds] } },
      select: { productId: true },
    });

    return new Set(rows.map((row) => row.productId));
  }
}
