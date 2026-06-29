import emailjs from '@emailjs/nodejs'
import { env } from './env'

interface MailOptions {
  to: string
  from?: string
  replyTo?: string
  subject: string
  text?: string
  html?: string
}

async function sendMail(opts: MailOptions): Promise<void> {
  const templateId = opts.html ? env.EMAILJS_TEMPLATE_ID_ORDER : env.EMAILJS_TEMPLATE_ID_CONTACT

  await emailjs.send(
    env.EMAILJS_SERVICE_ID,
    templateId,
    {
      to_email: opts.to,
      reply_to: opts.replyTo ?? '',
      subject: opts.subject,
      message: opts.text ?? '',
      html_message: opts.html ?? '',
    },
    {
      publicKey: env.EMAILJS_PUBLIC_KEY,
      privateKey: env.EMAILJS_PRIVATE_KEY,
    },
  )
}

export const mailer = { sendMail }
