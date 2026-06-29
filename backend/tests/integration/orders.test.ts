import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'

vi.mock('../../src/mailer', () => ({
  mailer: { sendMail: vi.fn().mockResolvedValue({ messageId: 'test' }) },
}))

import { app } from '../helpers'
import { mailer } from '../../src/mailer'

describe('POST /api/orders', () => {
  beforeEach(() => {
    vi.mocked(mailer.sendMail).mockClear()
  })

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

  it('sends a confirmation email and a boutique notification, returns 204', async () => {
    const res = await request(app).post('/api/orders').send(validPayload)

    expect(res.status).toBe(204)
    expect(mailer.sendMail).toHaveBeenCalledTimes(2)

    const calls = vi.mocked(mailer.sendMail).mock.calls.map((c) => c[0] as { to: string })
    expect(calls.map((c) => c.to)).toContain('jean@example.com')
    expect(calls.map((c) => c.to)).toContain('boutique@bsmbasket.fr')
  })

  it('rejects an empty cart', async () => {
    const res = await request(app).post('/api/orders').send({ ...validPayload, items: [] })
    expect(res.status).toBe(400)
    expect(mailer.sendMail).not.toHaveBeenCalled()
  })

  it('rejects an invalid billing email', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ ...validPayload, billing: { ...validPayload.billing, email: 'nope' } })
    expect(res.status).toBe(400)
  })
})
