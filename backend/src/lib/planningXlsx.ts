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

// A season runs from July to June: a planning for "Sam 10/1" sent in December
// belongs to the next calendar year, one for "Sam 19/9" sent in May to the
// previous one.
const SEASON_START_MONTH = 7

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

export interface PlanningRow {
  /** 1-based spreadsheet row number, as shown in Excel. */
  row: number
  /** Human label for reports, e.g. "Sam 19/9 – U9-F1". */
  label: string
}

export interface ParsedPlanningRow extends PlanningRow {
  match: MatchImportPayload
}

export interface PlanningIssue extends PlanningRow {
  reason: string
}

export interface ParsedPlanning {
  matches: ParsedPlanningRow[]
  issues: PlanningIssue[]
}

export class PlanningFormatError extends Error {}

function cellString(row: ExcelJS.Row, col: number): string {
  const value = row.getCell(col).value
  if (value == null) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'object' && 'richText' in value) {
    return value.richText.map((part) => part.text).join('').trim()
  }
  if (typeof value === 'object' && 'text' in value) return String(value.text).trim()
  if (typeof value === 'object' && 'result' in value) return String(value.result ?? '').trim()
  return String(value).trim()
}

function formatTime(totalMinutes: number): string {
  const hh = String(Math.floor(totalMinutes / 60) % 24).padStart(2, '0')
  const mm = String(totalMinutes % 60).padStart(2, '0')
  return `${hh}:${mm}`
}

/**
 * Time-only cells come back as a Date anchored on the Excel epoch (1899-12-30),
 * or as a raw day fraction when the cell lost its time format.
 */
function cellTime(row: ExcelJS.Row, col: number): string | null {
  const value = row.getCell(col).value
  if (value instanceof Date) return formatTime(value.getUTCHours() * 60 + value.getUTCMinutes())
  if (typeof value === 'number' && value >= 0 && value < 1) return formatTime(Math.round(value * 24 * 60))
  const text = cellString(row, col)
  return text || null
}

function sectionOf(row: ExcelJS.Row): 'DOMICILE' | 'EXTERIEUR' | null {
  const marker = cellString(row, 1).toUpperCase()
  return marker === 'DOMICILE' || marker === 'EXTERIEUR' ? marker : null
}

function isMatchRow(row: ExcelJS.Row): boolean {
  return /^(?:sam|dim)\b/i.test(cellString(row, COL.date))
}

export function seasonYearFor(month: number, today = new Date()): number {
  const seasonStart =
    today.getMonth() + 1 >= SEASON_START_MONTH ? today.getFullYear() : today.getFullYear() - 1
  return month >= SEASON_START_MONTH ? seasonStart : seasonStart + 1
}

/** "Sam\n19/9" => ISO date string, year inferred from the current season. */
export function parseDateCell(str: string, today = new Date()): string | null {
  const parts = str.trim().split(/\s+/)
  if (parts.length < 2) return null
  const [dayStr, monthStr] = parts[1].split('/')
  const day = parseInt(dayStr, 10)
  const month = parseInt(monthStr, 10)
  if (Number.isNaN(day) || Number.isNaN(month)) return null
  const year = seasonYearFor(month, today)
  // Rejects impossible dates like 31/2 instead of letting them roll over.
  const check = new Date(Date.UTC(year, month - 1, day))
  if (check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return null
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function convertRow(
  row: ExcelJS.Row,
  section: 'DOMICILE' | 'EXTERIEUR' | null,
  today: Date,
): MatchImportPayload | string {
  if (!section) return 'ligne placée avant la première section « DOMICILE » / « EXTERIEUR »'

  const date = parseDateCell(cellString(row, COL.date), today)
  const team = cellString(row, COL.team)
  const group = cellString(row, COL.group)
  const timeStart = cellTime(row, COL.timeStart)

  const missing = [
    !date && 'date illisible (format attendu : « Sam 19/9 »)',
    !team && 'équipe manquante (colonne B)',
    !group && 'poule manquante (colonne C)',
    !timeStart && 'heure du match manquante (colonne F)',
  ].filter(Boolean)
  if (missing.length > 0) return missing.join(', ')

  const boardOfficial = [cellString(row, COL.boardOfficial1), cellString(row, COL.boardOfficial2)].filter(
    Boolean,
  )
  const referees = [cellString(row, COL.referee1), cellString(row, COL.referee2)].filter(Boolean)

  return {
    date: date as string,
    team,
    group,
    isDomicile: section === 'DOMICILE',
    time_start: timeStart as string,
    time_meetup: cellTime(row, COL.timeMeetup),
    opponent: cellString(row, COL.opponent) || null,
    location: cellString(row, COL.location) || null,
    board_official: boardOfficial,
    referees,
    bar: cellString(row, COL.bar) || null,
    result: [],
  }
}

export async function parsePlanningXlsx(
  buffer: ArrayBuffer | Buffer,
  today = new Date(),
): Promise<ParsedPlanning> {
  const workbook = new ExcelJS.Workbook()
  try {
    await workbook.xlsx.load(buffer as ArrayBuffer)
  } catch {
    throw new PlanningFormatError(
      "Le fichier n'est pas un classeur Excel (.xlsx) lisible. Les anciens fichiers .xls doivent être réenregistrés en .xlsx.",
    )
  }
  const sheet = workbook.worksheets[0]
  if (!sheet) throw new PlanningFormatError('Le classeur ne contient aucune feuille.')

  const matches: ParsedPlanningRow[] = []
  const issues: PlanningIssue[] = []
  let section: 'DOMICILE' | 'EXTERIEUR' | null = null

  sheet.eachRow((row, rowNumber) => {
    const marker = sectionOf(row)
    if (marker) {
      section = marker
      return
    }
    if (!isMatchRow(row)) return

    const dateText = cellString(row, COL.date).replace(/\s+/g, ' ')
    const team = cellString(row, COL.team)
    const label = team ? `${dateText} – ${team}` : dateText
    const result = convertRow(row, section, today)
    if (typeof result === 'string') issues.push({ row: rowNumber, label, reason: result })
    else matches.push({ row: rowNumber, label, match: result })
  })

  if (matches.length === 0 && issues.length === 0) {
    throw new PlanningFormatError(
      "Aucun match trouvé dans le fichier. Vérifiez qu'il s'agit bien d'un export de planning (lignes commençant par « Sam » ou « Dim », sous une section « DOMICILE » ou « EXTERIEUR »).",
    )
  }

  return { matches, issues }
}
