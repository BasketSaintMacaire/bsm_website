import { readFileSync, existsSync, writeFileSync } from 'fs'
import { parse } from 'csv-parse/sync'

// ------------------- CONFIG -------------------

// Example file paths. Adjust to your actual file names/locations:
const BASE_JSON_FILE = './src/assets/storage_json/matchs.json'
const NEW_CSV_FILE = './src/scripts/planning.csv'
const OUTPUT_JSON_FILE = BASE_JSON_FILE
// We'll overwrite the existing base.json, but if you prefer you can change OUTPUT_JSON_FILE

/**
 * We'll define the "current year" from the system clock.
 * If you want a fixed year, just replace this with a constant, e.g. 2025.
 */
const CURRENT_YEAR = new Date().getFullYear()

/**
 * The structure of your Match object is the same as before:
 * {
 *   date: string          // e.g. "25/01/2025"
 *   team: string
 *   group: string
 *   isDomicile: boolean
 *   time_start: string
 *   time_meetup: string | null
 *   opponent: string | null
 *   location: string | null
 *   board_official: string[]
 *   referees: string[]
 *   bar: string | null
 *   result: number[]
 * }
 */

// ------------------- HELPER FUNCTIONS -------------------

/**
 * Return true if the row (array of columns) looks like a match row:
 * - col[0] starts with "Sam " or "Dim ".
 */
function isLikelyMatchRow(columns) {
  const firstCol = (columns[0] || '').trim()
  return /^(?:sam|dim)\b/i.test(firstCol) 
}

/**
 * Safe column getter.
 */
function safeCol(cols, idx, defaultValue = '') {
  if (idx < 0 || idx >= cols.length) return defaultValue
  const val = (cols[idx] || '').trim()
  return val.length ? val : defaultValue
}

/**
 * Parse something like "Sam 25/1" => "dd/mm/YYYY" using CURRENT_YEAR.
 */
function parseDateString(str) {
  // example: "Sam 25/1" => ["Sam","25/1"] => day=25, month=1
  const parts = str.split(' ')
  if (parts.length < 2) return ''
  const dayMonth = parts[1].split('/')
  if (dayMonth.length < 2) return ''

  const day = parseInt(dayMonth[0], 10)
  const month = parseInt(dayMonth[1], 10)

  // zero-pad
  const dd = String(day).padStart(2, '0')
  const mm = String(month).padStart(2, '0')

  return `${dd}/${mm}/${CURRENT_YEAR}`
}

/**
 * Convert a row of CSV into a Match-like object,
 * based on the new rules you specified:
 *
 *  - if col[3] non-empty => home => location=col[3], opponent=col[4]
 *  - else => away => location=col[8], opponent=col[7]
 *  - date in col[0] => transform "Sam 25/1" => "dd/mm/yyyy"
 *  - team = col[1], group = col[2]
 *  - time_start = col[5], time_meetup = col[6]
 *  - board_official = col[9..11], referees = col[12..13], bar=col[14]
 *  - result = col[15] => split by "-"
 */
function convertRowToMatch(columns) {
  const dateRaw = safeCol(columns, 0)
  const date = parseDateString(dateRaw)

  const team = safeCol(columns, 1)
  const group = safeCol(columns, 2)

  let isDomicile = safeCol(columns, 3) == "DOMICILE"
  let location = safeCol(columns, 4)
  let opponent = safeCol(columns, 5)

  const time_start = safeCol(columns, 6)
  const time_meetup = safeCol(columns, 7) || null

  // board_official => col[10..11]
  const board_official = [safeCol(columns, 10), safeCol(columns, 11)].filter((x) => x !== '')

  // referees => col[12..13]
  const referees = [safeCol(columns, 12), safeCol(columns, 13)].filter((x) => x !== '')

  // bar => col[14]
  const barValue = safeCol(columns, 14, null)
  const bar = barValue || null

  // result => col[15], split by "-"
  let result = []
  const col15 = safeCol(columns, 15, '')
  if (col15) {
    const parts = col15.split('-')
    result = parts.map((part) => parseInt(part, 10)).filter((num) => !isNaN(num))
  }

  return {
    date,
    team,
    group,
    isDomicile,
    time_start,
    time_meetup,
    opponent: opponent || null,
    location: location || null,
    board_official,
    referees,
    bar,
    result,
  }
}

/**
 * Read the new CSV file and parse it into an array of Match objects.
 */
function parseNewCSVFile(csvFile) {
  const rawCSV = readFileSync(csvFile, 'utf8')

  // parse
  const rows = parse(rawCSV, {
    relaxQuotes: true,
    relaxColumnCount: true,
    skipEmptyLines: true,
  })

  // convert
  const matches = rows.filter(isLikelyMatchRow).map(convertRowToMatch)

  return matches
}

/**
 * Build a unique key from date + team.
 */
function buildMatchKey(match) {
  return `${match.date}__${match.team}`
}

// ------------------- MAIN LOGIC -------------------

try {
  // 1. Read the base JSON file
  let baseMatches = []
  if (existsSync(BASE_JSON_FILE)) {
    const baseJsonRaw = readFileSync(BASE_JSON_FILE, 'utf8')
    baseMatches = JSON.parse(baseJsonRaw)
    if (!Array.isArray(baseMatches)) {
      throw new Error('Base JSON does not contain an array')
    }
  }

  // 2. Convert baseMatches to a Map for easy lookup by key
  const baseMap = new Map()
  for (const bm of baseMatches) {
    const key = buildMatchKey(bm)
    baseMap.set(key, bm)
  }
  console.log('Base Matches:', baseMatches.length)

  // 3. Parse the new CSV file
  const newMatches = parseNewCSVFile(NEW_CSV_FILE)

  // 4. For each new match:
  //    - build the key
  //    - if it exists, overwrite all fields
  //    - if it doesn’t exist, add it
  for (const nm of newMatches) {
    const key = buildMatchKey(nm)
    baseMap.set(key, nm)
  }

  // 5. Convert the map back into an array
  const updatedMatches = Array.from(baseMap.values())

  console.log('Updated Matches:', updatedMatches.length)
  // 6. Write to the base JSON file (overwriting it)
  writeFileSync(OUTPUT_JSON_FILE, JSON.stringify(updatedMatches, null, 2), 'utf8')
  console.log(
    `Done! ${newMatches.length} new/updated matches processed. Saved to ${OUTPUT_JSON_FILE}.`,
  )
} catch (err) {
  console.error('ERROR:', err.message)
  process.exit(1)
}
