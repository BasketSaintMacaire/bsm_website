import { Router } from 'express'
import { z } from 'zod'
import { sendContactMail } from '../mailer'
import { asyncHandler } from '../middleware/asyncHandler'

const router = Router()

const ABOUT_OPTIONS = [
  'planning',
  'tournoi',
  'boutique',
  'sponsoring',
  'bar',
  'technique',
  'secretaire',
  'contact',
] as const

const contactSchema = z.object({
  lastName: z.string().min(1),
  firstName: z.string().min(1),
  email: z.string().email(),
  about: z.enum(ABOUT_OPTIONS),
  message: z.string().min(1),
  consent: z.literal(true),
})

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = contactSchema.parse(req.body)

    await sendContactMail({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      about: data.about,
      message: data.message,
      recipientEmail: `${data.about}@bsmbasket.fr`,
    })

    res.status(204).end()
  }),
)

export default router
