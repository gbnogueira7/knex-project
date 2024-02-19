import { FastifyInstance } from 'fastify'
import knex from 'knex'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions')
      .where('amount', 1000)
      .select('*')
    return transactions
  })
}
