import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../helpers'

describe('POST /api/auth/login', () => {
  it('returns a token for valid admin credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' })

    expect(res.status).toBe(200)
    expect(typeof res.body.token).toBe('string')
    expect(res.body.token.length).toBeGreaterThan(10)
  })

  it('rejects an unknown username', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'someone-else', password: 'admin123' })
    expect(res.status).toBe(401)
  })

  it('rejects a wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'wrong-password' })
    expect(res.status).toBe(401)
  })

  it('rejects a malformed payload', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'admin' })
    expect(res.status).toBe(400)
  })

  it('the issued token works against a protected route', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' })

    const res = await request(app)
      .post('/api/committees')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({
        name: 'Test',
        description: 'desc',
        icon: 'Trophy',
        email: 'test@bsmbasket.fr',
        members: [],
      })

    expect(res.status).toBe(201)
  })
})
