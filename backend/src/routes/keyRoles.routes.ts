import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'
import { requireAuth } from '../middleware/auth'
import { asyncHandler } from '../middleware/asyncHandler'

const router = Router()

const keyRoleSchema = z.object({
  title: z.string().min(1),
  name: z.string().min(1),
  icon: z.string().min(1),
})

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const keyRoles = await prisma.keyRole.findMany({ orderBy: { id: 'asc' } })
    res.json(keyRoles)
  }),
)

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const keyRole = await prisma.keyRole.findUnique({ where: { id: Number(req.params.id) } })
    if (!keyRole) return res.status(404).json({ error: 'Not found' })
    res.json(keyRole)
  }),
)

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = keyRoleSchema.parse(req.body)
    const keyRole = await prisma.keyRole.create({ data })
    res.status(201).json(keyRole)
  }),
)

router.put(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = keyRoleSchema.parse(req.body)
    const keyRole = await prisma.keyRole.update({ where: { id: Number(req.params.id) }, data })
    res.json(keyRole)
  }),
)

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.keyRole.delete({ where: { id: Number(req.params.id) } })
    res.status(204).end()
  }),
)

export default router
