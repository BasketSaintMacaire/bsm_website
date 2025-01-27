import fs from 'fs'
import { parse } from 'csv-parse/sync'

// Change these if needed
const INPUT_CSV_FILE = './src/scripts/bsm.csv'
const OUTPUT_JSON_FILE = './src/scripts/output.json'

/**
 * We'll define the "current year" from the system clock.
 * If you want a fixed year, just replace this with a constant, e.g. 2025.
 */
const CURRENT_YEAR = new Date().getFullYear()

/**
 * Returns true if row looks like a match row.
 * e.g., first column is "Sam 25/1" or "Dim 26/1".
 */
function isLikelyMatchRow(columns) {
  const firstCol = (columns[0] || '').trim()
  return /^Sam\s|^Dim\s/i.test(firstCol)
}

/**
 * Helper: get a safe column if it exists, else defaultValue.
 */
function safeCol(cols, idx, defaultValue = '') {
  if (idx < 0 || idx >= cols.length) return defaultValue
  const val = (cols[idx] || '').trim()
  return val.length ? val : defaultValue
}

/**
 * Convert col[0] (like "Sam 25/1") to "dd/mm/YYYY" using the current year.
 */
function parseDateString(str) {
  // example input: "Sam 25/1" or "Dim 26/1"
  // we can split by space => ["Sam","25/1"]
  // second part => day/month
  const parts = str.split('\n')
  if (parts.length < 2) return '' // fallback

  const dayMonth = parts[1].split('/') // ["25","1"]
  if (dayMonth.length < 2) return '' // fallback

  let day = parseInt(dayMonth[0], 10)
  let month = parseInt(dayMonth[1], 10)

  // zero-pad
  const dd = String(day).padStart(2, '0')
  const mm = String(month).padStart(2, '0')
  // use CURRENT_YEAR
  return `${dd}/${mm}/${CURRENT_YEAR}`
}

/**
 * Convert a CSV row to a Match-like object
 */
function convertRowToMatch(columns) {
  // date is col[0], convert to dd/mm/yyyy
  const date = parseDateString(safeCol(columns, 0))

  // team = col[1], group = col[2]
  const team = safeCol(columns, 1)
  const group = safeCol(columns, 2)

  // Check if col[3] is non-empty => home match
  const col3 = safeCol(columns, 3)
  let isDomicile
  let location
  let opponent

  if (col3) {
    // Home
    isDomicile = true
    location = col3 // col[3]
    opponent = safeCol(columns, 4)
  } else {
    // Away
    isDomicile = false
    location = safeCol(columns, 8)
    opponent = safeCol(columns, 7)
  }

  // times
  const time_start = safeCol(columns, 5)
  const time_meetup = safeCol(columns, 6)

  // family_duety => cols[9,10,11], ignoring empty
  const family_duety = [safeCol(columns, 9), safeCol(columns, 10), safeCol(columns, 11)].filter(
    (x) => x !== '',
  )

  // referees => cols[12,13], ignoring empty
  const referees = [safeCol(columns, 12), safeCol(columns, 13)].filter((x) => x !== '')

  // bar => col[14]
  const bar = safeCol(columns, 14, null) || null

  // result => col[15], split by "-"
  let result = []
  const col15 = safeCol(columns, 15, '')
  if (col15) {
    const parts = col15.split('-')
    result = parts.map((p) => parseInt(p, 10)).filter((num) => !isNaN(num))
  }

  // build final object
  return {
    date,
    team,
    group,
    isDomicile,
    time_start,
    time_meetup: time_meetup || null, // if empty, store null
    opponent: opponent || null,
    location: location || null,
    family_duety,
    referees,
    bar,
    result,
  }
}

// ---------- MAIN SCRIPT ----------

// Read the CSV
const rawCSV = fs.readFileSync(INPUT_CSV_FILE, 'utf8')

// Parse it (relaxed config)
const rows = parse(rawCSV, {
  relaxQuotes: true,
  relaxColumnCount: true,
  skipEmptyLines: true,
})

// Convert each row
const matches = rows
  .filter(isLikelyMatchRow) // only rows that start with "Sam " or "Dim "
  .map((row) => convertRowToMatch(row))

// Write JSON output to file
fs.writeFileSync(OUTPUT_JSON_FILE, JSON.stringify(matches, null, 2), 'utf8')
console.log(`Done! Wrote ${matches.length} entries to ${OUTPUT_JSON_FILE}.`)
