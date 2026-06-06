/**
 * generate-data.mjs
 *
 * Reads source CSVs from /data/ and copies them to /public/data/
 * Also validates required columns and writes meta.json with last-updated date.
 *
 * Run: node scripts/generate-data.mjs
 * Called automatically by: npm run build
 */

import { readFileSync, writeFileSync, copyFileSync, readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT      = join(__dirname, '..')
const DATA_SRC  = join(ROOT, 'data')
const DATA_OUT  = join(ROOT, 'public', 'data')

// ── Required CSV files and their required columns ─────────────────────────────
const REQUIRED_FILES = {
  'district_pending_overview.csv': ['court_code','total_pending','pending_5plus','rate_5plus_pct'],
  'court_metrics.csv':             ['court_code','metric','value'],
  'cases_raw.csv':                 ['court_code','case_no','date_filing','age_days'],
  'monthly_inflow_outflow.csv':    ['court_code','month','pending_start','filed','resolved','pending_end'],
  'monthly_5plus_summary.csv':     ['court_code','month','pending_5plus_sep25','total_disposal_from_sep25','pending_5plus_end'],
  'monthly_5plus_disposals.csv':   ['month','case_no','court_code'],
  'pending_by_age.csv':            ['court_code','age_band','case_count'],
  'pending_by_type.csv':           ['court_code','case_type_category','case_count'],
  'nos_offence_types.csv':         ['section','cases','pct'],
  'nos_barriers.csv':              ['barrier','severity'],
  'nos_notable_cases.csv':         ['case_no','issue_type','severity'],
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getHeaders(csvText) {
  return csvText.split('\n')[0].split(',').map(h => h.trim().replace(/\r/g, ''))
}

function validate(file, csvText, required) {
  const headers = getHeaders(csvText)
  const missing = required.filter(col => !headers.includes(col))
  if (missing.length > 0) {
    console.warn(`  ⚠  ${file}: missing columns: ${missing.join(', ')}`)
    return false
  }
  const rows = csvText.split('\n').filter(l => l.trim() && !l.startsWith(headers[0])).length
  console.log(`  ✓  ${file} — ${rows} rows, columns OK`)
  return true
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log('\n📊  Barishal Courts Dashboard — Data Generator\n')

let allOk = true

for (const [file, cols] of Object.entries(REQUIRED_FILES)) {
  const srcPath = join(DATA_SRC, file)
  const outPath = join(DATA_OUT, file)

  if (!existsSync(srcPath)) {
    console.error(`  ✗  ${file}: NOT FOUND in /data/`)
    allOk = false
    continue
  }

  const text = readFileSync(srcPath, 'utf8')
  const ok   = validate(file, text, cols)
  if (!ok) allOk = false

  copyFileSync(srcPath, outPath)
}

// Write meta.json
const meta = {
  lastUpdated: new Date().toISOString().split('T')[0],
  generatedAt: new Date().toISOString(),
}
writeFileSync(join(DATA_OUT, 'meta.json'), JSON.stringify(meta, null, 2))
console.log(`\n  ✓  meta.json written (lastUpdated: ${meta.lastUpdated})`)

if (!allOk) {
  console.warn('\n⚠  Some files had issues — check warnings above before deploying.\n')
} else {
  console.log('\n✅  All data files OK — ready to build.\n')
}
