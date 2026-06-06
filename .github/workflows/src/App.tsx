import { useState, useEffect } from 'react'
import { useLang } from './i18n/useLang'
import { loadAllData } from './lib/dataLoader'
import { AppData } from './lib/types'
import { Sidebar } from './components/layout/Sidebar'
import { OverviewPage } from './pages/OverviewPage'
import { DistrictPage } from './pages/DistrictPage'
import { CourtByCourtPage } from './pages/CourtByCourtPage'
import { PendingPage } from './pages/PendingPage'
import { MonthlyPage } from './pages/MonthlyPage'
import { CaseTypesPage } from './pages/CaseTypesPage'
import { NOSPage } from './pages/NOSPage'
import { NOSOffencesPage } from './pages/NOSOffencesPage'
import { NOSBarriersPage } from './pages/NOSBarriersPage'
import { NOSCasesPage } from './pages/NOSCasesPage'
import { MethodologyPage } from './pages/MethodologyPage'

export type PageId =
  | 'overview' | 'district' | 'court'
  | 'pending' | 'monthly' | 'casetypes'
  | 'nos' | 'nos_offences' | 'nos_barriers' | 'nos_cases'
  | 'methodology'

export default function App() {
  const { lang } = useLang()
  const [page, setPage] = useState<PageId>('overview')
  const [data, setData] = useState<AppData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAllData()
      .then(setData)
      .catch(e => setError(String(e)))
  }, [])

  useEffect(() => {
    document.body.className = lang === 'bn' ? 'bn' : ''
  }, [lang])

  if (error) return (
    <div className="loading">
      <div>
        <p style={{ color: '#A32D2D', fontWeight: 500 }}>Failed to load data</p>
        <p style={{ fontSize: 12, marginTop: 4, color: '#854F0B' }}>{error}</p>
        <p style={{ fontSize: 12, marginTop: 8 }}>
          Run <code>npm run generate-data</code> then <code>npm run dev</code>
        </p>
      </div>
    </div>
  )

  if (!data) return <div className="loading">Loading data…</div>

  const pageProps = { data }

  return (
    <div className="app-shell">
      <Sidebar activePage={page} onNavigate={setPage} lastUpdated={data.lastUpdated} />
      <main className="main-content">
        {page === 'overview'      && <OverviewPage {...pageProps} />}
        {page === 'district'      && <DistrictPage {...pageProps} />}
        {page === 'court'         && <CourtByCourtPage {...pageProps} />}
        {page === 'pending'       && <PendingPage {...pageProps} />}
        {page === 'monthly'       && <MonthlyPage {...pageProps} />}
        {page === 'casetypes'     && <CaseTypesPage {...pageProps} />}
        {page === 'nos'           && <NOSPage {...pageProps} />}
        {page === 'nos_offences'  && <NOSOffencesPage {...pageProps} />}
        {page === 'nos_barriers'  && <NOSBarriersPage {...pageProps} />}
        {page === 'nos_cases'     && <NOSCasesPage {...pageProps} />}
        {page === 'methodology'   && <MethodologyPage {...pageProps} />}
      </main>
    </div>
  )
}
