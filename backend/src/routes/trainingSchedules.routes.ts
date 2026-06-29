import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'
import { requireAuth } from '../middleware/auth'
import { asyncHandler } from '../middleware/asyncHandler'

const router = Router()

const trainingSessionSchema = z.object({
  time: z.string().min(1),
  groups: z.array(z.string()),
  location: z.string().min(1),
  trainer: z.string().min(1),
  notes: z.string().nullable().optional(),
})

const dayScheduleSchema = z.object({
  date: z.string().min(1),
  sessions: z.array(trainingSessionSchema),
})

const weekScheduleSchema = z.object({
  name: z.string().min(1),
  period: z.string().nullable().optional(),
  days: z.array(dayScheduleSchema),
})

const include = { days: { include: { sessions: true } } }

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const schedules = await prisma.weekSchedule.findMany({ include, orderBy: { id: 'asc' } })
    res.json(schedules)
  }),
)

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const schedule = await prisma.weekSchedule.findUnique({
      where: { id: Number(req.params.id) },
      include,
    })
    if (!schedule) return res.status(404).json({ error: 'Not found' })
    res.json(schedule)
  }),
)

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = weekScheduleSchema.parse(req.body)
    const schedule = await prisma.weekSchedule.create({
      data: {
        name: data.name,
        period: data.period,
        days: {
          create: data.days.map((day) => ({
            date: day.date,
            sessions: { create: day.sessions },
          })),
        },
      },
      include,
    })
    res.status(201).json(schedule)
  }),
)

router.put(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id)
    const data = weekScheduleSchema.parse(req.body)
    const schedule = await prisma.$transaction(async (tx) => {
      await tx.daySchedule.deleteMany({ where: { weekScheduleId: id } })
      return tx.weekSchedule.update({
        where: { id },
        data: {
          name: data.name,
          period: data.period,
          days: {
            create: data.days.map((day) => ({
              date: day.date,
              sessions: { create: day.sessions },
            })),
          },
        },
        include,
      })
    })
    res.json(schedule)
  }),
)

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.weekSchedule.delete({ where: { id: Number(req.params.id) } })
    res.status(204).end()
  }),
)

export default router
