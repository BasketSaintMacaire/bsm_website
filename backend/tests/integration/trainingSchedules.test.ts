import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app, authHeader } from '../helpers'

const sample = {
  name: 'SAISON 2025/2026',
  period: 'Du 1 Septembre au 30 Juin',
  days: [
    {
      date: 'LUNDI',
      sessions: [
        { time: '17H15-18H30', groups: ['U07 F&G'], location: 'Salle Georges Raymond', trainer: 'Julien' },
      ],
    },
    {
      date: 'MARDI',
      sessions: [],
    },
  ],
}

describe('/api/training-schedules', () => {
  it('GET / returns an empty list initially', async () => {
    const res = await request(app).get('/api/training-schedules')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('POST / requires auth', async () => {
    const res = await request(app).post('/api/training-schedules').send(sample)
    expect(res.status).toBe(401)
  })

  it('creates a schedule with nested days and sessions', async () => {
    const created = await request(app)
      .post('/api/training-schedules')
      .set('Authorization', authHeader())
      .send(sample)

    expect(created.status).toBe(201)
    expect(created.body.period).toBe(sample.period)
    expect(created.body.days).toHaveLength(2)
    expect(created.body.days[0].sessions).toHaveLength(1)
    expect(created.body.days[0].sessions[0].groups).toEqual(['U07 F&G'])
    expect(created.body.days[1].sessions).toHaveLength(0)
  })

  it('creates a schedule with no period', async () => {
    const created = await request(app)
      .post('/api/training-schedules')
      .set('Authorization', authHeader())
      .send({ ...sample, period: null })

    expect(created.status).toBe(201)
    expect(created.body.period).toBeNull()
  })

  it('GET /:id returns the schedule', async () => {
    const created = await request(app)
      .post('/api/training-schedules')
      .set('Authorization', authHeader())
      .send(sample)

    const single = await request(app).get(`/api/training-schedules/${created.body.id}`)
    expect(single.status).toBe(200)
    expect(single.body.days).toHaveLength(2)
  })

  it('PUT /:id fully replaces days and sessions', async () => {
    const created = await request(app)
      .post('/api/training-schedules')
      .set('Authorization', authHeader())
      .send(sample)
    const id = created.body.id

    const updated = await request(app)
      .put(`/api/training-schedules/${id}`)
      .set('Authorization', authHeader())
      .send({
        ...sample,
        days: [
          {
            date: 'VENDREDI',
            sessions: [{ time: '19H00', groups: ['SF1'], location: 'Salle Georges Raymond', trainer: 'Antoine' }],
          },
        ],
      })

    expect(updated.status).toBe(200)
    expect(updated.body.days).toHaveLength(1)
    expect(updated.body.days[0].date).toBe('VENDREDI')
  })

  it('DELETE /:id removes the schedule and cascades', async () => {
    const created = await request(app)
      .post('/api/training-schedules')
      .set('Authorization', authHeader())
      .send(sample)
    const id = created.body.id

    const deleted = await request(app)
      .delete(`/api/training-schedules/${id}`)
      .set('Authorization', authHeader())
    expect(deleted.status).toBe(204)

    const afterDelete = await request(app).get(`/api/training-schedules/${id}`)
    expect(afterDelete.status).toBe(404)
  })
})
