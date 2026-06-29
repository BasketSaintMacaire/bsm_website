import { Router } from 'express'
import { z } from 'zod'
import { mailer } from '../mailer'
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

function buildItemsTable(items: z.infer<typeof orderSchema>['items']): string {
  return items
    .map(
      (item) => `
      <tr>
        <td>${item.name} (${item.color ?? ''} - ${item.size ?? ''})</td>
        <td>${item.quantity}</td>
        <td>${(item.price * item.quantity).toFixed(2)}€</td>
      </tr>`,
    )
    .join('')
}

function buildOrderEmailHtml(params: {
  orderNumber: string
  orderDate: string
  itemsTable: string
  total: string
  billing: z.infer<typeof orderSchema>['billing']
}): string {
  return `
    <h2>Commande ${params.orderNumber} — ${params.orderDate}</h2>
    <table>${params.itemsTable}</table>
    <p>Total: ${params.total}</p>
    <p>${params.billing.name}<br/>${params.billing.address}<br/>${params.billing.phone}<br/>${params.billing.email}</p>
  `
}

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = orderSchema.parse(req.body)

    const orderNumber = 'BSM-' + Date.now().toString().slice(-6)
    const orderDate = new Date().toLocaleDateString('fr-FR')
    const total = data.items
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2)
    const itemsTable = buildItemsTable(data.items)
    const html = buildOrderEmailHtml({
      orderNumber,
      orderDate,
      itemsTable,
      total: `${total}€`,
      billing: data.billing,
    })

    await mailer.sendMail({
      to: data.billing.email,
      subject: `Confirmation de commande ${orderNumber} — BSM Boutique`,
      html,
    })

    await mailer.sendMail({
      to: 'boutique@bsmbasket.fr',
      replyTo: data.billing.email,
      subject: `Nouvelle commande ${orderNumber} — BSM Boutique`,
      html,
    })

    res.status(204).end()
  }),
)

export default router
