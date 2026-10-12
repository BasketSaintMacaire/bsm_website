import { PlanningIssue, PlanningRow } from './planningXlsx'

// Builds the e-mails the Make scenario sends verbatim after a planning import:
// one for the planning sender (format problems they can fix and resend), one
// for the webmaster (technical failures). Kept server-side so Make never has
// to loop over arrays to compose text.

export interface SystemIssue extends PlanningRow {
  error: string
}

export interface ImportOutcome {
  filename: string
  total: number
  created: number
  updated: number
  formatErrors: PlanningIssue[]
  systemErrors: SystemIssue[]
}

const SIGNATURE = '— Import automatique du site BSM'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function render(paragraphs: (string | string[])[]): { text: string; html: string } {
  const text = paragraphs
    .map((p) => (Array.isArray(p) ? p.map((line) => `- ${line}`).join('\n') : p))
    .join('\n\n')
  const html = paragraphs
    .map((p) =>
      Array.isArray(p)
        ? `<ul>${p.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>`
        : `<p>${escapeHtml(p)}</p>`,
    )
    .join('\n')
  return { text, html }
}

function rowRef(issue: PlanningRow): string {
  return `${issue.label} (ligne ${issue.row})`
}

export function buildPlanningReport(outcome: ImportOutcome) {
  const imported = outcome.created + outcome.updated
  const paragraphs: (string | string[])[] = [
    'Bonjour,',
    `${imported}/${outcome.total} match${outcome.total > 1 ? 's ont' : ' a'} été mis sur le site BSM ` +
      `(${outcome.created} ajouté${outcome.created > 1 ? 's' : ''}, ${outcome.updated} mis à jour) ` +
      `à partir du fichier « ${outcome.filename} ».`,
  ]

  if (outcome.formatErrors.length > 0) {
    paragraphs.push(outcome.formatErrors.map((i) => `Le problème du match ${rowRef(i)} : ${i.reason}.`))
    paragraphs.push(
      'Merci de renvoyer le fichier contenant la correction. Les matchs déjà importés seront simplement mis à jour, pas dupliqués.',
    )
  }

  if (outcome.systemErrors.length > 0) {
    paragraphs.push(
      outcome.systemErrors.map(
        (i) => `Le match ${rowRef(i)} n'a pas pu être enregistré suite à une erreur technique.`,
      ),
    )
    paragraphs.push("Le webmaster a été prévenu, inutile de renvoyer le fichier pour ces matchs.")
  }

  paragraphs.push(SIGNATURE)
  return render(paragraphs)
}

export function buildFileRejectedReport(filename: string, reason: string) {
  return render([
    'Bonjour,',
    `0 match n'a été mis sur le site BSM : le fichier « ${filename} » n'a pas pu être lu.`,
    `Le problème : ${reason}`,
    'Merci de renvoyer le fichier contenant la correction.',
    SIGNATURE,
  ])
}

export function buildSystemReport(outcome: ImportOutcome) {
  return render([
    `Import planning « ${outcome.filename} » : ${outcome.systemErrors.length} match(s) en erreur technique.`,
    outcome.systemErrors.map((i) => `${rowRef(i)} : ${i.error}`),
    SIGNATURE,
  ])
}
