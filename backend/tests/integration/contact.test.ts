import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'

vi.mock('../../src/mailer', () => ({
  mailer: { sendMail: vi.fn().mockResolvedValue({ messageId: 'test' }) },
}))

import { app } from '../helpers'
import { mailer } from '../../src/mailer'

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.mocked(mailer.sendMail).mockClear()
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
    expect(mailer.sendMail).toHaveBeenCalledOnce()
    const call = vi.mocked(mailer.sendMail).mock.calls[0][0] as { to: string; replyTo: string }
    expect(call.to).toBe('secretaire@bsmbasket.fr')
    expect(call.replyTo).toBe('jean@example.com')
  })

  it('rejects when consent is false', async () => {
    const res = await request(app).post('/api/contact').send({ ...validPayload, consent: false })
    expect(res.status).toBe(400)
    expect(mailer.sendMail).not.toHaveBeenCalled()
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
