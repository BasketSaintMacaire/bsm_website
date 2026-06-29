import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../helpers'

describe('POST /api/orders', () => {
  const validPayload = {
    items: [
      { name: 'T-shirt Nike', size: 'M', color: null, price: 20, quantity: 2 },
      { name: 'Sweat à capuche', size: null, color: 'Noir', price: 27, quantity: 1 },
    ],
    billing: {
      name: 'Jean Dupont',
      address: '1 rue du Stade',
      phone: '0600000000',
      email: 'jean@example.com',
    },
  }

  it('accepts a valid order and returns 204', async () => {
    const res = await request(app).post('/api/orders').send(validPayload)
    expect(res.status).toBe(204)
  })

  it('rejects an empty cart', async () => {
    const res = await request(app).post('/api/orders').send({ ...validPayload, items: [] })
    expect(res.status).toBe(400)
  })

  it('rejects an invalid billing email', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ ...validPayload, billing: { ...validPayload.billing, email: 'nope' } })
    expect(res.status).toBe(400)
  })
})
