import { describe, it, expect, vi, afterEach } from 'vitest'
import request from 'supertest'
import { app, authHeader } from '../helpers'
import { prisma } from '../../src/prisma'
import { buildPlanningWorkbook, homeRow, awayRow, excelTime } from '../fixtures/planningWorkbook'

async function importFile(buffer: Buffer, filename = 'J2 19-20 Sept.xlsx') {
  return request(app)
    .post('/api/matches/import')
    .set('Authorization', authHeader())
    .send({ filename, contentBase64: buffer.toString('base64') })
}

describe('POST /api/matches/import', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('requires auth', async () => {
    const res = await request(app).post('/api/matches/import').send({ contentBase64: 'x' })
    expect(res.status).toBe(401)
  })

  it('rejects a request without file content as a 400', async () => {
    const res = await request(app)
      .post('/api/matches/import')
      .set('Authorization', authHeader())
      .send({ filename: 'x.xlsx' })
    expect(res.status).toBe(400)
  })

  it('creates every match and returns a ready-to-send report', async () => {
    const res = await importFile(await buildPlanningWorkbook())

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      total: 2,
      created: 2,
      updated: 0,
      imported: 2,
      hasFormatErrors: false,
      hasSystemErrors: false,
      systemReportText: null,
    })
    expect(res.body.reportText).toContain('2/2 matchs ont été mis sur le site BSM (2 ajoutés, 0 mis à jour)')
    expect(res.body.reportText).toContain('« J2 19-20 Sept.xlsx »')
    expect(await prisma.match.count()).toBe(2)
  })

  it('updates matches sharing the same (date, team) instead of failing, and keeps their result', async () => {
    await importFile(await buildPlanningWorkbook())
    const original = await prisma.match.findFirstOrThrow({ where: { team: 'U9-F1' } })
    await prisma.match.update({ where: { id: original.id }, data: { result: [54, 48] } })

    const corrected = await buildPlanningWorkbook(
      [homeRow({ 5: excelTime(11, 0), 13: 'Paul MARTIN' })],
      [awayRow()],
    )
    const res = await importFile(corrected)

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ total: 2, created: 0, updated: 2 })
    expect(await prisma.match.count()).toBe(2)

    const after = await prisma.match.findUniqueOrThrow({ where: { id: original.id } })
    expect(after.timeStart).toBe('11:00')
    expect(after.bar).toBe('Paul MARTIN')
    expect(after.result).toEqual([54, 48])
  })

  it('imports the valid rows and lists each format problem for the sender', async () => {
    const buffer = await buildPlanningWorkbook(
      [homeRow(), homeRow({ 1: 'U11-F2', 5: null })],
      [awayRow()],
    )
    const res = await importFile(buffer)

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ total: 3, imported: 2, hasFormatErrors: true })
    expect(res.body.formatErrors).toEqual([
      { row: 4, label: 'Sam 19/9 – U11-F2', reason: 'heure du match manquante (colonne F)' },
    ])
    expect(res.body.reportText).toContain('2/3 matchs ont été mis sur le site BSM')
    expect(res.body.reportText).toContain(
      'Le problème du match Sam 19/9 – U11-F2 (ligne 4) : heure du match manquante (colonne F).',
    )
    expect(res.body.reportText).toContain('Merci de renvoyer le fichier contenant la correction.')
    expect(res.body.reportHtml).toContain('<li>Le problème du match Sam 19/9 – U11-F2 (ligne 4)')
  })

  it('answers 422 with a sender report when the file is unreadable', async () => {
    const res = await importFile(Buffer.from('definitely not xlsx'), 'planning.xls')

    expect(res.status).toBe(422)
    expect(res.body.reportText).toContain("0 match n'a été mis sur le site BSM")
    expect(res.body.reportText).toContain('« planning.xls »')
    expect(await prisma.match.count()).toBe(0)
  })

  it('separates database failures into a webmaster report', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(prisma.match, 'create').mockRejectedValueOnce(new Error('connection lost'))

    const res = await importFile(await buildPlanningWorkbook())

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ total: 2, imported: 1, hasSystemErrors: true, hasFormatErrors: false })
    expect(res.body.reportText).toContain('1/2 matchs ont été mis sur le site BSM')
    expect(res.body.reportText).toContain('Le webmaster a été prévenu')
    expect(res.body.systemReportText).toContain('Sam 19/9 – U9-F1 (ligne 3) : connection lost')
  })
})

describe('POST /api/matches duplicate', () => {
  it('answers 409 instead of 500 when (date, team) already exists', async () => {
    const sample = {
      date: '2025-09-13',
      team: 'Séniors M1',
      group: 'A',
      isDomicile: true,
      time_start: '20:30',
      board_official: [],
      referees: [],
      result: [],
    }
    await request(app).post('/api/matches').set('Authorization', authHeader()).send(sample)
    const res = await request(app).post('/api/matches').set('Authorization', authHeader()).send(sample)
    expect(res.status).toBe(409)
  })
})
