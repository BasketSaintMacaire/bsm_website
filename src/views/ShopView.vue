<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ShoppingCart, ChevronLeft, ChevronRight, X } from 'lucide-vue-next'
import shopItemDataJson from '@/assets/storage_json/products.json'
import emailjs from '@emailjs/browser'
import type { Product, ProductVariant } from '@/models/Product'

interface BillingInfo {
  name: string
  address: string
  phone: string
  email: string
}

const showCart = ref(false)
const showBillingModal = ref(false)
const cart = ref<{ product: Product; variant: ProductVariant; quantity: number }[]>([])
const products = ref<Product[]>(shopItemDataJson as Product[])
const productImages = ref<{ [key: number]: string[] }>({})
const currentImageIndex = ref<{ [key: number]: number }>({})
const loading = ref(true)
const error = ref<string | null>(null)
const billingInfo = ref<BillingInfo>({
  name: '',
  address: '',
  phone: '',
  email: '',
})

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

const getProductImages = async (product: Product) => {
  try {
    const response = await fetch('/gallery-images.json')
    const allImages: string[] = await response.json()
    return allImages.filter((path) => path.includes(product.imageFolder))
  } catch (err) {
    console.error('Error fetching product images:', err)
    error.value = 'Failed to load product images. Please try again later.'
    return []
  }
}

const loadProductImages = async () => {
  loading.value = true
  error.value = null
  try {
    for (const product of products.value) {
      productImages.value[product.id] = await getProductImages(product)
      currentImageIndex.value[product.id] = 0
    }
  } catch (err) {
    console.error('Error loading product images:', err)
    error.value = 'Failed to load product images. Please try again later.'
  } finally {
    loading.value = false
  }
}

const nextImage = (productId: number) => {
  const images = productImages.value[productId]
  if (images && images.length > 0) {
    currentImageIndex.value[productId] = (currentImageIndex.value[productId] + 1) % images.length
  }
}

const prevImage = (productId: number) => {
  const images = productImages.value[productId]
  if (images && images.length > 0) {
    currentImageIndex.value[productId] =
      (currentImageIndex.value[productId] - 1 + images.length) % images.length
  }
}

onMounted(() => {
  loadProductImages()
})

function generateItemsTable() {
  let rows = ''
  cart.value.forEach((item) => {
    rows += `
      <tr>
        <td>${item.product.name}</td>
        <td>${item.quantity}</td>
        <td>${(item.variant.price * item.quantity).toFixed(2)}€</td>
      </tr>
    `
  })
  return rows
}

async function handleOrder() {
  try {
    const itemsHtml = generateItemsTable()
    const orderNumber = 'BSM-' + Date.now().toString().slice(-6)
    const orderDate = new Date().toLocaleDateString('fr-FR')
    const subTotalValue = cartTotal.value.toFixed(2) + '€'
    const totalValue = cartTotal.value.toFixed(2) + '€'

    const clientTemplateParams = {
      orderNumber,
      orderDate,
      itemsTable: itemsHtml,
      subTotal: subTotalValue,
      total: totalValue,
      billingName: billingInfo.value.name,
      billingAddress: billingInfo.value.address,
      billingPhone: billingInfo.value.phone,
      billingEmail: billingInfo.value.email,
      recipientEmail: billingInfo.value.email,
    }

    const clientResponse = await emailjs.send(
      'website_service',
      'template_bon_de_commande',
      clientTemplateParams,
      'AcTLkGWdcMa1-WcWM',
    )
    console.log('Client email sent:', clientResponse.status, clientResponse.text)

    const adminTemplateParams = {
      orderNumber,
      orderDate,
      itemsTable: itemsHtml,
      subTotal: subTotalValue,
      total: totalValue,
      billingName: billingInfo.value.name,
      billingAddress: billingInfo.value.address,
      billingPhone: billingInfo.value.phone,
      billingEmail: billingInfo.value.email,
      recipientEmail: 'boutique@bsmbasket.fr',
    }

    const adminResponse = await emailjs.send(
      'website_service',
      'template_bon_de_commande',
      adminTemplateParams,
      'AcTLkGWdcMa1-WcWM',
    )
    console.log('Admin email sent:', adminResponse.status, adminResponse.text)

    cart.value = []
    alert('Commande envoyée avec succès !')
    showBillingModal.value = false
    showCart.value = false
  } catch (error) {
    console.error('Error sending order email:', error)
    alert("Erreur lors de l'envoi de la commande. Veuillez réessayer.")
  }
}

