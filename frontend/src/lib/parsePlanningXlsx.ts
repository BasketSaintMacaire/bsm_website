import ExcelJS from 'exceljs'

// Column layout of the FFBB/league "planning" export (e.g. "J2 19-20 Sept.xlsx"):
// the sheet has no per-row home/away marker — instead a merged section row
// ("DOMICILE" / "EXTERIEUR") precedes each block of matches.
//   A: date ("Sam\n19/9")      F: time_start        K: board_official[1]
//   B: team                    G: time_meetup       L: referees[0]
//   C: group                   H-I: ouverture/       M: referees[1]
//   D: location                    fermeture flag    N: bar
//   E: opponent                J: board_official[0]
const COL = {
  date: 1,
  team: 2,
  group: 3,
  location: 4,
  opponent: 5,
  timeStart: 6,
  timeMeetup: 7,
  boardOfficial1: 10,
  boardOfficial2: 11,
  referee1: 12,
  referee2: 13,
  bar: 14,
} as const

export interface MatchImportPayload {
  date: string
  team: string
  group: string
  isDomicile: boolean
  time_start: string
  time_meetup: string | null
  opponent: string | null
  location: string | null
  board_official: string[]
  referees: string[]
  bar: string | null
  result: number[]
}

function cellString(row: ExcelJS.Row, col: number): string {
  const value = row.getCell(col).value
  if (value == null) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'object' && 'text' in value) return String((value as { text: unknown }).text).trim()
  return String(value).trim()
}

/** Time-only cells come back as a Date anchored on the Excel epoch (1899-12-30). */
function cellTime(row: ExcelJS.Row, col: number): string | null {
  const value = row.getCell(col).value
  if (value instanceof Date) {
    const hh = String(value.getUTCHours()).padStart(2, '0')
    const mm = String(value.getUTCMinutes()).padStart(2, '0')
    return `${hh}:${mm}`
  }
  if (typeof value === 'string' && value.trim()) return value.trim()
  return null
}

function sectionOf(row: ExcelJS.Row): 'DOMICILE' | 'EXTERIEUR' | null {
  const marker = cellString(row, 1).toUpperCase()
  return marker === 'DOMICILE' || marker === 'EXTERIEUR' ? marker : null
}

function isMatchRow(row: ExcelJS.Row): boolean {
  return /^(?:sam|dim)\b/i.test(cellString(row, COL.date))
}

/** "Sam\n19/9" => ISO date string for day=19, month=9, current year */
export function parseDateCell(str: string, year = new Date().getFullYear()): string | null {
  const parts = str.trim().split(/\s+/)
  if (parts.length < 2) return null
  const [dayStr, monthStr] = parts[1].split('/')
  const day = parseInt(dayStr, 10)
  const month = parseInt(monthStr, 10)
  if (Number.isNaN(day) || Number.isNaN(month)) return null
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function convertRow(row: ExcelJS.Row, isDomicile: boolean): MatchImportPayload | null {
  const date = parseDateCell(cellString(row, COL.date))
  const team = cellString(row, COL.team)
  const timeStart = cellTime(row, COL.timeStart)
  if (!date || !team || !timeStart) return null

  const boardOfficial = [cellString(row, COL.boardOfficial1), cellString(row, COL.boardOfficial2)].filter(
    Boolean,
  )
  const referees = [cellString(row, COL.referee1), cellString(row, COL.referee2)].filter(Boolean)

  return {
    date,
    team,
    group: cellString(row, COL.group),
    isDomicile,
    time_start: timeStart,
    time_meetup: cellTime(row, COL.timeMeetup),
    opponent: cellString(row, COL.opponent) || null,
    location: cellString(row, COL.location) || null,
    board_official: boardOfficial,
    referees,
    bar: cellString(row, COL.bar) || null,
    result: [],
  }
}

export async function parsePlanningXlsx(buffer: ArrayBuffer): Promise<MatchImportPayload[]> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)
  const sheet = workbook.worksheets[0]
  if (!sheet) return []

  const matches: MatchImportPayload[] = []
  let section: 'DOMICILE' | 'EXTERIEUR' | null = null

  sheet.eachRow((row) => {
    const marker = sectionOf(row)
    if (marker) {
      section = marker
      return
    }
    if (!isMatchRow(row)) return
    const match = convertRow(row, section === 'DOMICILE')
    if (match) matches.push(match)
  })

  return matches
}
