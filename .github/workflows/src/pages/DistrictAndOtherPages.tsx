import { useLang } from '../i18n/useLang'
import { AppData } from '../lib/types'
import { rateColor, rateBadgeClass, fmtNum } from '../lib/chartHelpers'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts'

interface Props { data: AppData }

// ── District Page ─────────────────────────────────────────────────────────────
export function DistrictPage({ data }: Props) {
  const { t } = useLang()
  const d = [...data.districtOverview].sort((a, b) => b.total_pending - a.total_pending)
  const chartData = [...d].filter(r => r.total_pending > 0).sort((a, b) => a.total_pending - b.total_pending)

  return (
    <div>
      <div className="page-title">{t('districtTitle')}</div>
      <div className="page-sub">{t('districtSub')}</div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{t('court')}</th>
              <th className="num">{t('totalPendingCol')}</th>
              <th className="num">{t('fivePlusYears')}</th>
              <th className="num">{t('rate')}</th>
            </tr>
          </thead>
          <tbody>
            {d.map((row, i) => (
              <tr key={row.court_code}>
                <td>{i + 1}</td>
                <td>{row.court}</td>
                <td className="num">{fmtNum(row.total_pending)}</td>
                <td className="num">{row.pending_5plus}</td>
                <td className="num">
                  <span className={`badge ${rateBadgeClass(row.rate_5plus_pct)}`}>
                    {row.rate_5plus_pct}%
                  </span>
                </td>
              </tr>
            ))}
            <tr style={{ fontWeight: 600 }}>
              <td></td>
              <td>{t('districtTotal')}</td>
              <td className="num">{fmtNum(d.reduce((s, r) => s + r.total_pending, 0))}</td>
              <td className="num">{d.reduce((s, r) => s + r.pending_5plus, 0)}</td>
              <td className="num">
                <span className="badge badge-amber">
                  {((d.reduce((s,r)=>s+r.pending_5plus,0)/d.reduce((s,r)=>s+r.total_pending,0))*100).toFixed(1)}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="card-note">{t('sourceNote')}: {t('sourceSep2025')}</div>
      </div>

      <div className="section-label">{t('totalByCourt')}</div>
      <div className="card">
        <div className="legend">
          <span className="legend-item"><span className="legend-dot" style={{ background: '#185FA5' }} />{t('totalPendingCol')}</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: '#E24B4A' }} />{t('fivePlusYears')}</span>
        </div>
        <div className="chart-wrap" style={{ height: Math.max(280, chartData.length * 38 + 60) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 140, right: 20, top: 4, bottom: 4 }}>
              <XAxis type="number" tickFormatter={fmtNum} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="court" tick={{ fontSize: 11 }} width={136} />
              <Tooltip formatter={(v: number) => fmtNum(v)} />
              <Bar dataKey="total_pending" name={t('totalPendingCol')} fill="#185FA5" radius={[0,3,3,0]} />
              <Bar dataKey="pending_5plus" name={t('fivePlusYears')} fill="#E24B4A" radius={[0,3,3,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// ── Monthly Page ──────────────────────────────────────────────────────────────
export function MonthlyPage({ data }: Props) {
  const { t } = useLang()
  const flows = data.monthlyFlow
  const summary = data.monthly5Plus
  const disposals = data.monthly5PlusDisposals

  const chartData = summary.map(r => ({
    name: r.court_name.split(' ')[0],
    baseline: r.pending_5plus_sep25,
    disposed: r.total_disposal_from_sep25,
    pending: r.pending_5plus_end,
  }))

  return (
    <div>
      <div className="page-title">{t('monthlyTitle')}</div>
      <div className="page-sub">{t('monthlySub')}</div>

      <div className="section-label">{t('inflowOutflow')}</div>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('court')}</th>
              <th className="num">{t('pendingStart')}</th>
              <th className="num">{t('filed')}</th>
              <th className="num">{t('resolved')}</th>
              <th className="num">{t('pendingEnd')}</th>
              <th className="num">{t('netChange')}</th>
            </tr>
          </thead>
          <tbody>
            {flows.map(r => {
              const net = r.pending_end - r.pending_start
              return (
                <tr key={r.court_code}>
                  <td>{r.court_name.split(' ').slice(0, 3).join(' ')}</td>
                  <td className="num">{fmtNum(r.pending_start)}</td>
                  <td className="num">{r.filed}</td>
                  <td className="num">{r.resolved}</td>
                  <td className="num">{fmtNum(r.pending_end)}</td>
                  <td className="num">
                    <span className={`badge ${net <= 0 ? 'badge-green' : 'badge-amber'}`}>
                      {net > 0 ? '+' : ''}{net}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="card-note">{t('sourceNote')}: {t('sourceMonthlyFeb')}</div>
      </div>

      <div className="section-label">{t('clearanceTracker')}</div>
      <div className="card">
        <div className="chart-wrap" style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="baseline" name="Baseline Sep 2025" fill="#888780" radius={[2,2,0,0]} />
              <Bar dataKey="disposed" name="Total disposed" fill="#639922" radius={[2,2,0,0]} />
              <Bar dataKey="pending" name="Still pending 5+" fill="#E24B4A" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('court')}</th>
              <th className="num">{t('baseline')}</th>
              <th className="num">{t('disposedThisMonth')}</th>
              <th className="num">{t('totalDisposed')}</th>
              <th className="num">{t('stillPending')}</th>
              <th className="num">{t('pctCleared')}</th>
            </tr>
          </thead>
          <tbody>
            {summary.map(r => {
              const pct = r.pending_5plus_sep25 > 0
                ? Math.round((r.total_disposal_from_sep25 / r.pending_5plus_sep25) * 100)
                : 100
              return (
                <tr key={r.court_code}>
                  <td>{r.court_name.split(' ').slice(0, 2).join(' ')}</td>
                  <td className="num">{r.pending_5plus_sep25}</td>
                  <td className="num">{r.disposal_this_month}</td>
                  <td className="num">{r.total_disposal_from_sep25}</td>
                  <td className="num">{r.pending_5plus_end}</td>
                  <td className="num">
                    <span className={`badge ${pct >= 50 ? 'badge-green' : pct >= 20 ? 'badge-blue' : 'badge-amber'}`}>
                      {pct}%
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="section-label">{t('individualDisposals')}</div>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{t('caseNo')}</th>
              <th>{t('court')}</th>
              <th>{t('sections')}</th>
              <th>{t('date')}</th>
              <th>{t('mode')}</th>
              <th>{t('paralegal')}</th>
            </tr>
          </thead>
          <tbody>
            {disposals.map(r => (
              <tr key={r.sl}>
                <td>{r.sl}</td>
                <td>{r.case_no}</td>
                <td>{r.court_code}</td>
                <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.sections}>{r.sections}</td>
                <td>{r.date_disposal}</td>
                <td>{t('acquitted')}</td>
                <td>{r.paralegal_support ? <span className="badge badge-blue">{t('sourceNote') === 'Source' ? 'Yes' : 'হ্যাঁ'}</span> : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="card-note">{t('sourceNote')}: {t('sourceMonthlyFeb')}</div>
      </div>
    </div>
  )
}

// ── Methodology Page ──────────────────────────────────────────────────────────
export function MethodologyPage({ data: _ }: Props) {
  const { t } = useLang()
  const sources = [
    { file: 'Old case registers (7 files)', type: 'Excel', date: 'Jan 2026', courts: 'NOS, CMM, ACJM, ACMM, CJM, DJ, JM-2', notes: 'Case-level, 634 cases filed ≤2019' },
    { file: 'NOS Register Analysis Report', type: 'Word doc', date: 'April 2026', courts: 'NOS', notes: '130 cases; 35 reviewed by paralegals' },
    { file: 'Pending Cases Report', type: 'Word doc', date: 'Sep 2025', courts: 'All 10 courts', notes: 'District-wide totals and 5+ yr rates' },
    { file: 'Monthly Case Mgmt Report', type: 'Excel', date: 'Feb 2026', courts: 'NOS, CMM, ACMM, Shishu', notes: 'Inflow/outflow + 5+ yr disposal tracker' },
  ]

  return (
    <div>
      <div className="page-title">{t('methodologyTitle')}</div>
      <div className="page-sub">{t('methodologySub')}</div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('source')}</th>
              <th>{t('type')}</th>
              <th>{t('referenceDate')}</th>
              <th>{t('courtsCoveredCol')}</th>
              <th>{t('notes')}</th>
            </tr>
          </thead>
          <tbody>
            {sources.map(s => (
              <tr key={s.file}>
                <td>{s.file}</td>
                <td>{s.type}</td>
                <td>{s.date}</td>
                <td>{s.courts}</td>
                <td>{s.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="card-title">{t('keyNotes')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: 13, color: 'var(--color-text-2)', marginTop: '0.75rem' }}>
          <p><strong style={{ color: 'var(--color-text)' }}>Reference dates differ.</strong> District totals (Sep 2025), old case register ages (Jan 2026), NOS analysis (April 2026), monthly progress (Feb 2026). Complementary, not overlapping.</p>
          <p><strong style={{ color: 'var(--color-text)' }}>NOS register: 130 cases, only 35 reviewed.</strong> Offence type and barrier data reflects the 35 paralegal-reviewed cases only. Remaining 95 recommended for urgent review (Recommendation R8).</p>
          <p><strong style={{ color: 'var(--color-text)' }}>Case type classification is partial.</strong> ACJM, ACMM, CJM, DJ, and JM-2 records are largely unclassified due to inconsistent section number formats.</p>
          <p><strong style={{ color: 'var(--color-text)' }}>Classification columns sparse.</strong> Delay-reason flags populated only in CMM and ACJM. Blank fields likely reflect incomplete data entry.</p>
          <p><strong style={{ color: 'var(--color-text)' }}>Project context.</strong> Data collected under Access to Justice for Women in Bangladesh (GIZ). NOS court and cases involving women and children are priority tracking areas.</p>
        </div>
      </div>
    </div>
  )
}
