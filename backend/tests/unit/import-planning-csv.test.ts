import { describe, it, expect } from 'vitest'
import { writeFileSync, mkdtempSync } from 'fs'
import { tmpdir } from 'os'
import path from 'path'
import {
  isLikelyMatchRow,
  safeCol,
  parseDateCell,
  convertRowToMatch,
  parsePlanningCsv,
} from '../../scripts/import-planning-csv'

describe('isLikelyMatchRow', () => {
  it('accepts rows starting with Sam or Dim (case-insensitive)', () => {
    expect(isLikelyMatchRow(['Sam 23/5'])).toBe(true)
    expect(isLikelyMatchRow(['dim 24/5'])).toBe(true)
  })

  it('rejects header/other rows', () => {
    expect(isLikelyMatchRow(['Date', 'Equipe'])).toBe(false)
    expect(isLikelyMatchRow([''])).toBe(false)
  })
})

describe('safeCol', () => {
  it('returns the trimmed value when present', () => {
    expect(safeCol(['  hello  '], 0)).toBe('hello')
  })

  it('returns the default for out-of-range or empty values', () => {
    expect(safeCol([], 0)).toBe('')
    expect(safeCol(['', ''], 5, null)).toBeNull()
    expect(safeCol(['   '], 0, 'fallback')).toBe('fallback')
  })
})

describe('parseDateCell', () => {
  it('parses "Sam dd/m" into a UTC date in the current year', () => {
    const date = parseDateCell('Sam 23/5')
    const currentYear = new Date().getFullYear()
    expect(date).toEqual(new Date(Date.UTC(currentYear, 4, 23)))
  })

  it('returns null for malformed input', () => {
    expect(parseDateCell('Sam')).toBeNull()
    expect(parseDateCell('Sam abc')).toBeNull()
  })
})

describe('convertRowToMatch', () => {
  it('maps a home match row', () => {
    const columns = [
      'Sam 23/5', // 0 date
      'Séniors M1', // 1 team
      'A', // 2 group
      'DOMICILE', // 3 type
      'Salle Pierre de Coubertin', // 4 location (home)
      'ORVAULT SPORTS BASKET - 1', // 5 opponent (home)
      '20:30', // 6 time_start
      '19:30', // 7 time_meetup
      '', // 8 unused
      '', // 9 unused
      'FERMETURE', // 10 board_official[0]
      'TIMOTHEE SIMON', // 11 board_official[1]
      'MAXIME COTTENCEAU', // 12 referees[0]
      'OFF', // 13 referees[1]
      'OFF', // 14 bar
      '85-72', // 15 result
    ]

    const match = convertRowToMatch(columns)

    expect(match).not.toBeNull()
    expect(match?.team).toBe('Séniors M1')
    expect(match?.group).toBe('A')
    expect(match?.isDomicile).toBe(true)
    expect(match?.location).toBe('Salle Pierre de Coubertin')
    expect(match?.opponent).toBe('ORVAULT SPORTS BASKET - 1')
    expect(match?.timeStart).toBe('20:30')
    expect(match?.timeMeetup).toBe('19:30')
    expect(match?.boardOfficial).toEqual(['FERMETURE', 'TIMOTHEE SIMON'])
    expect(match?.referees).toEqual(['MAXIME COTTENCEAU', 'OFF'])
    expect(match?.bar).toBe('OFF')
    expect(match?.result).toEqual([85, 72])
  })

  it('maps an away match row (no DOMICILE marker)', () => {
    const columns = ['Dim 24/5', 'Séniors M3', 'Finale D5', 'EXTERIEUR', 'Salle de ST Lambert', 'LONGUE 5', '13:45', '12:00']

    const match = convertRowToMatch(columns)

    expect(match?.isDomicile).toBe(false)
    expect(match?.opponent).toBe('LONGUE 5')
  })

  it('returns null when the date cell cannot be parsed', () => {
    expect(convertRowToMatch(['not-a-date', 'Team'])).toBeNull()
  })
})

describe('parsePlanningCsv', () => {
  it('parses a CSV file end-to-end, skipping the header row', () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'planning-csv-'))
    const file = path.join(dir, 'planning.csv')
    writeFileSync(
      file,
      [
        'Date,Equipe,Poule,TYPE,Salle,Contre,Match,RDV,Equipe,Salle,Tables,,Arbitres,,Bar',
        'Sam 23/5,U15-M1 CTC,1/2 Finales,DOMICILE,Salle Pierre,CTC Nantes,18:00,17:15,,,,,,OFF,OFF,',
      ].join('\n'),
    )

    const matches = parsePlanningCsv(file)

    expect(matches).toHaveLength(1)
    expect(matches[0].team).toBe('U15-M1 CTC')
  })
})
