import { afterAll, afterEach } from 'vitest'
import { prisma } from '../src/prisma'

const TABLES = [
  'committees',
  'key_roles',
  'history_events',
  'matches',
  'news_articles',
  'products',
  'product_variants',
  'flockings',
  'season_events',
  'teams',
  'players',
  'week_schedules',
  'day_schedules',
  'training_sessions',
]

afterEach(async () => {
  const quoted = TABLES.map((t) => `"${t}"`).join(',')
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE`)
})

afterAll(async () => {
  await prisma.$disconnect()
})
