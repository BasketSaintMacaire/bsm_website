import emailjs from '@emailjs/nodejs'
import { env } from './env'

export interface ContactMailParams extends Record<string, unknown> {
  firstName: string
  lastName: string
  email: string
  about: string
  message: string
  recipientEmail: string
}

export async function sendContactMail(params: ContactMailParams): Promise<void> {
  await emailjs.send(
    env.EMAILJS_SERVICE_ID,
    env.EMAILJS_TEMPLATE_ID_CONTACT,
    params,
    {
      publicKey: env.EMAILJS_PUBLIC_KEY,
      privateKey: env.EMAILJS_PRIVATE_KEY,
    },
  )
}
