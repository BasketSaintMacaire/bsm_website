import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app, authHeader } from '../helpers'

const sample = {
  title: 'Direction la Région',
  excerpt: 'Félicitations à nos équipes',
  content: 'Un grand bravo...',
  date: '2025-01-06',
  image: '/gallery/news/img_region.webp',
  category: 'Résultats',
}

describe('/api/news', () => {
  it('GET / returns an empty list initially', async () => {
    const res = await request(app).get('/api/news')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('POST / requires auth', async () => {
    const res = await request(app).post('/api/news').send(sample)
    expect(res.status).toBe(401)
  })

  it('creates, lists (sorted desc by date), fetches, updates and deletes an article', async () => {
    await request(app)
      .post('/api/news')
      .set('Authorization', authHeader())
      .send({ ...sample, title: 'Older', date: '2024-12-04' })
    const created = await request(app)
      .post('/api/news')
      .set('Authorization', authHeader())
      .send(sample)
    expect(created.status).toBe(201)
    const id = created.body.id

    const list = await request(app).get('/api/news')
    expect(list.body).toHaveLength(2)
    expect(list.body[0].title).toBe(sample.title) // newest first

    const single = await request(app).get(`/api/news/${id}`)
    expect(single.status).toBe(200)

    const updated = await request(app)
      .put(`/api/news/${id}`)
      .set('Authorization', authHeader())
      .send({ ...sample, title: 'Renamed' })
    expect(updated.body.title).toBe('Renamed')

    const deleted = await request(app).delete(`/api/news/${id}`).set('Authorization', authHeader())
    expect(deleted.status).toBe(204)

    const afterDelete = await request(app).get(`/api/news/${id}`)
    expect(afterDelete.status).toBe(404)
  })
})
