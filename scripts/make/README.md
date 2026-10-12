# Make scenario: planning import by e-mail

`planning-import.blueprint.json` is a Make scenario that watches the website@bsmbasket.fr Gmail inbox. When
planning@bsmbasket.fr sends an e-mail whose subject contains "planning", it imports the attached `.xlsx`
the same way the admin "Import planning (Excel)" button does. The server-side behavior is documented on
`POST /api/matches/import` in `backend/src/routes/matches.routes.ts`.

## Flow

```
Gmail watch ─► router ─┬─ no .xlsx attached ─────────► reply to planning@ ("0 match… aucun fichier")
                       └─ .xlsx attached ─► HTTP login ─► router ─┬─ status ≠ 200 ─► mail website@ (system)
                              │ (network error ► mail website@)   └─ 200 ─► each attachment ─► HTTP import ─► router
                                                                                │ (network error ► mail website@)
            ┌───────────────────────────────────────────────────────────────────┘
            ├─ 200 or 422 ───────────────► reply to planning@ with data.reportHtml ("X/Y matchs…")
            ├─ 200 + hasSystemErrors ────► mail website@ with data.systemReportHtml
            └─ anything else ────────────► mail website@ with status + body
```

Format problems (a bad row, an unreadable file) go to planning@ so they can fix the file and resend it.
Re-sending is safe: matches are upserted on (date, team), and results already entered are kept.
Technical problems (API down, wrong password, database error) go to website@ only.

## Setup after import

1. In Make, go to **Scenarios → Create → ⋯ → Import blueprint** and select the JSON file.
2. Pick your Gmail connection on the trigger (module 1) and on every "Send an email" module.
3. In the **HTTP login** module (4), replace `REMPLACER_PAR_ADMIN_USERNAME` / `REMPLACER_PAR_ADMIN_PASSWORD`
   with the admin console credentials. If the password contains `"` or `\`, escape them for JSON.
4. Check the API base URL `https://bsmbasket.fr/api` in modules 4 and 8.
5. Do a first **Run once** with a real planning e-mail, then check:
   - the trigger output really exposes `attachments[].fileName` / `.data`;
   - module 8's response is a 200 (if it's a 400 on `contentBase64`, the `base64()` mapping is the culprit);
   - the error-handler mails (20, 22) show the error message. Remap `{{4.error.message}}` /
     `{{8.error.message}}` from the panel if that field has a different name.
6. Schedule it (e.g. every 15 minutes) and turn it on. Pick **From now on** when Make asks where to start.
