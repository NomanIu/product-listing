import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * A single shared PrismaClient instance.
 *
 * Prisma 7 connects through a driver adapter; `PrismaPg` drives the connection to
 * Postgres (Neon) using the `DATABASE_URL`. Caching the instance on `globalThis`
 * means Next.js hot-reloads in development reuse one connection pool instead of
 * opening a new one on every reload until the database refuses connections.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
