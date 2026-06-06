export const COURT_COLORS: Record<string, string> = {
  NOS:     '#D4537E',
  CMM:     '#185FA5',
  ACJM:    '#1D9E75',
  ACMM:    '#534AB7',
  CJM:     '#3B6D11',
  DJ:      '#854F0B',
  JM2:     '#3C3489',
  DSJ:     '#BA7517',
  MSC:     '#993556',
  JNSSJ:   '#A32D2D',
  DSPecJ:  '#E24B4A',
  CT:      '#5F5E5A',
  HTT:     '#085041',
  AT:      '#888780',
}

export const CASE_TYPE_COLORS: Record<string, string> = {
  'Nari O Shishu Act':         '#D4537E',
  'Special Laws':               '#EF9F27',
  'Homicide / Attempt':         '#E24B4A',
  'Forgery / Fraud':            '#D85A30',
  'Theft / Robbery':            '#1D9E75',
  'Assault / Hurt':             '#185FA5',
  'Rioting / Unlawful Assembly':'#639922',
  'Trespass':                   '#534AB7',
  'Other / Unclassified':       '#B4B2A9',
  'Unclassified':               '#D3D1C7',
}

export function rateColor(rate: number): string {
  if (rate >= 20) return '#E24B4A'
  if (rate >= 10) return '#EF9F27'
  if (rate >= 3)  return '#185FA5'
  return '#639922'
}

export function rateBadgeClass(rate: number): string {
  if (rate >= 20) return 'badge-red'
  if (rate >= 10) return 'badge-amber'
  if (rate >= 3)  return 'badge-blue'
  return 'badge-green'
}

export function severityBadgeClass(severity: string): string {
  switch (severity.toUpperCase()) {
    case 'CRITICAL': return 'badge-red'
    case 'HIGH':     return 'badge-amber'
    case 'MODERATE':
    case 'MEDIUM':   return 'badge-blue'
    case 'POSITIVE': return 'badge-green'
    default:         return 'badge-gray'
  }
}

export function fmtNum(n: number): string {
  return n.toLocaleString('en-IN')
}
