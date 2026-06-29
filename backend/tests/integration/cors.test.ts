import { describe, it, expect, vi, afterEach } from 'vitest'
import request from 'supertest'

const ORIGINAL_CORS_ORIGINS = process.env.CORS_ORIGINS

describe('createApp CORS configuration', () => {
  afterEach(() => {
    process.env.CORS_ORIGINS = ORIGINAL_CORS_ORIGINS
  })

  it('reflects a configured origin', async () => {
    vi.resetModules()
    process.env.CORS_ORIGINS = 'http://example.com'
    const { createApp } = await import('../../src/app')
    const app = createApp()

    const res = await request(app).get('/api/health').set('Origin', 'http://example.com')

    expect(res.headers['access-control-allow-origin']).toBe('http://example.com')
  })

  it('disables CORS entirely when no origins are configured', async () => {
    vi.resetModules()
    process.env.CORS_ORIGINS = ''
    const { createApp } = await import('../../src/app')
    const app = createApp()

    const res = await request(app).get('/api/health').set('Origin', 'http://example.com')

    expect(res.headers['access-control-allow-origin']).toBeUndefined()
  })
})
