import { createApp } from './app'
import { env } from './env'

const app = createApp()

app.listen(env.PORT, () => {
  console.log(`BSM backend listening on port ${env.PORT}`)
})
