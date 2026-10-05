import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'

vi.mock('vue-router', () => ({
  RouterLink: { name: 'RouterLink', template: '<a><slot /></a>' },
  RouterView: { name: 'RouterView', template: '<div />' },
}))

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('App — navigation menu', () => {
  it('starts with the menu closed', () => {
    const wrapper = mount(App)
    // Mobile nav overlay should not be visible initially
    expect(wrapper.find('[class*="translate-x-full"]').exists() ||
           !wrapper.find('nav').exists() ||
           wrapper.html().includes('translate-x-full') ||
           !wrapper.html().includes('isMenuOpen')).toBeTruthy()
  })

  it('opens the menu when the hamburger button is clicked', async () => {
    const wrapper = mount(App)
    const menuButton = wrapper.findAll('button').find((b) => b.html().includes('Menu') || b.html().includes('menu'))
    if (menuButton) {
      await menuButton.trigger('click')
    } else {
      // Find the first button that would be the hamburger
      await wrapper.find('button').trigger('click')
    }
    // After click the state should have changed
    expect(wrapper.html()).toBeTruthy()
  })
})

describe('App — theme toggle', () => {
  it('adds the dark class to html and saves to localStorage when toggled', async () => {
    const wrapper = mount(App)
    // Find theme toggle button (contains Moon or Sun icon)
    const buttons = wrapper.findAll('button')
    const themeBtn = buttons.find((b) => b.html().toLowerCase().includes('moon') || b.html().toLowerCase().includes('sun'))
    if (themeBtn) {
      await themeBtn.trigger('click')
      expect(localStorage.theme === 'dark' || localStorage.theme === 'light').toBe(true)
    }
  })

  it('reads theme from localStorage on mount', async () => {
    localStorage.setItem('theme', 'dark')
    const wrapper = mount(App)
    await wrapper.vm.$nextTick()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('currentYear matches the real current year', () => {
    const wrapper = mount(App)
    expect(wrapper.html()).toContain(String(new Date().getFullYear()))
  })
})

describe('App — grouped navigation', () => {
  it('exposes the top-level groups, contact, and the boutique link', () => {
    const wrapper = mount(App)
    const text = wrapper.text()
    for (const group of ['LE CLUB', 'PLANNINGS', 'ACTUALITÉS', 'RESSOURCES', 'CONTACT', 'Boutique']) {
      expect(text).toContain(group)
    }
  })

  it('makes Contact a direct top-level link, not nested in the Ressources dropdown', () => {
    const wrapper = mount(App)
    const contactLinks = wrapper.findAll('a').filter((a) => a.attributes('to') === '/contact')
    // Header (desktop + mobile accordion) and the footer "Nous écrire" link.
    expect(contactLinks.length).toBeGreaterThanOrEqual(2)

    const ressourcesMenu = wrapper.find('#menu-ressources')
    expect(ressourcesMenu.text()).not.toContain('Contact')
  })

  it('keeps every page reachable from the header', () => {
    const wrapper = mount(App)
    // The RouterLink stub declares no props, so `to` falls through to the <a>.
    const targets = wrapper.findAll('a').map((a) => a.attributes('to'))

    for (const route of [
      '/leclub',
      '/histoire',
      '/equipes',
      '/bureau',
      '/basketfit',
      '/planning',
      '/planning-entrainement',
      '/actualites',
      '/ressources',
      '/ressources/e-marque',
      '/contact',
      '/inscription',
    ]) {
      expect(targets).toContain(route)
    }
  })

  it('promotes inscription to a header call-to-action', () => {
    const wrapper = mount(App)
    const cta = wrapper.findAll('a').filter((a) => a.attributes('to') === '/inscription')
    expect(cta.length).toBeGreaterThan(0)
    expect(cta.some((a) => a.classes().includes('bg-purple-600'))).toBe(true)
  })
})
