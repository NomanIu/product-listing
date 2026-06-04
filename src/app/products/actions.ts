"use server";

import { revalidatePath } from "next/cache";
import type { ProductId } from "@/domain/product";
import { getFavouriteRepository } from "@/infrastructure/container";
import { getOrCreateSessionId } from "@/lib/session";

/** The result returned to the client island so it can update its UI. */
export interface ToggleFavouriteResult {
  readonly ok: boolean;
  /** Whether this visitor now has the product favourited. */
  readonly favourited: boolean;
  /** The product's total favourite count after the toggle. */
  readonly count: number;
}

/**
 * Server Action: toggle the current visitor's favourite for `productId`.
 *
 * Input is validated here because a Server Action is a public HTTP endpoint and must
 * not trust its caller. The visitor is identified by an anonymous session cookie, so
 * clicking adds the favourite and clicking again removes it (idempotent per visitor).
 * The affected routes are revalidated so server-rendered counts stay in sync.
 */
export async function toggleFavourite(
  productId: ProductId,
): Promise<ToggleFavouriteResult> {
  if (!Number.isInteger(productId) || productId <= 0) {
    return { ok: false, favourited: false, count: 0 };
  }

  const sessionId = await getOrCreateSessionId();
  const { favourited, count } = await getFavouriteRepository().toggle(
    sessionId,
    productId,
  );

  revalidatePath("/products");
  revalidatePath(`/products/${productId}`);

  return { ok: true, favourited, count };
}
