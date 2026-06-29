import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'
import { requireAuth } from '../middleware/auth'
import { asyncHandler } from '../middleware/asyncHandler'

const router = Router()

const playerSchema = z.object({
  name: z.string().min(1),
  position: z.string(),
  number: z.number().int(),
})

const teamSchema = z.object({
  name: z.string().min(1),
  image: z.string().min(1),
  season: z.string().min(1),
  category: z.enum(['men', 'women', 'pleasure']),
  players: z.array(playerSchema),
})

const include = { players: true }

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const teams = await prisma.team.findMany({ include, orderBy: { id: 'asc' } })
    res.json(teams)
  }),
)

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const team = await prisma.team.findUnique({ where: { id: Number(req.params.id) }, include })
    if (!team) return res.status(404).json({ error: 'Not found' })
    res.json(team)
  }),
)

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = teamSchema.parse(req.body)
    const team = await prisma.team.create({
      data: {
        name: data.name,
        image: data.image,
        season: data.season,
        category: data.category,
        players: { create: data.players },
      },
      include,
    })
    res.status(201).json(team)
  }),
)

router.put(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id)
    const data = teamSchema.parse(req.body)
    const team = await prisma.$transaction(async (tx) => {
      await tx.player.deleteMany({ where: { teamId: id } })
      return tx.team.update({
        where: { id },
        data: {
          name: data.name,
          image: data.image,
          season: data.season,
          category: data.category,
          players: { create: data.players },
        },
        include,
      })
    })
    res.json(team)
  }),
)

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.team.delete({ where: { id: Number(req.params.id) } })
    res.status(204).end()
  }),
)

export default router
