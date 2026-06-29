import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import NewsView from './NewsView.vue'

vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    to: vi.fn().mockReturnValue({ kill: vi.fn() }),
    from: vi.fn(),
    utils: { toArray: vi.fn().mockReturnValue([]) },
  },
}))
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: class ScrollTrigger {} }))
vi.mock('@/composables/useApiList', () => ({ useApiList: vi.fn() }))

import { useApiList } from '@/composables/useApiList'

const sampleArticles = [
  {
    id: 1,
    title: 'Article récent',
    excerpt: 'Résumé A',
    content: 'Contenu A',
    date: '2025-06-01',
    image: '/img-a.jpg',
    category: 'Sport',
  },
  {
    id: 2,
    title: 'Article ancien',
    excerpt: 'Résumé B',
    content: 'Contenu B',
    date: '2024-01-10',
    image: '/img-b.jpg',
    category: 'Club',
  },
]

beforeEach(() => {
  vi.mocked(useApiList).mockReturnValue({
    data: ref(sampleArticles),
    loading: ref(false),
    error: ref(null),
  })
})

describe('NewsView', () => {
  it('renders all articles as cards', async () => {
    const wrapper = mount(NewsView)
    await flushPromises()
    expect(wrapper.findAll('article')).toHaveLength(2)
  })

  it('displays articles sorted newest first', async () => {
    const wrapper = mount(NewsView)
    await flushPromises()
    const titles = wrapper.findAll('h2').map((h) => h.text())
    expect(titles[0]).toBe('Article récent')
    expect(titles[1]).toBe('Article ancien')
  })

  it('opens the modal when an article card is clicked', async () => {
    const wrapper = mount(NewsView)
    await flushPromises()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    await wrapper.find('article').trigger('click')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    expect(wrapper.find('#modal-title').text()).toBe('Article récent')
  })

  it('closes the modal when the close button is clicked', async () => {
    const wrapper = mount(NewsView)
    await flushPromises()
    await wrapper.find('article').trigger('click')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    await wrapper.find('button[aria-label="Close"]').trigger('click')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('closes the modal when the backdrop is clicked', async () => {
    const wrapper = mount(NewsView)
    await flushPromises()
    await wrapper.find('article').trigger('click')
    await wrapper.find('[aria-hidden="true"]').trigger('click')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('formats dates in French locale', async () => {
    const wrapper = mount(NewsView)
    await flushPromises()
    await wrapper.find('article').trigger('click')
    const expected = new Date('2025-06-01').toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    expect(wrapper.find('[role="dialog"]').text()).toContain(expected)
  })
})
