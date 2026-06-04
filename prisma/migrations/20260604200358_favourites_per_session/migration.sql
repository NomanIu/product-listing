-- AlterTable: add the anonymous visitor id to each favourite row.
ALTER TABLE "favourites" ADD COLUMN "session_id" TEXT NOT NULL;

-- CreateIndex: one favourite per (visitor, product) — makes toggling idempotent.
CREATE UNIQUE INDEX "favourites_session_id_product_id_key" ON "favourites"("session_id", "product_id");
