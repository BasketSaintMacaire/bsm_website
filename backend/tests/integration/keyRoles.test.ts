import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app, authHeader } from '../helpers'

const sample = { title: 'Présidente', name: 'Céline Grasset', icon: 'Crown' }

describe('/api/key-roles', () => {
  it('GET / returns an empty list initially', async () => {
    const res = await request(app).get('/api/key-roles')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('POST / requires auth', async () => {
    const res = await request(app).post('/api/key-roles').send(sample)
    expect(res.status).toBe(401)
  })

  it('creates, lists, fetches, updates and deletes a key role', async () => {
    const created = await request(app)
      .post('/api/key-roles')
      .set('Authorization', authHeader())
      .send(sample)
    expect(created.status).toBe(201)
    expect(created.body).toMatchObject(sample)
    const id = created.body.id

    const list = await request(app).get('/api/key-roles')
    expect(list.body).toHaveLength(1)

    const single = await request(app).get(`/api/key-roles/${id}`)
    expect(single.status).toBe(200)

    const updated = await request(app)
      .put(`/api/key-roles/${id}`)
      .set('Authorization', authHeader())
      .send({ ...sample, name: 'Renamed' })
    expect(updated.body.name).toBe('Renamed')

    const deleted = await request(app)
      .delete(`/api/key-roles/${id}`)
      .set('Authorization', authHeader())
    expect(deleted.status).toBe(204)

    const afterDelete = await request(app).get(`/api/key-roles/${id}`)
    expect(afterDelete.status).toBe(404)
  })
})
