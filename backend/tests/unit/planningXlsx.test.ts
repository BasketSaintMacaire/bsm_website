import { describe, it, expect } from 'vitest'
import ExcelJS from 'exceljs'
import {
  parsePlanningXlsx,
  parseDateCell,
  seasonYearFor,
  PlanningFormatError,
} from '../../src/lib/planningXlsx'
import { buildPlanningWorkbook, homeRow, excelTime } from '../fixtures/planningWorkbook'

const OCTOBER_2026 = new Date(2026, 9, 12)
const MARCH_2027 = new Date(2027, 2, 1)

describe('seasonYearFor', () => {
  it('maps autumn months to the season start year and spring months to the next', () => {
    expect(seasonYearFor(9, OCTOBER_2026)).toBe(2026)
    expect(seasonYearFor(1, OCTOBER_2026)).toBe(2027)
    expect(seasonYearFor(11, MARCH_2027)).toBe(2026)
    expect(seasonYearFor(4, MARCH_2027)).toBe(2027)
  })
})

describe('parseDateCell', () => {
  it('parses a "Sam\\n19/9" style cell into an ISO date within the current season', () => {
    expect(parseDateCell('Sam\n19/9', OCTOBER_2026)).toBe('2026-09-19')
    expect(parseDateCell('Sam 10/1', OCTOBER_2026)).toBe('2027-01-10')
  })

  it('returns null for malformed or impossible input', () => {
    expect(parseDateCell('Sam')).toBeNull()
    expect(parseDateCell('Sam abc')).toBeNull()
    expect(parseDateCell('Sam 31/2')).toBeNull()
    expect(parseDateCell('Sam 1/13')).toBeNull()
  })
})

describe('parsePlanningXlsx', () => {
  it('parses home and away matches from the section-based planning layout', async () => {
    const { matches, issues } = await parsePlanningXlsx(await buildPlanningWorkbook(), OCTOBER_2026)

    expect(issues).toEqual([])
    expect(matches).toHaveLength(2)

    const [home, away] = matches
    expect(home.row).toBe(3)
    expect(home.label).toBe('Sam 19/9 – U9-F1')
    expect(home.match).toEqual({
      date: '2026-09-19',
      team: 'U9-F1',
      group: 'D1A',
      isDomicile: true,
      time_start: '09:00',
      time_meetup: '08:30',
      opponent: 'PUY SAINT BONNET BASKET',
      location: 'Salle Pierre de\nCoubertin',
      board_official: [],
      referees: ['LOUISE BRIN', 'CLARA THARREAU'],
      bar: 'Grégory DUPONT',
      result: [],
    })

    expect(away.match.team).toBe('U18-M3 CTC')
    expect(away.match.isDomicile).toBe(false)
    expect(away.match.time_start).toBe('10:00')
    expect(away.match.time_meetup).toBe('09:15')
  })

  it('accepts times typed as text or stored as a raw day fraction', async () => {
    const buffer = await buildPlanningWorkbook([homeRow({ 5: '20h30', 6: 0.8125 })], [])
    const { matches } = await parsePlanningXlsx(buffer)
    expect(matches[0].match.time_start).toBe('20h30')
    expect(matches[0].match.time_meetup).toBe('19:30')
  })

  it('reports match rows it cannot import instead of dropping them silently', async () => {
    const buffer = await buildPlanningWorkbook(
      [homeRow({ 5: null }), homeRow({ 0: 'Sam 31/2', 1: 'U11-F2' })],
      [],
    )
    const { matches, issues } = await parsePlanningXlsx(buffer)

    expect(matches).toEqual([])
    expect(issues).toEqual([
      { row: 3, label: 'Sam 19/9 – U9-F1', reason: 'heure du match manquante (colonne F)' },
      { row: 4, label: 'Sam 31/2 – U11-F2', reason: 'date illisible (format attendu : « Sam 19/9 »)' },
    ])
  })

  it('reports match rows placed before any section marker', async () => {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('planning')
    sheet.addRow(['Sam\n19/9', 'Orphan team', 'D1A', '', '', excelTime(9, 0)])
    const buffer = Buffer.from(await workbook.xlsx.writeBuffer())

    const { issues } = await parsePlanningXlsx(buffer)
    expect(issues).toHaveLength(1)
    expect(issues[0].reason).toMatch(/avant la première section/)
  })

  it('throws a PlanningFormatError for a file that is not a workbook', async () => {
    await expect(parsePlanningXlsx(Buffer.from('not an excel file'))).rejects.toBeInstanceOf(
      PlanningFormatError,
    )
  })

  it('throws a PlanningFormatError when the sheet holds no match rows', async () => {
    const workbook = new ExcelJS.Workbook()
    workbook.addWorksheet('planning').addRow(['Date', 'Equipe'])
    const buffer = Buffer.from(await workbook.xlsx.writeBuffer())
    await expect(parsePlanningXlsx(buffer)).rejects.toThrow(/Aucun match trouvé/)
  })
})
