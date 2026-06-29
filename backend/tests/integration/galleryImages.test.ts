import { describe, it, expect, vi } from 'vitest'
import { Readable } from 'stream'
import request from 'supertest'

const { listObjectsV2 } = vi.hoisted(() => ({ listObjectsV2: vi.fn() }))

vi.mock('../../src/minio', () => ({
  minioClient: { listObjectsV2 },
}))

import { app } from '../helpers'

describe('GET /api/gallery-images', () => {
  it('returns object keys as leading-slash paths', async () => {
    listObjectsV2.mockReturnValue(
      Readable.from(
        [{ name: 'gallery/news/a.webp' }, { name: 'gallery/team_men/2024-2025/SG1.webp' }],
        { objectMode: true },
      ),
    )

    const res = await request(app).get('/api/gallery-images')

    expect(res.status).toBe(200)
    expect(res.body).toEqual(['/gallery/news/a.webp', '/gallery/team_men/2024-2025/SG1.webp'])
  })

  it('skips entries without a name (e.g. a "directory" marker object)', async () => {
    listObjectsV2.mockReturnValue(
      Readable.from([{ name: 'gallery/news/a.webp' }, { prefix: 'gallery/news/' }], {
        objectMode: true,
      }),
    )

    const res = await request(app).get('/api/gallery-images')

    expect(res.body).toEqual(['/gallery/news/a.webp'])
  })

  it('returns an empty array when the bucket has nothing under gallery/', async () => {
    listObjectsV2.mockReturnValue(Readable.from([], { objectMode: true }))

    const res = await request(app).get('/api/gallery-images')

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('propagates a stream error as a 500', async () => {
    const erroringStream = new Readable({
      objectMode: true,
      read() {
        this.emit('error', new Error('minio unreachable'))
      },
    })
    listObjectsV2.mockReturnValue(erroringStream)

    const res = await request(app).get('/api/gallery-images')

    expect(res.status).toBe(500)
  })
})
