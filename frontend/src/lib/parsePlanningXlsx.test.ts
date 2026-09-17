import { describe, it, expect } from 'vitest'
import ExcelJS from 'exceljs'
import { parsePlanningXlsx, parseDateCell } from './parsePlanningXlsx'

// Builds a workbook shaped like the federation's "planning" export (e.g.
// "J2 19-20 Sept.xlsx"): a header row, a merged "DOMICILE"/"EXTERIEUR" marker
// row, and match rows with Excel time-of-day values (epoch 1899-12-30).
async function buildPlanningWorkbook(): Promise<ArrayBuffer> {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('planning')
  const excelTime = (hh: number, mm: number) => new Date(Date.UTC(1899, 11, 30, hh, mm))

  sheet.addRow([
    'Date', 'Equipe', 'Poule', 'Salle', 'Contre', 'Match', 'RDV', 'Equipe', 'Salle', 'Tables', 'Tables', 'Arbitres', 'Arbitres', 'Bar',
  ])
  sheet.addRow(['DOMICILE'])
  sheet.mergeCells('A2:N2')
  sheet.addRow([
    'Sam\n19/9', 'U9-F1', 'D1A', 'Salle Pierre de\nCoubertin', 'PUY SAINT BONNET BASKET',
    excelTime(9, 0), excelTime(8, 30), 'OUVERTURE', '', '', '', 'LOUISE BRIN', 'CLARA THARREAU', 'Grégory DUPONT',
  ])
  sheet.addRow(['EXTERIEUR'])
  sheet.mergeCells('A5:N5')
  sheet.addRow([
    'Dim\n20/9', 'U18-M3 CTC', 'D4E', 'SALLE N°1 St André', 'VIHIERS BASKET 3',
    excelTime(10, 0), excelTime(9, 15), '', '', '', '', '', '', '',
  ])

  const buffer = await workbook.xlsx.writeBuffer()
  return buffer as ArrayBuffer
}

describe('parseDateCell', () => {
  it('parses a "Sam\\n19/9" style cell into an ISO date for the given year', () => {
    expect(parseDateCell('Sam\n19/9', 2025)).toBe('2025-09-19')
  })

  it('returns null for malformed input', () => {
    expect(parseDateCell('Sam')).toBeNull()
    expect(parseDateCell('Sam abc')).toBeNull()
  })
})

describe('parsePlanningXlsx', () => {
  it('parses home and away matches from the section-based planning layout', async () => {
    const buffer = await buildPlanningWorkbook()
    const matches = await parsePlanningXlsx(buffer)

    expect(matches).toHaveLength(2)

    const [home, away] = matches
    expect(home.team).toBe('U9-F1')
    expect(home.group).toBe('D1A')
    expect(home.isDomicile).toBe(true)
    expect(home.location).toBe('Salle Pierre de\nCoubertin')
    expect(home.opponent).toBe('PUY SAINT BONNET BASKET')
    expect(home.time_start).toBe('09:00')
    expect(home.time_meetup).toBe('08:30')
    expect(home.board_official).toEqual([])
    expect(home.referees).toEqual(['LOUISE BRIN', 'CLARA THARREAU'])
    expect(home.bar).toBe('Grégory DUPONT')
    expect(home.result).toEqual([])

    expect(away.team).toBe('U18-M3 CTC')
    expect(away.isDomicile).toBe(false)
    expect(away.opponent).toBe('VIHIERS BASKET 3')
    expect(away.time_start).toBe('10:00')
    expect(away.time_meetup).toBe('09:15')
  })

  it('ignores rows before any section marker and rows missing required fields', async () => {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('planning')
    sheet.addRow(['Date', 'Equipe'])
    sheet.addRow(['Sam\n19/9', 'Orphan team'])
    sheet.addRow(['DOMICILE'])
    sheet.mergeCells('A3:N3')
    sheet.addRow(['Sam\n19/9', '', 'D1A'])
    const buffer = (await workbook.xlsx.writeBuffer()) as ArrayBuffer

    const matches = await parsePlanningXlsx(buffer)

    expect(matches).toHaveLength(0)
  })
})
