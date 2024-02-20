import { afterAll, beforeAll, it, describe, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'new transaction',
        amount: 100,
        type: 'credit',
      })
      .expect(201)
  })
  it('should be able to list transactions', async () => {
    const createCookie = await request(app.server).post('/transactions').send({
      title: 'new transaction',
      amount: 100,
      type: 'credit',
    })

    const cookies = createCookie.get('Set-Cookie')

    const listTransactionsTest = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsTest.body.transactions).toEqual([
      expect.objectContaining({
        title: 'new transaction',
        amount: 100,
      }),
    ])
  })
})
