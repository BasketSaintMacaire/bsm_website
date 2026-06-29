import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app, authHeader } from '../helpers'

const sample = {
  name: 'T-shirt Nike',
  category: 'Vêtements',
  imageFolder: '/gallery/shop/tshirt_nike/',
  description: 'T-shirt brodé',
  variants: [
    { size: 'M', color: null, price: 20 },
    { size: 'L', color: null, price: 20 },
  ],
  flocking: { price: 4, maxSize: 20 },
}

describe('/api/products', () => {
  it('GET / returns an empty list initially', async () => {
    const res = await request(app).get('/api/products')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('POST / requires auth', async () => {
    const res = await request(app).post('/api/products').send(sample)
    expect(res.status).toBe(401)
  })

  it('rejects a product with no variants', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', authHeader())
      .send({ ...sample, variants: [] })
    expect(res.status).toBe(400)
  })

  it('creates a product with nested variants and flocking, prices as numbers', async () => {
    const created = await request(app)
      .post('/api/products')
      .set('Authorization', authHeader())
      .send(sample)

    expect(created.status).toBe(201)
    expect(created.body.variants).toHaveLength(2)
    expect(typeof created.body.variants[0].price).toBe('number')
    expect(created.body.variants[0].price).toBe(20)
    expect(created.body.flocking.price).toBe(4)
    expect(typeof created.body.flocking.price).toBe('number')
  })

  it('creates a product with no flocking', async () => {
    const created = await request(app)
      .post('/api/products')
      .set('Authorization', authHeader())
      .send({ ...sample, flocking: null })

    expect(created.status).toBe(201)
    expect(created.body.flocking).toBeNull()
  })

  it('GET /:id returns the product', async () => {
    const created = await request(app)
      .post('/api/products')
      .set('Authorization', authHeader())
      .send(sample)

    const single = await request(app).get(`/api/products/${created.body.id}`)
    expect(single.status).toBe(200)
    expect(single.body.name).toBe(sample.name)
  })

  it('PUT /:id fully replaces variants and flocking', async () => {
    const created = await request(app)
      .post('/api/products')
      .set('Authorization', authHeader())
      .send(sample)
    const id = created.body.id

    const updated = await request(app)
      .put(`/api/products/${id}`)
      .set('Authorization', authHeader())
      .send({
        ...sample,
        variants: [{ size: 'Unique', color: null, price: 99 }],
        flocking: null,
      })

    expect(updated.status).toBe(200)
    expect(updated.body.variants).toHaveLength(1)
    expect(updated.body.variants[0].size).toBe('Unique')
    expect(updated.body.variants[0].price).toBe(99)
    expect(updated.body.flocking).toBeNull()
  })

  it('PUT /:id can add flocking to a product that had none', async () => {
    const created = await request(app)
      .post('/api/products')
      .set('Authorization', authHeader())
      .send({ ...sample, flocking: null })
    const id = created.body.id

    const updated = await request(app)
      .put(`/api/products/${id}`)
      .set('Authorization', authHeader())
      .send({ ...sample, flocking: { price: 5, maxSize: 18 } })

    expect(updated.status).toBe(200)
    expect(updated.body.flocking.price).toBe(5)
  })

  it('DELETE /:id removes the product and its variants', async () => {
    const created = await request(app)
      .post('/api/products')
      .set('Authorization', authHeader())
      .send(sample)
    const id = created.body.id

    const deleted = await request(app)
      .delete(`/api/products/${id}`)
      .set('Authorization', authHeader())
    expect(deleted.status).toBe(204)

    const afterDelete = await request(app).get(`/api/products/${id}`)
    expect(afterDelete.status).toBe(404)
  })
})
