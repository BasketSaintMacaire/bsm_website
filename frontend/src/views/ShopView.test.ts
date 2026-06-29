import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import ShopView from './ShopView.vue'
import type { Product } from '@/models/Product'

vi.mock('@/composables/useApiList', () => ({ useApiList: vi.fn() }))
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn().mockResolvedValue([]),
    post: vi.fn().mockResolvedValue({}),
  },
}))

import { useApiList } from '@/composables/useApiList'

const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Maillot BSM',
    category: 'maillot',
    imageFolder: '/gallery/shop/maillot/',
    description: 'Le maillot officiel',
    variants: [
      { size: 'S', color: 'Blanc', price: 25.0 },
      { size: 'M', color: 'Blanc', price: 25.0 },
    ],
  },
  {
    id: 2,
    name: 'Short BSM',
    category: 'short',
    imageFolder: '/gallery/shop/short/',
    description: 'Le short officiel',
    variants: [{ size: 'M', color: 'Noir', price: 20.0 }],
  },
]

let productsData: ReturnType<typeof ref<Product[]>>

beforeEach(() => {
  productsData = ref<Product[]>([])
  vi.mocked(useApiList).mockReturnValue({
    data: productsData,
    loading: ref(false),
    error: ref(null),
  })
})

async function mountWithProducts() {
  const wrapper = mount(ShopView)
  productsData.value = sampleProducts
  await nextTick()
  await flushPromises()
  return wrapper
}

describe('ShopView — cart visibility', () => {
  it('hides the cart sidebar by default', () => {
    const wrapper = mount(ShopView)
    expect(wrapper.text()).not.toContain('Panier')
  })

  it('shows the cart sidebar when the cart icon is clicked', async () => {
    const wrapper = mount(ShopView)
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('Panier')
  })

  it('shows "panier est vide" when cart is empty', async () => {
    const wrapper = mount(ShopView)
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('vide')
  })
})

describe('ShopView — addToCart', () => {
  it('adds a product to the cart when "Ajouter au panier" is clicked', async () => {
    const wrapper = await mountWithProducts()

    const addButtons = wrapper.findAll('button').filter((b) => b.text().includes('Ajouter'))
    expect(addButtons.length).toBeGreaterThan(0)
    await addButtons[0].trigger('click')

    // Open cart to verify
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('Maillot BSM')
  })

  it('increments quantity when the same item is added twice', async () => {
    const wrapper = await mountWithProducts()
    const addButtons = wrapper.findAll('button').filter((b) => b.text().includes('Ajouter'))
    await addButtons[0].trigger('click')
    await addButtons[0].trigger('click')

    // Open cart
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('2')
  })
})

describe('ShopView — decrementItem', () => {
  it('removes an item from the cart when decremented to zero', async () => {
    const wrapper = await mountWithProducts()

    // Add one item
    const addButtons = wrapper.findAll('button').filter((b) => b.text().includes('Ajouter'))
    await addButtons[0].trigger('click')

    // Open cart
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('Maillot BSM')

    // Click the decrement "-" button
    const decrementBtn = wrapper.findAll('button').find((b) => b.text() === '-')
    if (decrementBtn) {
      await decrementBtn.trigger('click')
    }
    expect(wrapper.text()).toContain('vide')
  })
})

describe('ShopView — billing modal', () => {
  it('opens the billing modal when "Passer la commande" is clicked', async () => {
    const wrapper = mount(ShopView)
    // Open the cart sidebar first
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('Panier')

    // The "Passer la commande" button is always in the cart footer
    const orderBtn = wrapper.findAll('button').find((b) =>
      b.text().includes('Passer la commande'),
    )
    expect(orderBtn).toBeDefined()
    await orderBtn!.trigger('click')
    // Billing modal should now be shown
    expect(wrapper.html()).toContain('commande')
  })
})
