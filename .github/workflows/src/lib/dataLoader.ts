import Papa from 'papaparse'
import { AppData } from './types'

const BASE = import.meta.env.BASE_URL

async function loadCSV<T>(path: string): Promise<T[]> {
  const res = await fetch(`${BASE}data/${path}`)
  if (!res.ok) throw new Error(`Failed to load ${path}`)
  const text = await res.text()
  const result = Papa.parse<T>(text, { header: true, skipEmptyLines: true, dynamicTyping: true })
  return result.data
}

export async function loadAllData(): Promise<AppData> {
  const [
    districtOverview,
    courtMetrics,
    cases,
    monthlyFlow,
    monthly5Plus,
    monthly5PlusDisposals,
    ageBands,
    caseTypes,
    nosOffences,
    nosBarriers,
    nosNotableCases,
    meta,
  ] = await Promise.all([
    loadCSV('district_pending_overview.csv'),
    loadCSV('court_metrics.csv'),
    loadCSV('cases_raw.csv'),
    loadCSV('monthly_inflow_outflow.csv'),
    loadCSV('monthly_5plus_summary.csv'),
    loadCSV('monthly_5plus_disposals.csv'),
    loadCSV('pending_by_age.csv'),
    loadCSV('pending_by_type.csv'),
    loadCSV('nos_offence_types.csv'),
    loadCSV('nos_barriers.csv'),
    loadCSV('nos_notable_cases.csv'),
    fetch(`${BASE}data/meta.json`).then(r => r.ok ? r.json() : { lastUpdated: 'Unknown' }),
  ])

  return {
    districtOverview: districtOverview as any,
    courtMetrics: courtMetrics as any,
    cases: cases as any,
    monthlyFlow: monthlyFlow as any,
    monthly5Plus: monthly5Plus as any,
    monthly5PlusDisposals: monthly5PlusDisposals as any,
    ageBands: ageBands as any,
    caseTypes: caseTypes as any,
    nosOffences: nosOffences as any,
    nosBarriers: nosBarriers as any,
    nosNotableCases: nosNotableCases as any,
    lastUpdated: (meta as any).lastUpdated ?? 'Unknown',
  }
}

// Helper: get a single metric value for a court
export function getMetric(
  metrics: AppData['courtMetrics'],
  court_code: string,
  metric: string
): number | null {
  const row = metrics.find(m => m.court_code === court_code && m.metric === metric)
  return row ? Number(row.value) : null
}
