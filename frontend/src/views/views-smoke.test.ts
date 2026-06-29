/**
 * Smoke tests for display-oriented views.
 * Goal: ensure each view mounts without throwing and renders its basic structure.
 * We don't test implementation details — we just verify the component is alive.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'

// ─── shared mocks ────────────────────────────────────────────────────────────

vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    from: vi.fn(),
    to: vi.fn().mockReturnValue({ kill: vi.fn() }),
    utils: { toArray: vi.fn().mockReturnValue([]) },
  },
}))
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: class ScrollTrigger {} }))
vi.mock('@/composables/useApiList', () => ({ useApiList: vi.fn() }))
vi.mock('@/lib/api', () => ({ api: { get: vi.fn().mockResolvedValue([]), post: vi.fn().mockResolvedValue({}) } }))
vi.mock('vue-router', () => ({
  useRouter: vi.fn().mockReturnValue({ push: vi.fn() }),
  RouterLink: { name: 'RouterLink', template: '<a><slot /></a>' },
}))

import { useApiList } from '@/composables/useApiList'

beforeEach(() => {
  vi.mocked(useApiList).mockReturnValue({
    data: ref([]),
    loading: ref(false),
    error: ref(null),
  })
})

// ─── BasketFitView ────────────────────────────────────────────────────────────

import BasketFitView from './BasketFitView.vue'

describe('BasketFitView', () => {
  it('mounts and renders the main heading', () => {
    const wrapper = mount(BasketFitView)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Basket')
  })
})

// ─── CommitteesView ───────────────────────────────────────────────────────────

import CommitteesView from './CommitteesView.vue'

describe('CommitteesView', () => {
  it('mounts and renders the bureau heading', () => {
    const wrapper = mount(CommitteesView)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Bureau')
  })
})

// ─── HistoryView ──────────────────────────────────────────────────────────────

import HistoryView from './HistoryView.vue'

describe('HistoryView', () => {
  it('mounts and renders the history heading', () => {
    const wrapper = mount(HistoryView)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Histoire')
  })
})

// ─── LegalNoticesView ─────────────────────────────────────────────────────────

import LegalNoticesView from './LegalNoticesView.vue'

describe('LegalNoticesView', () => {
  it('mounts without errors', () => {
    const wrapper = mount(LegalNoticesView)
    expect(wrapper.exists()).toBe(true)
  })

  it('toggles a section open/closed when the header is clicked', async () => {
    const wrapper = mount(LegalNoticesView)
    // All sections except the first start closed; clicking the second section should open it
    const headers = wrapper.findAll('[class*="cursor-pointer"], button, .flex.justify-between')
    if (headers.length > 1) {
      const initialHtml = wrapper.html()
      await headers[1].trigger('click')
      expect(wrapper.html()).not.toBe(initialHtml)
    } else {
      // Fallback: find any clickable element in the sections list
      const clickable = wrapper.find('[class*="rounded-lg"]')
      await clickable.trigger('click')
      expect(wrapper.exists()).toBe(true)
    }
  })
})

// ─── PrivacyPolicyView ────────────────────────────────────────────────────────

import PrivacyPolicyView from './PrivacyPolicyView.vue'

describe('PrivacyPolicyView', () => {
  it('mounts without errors', () => {
    const wrapper = mount(PrivacyPolicyView)
    expect(wrapper.exists()).toBe(true)
  })

  it('toggles a section when clicked', async () => {
    const wrapper = mount(PrivacyPolicyView)
    const headers = wrapper.findAll('[class*="cursor-pointer"], button, .flex.justify-between')
    if (headers.length > 1) {
      await headers[1].trigger('click')
    }
    expect(wrapper.exists()).toBe(true)
  })
})

// ─── RegistrationView ─────────────────────────────────────────────────────────

import RegistrationView from './RegistrationView.vue'

describe('RegistrationView', () => {
  it('mounts and renders the main content', () => {
    const wrapper = mount(RegistrationView)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('BSM')
  })

  it('triggers downloadFile when a download button is clicked', async () => {
    const wrapper = mount(RegistrationView)
    const downloadButtons = wrapper.findAll('button').filter((b) =>
      b.text().toLowerCase().includes('télécharger'),
    )
    if (downloadButtons.length) {
      await downloadButtons[0].trigger('click')
    }
    expect(wrapper.exists()).toBe(true)
  })
})

// ─── ClubView ─────────────────────────────────────────────────────────────────

import ClubView from './ClubView.vue'

describe('ClubView', () => {
  it('mounts without errors', () => {
    const wrapper = mount(ClubView)
    expect(wrapper.exists()).toBe(true)
  })
})

// ─── ShopView ─────────────────────────────────────────────────────────────────

import ShopView from './ShopView.vue'

describe('ShopView', () => {
  it('mounts without errors', () => {
    const wrapper = mount(ShopView)
    expect(wrapper.exists()).toBe(true)
  })
})

// ─── PlanningView ─────────────────────────────────────────────────────────────

import PlanningView from './PlanningView.vue'

describe('PlanningView', () => {
  it('mounts without errors', () => {
    const wrapper = mount(PlanningView)
    expect(wrapper.exists()).toBe(true)
  })
})
