import { Router } from 'express'
import { z } from 'zod'
import { asyncHandler } from '../middleware/asyncHandler'

const router = Router()

const orderItemSchema = z.object({
  name: z.string().min(1),
  color: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  price: z.number(),
  quantity: z.number().int().positive(),
})

const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  billing: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email(),
  }),
})

router.post(
  '/',
  asyncHandler(async (req, res) => {
    orderSchema.parse(req.body)
    res.status(204).end()
  }),
)

export default router
