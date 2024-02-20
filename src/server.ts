import { fastify } from 'fastify'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'

const app = fastify()

app.register(cookie)
const port = 3333

app.register(transactionsRoutes, {
  prefix: '/transactions',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Server listening on: http://localhost:${port}`)
  })
