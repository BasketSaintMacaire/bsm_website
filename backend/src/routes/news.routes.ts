import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'
import { requireAuth } from '../middleware/auth'
import { asyncHandler } from '../middleware/asyncHandler'

const router = Router()

const newsArticleSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  date: z.coerce.date(),
  image: z.string().min(1),
  category: z.string().min(1),
})

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const articles = await prisma.newsArticle.findMany({ orderBy: { date: 'desc' } })
    res.json(articles)
  }),
)

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const article = await prisma.newsArticle.findUnique({ where: { id: Number(req.params.id) } })
    if (!article) return res.status(404).json({ error: 'Not found' })
    res.json(article)
  }),
)

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = newsArticleSchema.parse(req.body)
    const article = await prisma.newsArticle.create({ data })
    res.status(201).json(article)
  }),
)

router.put(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = newsArticleSchema.parse(req.body)
    const article = await prisma.newsArticle.update({
      where: { id: Number(req.params.id) },
      data,
    })
    res.json(article)
  }),
)

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.newsArticle.delete({ where: { id: Number(req.params.id) } })
    res.status(204).end()
  }),
)

export default router
