import { app } from './app'
import { env } from './env'

const port = 3333

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Server listening on: http://localhost:${port}`)
  })
