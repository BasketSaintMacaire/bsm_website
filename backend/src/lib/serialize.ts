import { Flocking, Product, ProductVariant } from '@prisma/client'

type ProductWithRelations = Product & { variants: ProductVariant[]; flocking: Flocking | null }

export function serializeProduct(product: ProductWithRelations) {
  return {
    ...product,
    variants: product.variants.map((variant) => ({
      ...variant,
      price: variant.price.toNumber(),
    })),
    flocking: product.flocking
      ? { ...product.flocking, price: product.flocking.price.toNumber() }
      : null,
  }
}
