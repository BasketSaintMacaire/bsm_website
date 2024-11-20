<script setup lang="ts">
import { ref, computed } from 'vue'
import { ShoppingCart } from 'lucide-vue-next'

interface ProductVariant {
  size?: string
  color?: string
  price: number
}

interface Product {
  id: number
  name: string
  category: string
  image: string
  description: string
  variants: ProductVariant[]
  isNew?: boolean
  inStock: boolean
}

const showCart = ref(false)
const cart = ref<{ product: Product; variant: ProductVariant; quantity: number }[]>([])

const products = ref<Product[]>([
  {
    id: 1,
    name: 'Doudoune sans manche',
    category: 'Vêtements',
    image: 'https://placehold.co/400x500',
    description: 'Doudoune sans manche avec logo BSM brodé',
    variants: [
      { size: 'S', price: 40.0 },
      { size: 'M', price: 42.5 },
      { size: 'L', price: 45.0 },
    ],
    isNew: true,
    inStock: true,
  },
  {
    id: 2,
    name: 'Veste zippée',
    category: 'Vêtements',
    image: 'https://placehold.co/400x500',
    description: 'Veste zippée à capuche avec logo BSM',
    variants: [
      { size: 'S', price: 31.0 },
      { size: 'M', price: 35.0 },
      { size: 'L', price: 40.0 },
    ],
    inStock: true,
  },
  {
    id: 3,
    name: 'Sac de sport',
    category: 'Sac',
    image: 'https://placehold.co/400x500',
    description: 'Sac de sport',
    variants: [{ size: 'Unique', price: 40.0 }],
    inStock: true,
  },
  {
    id: 4,
    name: 'Sac de sport',
    category: 'Sac',
    image: 'https://placehold.co/400x500',
    description: 'Sac de sport',
    variants: [{ size: 'Unique', price: 40.0 }],
    inStock: true,
  },
  {
    id: 5,
    name: 'Sac de sport',
    category: 'Sac',
    image: 'https://placehold.co/400x500',
    description: 'Sac de sport',
    variants: [{ size: 'Unique', price: 40.0 }],
    inStock: true,
  },
  {
    id: 6,
    name: 'Sac de sport',
    category: 'Sac',
    image: 'https://placehold.co/400x500',
    description: 'Sac de sport',
    variants: [{ size: 'Unique', price: 40.0 }],
    inStock: true,
  },
])

const cartTotal = computed(() => {
  return cart.value.reduce((total, item) => total + item.variant.price * item.quantity, 0)
})

const addToCart = (product: Product, variant: ProductVariant) => {
  const existingItem = cart.value.find(
    (item) => item.product.id === product.id && item.variant.size === variant.size,
  )

  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.value.push({ product, variant, quantity: 1 })
  }
}
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Cart Icon (Fixed position) -->
    <div class="fixed top-4 right-4 z-50">
      <button
        class="relative p-2 bg-[#1A1A1A] hover:bg-gray-700 rounded-full transition-colors"
        @click="showCart = !showCart"
      >
        <ShoppingCart class="w-6 h-6" />
        <span
          v-if="cart.length"
          class="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
        >
          {{ cart.length }}
        </span>
      </button>
    </div>

    <!-- Products Grid -->
    <main class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-[#1A1A1A] rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
        >
          <div class="relative">
            <img :src="product.image" :alt="product.name" class="w-full h-auto object-cover" />
            <span
              v-if="product.isNew"
              class="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-md text-sm"
            >
              Nouveau
            </span>
          </div>

          <div class="p-4">
            <h3 class="text-lg font-semibold">{{ product.name }}</h3>
            <p class="text-gray-400 text-sm mt-1">{{ product.description }}</p>

            <div class="mt-4">
              <p class="text-sm text-gray-400">Prix à partir de</p>
              <p class="text-xl font-bold">
                {{ Math.min(...product.variants.map((v) => v.price)).toFixed(2) }}€
              </p>
            </div>

            <div class="mt-4 space-y-2">
              <select
                v-if="product.variants.length > 1"
                class="block w-full bg-gray-700 border-gray-600 rounded-md text-white px-4 py-2"
              >
                <option
                  v-for="variant in product.variants"
                  :key="variant.size"
                  :value="variant.size"
                >
                  {{ variant.size }} - {{ variant.price.toFixed(2) }}€
                </option>
              </select>

              <button
                class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition-colors"
                @click="addToCart(product, product.variants[0])"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Shopping Cart Sidebar -->
    <div
      v-if="showCart"
      class="fixed inset-0 bg-black bg-opacity-50 z-50"
      @click="showCart = false"
    >
      <div class="absolute right-0 top-0 h-full w-96 bg-gray-800 p-6" @click.stop>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">Panier</h2>
          <button class="text-gray-400 hover:text-white" @click="showCart = false">✕</button>
        </div>

        <div v-if="cart.length === 0" class="text-center text-gray-400 py-8">
          Votre panier est vide
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="item in cart"
            :key="`${item.product.id}-${item.variant.size}`"
            class="flex items-center gap-4 bg-gray-700 p-4 rounded-lg"
          >
            <img
              :src="item.product.image"
              :alt="item.product.name"
              class="w-16 h-16 object-cover rounded"
            />
            <div class="flex-1">
              <h3 class="font-semibold">{{ item.product.name }}</h3>
              <p class="text-sm text-gray-400">Taille: {{ item.variant.size }}</p>
              <div class="flex items-center gap-2 mt-2">
                <button
                  class="text-gray-400 hover:text-white"
                  @click="item.quantity = Math.max(0, item.quantity - 1)"
                >
                  -
                </button>
                <span>{{ item.quantity }}</span>
                <button class="text-gray-400 hover:text-white" @click="item.quantity++">+</button>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold">{{ (item.variant.price * item.quantity).toFixed(2) }}€</p>
            </div>
          </div>

          <div class="border-t border-gray-700 pt-4 mt-4">
            <div class="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{{ cartTotal.toFixed(2) }}€</span>
            </div>
            <button
              class="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md mt-4 transition-colors"
            >
              Passer la commande
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Antonio:wght@400;600;700&display=swap');

body {
  font-family: 'Antonio', sans-serif;
}
</style>
