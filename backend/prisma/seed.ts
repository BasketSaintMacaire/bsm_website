import { PrismaClient, TeamCategory } from '@prisma/client'
import committees from './seed-data/committees.json'
import historyEvents from './seed-data/history_events.json'
import keyRoles from './seed-data/key_roles.json'
import matches from './seed-data/matchs.json'
import newsArticles from './seed-data/news_article.json'
import products from './seed-data/products.json'
import seasonEvents from './seed-data/season_events.json'
import teams from './seed-data/team.json'
import weekSchedules from './seed-data/training.json'

const prisma = new PrismaClient()

function parseDdMmYyyy(value: string): Date {
  const [day, month, year] = value.split('/').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

async function alreadySeeded(): Promise<boolean> {
  const counts = await Promise.all([
    prisma.committee.count(),
    prisma.keyRole.count(),
    prisma.historyEvent.count(),
    prisma.match.count(),
    prisma.newsArticle.count(),
    prisma.product.count(),
    prisma.seasonEvent.count(),
    prisma.team.count(),
    prisma.weekSchedule.count(),
  ])
  return counts.some((count) => count > 0)
}

async function main() {
  if (await alreadySeeded()) {
    console.log('Database already has data in one or more tables — skipping seed.')
    return
  }

  await prisma.committee.createMany({
    data: committees.map((c) => ({
      name: c.name,
      description: c.description,
      icon: c.icon,
      email: c.email,
      members: c.members,
    })),
  })
  console.log(`Seeded ${committees.length} committees`)

  await prisma.keyRole.createMany({ data: keyRoles })
  console.log(`Seeded ${keyRoles.length} key roles`)

  await prisma.historyEvent.createMany({ data: historyEvents })
  console.log(`Seeded ${historyEvents.length} history events`)

  await prisma.match.createMany({
    data: matches.map((m) => ({
      date: parseDdMmYyyy(m.date),
      team: m.team,
      group: m.group,
      isDomicile: m.isDomicile,
      timeStart: m.time_start,
      timeMeetup: m.time_meetup,
      opponent: m.opponent,
      location: m.location,
      boardOfficial: m.board_official,
      referees: m.referees,
      bar: m.bar,
      result: m.result,
    })),
  })
  console.log(`Seeded ${matches.length} matches`)

  await prisma.newsArticle.createMany({
    data: newsArticles.map((a) => ({
      title: a.title,
      excerpt: a.excerpt,
      content: a.content,
      date: new Date(a.date),
      image: a.image,
      category: a.category,
    })),
  })
  console.log(`Seeded ${newsArticles.length} news articles`)

  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        category: product.category,
        imageFolder: product.imageFolder,
        description: product.description,
        variants: { create: product.variants },
        flocking: product.flocking ? { create: product.flocking } : undefined,
      },
    })
  }
  console.log(`Seeded ${products.length} products`)

  await prisma.seasonEvent.createMany({ data: seasonEvents })
  console.log(`Seeded ${seasonEvents.length} season events`)

  for (const team of teams) {
    await prisma.team.create({
      data: {
        name: team.name,
        image: team.image,
        season: team.season,
        category: team.category as TeamCategory,
        players: {
          create: team.players.map((p) => ({
            name: p.name,
            position: p.position,
            number: p.number,
          })),
        },
      },
    })
  }
  console.log(`Seeded ${teams.length} teams`)

  for (const week of weekSchedules) {
    await prisma.weekSchedule.create({
      data: {
        name: week.name,
        period: (week as { period?: string }).period ?? null,
        days: {
          create: week.days.map((day) => ({
            date: day.date,
            sessions: {
              create: day.sessions.map((session) => ({
                time: session.time,
                groups: session.groups,
                location: session.location,
                trainer: session.trainer,
                notes: (session as { notes?: string }).notes ?? null,
              })),
            },
          })),
        },
      },
    })
  }
  console.log(`Seeded ${weekSchedules.length} week schedules`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
