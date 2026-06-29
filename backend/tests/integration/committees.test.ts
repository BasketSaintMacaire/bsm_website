import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app, authHeader } from '../helpers'

const sample = {
  name: 'Commission Technique',
  description: 'Gestion des équipes',
  icon: 'Trophy',
  email: 'technique@bsmbasket.fr',
  members: ['Alice', 'Bob'],
}

describe('/api/committees', () => {
  it('GET / returns an empty list initially', async () => {
    const res = await request(app).get('/api/committees')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('POST / requires auth', async () => {
    const res = await request(app).post('/api/committees').send(sample)
    expect(res.status).toBe(401)
  })

  it('POST / rejects invalid payloads even when authed', async () => {
    const res = await request(app)
      .post('/api/committees')
      .set('Authorization', authHeader())
      .send({ name: 'No email' })
    expect(res.status).toBe(400)
  })

  it('creates, lists, fetches, updates and deletes a committee', async () => {
    const created = await request(app)
      .post('/api/committees')
      .set('Authorization', authHeader())
      .send(sample)
    expect(created.status).toBe(201)
    expect(created.body).toMatchObject(sample)
    const id = created.body.id

    const list = await request(app).get('/api/committees')
    expect(list.body).toHaveLength(1)

    const single = await request(app).get(`/api/committees/${id}`)
    expect(single.status).toBe(200)
    expect(single.body.name).toBe(sample.name)

    const updated = await request(app)
      .put(`/api/committees/${id}`)
      .set('Authorization', authHeader())
      .send({ ...sample, name: 'Renamed' })
    expect(updated.status).toBe(200)
    expect(updated.body.name).toBe('Renamed')

    const deleted = await request(app).delete(`/api/committees/${id}`).set('Authorization', authHeader())
    expect(deleted.status).toBe(204)

    const afterDelete = await request(app).get(`/api/committees/${id}`)
    expect(afterDelete.status).toBe(404)
  })

  it('GET /:id returns 404 for a missing committee', async () => {
    const res = await request(app).get('/api/committees/999999')
    expect(res.status).toBe(404)
  })
})
