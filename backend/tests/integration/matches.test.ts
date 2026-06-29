import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app, authHeader } from '../helpers'

const sample = {
  date: '2025-09-13',
  team: 'Séniors M1',
  group: 'A',
  isDomicile: true,
  time_start: '20:30',
  time_meetup: '19:30',
  opponent: 'ANDARD BRAIN - 1',
  location: 'Salle Georges Raymond',
  board_official: ['OFF'],
  referees: ['OFF'],
  bar: null,
  result: [],
}

describe('/api/matches', () => {
  it('GET / returns an empty list initially', async () => {
    const res = await request(app).get('/api/matches')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('POST / requires auth', async () => {
    const res = await request(app).post('/api/matches').send(sample)
    expect(res.status).toBe(401)
  })

  it('creates a match and returns it in the snake_case wire format', async () => {
    const created = await request(app)
      .post('/api/matches')
      .set('Authorization', authHeader())
      .send(sample)

    expect(created.status).toBe(201)
    expect(created.body.time_start).toBe('20:30')
    expect(created.body.time_meetup).toBe('19:30')
    expect(created.body.board_official).toEqual(['OFF'])
    expect(created.body).not.toHaveProperty('timeStart')
    expect(created.body).not.toHaveProperty('boardOfficial')
  })

  it('filters by team via query param', async () => {
    await request(app).post('/api/matches').set('Authorization', authHeader()).send(sample)
    await request(app)
      .post('/api/matches')
      .set('Authorization', authHeader())
      .send({ ...sample, team: 'Séniors M2', date: '2025-09-14' })

    const res = await request(app).get('/api/matches').query({ team: 'Séniors M2' })

    expect(res.body).toHaveLength(1)
    expect(res.body[0].team).toBe('Séniors M2')
  })

  it('filters by date range via from/to query params', async () => {
    await request(app)
      .post('/api/matches')
      .set('Authorization', authHeader())
      .send({ ...sample, date: '2025-09-13' })
    await request(app)
      .post('/api/matches')
      .set('Authorization', authHeader())
      .send({ ...sample, team: 'U18', date: '2025-10-04' })

    const res = await request(app)
      .get('/api/matches')
      .query({ from: '2025-10-01', to: '2025-10-31' })

    expect(res.body).toHaveLength(1)
    expect(res.body[0].team).toBe('U18')
  })

  it('enforces the (date, team) unique constraint on update', async () => {
    const created = await request(app)
      .post('/api/matches')
      .set('Authorization', authHeader())
      .send(sample)
    const id = created.body.id

    const updated = await request(app)
      .put(`/api/matches/${id}`)
      .set('Authorization', authHeader())
      .send({ ...sample, team: 'Renamed Team' })

    expect(updated.status).toBe(200)
    expect(updated.body.team).toBe('Renamed Team')
  })

  it('GET /:id returns the match when found', async () => {
    const created = await request(app)
      .post('/api/matches')
      .set('Authorization', authHeader())
      .send(sample)

    const single = await request(app).get(`/api/matches/${created.body.id}`)

    expect(single.status).toBe(200)
    expect(single.body.team).toBe(sample.team)
  })

  it('deletes a match', async () => {
    const created = await request(app)
      .post('/api/matches')
      .set('Authorization', authHeader())
      .send(sample)
    const id = created.body.id

    const deleted = await request(app)
      .delete(`/api/matches/${id}`)
      .set('Authorization', authHeader())
    expect(deleted.status).toBe(204)

    const afterDelete = await request(app).get(`/api/matches/${id}`)
    expect(afterDelete.status).toBe(404)
  })
})
