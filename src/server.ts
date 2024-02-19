import { fastify } from 'fastify'
import { knex } from './database'
import crypto from 'node:crypto'
import { env } from './env'

const app = fastify()
const port = 3333

app.get('/', async () => {
  const transaction = await knex('transactions')
    .where('amount', 1000)
    .select('*')
  return transaction
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Server listening on: http://localhost:${port}`)
  })
