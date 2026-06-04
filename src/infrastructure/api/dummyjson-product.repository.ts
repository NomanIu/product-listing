import type { Product, ProductId, ProductPage } from "@/domain/product";
import type { ProductRepository } from "@/domain/repositories";
import type { ProductDto, ProductListDto } from "./dummyjson.dto";
import { toProduct, toProductSummary } from "./dummyjson.mapper";
import { getJson, HttpError } from "./http-client";

/**
 * {@link ProductRepository} backed by the public dummyjson REST API.
 *
 * The base URL is injected rather than hard-coded so the data source can be pointed
 * at a mock in tests or swapped for a different host via configuration.
 */
export class DummyJsonProductRepository implements ProductRepository {
  constructor(private readonly baseUrl: string) {}

  async list({ limit }: { limit: number }): Promise<ProductPage> {
    // `select` trims the payload to only the fields the domain needs.
    const url = `${this.baseUrl}/products?limit=${limit}&select=id,title,price,category,thumbnail`;
    const dto = await getJson<ProductListDto>(url);

    return {
      items: dto.products.map(toProductSummary),
      total: dto.total,
    };
  }

  async getById(id: ProductId): Promise<Product | null> {
    try {
      const dto = await getJson<ProductDto>(`${this.baseUrl}/products/${id}`);
      return toProduct(dto);
    } catch (error) {
      // A 404 is a normal "not found", not an exceptional failure — map it to null
      // so the route can render a proper not-found page. Re-throw everything else.
      if (error instanceof HttpError && error.status === 404) return null;
      throw error;
    }
  }
}
