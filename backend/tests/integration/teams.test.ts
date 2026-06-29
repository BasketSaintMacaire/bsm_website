import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app, authHeader } from '../helpers'

const sample = {
  name: 'SM1',
  image: '/gallery/team_men/2024-2025/SG1.webp',
  season: '2024-2025',
  category: 'men',
  players: [
    { name: 'Thomas Veron', position: 'Pivot', number: 4 },
    { name: 'Rodrigue Mailet', position: 'Pivot', number: 5 },
  ],
}

describe('/api/teams', () => {
  it('GET / returns an empty list initially', async () => {
    const res = await request(app).get('/api/teams')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('POST / requires auth', async () => {
    const res = await request(app).post('/api/teams').send(sample)
    expect(res.status).toBe(401)
  })

  it('rejects an invalid category', async () => {
    const res = await request(app)
      .post('/api/teams')
      .set('Authorization', authHeader())
      .send({ ...sample, category: 'not-a-category' })
    expect(res.status).toBe(400)
  })

  it('creates a team with nested players and fresh player ids', async () => {
    const created = await request(app)
      .post('/api/teams')
      .set('Authorization', authHeader())
      .send(sample)

    expect(created.status).toBe(201)
    expect(created.body.players).toHaveLength(2)
    expect(created.body.players[0].id).toBeTypeOf('number')
    expect(created.body.players[0].teamId).toBe(created.body.id)
  })

  it('GET /:id returns the team with players', async () => {
    const created = await request(app)
      .post('/api/teams')
      .set('Authorization', authHeader())
      .send(sample)

    const single = await request(app).get(`/api/teams/${created.body.id}`)
    expect(single.status).toBe(200)
    expect(single.body.players).toHaveLength(2)
  })

  it('PUT /:id fully replaces the player roster', async () => {
    const created = await request(app)
      .post('/api/teams')
      .set('Authorization', authHeader())
      .send(sample)
    const id = created.body.id

    const updated = await request(app)
      .put(`/api/teams/${id}`)
      .set('Authorization', authHeader())
      .send({ ...sample, players: [{ name: 'New Player', position: 'Ailier', number: 7 }] })

    expect(updated.status).toBe(200)
    expect(updated.body.players).toHaveLength(1)
    expect(updated.body.players[0].name).toBe('New Player')
  })

  it('DELETE /:id removes the team and cascades to players', async () => {
    const created = await request(app)
      .post('/api/teams')
      .set('Authorization', authHeader())
      .send(sample)
    const id = created.body.id

    const deleted = await request(app).delete(`/api/teams/${id}`).set('Authorization', authHeader())
    expect(deleted.status).toBe(204)

    const afterDelete = await request(app).get(`/api/teams/${id}`)
    expect(afterDelete.status).toBe(404)
  })
})
