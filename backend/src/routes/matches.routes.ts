import { Router } from 'express'
import { Match } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '../prisma'
import { requireAuth } from '../middleware/auth'
import { asyncHandler } from '../middleware/asyncHandler'
import { parsePlanningXlsx, PlanningFormatError, PlanningIssue } from '../lib/planningXlsx'
import {
  buildFileRejectedReport,
  buildPlanningReport,
  buildSystemReport,
  ImportOutcome,
  SystemIssue,
} from '../lib/importReport'

const router = Router()

// Wire format matches the club's historical matchs.json field names (snake_case
// for time_start/time_meetup/board_official), which the frontend's Match model
// and PlanningView.vue are written against. Prisma columns stay camelCase.
const matchSchema = z.object({
  date: z.coerce.date(),
  team: z.string().min(1),
  group: z.string().min(1),
  isDomicile: z.boolean(),
  time_start: z.string().min(1),
  time_meetup: z.string().nullable().optional(),
  opponent: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  board_official: z.array(z.string()),
  referees: z.array(z.string()),
  bar: z.string().nullable().optional(),
  result: z.array(z.number().int()),
})

function toWire(match: Match) {
  const { timeStart, timeMeetup, boardOfficial, ...rest } = match
  return {
    ...rest,
    time_start: timeStart,
    time_meetup: timeMeetup,
    board_official: boardOfficial,
  }
}

function toColumns(data: z.infer<typeof matchSchema>) {
  const { time_start, time_meetup, board_official, ...rest } = data
  return {
    ...rest,
    timeStart: time_start,
    timeMeetup: time_meetup,
    boardOfficial: board_official,
  }
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { team, from, to } = req.query
    const where: Record<string, unknown> = {}
    if (typeof team === 'string') where.team = team
    if (typeof from === 'string' || typeof to === 'string') {
      where.date = {
        ...(typeof from === 'string' ? { gte: new Date(from) } : {}),
        ...(typeof to === 'string' ? { lte: new Date(to) } : {}),
      }
    }
    const matches = await prisma.match.findMany({ where, orderBy: { date: 'asc' } })
    res.json(matches.map(toWire))
  }),
)

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const match = await prisma.match.findUnique({ where: { id: Number(req.params.id) } })
    if (!match) return res.status(404).json({ error: 'Not found' })
    res.json(toWire(match))
  }),
)

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = matchSchema.parse(req.body)
    const match = await prisma.match.create({ data: toColumns(data) })
    res.status(201).json(toWire(match))
  }),
)

// Planning import, shared by the admin "Import planning (Excel)" button and the
// Make e-mail automation. Upserts on the (date, team) natural key so a corrected
// planning re-sent later updates matches instead of failing on duplicates.
// Status codes drive the Make routing: 200 and 422 are reported to the planning
// sender (reportText/reportHtml), anything else is a technical failure.
const importSchema = z.object({
  filename: z.string().optional(),
  contentBase64: z.string().min(1),
})

function describeZodIssues(error: z.ZodError): string {
  return error.issues.map((issue) => `champ « ${issue.path.join('.')} » invalide`).join(', ')
}

router.post(
  '/import',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { contentBase64, filename = 'planning.xlsx' } = importSchema.parse(req.body)

    let parsed
    try {
      parsed = await parsePlanningXlsx(Buffer.from(contentBase64, 'base64'))
    } catch (err) {
      if (!(err instanceof PlanningFormatError)) throw err
      const report = buildFileRejectedReport(filename, err.message)
      res.status(422).json({ error: err.message, reportText: report.text, reportHtml: report.html })
      return
    }

    const formatErrors: PlanningIssue[] = [...parsed.issues]
    const systemErrors: SystemIssue[] = []
    let created = 0
    let updated = 0

    for (const { row, label, match } of parsed.matches) {
      const validated = matchSchema.safeParse(match)
      if (!validated.success) {
        formatErrors.push({ row, label, reason: describeZodIssues(validated.error) })
        continue
      }
      const data = toColumns(validated.data)
      try {
        const existing = await prisma.match.findUnique({
          where: { date_team_unique: { date: data.date, team: data.team } },
        })
        if (existing) {
          // The planning never carries scores: keep a result already entered.
          await prisma.match.update({
            where: { id: existing.id },
            data: { ...data, result: data.result.length > 0 ? data.result : existing.result },
          })
          updated++
        } else {
          await prisma.match.create({ data })
          created++
        }
      } catch (err) {
        console.error(err)
        systemErrors.push({ row, label, error: err instanceof Error ? err.message : String(err) })
      }
    }

    formatErrors.sort((a, b) => a.row - b.row)
    const outcome: ImportOutcome = {
      filename,
      total: parsed.matches.length + parsed.issues.length,
      created,
      updated,
      formatErrors,
      systemErrors,
    }
    const report = buildPlanningReport(outcome)
    const systemReport = systemErrors.length > 0 ? buildSystemReport(outcome) : null

    res.json({
      ...outcome,
      imported: created + updated,
      hasFormatErrors: formatErrors.length > 0,
      hasSystemErrors: systemErrors.length > 0,
      reportText: report.text,
      reportHtml: report.html,
      systemReportText: systemReport?.text ?? null,
      systemReportHtml: systemReport?.html ?? null,
    })
  }),
)

router.put(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = matchSchema.parse(req.body)
    const match = await prisma.match.update({
      where: { id: Number(req.params.id) },
      data: toColumns(data),
    })
    res.json(toWire(match))
  }),
)

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.match.delete({ where: { id: Number(req.params.id) } })
    res.status(204).end()
  }),
)

export default router
