import { Router } from 'express'
import { Match } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '../prisma'
import { requireAuth } from '../middleware/auth'
import { asyncHandler } from '../middleware/asyncHandler'

const router = Router()

// Wire format matches the club's historical matchs.json field names (snake_case
// for time_start/time_meetup/board_official), which the frontend's Match model
// and PlanningView.vue are written against. Prisma columns stay camelCase.
const matchSchema = z.object({
  date: z.coerce.date(),
  team: z.string().min(1),
  group: z.string().min(1),
  isDomicile: z.boolean(),
  time_start: z.string().min(1),
  time_meetup: z.string().nullable().optional(),
  opponent: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  board_official: z.array(z.string()),
  referees: z.array(z.string()),
  bar: z.string().nullable().optional(),
  result: z.array(z.number().int()),
})

function toWire(match: Match) {
  const { timeStart, timeMeetup, boardOfficial, ...rest } = match
  return {
    ...rest,
    time_start: timeStart,
    time_meetup: timeMeetup,
    board_official: boardOfficial,
  }
}

function toColumns(data: z.infer<typeof matchSchema>) {
  const { time_start, time_meetup, board_official, ...rest } = data
  return {
    ...rest,
    timeStart: time_start,
    timeMeetup: time_meetup,
    boardOfficial: board_official,
  }
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { team, from, to } = req.query
    const where: Record<string, unknown> = {}
    if (typeof team === 'string') where.team = team
    if (typeof from === 'string' || typeof to === 'string') {
      where.date = {
        ...(typeof from === 'string' ? { gte: new Date(from) } : {}),
        ...(typeof to === 'string' ? { lte: new Date(to) } : {}),
      }
    }
    const matches = await prisma.match.findMany({ where, orderBy: { date: 'asc' } })
    res.json(matches.map(toWire))
  }),
)

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const match = await prisma.match.findUnique({ where: { id: Number(req.params.id) } })
    if (!match) return res.status(404).json({ error: 'Not found' })
    res.json(toWire(match))
  }),
)

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = matchSchema.parse(req.body)
    const match = await prisma.match.create({ data: toColumns(data) })
    res.status(201).json(toWire(match))
  }),
)

router.put(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = matchSchema.parse(req.body)
    const match = await prisma.match.update({
      where: { id: Number(req.params.id) },
      data: toColumns(data),
    })
    res.json(toWire(match))
  }),
)

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.match.delete({ where: { id: Number(req.params.id) } })
    res.status(204).end()
  }),
)

export default router
