import { describe, it, expect, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { requireAuth } from '../../src/middleware/auth'

function mockRes() {
  const res = {} as Response
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('requireAuth', () => {
  it('rejects a request with no Authorization header', () => {
    const req = { headers: {} } as Request
    const res = mockRes()
    const next = vi.fn()

    requireAuth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('rejects a malformed Authorization header', () => {
    const req = { headers: { authorization: 'Token abc' } } as Request
    const res = mockRes()
    const next = vi.fn()

    requireAuth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('rejects an invalid token', () => {
    const req = { headers: { authorization: 'Bearer not-a-real-token' } } as Request
    const res = mockRes()
    const next = vi.fn()

    requireAuth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('calls next for a valid token', () => {
    const token = jwt.sign({ sub: 'admin' }, process.env.JWT_SECRET as string)
    const req = { headers: { authorization: `Bearer ${token}` } } as Request
    const res = mockRes()
    const next = vi.fn()

    requireAuth(req, res, next)

    expect(next).toHaveBeenCalledOnce()
    expect(res.status).not.toHaveBeenCalled()
  })
})
