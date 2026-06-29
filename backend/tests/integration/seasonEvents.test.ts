import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app, authHeader } from '../helpers'

const sample = { name: 'Galette', day: '18', month: 'JANVIER', year: '2026' }

describe('/api/season-events', () => {
  it('GET / returns an empty list initially', async () => {
    const res = await request(app).get('/api/season-events')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('POST / requires auth', async () => {
    const res = await request(app).post('/api/season-events').send(sample)
    expect(res.status).toBe(401)
  })

  it('creates, lists, fetches, updates and deletes a season event', async () => {
    const created = await request(app)
      .post('/api/season-events')
      .set('Authorization', authHeader())
      .send(sample)
    expect(created.status).toBe(201)
    expect(created.body).toMatchObject(sample)
    const id = created.body.id

    const list = await request(app).get('/api/season-events')
    expect(list.body).toHaveLength(1)

    const single = await request(app).get(`/api/season-events/${id}`)
    expect(single.status).toBe(200)

    const updated = await request(app)
      .put(`/api/season-events/${id}`)
      .set('Authorization', authHeader())
      .send({ ...sample, name: 'Renamed' })
    expect(updated.body.name).toBe('Renamed')

    const deleted = await request(app)
      .delete(`/api/season-events/${id}`)
      .set('Authorization', authHeader())
    expect(deleted.status).toBe(204)

    const afterDelete = await request(app).get(`/api/season-events/${id}`)
    expect(afterDelete.status).toBe(404)
  })
})
