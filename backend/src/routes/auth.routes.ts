import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { env } from '../env'
import { asyncHandler } from '../middleware/asyncHandler'

const router = Router()

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { username, password } = loginSchema.parse(req.body)

    if (username !== env.ADMIN_USERNAME) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const valid = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH)
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const token = jwt.sign({ sub: username }, env.JWT_SECRET, { expiresIn: '12h' })
    res.json({ token })
  }),
)

export default router
