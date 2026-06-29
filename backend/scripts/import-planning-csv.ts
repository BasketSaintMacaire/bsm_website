import { readFileSync } from 'fs'
import { parse } from 'csv-parse/sync'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const CURRENT_YEAR = new Date().getFullYear()

export interface ParsedMatch {
  date: Date
  team: string
  group: string
  isDomicile: boolean
  timeStart: string
  timeMeetup: string | null
  opponent: string | null
  location: string | null
  boardOfficial: string[]
  referees: string[]
  bar: string | null
  result: number[]
}

export function isLikelyMatchRow(columns: string[]): boolean {
  const firstCol = (columns[0] || '').trim()
  return /^(?:sam|dim)\b/i.test(firstCol)
}

export function safeCol(
  cols: string[],
  idx: number,
  defaultValue: string | null = '',
): string | null {
  if (idx < 0 || idx >= cols.length) return defaultValue
  const val = (cols[idx] || '').trim()
  return val.length ? val : defaultValue
}

/** "Sam 25/1" => Date for day=25, month=1, CURRENT_YEAR */
export function parseDateCell(str: string): Date | null {
  const parts = str.split(' ')
  if (parts.length < 2) return null
  const dayMonth = parts[1].split('/')
  if (dayMonth.length < 2) return null

  const day = parseInt(dayMonth[0], 10)
  const month = parseInt(dayMonth[1], 10)
  if (Number.isNaN(day) || Number.isNaN(month)) return null

  return new Date(Date.UTC(CURRENT_YEAR, month - 1, day))
}

/**
 * Same column layout as the legacy merge-csv-into-base.js:
 *  - col[3] == 'DOMICILE' => home => location=col[4], opponent=col[5]
 *  - else => away
 *  - team = col[1], group = col[2]
 *  - time_start = col[6], time_meetup = col[7]
 *  - board_official = col[10..11], referees = col[12..13], bar = col[14]
 *  - result = col[15] split by "-"
 */
export function convertRowToMatch(columns: string[]): ParsedMatch | null {
  const date = parseDateCell(safeCol(columns, 0, '') ?? '')
  if (!date) return null

  const team = safeCol(columns, 1, '') ?? ''
  const group = safeCol(columns, 2, '') ?? ''

  const isDomicile = safeCol(columns, 3, '') === 'DOMICILE'
  const location = safeCol(columns, 4)
  const opponent = safeCol(columns, 5)

  const timeStart = safeCol(columns, 6, '') ?? ''
  const timeMeetup = safeCol(columns, 7)

  const boardOfficial = [safeCol(columns, 10, ''), safeCol(columns, 11, '')].filter(
    (x): x is string => !!x,
  )
  const referees = [safeCol(columns, 12, ''), safeCol(columns, 13, '')].filter(
    (x): x is string => !!x,
  )
  const bar = safeCol(columns, 14)

  let result: number[] = []
  const col15 = safeCol(columns, 15, '')
  if (col15) {
    result = col15
      .split('-')
      .map((part) => parseInt(part, 10))
      .filter((num) => !Number.isNaN(num))
  }

  return {
    date,
    team,
    group,
    isDomicile,
    timeStart,
    timeMeetup,
    opponent,
    location,
    boardOfficial,
    referees,
    bar,
    result,
  }
}

export function parsePlanningCsv(csvFile: string): ParsedMatch[] {
  let rawCsv = readFileSync(csvFile, 'utf8')

  // Remove line breaks inside quoted fields and replace with space
  rawCsv = rawCsv.replace(/"([^"]*)"/g, (match) => match.replace(/\r?\n\s*/g, ' '))
  // Remove all remaining quotes
  rawCsv = rawCsv.replace(/"/g, '')

  const rows: string[][] = parse(rawCsv, {
    relaxQuotes: true,
    relaxColumnCount: true,
    skipEmptyLines: true,
  })

  return rows
    .filter(isLikelyMatchRow)
    .map(convertRowToMatch)
    .filter((m): m is ParsedMatch => m !== null)
}

async function main() {
  const csvPath = process.argv[2] ?? './scripts/planning.csv'
  const matches = parsePlanningCsv(csvPath)

  console.log(`Parsed ${matches.length} matches from ${csvPath}`)

  for (const match of matches) {
    await prisma.match.upsert({
      where: { date_team_unique: { date: match.date, team: match.team } },
      update: match,
      create: match,
    })
  }

  console.log(`Upserted ${matches.length} matches.`)
}

/* v8 ignore start -- CLI entrypoint, exercised manually, not under coverage */
if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(() => prisma.$disconnect())
}
/* v8 ignore stop */
