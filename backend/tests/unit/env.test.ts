import { describe, it, expect, vi, afterEach } from 'vitest'

// Without this, `import 'dotenv/config'` inside src/env.ts would reload
// backend/.env on disk and silently refill whatever we delete below.
vi.mock('dotenv/config', () => ({}))

const ORIGINAL_ENV = { ...process.env }

describe('env', () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  it('throws when a required variable is missing', async () => {
    vi.resetModules()
    delete process.env.ADMIN_PASSWORD_HASH
    await expect(import('../../src/env')).rejects.toThrow(/ADMIN_PASSWORD_HASH/)
  })

  it('parses a comma-separated CORS_ORIGINS list, trimming whitespace', async () => {
    vi.resetModules()
    process.env.CORS_ORIGINS = 'http://a.com, http://b.com'
    const { env } = await import('../../src/env')
    expect(env.CORS_ORIGINS).toEqual(['http://a.com', 'http://b.com'])
  })

  it('defaults CORS_ORIGINS to an empty array when unset', async () => {
    vi.resetModules()
    delete process.env.CORS_ORIGINS
    const { env } = await import('../../src/env')
    expect(env.CORS_ORIGINS).toEqual([])
  })

  it('throws when EMAILJS_SERVICE_ID is missing', async () => {
    vi.resetModules()
    delete process.env.EMAILJS_SERVICE_ID
    await expect(import('../../src/env')).rejects.toThrow(/EMAILJS_SERVICE_ID/)
  })
})