function decrementItem(item: { product: Product; variant: ProductVariant; quantity: number }) {
  if (item.quantity > 1) {
    item.quantity--
  } else {
    // Remove item if quantity is 1 and user decrements
    cart.value = cart.value.filter((cartItem) => cartItem !== item)
  }
}

const openBillingModal = () => {
  showBillingModal.value = true
}

const closeBillingModal = () => {
  showBillingModal.value = false
}
</script>

<template>
  <!-- Main container uses theme tokens for background/text -->
  <div class="min-h-screen bg-page text-mainText dark:bg-page-dark dark:text-mainText-dark">
    <!-- Cart Icon -->
    <div class="fixed top-4 right-4 z-50">
      <button
        class="relative p-2 bg-card hover:bg-gray-200 rounded-full transition-colors dark:bg-card-dark dark:hover:bg-gray-700"
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
      <div v-if="loading" class="text-center py-8">
        <p class="text-xl">Loading products...</p>
      </div>
      <div v-else-if="error" class="text-center py-8">
        <p class="text-xl text-red-500">{{ error }}</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="rounded-lg overflow-hidden shadow-lg transition-transform md:hover:scale-105 bg-card dark:bg-card-dark"
        >
          <div class="relative">
            <img
              v-if="productImages[product.id] && productImages[product.id].length > 0"
              :src="productImages[product.id][currentImageIndex[product.id]]"
              :alt="product.name"
              class="w-full h-[500px] object-cover"
            />
            <div
              v-else
              class="w-full h-[600px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
            >
              <p class="text-mutedText dark:text-mutedText-dark">No image available</p>
            </div>

            <!-- Carousel Controls -->
            <button
              v-if="productImages[product.id] && productImages[product.id].length > 1"
              @click="prevImage(product.id)"
              class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1 dark:bg-white dark:bg-opacity-50"
            >
              <ChevronLeft class="w-6 h-6" />
            </button>
            <button
              v-if="productImages[product.id] && productImages[product.id].length > 1"
              @click="nextImage(product.id)"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1 dark:bg-white dark:bg-opacity-50"
            >
              <ChevronRight class="w-6 h-6" />
            </button>
          </div>

          <!-- Product Info -->
          <div class="p-4">
            <h3 class="text-lg font-semibold">{{ product.name }}</h3>
            <p class="text-mutedText dark:text-mutedText-dark text-sm mt-1">
              {{ product.description }}
            </p>

            <div class="mt-4">
              <p class="text-sm text-mutedText dark:text-mutedText-dark">Prix à partir de</p>
              <p class="text-xl font-bold">
                {{ Math.min(...product.variants.map((v) => v.price)).toFixed(2) }}€
              </p>
            </div>

            <div class="mt-4 space-y-2">
              <!-- Variation Select -->
              <select
                v-if="product.variants.length > 1"
                class="block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md text-mainText dark:text-mainText-dark px-4 py-2"
              >
                <option
                  v-for="variant in product.variants"
                  :key="variant.size"
                  :value="variant.size"
                >
                  {{ variant.color ? variant.color + ' - ' : '' }}{{ variant.size }} -
                  {{ variant.price.toFixed(2) }}€
                </option>
              </select>

              <!-- Add to Cart -->
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
      class="fixed inset-0 bg-black bg-opacity-50 dark:bg-white dark:bg-opacity-20 z-50"
      @click="showCart = false"
    >
      <div
        class="absolute right-0 top-0 h-full w-96 bg-card dark:bg-card-dark flex flex-col"
        @click.stop
      >
        <!-- Cart Header -->
        <div class="p-6 border-b border-borderColor dark:border-borderColor-dark">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">Panier</h2>
            <button
              class="text-mutedText dark:text-mutedText-dark hover:text-mainText dark:hover:text-mainText-dark"
              @click="showCart = false"
            >
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>

        <!-- Cart Items (Scrollable) -->
        <div class="flex-grow overflow-y-auto p-6">
          <div
            v-if="cart.length === 0"
            class="text-center text-mutedText dark:text-mutedText-dark py-8"
          >
            Votre panier est vide
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="item in cart"
              :key="`${item.product.id}-${item.variant.size}`"
              class="flex items-center gap-4 p-4 rounded-lg bg-gray-200 dark:bg-gray-700"
            >
              <img
                v-if="productImages[item.product.id] && productImages[item.product.id].length > 0"
                :src="productImages[item.product.id][0]"
                :alt="item.product.name"
                class="w-16 h-16 object-cover rounded"
              />
              <div class="flex-1">
                <h3 class="font-semibold">{{ item.product.name }}</h3>
                <p class="text-sm text-mutedText dark:text-mutedText-dark">
                  Taille: {{ item.variant.size }}
                </p>
                <div class="flex items-center gap-2 mt-2">
                  <button
                    class="text-mutedText dark:text-mutedText-dark hover:text-mainText dark:hover:text-mainText-dark"
                    @click="decrementItem(item)"
                  >
                    -
                  </button>
                  <span>{{ item.quantity }}</span>
                  <button
                    class="text-mutedText dark:text-mutedText-dark hover:text-mainText dark:hover:text-mainText-dark"
                    @click="item.quantity++"
                  >
                    +
                  </button>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold">{{ (item.variant.price * item.quantity).toFixed(2) }}€</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Footer -->
        <div
          class="p-6 border-t border-borderColor dark:border-borderColor-dark bg-card dark:bg-card-dark"
        >
          <div class="flex justify-between text-lg font-bold mb-4">
            <span>Total</span>
            <span>{{ cartTotal.toFixed(2) }}€</span>
          </div>
          <button
            class="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md transition-colors"
            @click="openBillingModal"
          >
            Passer la commande
          </button>
        </div>
      </div>
    </div>

    <!-- Billing Modal -->
    <div
      v-if="showBillingModal"
      class="fixed inset-0 bg-black bg-opacity-75 dark:bg-white dark:bg-opacity-10 flex items-center justify-center z-50"
    >
      <div class="bg-card dark:bg-card-dark p-8 rounded-lg max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4">Informations de facturation</h2>
        <form @submit.prevent="handleOrder" class="space-y-4">
          <!-- Name -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-mutedText dark:text-mutedText-dark"
            >
              Nom
            </label>
            <input
              type="text"
              id="name"
              v-model="billingInfo.name"
              required
              class="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-mainText dark:text-mainText-dark focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
            />
          </div>
          <!-- Address -->
          <div>
            <label
              for="address"
              class="block text-sm font-medium text-mutedText dark:text-mutedText-dark"
            >
              Adresse
            </label>
            <input
              type="text"
              id="address"
              v-model="billingInfo.address"
              required
              class="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-mainText dark:text-mainText-dark focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
            />
          </div>
          <!-- Phone -->
          <div>
            <label
              for="phone"
              class="block text-sm font-medium text-mutedText dark:text-mutedText-dark"
            >
              Téléphone
            </label>
            <input
              type="tel"
              id="phone"
              v-model="billingInfo.phone"
              required
              class="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-mainText dark:text-mainText-dark focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
            />
          </div>
          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-mutedText dark:text-mutedText-dark"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              v-model="billingInfo.email"
              required
              class="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-mainText dark:text-mainText-dark focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
            />
          </div>

          <!-- Order Summary -->
          <div class="mt-6">
            <h3 class="text-lg font-semibold mb-2">Résumé de la commande</h3>
            <div class="space-y-2">
              <div
                v-for="item in cart"
                :key="`${item.product.id}-${item.variant.size}`"
                class="flex justify-between"
              >
                <span>{{ item.product.name }} ({{ item.variant.size }}) x {{ item.quantity }}</span>
                <span>{{ (item.variant.price * item.quantity).toFixed(2) }}€</span>
              </div>
              <div
                class="flex justify-between border-t border-borderColor dark:border-borderColor-dark pt-2 font-bold"
              >
                <span>Total</span>
                <span>{{ cartTotal.toFixed(2) }}€</span>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              @click="closeBillingModal"
              class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-mainText dark:text-mainText-dark rounded-md hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Confirmer la commande
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Any local overrides if needed */
</style>
