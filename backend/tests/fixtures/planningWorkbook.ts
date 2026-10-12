import ExcelJS from 'exceljs'

// Builds a workbook shaped like the federation's "planning" export (e.g.
// "J2 19-20 Sept.xlsx"): a header row, a merged "DOMICILE"/"EXTERIEUR" marker
// row, and match rows with Excel time-of-day values (epoch 1899-12-30).
export const excelTime = (hh: number, mm: number) => new Date(Date.UTC(1899, 11, 30, hh, mm))

const HEADER = [
  'Date', 'Equipe', 'Poule', 'Salle', 'Contre', 'Match', 'RDV', 'Equipe', 'Salle', 'Tables', 'Tables', 'Arbitres', 'Arbitres', 'Bar',
]

/** A home match row; `overrides` replaces cells by 0-based column index. */
export function homeRow(overrides: Record<number, unknown> = {}): unknown[] {
  const row: unknown[] = [
    'Sam\n19/9', 'U9-F1', 'D1A', 'Salle Pierre de\nCoubertin', 'PUY SAINT BONNET BASKET',
    excelTime(9, 0), excelTime(8, 30), 'OUVERTURE', '', '', '', 'LOUISE BRIN', 'CLARA THARREAU', 'Grégory DUPONT',
  ]
  for (const [i, v] of Object.entries(overrides)) row[Number(i)] = v
  return row
}

export function awayRow(): unknown[] {
  return [
    'Dim\n20/9', 'U18-M3 CTC', 'D4E', 'SALLE N°1 St André', 'VIHIERS BASKET 3',
    excelTime(10, 0), excelTime(9, 15), '', '', '', '', '', '', '',
  ]
}

export async function buildPlanningWorkbook(
  home: unknown[][] = [homeRow()],
  away: unknown[][] = [awayRow()],
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('planning')
  sheet.addRow(HEADER)
  sheet.addRow(['DOMICILE'])
  sheet.mergeCells(`A${sheet.rowCount}:N${sheet.rowCount}`)
  home.forEach((r) => sheet.addRow(r))
  sheet.addRow(['EXTERIEUR'])
  sheet.mergeCells(`A${sheet.rowCount}:N${sheet.rowCount}`)
  away.forEach((r) => sheet.addRow(r))
  return Buffer.from(await workbook.xlsx.writeBuffer())
}
