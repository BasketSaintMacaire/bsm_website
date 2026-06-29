import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import HomeView from './HomeView.vue'

vi.mock('@/composables/useApiList', () => ({ useApiList: vi.fn() }))
vi.mock('@/components/ImageCarousel.vue', () => ({
  default: { name: 'ImageCarousel', template: '<div />' },
}))

import { useApiList } from '@/composables/useApiList'

const testEvents = [
  { day: '20', month: 'MARS', year: '2025', name: 'C-March-20' },
  { day: '1', month: 'JANVIER', year: '2024', name: 'A-Jan-2024' },
  { day: '5', month: 'MARS', year: '2025', name: 'B-March-5' },
  { day: '10', month: 'JANVIER', year: '2025', name: 'D-Jan-2025' },
]

beforeEach(() => {
  vi.mocked(useApiList).mockReturnValue({
    data: ref(testEvents),
    loading: ref(false),
    error: ref(null),
  })
})

describe('HomeView — sortedEvents', () => {
  it('renders events in chronological order (year → month → day)', () => {
    const wrapper = mount(HomeView, {
      global: { stubs: { RouterLink: true } },
    })

    const names = wrapper
      .findAll('.text-lg.font-semibold')
      .map((el) => el.text())

    expect(names).toEqual(['A-Jan-2024', 'D-Jan-2025', 'B-March-5', 'C-March-20'])
  })

  it('renders nothing in the events grid when the list is empty', () => {
    vi.mocked(useApiList).mockReturnValue({
      data: ref([]),
      loading: ref(false),
      error: ref(null),
    })

    const wrapper = mount(HomeView, {
      global: { stubs: { RouterLink: true } },
    })

    expect(wrapper.findAll('.text-lg.font-semibold')).toHaveLength(0)
  })

  it('renders the scroll-to-top button', () => {
    const wrapper = mount(HomeView, {
      global: { stubs: { RouterLink: true } },
    })
    expect(wrapper.find('button').exists()).toBe(true)
  })
})
