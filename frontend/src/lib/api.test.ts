import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { api } from './api'

function mockFetchOnce(response: Partial<Response> & { ok: boolean }) {
  const fetchMock = vi.fn().mockResolvedValue(response as Response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('api', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('GET resolves with the parsed JSON body', async () => {
    mockFetchOnce({ ok: true, status: 200, json: async () => [{ id: 1 }] })

    const result = await api.get<{ id: number }[]>('/committees')

    expect(result).toEqual([{ id: 1 }])
  })

  it('sends the configured API base, method and JSON body for POST', async () => {
    const fetchMock = mockFetchOnce({ ok: true, status: 201, json: async () => ({ id: 1 }) })

    await api.post('/committees', { name: 'Test' })

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/committees',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Test' }),
      }),
    )
  })

  it('attaches a stored admin token as a Bearer Authorization header', async () => {
    localStorage.setItem('bsm_admin_token', 'fake-token')
    const fetchMock = mockFetchOnce({ ok: true, status: 200, json: async () => ({}) })

    await api.get('/committees')

    const [, options] = fetchMock.mock.calls[0]
    expect((options.headers as Record<string, string>).Authorization).toBe('Bearer fake-token')
  })

  it('does not attach an Authorization header when no token is stored', async () => {
    const fetchMock = mockFetchOnce({ ok: true, status: 200, json: async () => ({}) })

    await api.get('/committees')

    const [, options] = fetchMock.mock.calls[0]
    expect((options.headers as Record<string, string>).Authorization).toBeUndefined()
  })

  it('returns undefined for a 204 No Content response without calling .json()', async () => {
    const json = vi.fn()
    mockFetchOnce({ ok: true, status: 204, json })

    const result = await api.delete('/committees/1')

    expect(result).toBeUndefined()
    expect(json).not.toHaveBeenCalled()
  })

  it('throws with the status and body text when the response is not ok', async () => {
    mockFetchOnce({ ok: false, status: 500, text: async () => 'boom' })

    await expect(api.get('/committees')).rejects.toThrow('API error 500: boom')
  })
})
