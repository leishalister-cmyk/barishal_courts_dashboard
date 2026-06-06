// District-level overview (from Sep 2025 report)
export interface DistrictRow {
  sl: number
  court: string
  court_code: string
  reference_date: string
  total_pending: number
  pending_5plus: number
  rate_5plus_pct: number
}

// Aggregated metrics per court (from old registers + district report)
export interface CourtMetric {
  court_code: string
  court_name: string
  metric: string
  value: number
  unit: string
  notes: string
}

// Individual case from old registers
export interface CaseRow {
  court_code: string
  court_name: string
  sl_no: number
  case_no: string
  title: string
  date_filing: string
  year_filing: number
  last_hearing: string
  next_date: string
  case_type_raw: string
  case_type_category: string
  age_days: number
  age_band: string
  classification_frequent_adj: number
  classification_adr: number
  classification_ready: number
  classification_doc_missing: number
  classification_no_police_rpt: number
  classification_disposal: number
  classification_other: number
}

// Monthly inflow/outflow
export interface MonthlyFlow {
  court_code: string
  court_name: string
  month: string
  pending_start: number
  filed: number
  resolved: number
  pending_end: number
}

// Monthly 5+ year summary
export interface Monthly5Plus {
  court_code: string
  court_name: string
  month: string
  pending_5plus_sep25: number
  disposal_cumulative_sep25: number
  disposal_this_month: number
  total_disposal_from_sep25: number
  pending_5plus_end: number
}

// Monthly 5+ year individual disposals
export interface Monthly5PlusDisposal {
  month: string
  sl: number
  case_no: string
  court_code: string
  sections: string
  date_disposal: string
  mode_of_disposal: string
  paralegal_support: string
}

// Age bands per court
export interface AgeBand {
  court_code: string
  age_band: string
  case_count: number
}

// Case types per court
export interface CaseType {
  court_code: string
  case_type_category: string
  case_count: number
}

// NOS offence types
export interface NOSOffence {
  section: string
  description: string
  cases: number
  pct: number
  severity: string
}

// NOS barriers
export interface NOSBarrier {
  barrier: string
  prevalence: string
  severity: string
  notes: string
}

// NOS notable cases
export interface NOSNotableCase {
  case_no: string
  issue_type: string
  severity: string
  detail: string
}

// All data loaded into the app
export interface AppData {
  districtOverview: DistrictRow[]
  courtMetrics: CourtMetric[]
  cases: CaseRow[]
  monthlyFlow: MonthlyFlow[]
  monthly5Plus: Monthly5Plus[]
  monthly5PlusDisposals: Monthly5PlusDisposal[]
  ageBands: AgeBand[]
  caseTypes: CaseType[]
  nosOffences: NOSOffence[]
  nosBarriers: NOSBarrier[]
  nosNotableCases: NOSNotableCase[]
  lastUpdated: string
}
