import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'
import { requireAuth } from '../middleware/auth'
import { asyncHandler } from '../middleware/asyncHandler'

const router = Router()

const committeeSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  email: z.string().email(),
  members: z.array(z.string()),
})

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const committees = await prisma.committee.findMany({ orderBy: { id: 'asc' } })
    res.json(committees)
  }),
)

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const committee = await prisma.committee.findUnique({ where: { id: Number(req.params.id) } })
    if (!committee) return res.status(404).json({ error: 'Not found' })
    res.json(committee)
  }),
)

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = committeeSchema.parse(req.body)
    const committee = await prisma.committee.create({ data })
    res.status(201).json(committee)
  }),
)

router.put(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = committeeSchema.parse(req.body)
    const committee = await prisma.committee.update({
      where: { id: Number(req.params.id) },
      data,
    })
    res.json(committee)
  }),
)

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.committee.delete({ where: { id: Number(req.params.id) } })
    res.status(204).end()
  }),
)

export default router
