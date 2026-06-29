import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'

vi.mock('../../src/mailer', () => ({
  sendContactMail: vi.fn().mockResolvedValue(undefined),
}))

import { app } from '../helpers'
import { sendContactMail } from '../../src/mailer'

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.mocked(sendContactMail).mockClear()
  })

  const validPayload = {
    lastName: 'Dupont',
    firstName: 'Jean',
    email: 'jean@example.com',
    about: 'secretaire',
    message: 'Bonjour, je veux inscrire mon enfant',
    consent: true,
  }

  it('sends an email to the resolved recipient and returns 204', async () => {
    const res = await request(app).post('/api/contact').send(validPayload)

    expect(res.status).toBe(204)
    expect(sendContactMail).toHaveBeenCalledOnce()
    const call = vi.mocked(sendContactMail).mock.calls[0][0]
    expect(call.recipientEmail).toBe('secretaire@bsmbasket.fr')
    expect(call.email).toBe('jean@example.com')
    expect(call.firstName).toBe('Jean')
    expect(call.lastName).toBe('Dupont')
  })

  it('rejects when consent is false', async () => {
    const res = await request(app).post('/api/contact').send({ ...validPayload, consent: false })
    expect(res.status).toBe(400)
    expect(sendContactMail).not.toHaveBeenCalled()
  })

  it('rejects an unknown "about" value', async () => {
    const res = await request(app).post('/api/contact').send({ ...validPayload, about: 'hacking' })
    expect(res.status).toBe(400)
  })

  it('rejects an invalid email', async () => {
    const res = await request(app).post('/api/contact').send({ ...validPayload, email: 'not-an-email' })
    expect(res.status).toBe(400)
  })
})
