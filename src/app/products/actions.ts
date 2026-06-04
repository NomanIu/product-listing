"use server";

import { revalidatePath } from "next/cache";
import type { ProductId } from "@/domain/product";
import { getFavouriteRepository } from "@/infrastructure/container";

/** The result returned to the client island so it can update its UI. */
export interface FavouriteResult {
  readonly ok: boolean;
  readonly count: number;
}

/**
 * Server Action: persist a favourite for `productId`, then return the fresh count.
 *
 * Input is validated here because a Server Action is a public HTTP endpoint and must
 * not trust its caller. On success we revalidate the affected routes so any
 * server-rendered count elsewhere reflects the new total.
 */
export async function addFavourite(
  productId: ProductId,
): Promise<FavouriteResult> {
  if (!Number.isInteger(productId) || productId <= 0) {
    return { ok: false, count: 0 };
  }

  const favourites = getFavouriteRepository();
  await favourites.add(productId);
  const count = await favourites.countFor(productId);

  revalidatePath("/products");
  revalidatePath(`/products/${productId}`);

  return { ok: true, count };
}
