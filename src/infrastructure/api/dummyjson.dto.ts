/**
 * Data transfer objects: the *raw* JSON shape returned by dummyjson.com.
 *
 * These mirror the upstream payload exactly and never leak past the mapper. Keeping
 * them separate from the domain model means an upstream field rename is a one-line
 * change in the mapper, not a hunt through the UI.
 */

export interface ProductDto {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
}

export interface ProductListDto {
  products: ProductDto[];
  total: number;
  skip: number;
  limit: number;
}
