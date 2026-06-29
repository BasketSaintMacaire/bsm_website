import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ImageCarousel from './ImageCarousel.vue'

vi.mock('@/lib/api', () => ({ api: { get: vi.fn() } }))

import { api } from '@/lib/api'

const defaultProps = {
  galleryName: 'partner_light',
  itemWidth: 200,
  itemHeight: 200,
  zoomed: false,
}

afterEach(() => vi.clearAllMocks())

describe('ImageCarousel', () => {
  it('fetches gallery images from the API on mount', async () => {
    vi.mocked(api.get).mockResolvedValue([])
    mount(ImageCarousel, { props: defaultProps })
    await flushPromises()
    expect(api.get).toHaveBeenCalledWith('/gallery-images')
  })

  it('displays only images belonging to the configured gallery', async () => {
    vi.mocked(api.get).mockResolvedValue([
      '/gallery/partner_light/logo-a.webp',
      '/gallery/other/logo-b.webp',
      '/gallery/partner_light/logo-c.webp',
    ])
    const wrapper = mount(ImageCarousel, { props: defaultProps })
    await flushPromises()
    const imgs = wrapper.findAll('img')
    expect(imgs).toHaveLength(2)
    expect(imgs[0].attributes('src')).toBe('/gallery/partner_light/logo-a.webp')
    expect(imgs[1].attributes('src')).toBe('/gallery/partner_light/logo-c.webp')
  })

  it('renders no images when the API returns an empty list', async () => {
    vi.mocked(api.get).mockResolvedValue([])
    const wrapper = mount(ImageCarousel, { props: defaultProps })
    await flushPromises()
    expect(wrapper.findAll('img')).toHaveLength(0)
  })

  it('renders no images when the API call fails', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('network error'))
    const wrapper = mount(ImageCarousel, { props: defaultProps })
    await flushPromises()
    expect(wrapper.findAll('img')).toHaveLength(0)
  })

  it('reloads images when the galleryName prop changes', async () => {
    vi.mocked(api.get).mockResolvedValue([])
    const wrapper = mount(ImageCarousel, { props: defaultProps })
    await flushPromises()
    expect(api.get).toHaveBeenCalledTimes(1)

    await wrapper.setProps({ galleryName: 'partner_dark' })
    await flushPromises()
    expect(api.get).toHaveBeenCalledTimes(2)
  })

  it('applies object-contain class when zoomed is false', async () => {
    vi.mocked(api.get).mockResolvedValue(['/gallery/partner_light/img.webp'])
    const wrapper = mount(ImageCarousel, { props: defaultProps })
    await flushPromises()
    expect(wrapper.find('img').classes()).toContain('object-contain')
  })

  it('applies object-cover class when zoomed is true', async () => {
    vi.mocked(api.get).mockResolvedValue(['/gallery/partner_light/img.webp'])
    const wrapper = mount(ImageCarousel, { props: { ...defaultProps, zoomed: true } })
    await flushPromises()
    expect(wrapper.find('img').classes()).toContain('object-cover')
  })
})
