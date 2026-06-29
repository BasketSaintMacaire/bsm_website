import { Router } from 'express'
import { z } from 'zod'
import { mailer } from '../mailer'
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
    const recipient = `${data.about}@bsmbasket.fr`

    await mailer.sendMail({
      to: recipient,
      replyTo: data.email,
      subject: `[BSM Contact] ${data.about} — ${data.firstName} ${data.lastName}`,
      text: `${data.message}\n\nDe: ${data.firstName} ${data.lastName} <${data.email}>`,
    })

    res.status(204).end()
  }),
)

export default router
