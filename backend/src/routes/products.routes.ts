import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'
import { requireAuth } from '../middleware/auth'
import { asyncHandler } from '../middleware/asyncHandler'
import { serializeProduct } from '../lib/serialize'

const router = Router()

const variantSchema = z.object({
  size: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  price: z.number(),
})

const flockingSchema = z.object({
  price: z.number(),
  maxSize: z.number().int(),
})

const productSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  imageFolder: z.string().min(1),
  description: z.string().min(1),
  variants: z.array(variantSchema).min(1),
  flocking: flockingSchema.nullable().optional(),
})

const include = { variants: true, flocking: true }

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const products = await prisma.product.findMany({ include, orderBy: { id: 'asc' } })
    res.json(products.map(serializeProduct))
  }),
)

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include,
    })
    if (!product) return res.status(404).json({ error: 'Not found' })
    res.json(serializeProduct(product))
  }),
)

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = productSchema.parse(req.body)
    const product = await prisma.product.create({
      data: {
        name: data.name,
        category: data.category,
        imageFolder: data.imageFolder,
        description: data.description,
        variants: { create: data.variants },
        flocking: data.flocking ? { create: data.flocking } : undefined,
      },
      include,
    })
    res.status(201).json(serializeProduct(product))
  }),
)

router.put(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id)
    const data = productSchema.parse(req.body)
    const product = await prisma.$transaction(async (tx) => {
      await tx.productVariant.deleteMany({ where: { productId: id } })
      await tx.flocking.deleteMany({ where: { productId: id } })
      return tx.product.update({
        where: { id },
        data: {
          name: data.name,
          category: data.category,
          imageFolder: data.imageFolder,
          description: data.description,
          variants: { create: data.variants },
          flocking: data.flocking ? { create: data.flocking } : undefined,
        },
        include,
      })
    })
    res.json(serializeProduct(product))
  }),
)

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.product.delete({ where: { id: Number(req.params.id) } })
    res.status(204).end()
  }),
)

export default router
