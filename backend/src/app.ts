import express from 'express'
import cors from 'cors'
import { env } from './env'
import { errorHandler } from './middleware/errorHandler'
import authRouter from './routes/auth.routes'
import contactRouter from './routes/contact.routes'
import ordersRouter from './routes/orders.routes'
import committeesRouter from './routes/committees.routes'
import keyRolesRouter from './routes/keyRoles.routes'
import historyEventsRouter from './routes/historyEvents.routes'
import matchesRouter from './routes/matches.routes'
import newsRouter from './routes/news.routes'
import productsRouter from './routes/products.routes'
import seasonEventsRouter from './routes/seasonEvents.routes'
import teamsRouter from './routes/teams.routes'
import trainingSchedulesRouter from './routes/trainingSchedules.routes'
import galleryImagesRouter from './routes/galleryImages.routes'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: env.CORS_ORIGINS.length > 0 ? env.CORS_ORIGINS : false,
    }),
  )
  app.use(express.json())

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

  app.use('/api/auth', authRouter)
  app.use('/api/contact', contactRouter)
  app.use('/api/orders', ordersRouter)
  app.use('/api/committees', committeesRouter)
  app.use('/api/key-roles', keyRolesRouter)
  app.use('/api/history-events', historyEventsRouter)
  app.use('/api/matches', matchesRouter)
  app.use('/api/news', newsRouter)
  app.use('/api/products', productsRouter)
  app.use('/api/season-events', seasonEventsRouter)
  app.use('/api/teams', teamsRouter)
  app.use('/api/training-schedules', trainingSchedulesRouter)
  app.use('/api/gallery-images', galleryImagesRouter)

  app.use(errorHandler)

  return app
}
