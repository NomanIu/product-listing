import type { Product, ProductImage, ProductSummary } from "@/domain/product";
import type { ProductDto } from "./dummyjson.dto";

/**
 * Translates upstream DTOs into domain entities (anti-corruption layer).
 *
 * dummyjson does not return image dimensions, but `next/image` needs intrinsic
 * width/height to reserve space and avoid layout shift (CLS). dummyjson product
 * renders are square, so we declare a square intrinsic size; the rendered box keeps
 * this aspect ratio regardless of display size, which is what prevents the shift.
 */
const INTRINSIC_IMAGE_SIZE = 500;

function toImage(url: string): ProductImage {
  return { url, width: INTRINSIC_IMAGE_SIZE, height: INTRINSIC_IMAGE_SIZE };
}

export function toProductSummary(dto: ProductDto): ProductSummary {
  return {
    id: dto.id,
    title: dto.title,
    price: dto.price,
    category: dto.category,
    thumbnail: toImage(dto.thumbnail),
  };
}

export function toProduct(dto: ProductDto): Product {
  return {
    ...toProductSummary(dto),
    description: dto.description,
    brand: dto.brand ?? null,
    rating: dto.rating,
    stock: dto.stock,
    images: dto.images.map(toImage),
  };
}
