import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app, authHeader } from '../helpers'

const sample = { year: 1981, title: 'Fondation du BSM', description: 'Fondé par des passionnés' }

describe('/api/history-events', () => {
  it('GET / returns an empty list initially', async () => {
    const res = await request(app).get('/api/history-events')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('POST / requires auth', async () => {
    const res = await request(app).post('/api/history-events').send(sample)
    expect(res.status).toBe(401)
  })

  it('rejects a non-numeric year', async () => {
    const res = await request(app)
      .post('/api/history-events')
      .set('Authorization', authHeader())
      .send({ ...sample, year: 'not-a-year' })
    expect(res.status).toBe(400)
  })

  it('creates, lists, fetches, updates and deletes a history event', async () => {
    const created = await request(app)
      .post('/api/history-events')
      .set('Authorization', authHeader())
      .send(sample)
    expect(created.status).toBe(201)
    expect(created.body).toMatchObject(sample)
    const id = created.body.id

    const list = await request(app).get('/api/history-events')
    expect(list.body).toHaveLength(1)

    const single = await request(app).get(`/api/history-events/${id}`)
    expect(single.status).toBe(200)

    const updated = await request(app)
      .put(`/api/history-events/${id}`)
      .set('Authorization', authHeader())
      .send({ ...sample, title: 'Renamed' })
    expect(updated.body.title).toBe('Renamed')

    const deleted = await request(app)
      .delete(`/api/history-events/${id}`)
      .set('Authorization', authHeader())
    expect(deleted.status).toBe(204)

    const afterDelete = await request(app).get(`/api/history-events/${id}`)
    expect(afterDelete.status).toBe(404)
  })
})
