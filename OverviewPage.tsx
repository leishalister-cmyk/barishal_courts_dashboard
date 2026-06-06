import { useLang } from '../i18n/useLang'
import { AppData } from '../lib/types'
import { rateColor, rateBadgeClass, fmtNum } from '../lib/chartHelpers'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

interface Props { data: AppData }

export function OverviewPage({ data }: Props) {
  const { t } = useLang()
  const d = data.districtOverview

  const totalPending = d.reduce((s, r) => s + r.total_pending, 0)
  const total5plus   = d.reduce((s, r) => s + r.pending_5plus, 0)
  const rate         = totalPending > 0 ? ((total5plus / totalPending) * 100).toFixed(1) : '0'
  const highest      = [...d].sort((a, b) => b.rate_5plus_pct - a.rate_5plus_pct)[0]

  const nosFlow = data.monthlyFlow.find(r => r.court_code === 'NOS')
  const cmmFlow = data.monthlyFlow.find(r => r.court_code === 'CMM')
  const acmmFlow = data.monthlyFlow.find(r => r.court_code === 'ACMM')
  const disposedFeb = (nosFlow?.resolved ?? 0) + (cmmFlow?.resolved ?? 0) + (acmmFlow?.resolved ?? 0)

  const nosRegister = data.courtMetrics.find(m => m.court_code === 'NOS' && m.metric === 'total_pending')

  // Chart data — exclude Anti-Terrorism (0), sort by rate
  const chartData = [...d]
    .filter(r => r.total_pending > 0)
    .sort((a, b) => a.rate_5plus_pct - b.rate_5plus_pct)
    .map(r => ({ name: r.court, rate: r.rate_5plus_pct, code: r.court_code }))

  // Key findings sorted descending
  const findings = [...d]
    .filter(r => r.total_pending > 0)
    .sort((a, b) => b.rate_5plus_pct - a.rate_5plus_pct)
    .slice(0, 7)

  return (
    <div>
      <div className="page-title">{t('overviewTitle')}</div>
      <div className="page-sub">{t('overviewSub')}</div>

      <div className="kpi-grid">
        <div className="kpi-card red">
          <div className="kpi-label">{t('totalPending')}</div>
          <div className="kpi-value">{fmtNum(totalPending)}</div>
          <div className="kpi-sub">{t('districtWide')}</div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-label">{t('pending5plus')}</div>
          <div className="kpi-value">{fmtNum(total5plus)}</div>
          <div className="kpi-sub">{rate}% {t('ofTotal')}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">{t('courtsCovered')}</div>
          <div className="kpi-value">{d.length}</div>
          <div className="kpi-sub">{t('allCourtTypes')}</div>
        </div>
        <div className="kpi-card red">
          <div className="kpi-label">{t('highest5plusRate')}</div>
          <div className="kpi-value">{highest?.rate_5plus_pct}%</div>
          <div className="kpi-sub">{t('divisionalSpecialJudge')}</div>
        </div>
        <div className="kpi-card red">
          <div className="kpi-label">{t('oldCaseRegister')}</div>
          <div className="kpi-value">130</div>
          <div className="kpi-sub">NOS · 35 {t('reviewedByParalegals')}</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-label">{t('disposedFeb')}</div>
          <div className="kpi-value">{disposedFeb}</div>
          <div className="kpi-sub">NOS + CMM + ACMM</div>
        </div>
      </div>

      <div className="section-label">{t('fivePlusRateByCourt')}</div>
      <div className="card">
        <div className="legend">
          {[['<3%','#639922'],['3–10%','#185FA5'],['10–20%','#EF9F27'],['20%+','#E24B4A']].map(([l,c]) => (
            <span key={l} className="legend-item">
              <span className="legend-dot" style={{ background: c }} />
              {l}
            </span>
          ))}
        </div>
        <div className="chart-wrap" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 60, left: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
              <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [`${v}%`, '5+ yr rate']} />
              <Bar dataKey="rate" radius={[3,3,0,0]}>
                {chartData.map(entry => (
                  <Cell key={entry.code} fill={rateColor(entry.rate)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card-note">{t('sourceNote')}: {t('sourceSep2025')}</div>
      </div>

      <div className="section-label">{t('keyFindings')}</div>
      <div className="card">
        {findings.map(r => (
          <div key={r.court_code} className="prog-row">
            <span className="prog-label">{r.court}</span>
            <div className="prog-bar-wrap">
              <div className="prog-bar" style={{ width: `${Math.min(r.rate_5plus_pct * 2, 100)}%`, background: rateColor(r.rate_5plus_pct) }} />
            </div>
            <span className="prog-val">
              <span className={`badge ${rateBadgeClass(r.rate_5plus_pct)}`}>{r.rate_5plus_pct}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
