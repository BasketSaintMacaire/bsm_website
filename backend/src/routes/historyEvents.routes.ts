import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'
import { requireAuth } from '../middleware/auth'
import { asyncHandler } from '../middleware/asyncHandler'

const router = Router()

const historyEventSchema = z.object({
  year: z.number().int(),
  title: z.string().min(1),
  description: z.string().min(1),
})

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const events = await prisma.historyEvent.findMany({ orderBy: { year: 'asc' } })
    res.json(events)
  }),
)

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const event = await prisma.historyEvent.findUnique({ where: { id: Number(req.params.id) } })
    if (!event) return res.status(404).json({ error: 'Not found' })
    res.json(event)
  }),
)

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = historyEventSchema.parse(req.body)
    const event = await prisma.historyEvent.create({ data })
    res.status(201).json(event)
  }),
)

router.put(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = historyEventSchema.parse(req.body)
    const event = await prisma.historyEvent.update({
      where: { id: Number(req.params.id) },
      data,
    })
    res.json(event)
  }),
)

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.historyEvent.delete({ where: { id: Number(req.params.id) } })
    res.status(204).end()
  }),
)

export default router
