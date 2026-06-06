import { writeFileSync, copyFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DATA_SRC = join(ROOT, 'data')
const DATA_OUT = join(ROOT, 'public', 'data')

mkdirSync(DATA_OUT, { recursive: true })

const REQUIRED_FILES = [
  'district_pending_overview.csv',
  'court_metrics.csv',
  'cases_raw.csv',
  'monthly_inflow_outflow.csv',
  'monthly_5plus_summary.csv',
  'monthly_5plus_disposals.csv',
  'pending_by_age.csv',
  'pending_by_type.csv',
  'nos_offence_types.csv',
  'nos_barriers.csv',
  'nos_notable_cases.csv',
]

for (const file of REQUIRED_FILES) {
  const src = join(DATA_SRC, file)
  const out = join(DATA_OUT, file)
  if (existsSync(src)) {
    copyFileSync(src, out)
    console.log(`✓ ${file}`)
  } else {
    console.warn(`⚠ ${file} not found — skipping`)
  }
}

const meta = { lastUpdated: new Date().toISOString().split('T')[0] }
writeFileSync(join(DATA_OUT, 'meta.json'), JSON.stringify(meta, null, 2))
console.log('✓ meta.json')
