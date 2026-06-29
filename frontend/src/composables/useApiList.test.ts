import { describe, it, expect, vi, afterEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { useApiList } from './useApiList'
import { api } from '@/lib/api'

vi.mock('@/lib/api', () => ({ api: { get: vi.fn() } }))

function mountComposable<T>(path: string) {
  let result!: ReturnType<typeof useApiList<T>>
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useApiList<T>(path)
        return () => h('div')
      },
    }),
  )
  return { wrapper, result }
}

describe('useApiList', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('starts with an empty array and loading=true', () => {
    vi.mocked(api.get).mockReturnValue(new Promise(() => {}))

    const { result } = mountComposable('/news')

    expect(result.data.value).toEqual([])
    expect(result.loading.value).toBe(true)
    expect(result.error.value).toBeNull()
  })

  it('populates data and clears loading on success', async () => {
    vi.mocked(api.get).mockResolvedValue([{ id: 1 }])

    const { result } = mountComposable('/news')
    await flushPromises()

    expect(api.get).toHaveBeenCalledWith('/news')
    expect(result.data.value).toEqual([{ id: 1 }])
    expect(result.loading.value).toBe(false)
    expect(result.error.value).toBeNull()
  })

  it('captures an error message and clears loading on failure', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('network down'))

    const { result } = mountComposable('/news')
    await flushPromises()

    expect(result.data.value).toEqual([])
    expect(result.loading.value).toBe(false)
    expect(result.error.value).toBe('network down')
  })
})
