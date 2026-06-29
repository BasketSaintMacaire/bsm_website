import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LazyImage from './LazyImage.vue'

let observerCallback: IntersectionObserverCallback

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn().mockImplementation(function (cb: IntersectionObserverCallback) {
      observerCallback = cb
      return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() }
    }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function triggerIntersection(isIntersecting: boolean) {
  observerCallback(
    [{ isIntersecting } as IntersectionObserverEntry],
    {} as IntersectionObserver,
  )
}

describe('LazyImage', () => {
  it('renders no <img> before the element enters the viewport', () => {
    const wrapper = mount(LazyImage, { props: { src: '/img.jpg', alt: 'test' } })
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('sets the image src when the sentinel enters the viewport', async () => {
    const wrapper = mount(LazyImage, { props: { src: '/img.jpg', alt: 'test' } })
    triggerIntersection(true)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).toBe('/img.jpg')
  })

  it('does not set the src for non-intersecting entries', async () => {
    const wrapper = mount(LazyImage, { props: { src: '/img.jpg', alt: 'test' } })
    triggerIntersection(false)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('shows the loading skeleton while the image has not loaded yet', async () => {
    const wrapper = mount(LazyImage, { props: { src: '/img.jpg', alt: 'test' } })
    triggerIntersection(true)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.animate-pulse').exists()).toBe(true)
    expect(wrapper.find('img').classes()).toContain('opacity-0')
  })

  it('hides the skeleton and makes the image visible after the load event', async () => {
    const wrapper = mount(LazyImage, { props: { src: '/img.jpg', alt: 'test' } })
    triggerIntersection(true)
    await wrapper.vm.$nextTick()
    await wrapper.find('img').trigger('load')
    expect(wrapper.find('.animate-pulse').exists()).toBe(false)
    expect(wrapper.find('img').classes()).toContain('opacity-100')
  })

  it('removes the image and shows the error message on load failure', async () => {
    const wrapper = mount(LazyImage, { props: { src: '/img.jpg', alt: 'test' } })
    triggerIntersection(true)
    await wrapper.vm.$nextTick()
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('Image unavailable')
  })

  it('emits an error event when the image fails to load', async () => {
    const wrapper = mount(LazyImage, { props: { src: '/img.jpg', alt: 'test' } })
    triggerIntersection(true)
    await wrapper.vm.$nextTick()
    await wrapper.find('img').trigger('error')
    expect(wrapper.emitted('error')).toHaveLength(1)
  })

  it('forwards width and height props to the wrapper element', () => {
    const wrapper = mount(LazyImage, {
      props: { src: '/img.jpg', alt: 'test', width: '300px', height: '200px' },
    })
    const style = (wrapper.element as HTMLElement).style
    expect(style.width).toBe('300px')
    expect(style.height).toBe('200px')
  })
})
