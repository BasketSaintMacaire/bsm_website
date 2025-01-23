export interface Product {
  id: number
  name: string
  category: string
  imageFolder: string
  description: string
  variants: ProductVariant[]
  flocking?: Flocking
}

export interface ProductVariant {
  size?: string
  color?: string
  price: number
}

export interface Flocking {
  price: number
  maxSize: number
}
