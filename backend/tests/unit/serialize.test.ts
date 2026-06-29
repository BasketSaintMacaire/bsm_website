import { describe, it, expect } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'
import { serializeProduct } from '../../src/lib/serialize'

function baseProduct() {
  return {
    id: 1,
    name: 'T-shirt',
    category: 'Vêtements',
    imageFolder: '/gallery/shop/tshirt/',
    description: 'desc',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

describe('serializeProduct', () => {
  it('converts variant prices from Decimal to number', () => {
    const product = {
      ...baseProduct(),
      variants: [
        { id: 1, size: 'M', color: null, price: new Decimal('20.00'), productId: 1 },
        { id: 2, size: 'L', color: null, price: new Decimal('22.50'), productId: 1 },
      ],
      flocking: null,
    }

    const result = serializeProduct(product)

    expect(result.variants[0].price).toBe(20)
    expect(result.variants[1].price).toBe(22.5)
    expect(typeof result.variants[0].price).toBe('number')
  })

  it('converts flocking price from Decimal to number when present', () => {
    const product = {
      ...baseProduct(),
      variants: [],
      flocking: { id: 1, price: new Decimal('4.00'), maxSize: 20, productId: 1 },
    }

    const result = serializeProduct(product)

    expect(result.flocking?.price).toBe(4)
  })

  it('keeps flocking null when the product has none', () => {
    const product = { ...baseProduct(), variants: [], flocking: null }

    const result = serializeProduct(product)

    expect(result.flocking).toBeNull()
  })
})
