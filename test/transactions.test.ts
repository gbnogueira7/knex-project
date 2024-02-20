import { afterAll, beforeAll, it, describe, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  // eslint-disable-next-line no-unused-expressions
  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
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

  it('should be able to list a transaction for id', async () => {
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

    const transactionId = listTransactionsTest.body.transactions[0].id

    const getTransactionsResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactionsResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'new transaction',
        amount: 100,
      }),
    )
  })

  it('should be able to get the summary', async () => {
    const createCookie = await request(app.server).post('/transactions').send({
      title: 'Credit transaction',
      amount: 5000,
      type: 'credit',
    })

    const cookies = createCookie.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'debit transaction',
        amount: 2000,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(201)

    expect(summaryResponse.body.summary).toEqual({
      amount: 3000,
    })
  })
})
