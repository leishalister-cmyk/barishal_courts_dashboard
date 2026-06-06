import { useLang } from '../../i18n/useLang'
import type { PageId } from '../../App'

interface Props {
  activePage: PageId
  onNavigate: (p: PageId) => void
  lastUpdated: string
}

function NavItem({
  id, label, active, onClick, sub = false,
}: { id: PageId; label: string; active: boolean; onClick: () => void; sub?: boolean }) {
  return (
    <button
      className={`nav-item${active ? ' active' : ''}${sub ? ' sub' : ''}`}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </button>
  )
}

export function Sidebar({ activePage, onNavigate, lastUpdated }: Props) {
  const { t, toggle } = useLang()
  const nav = (id: PageId) => () => onNavigate(id)

  return (
    <nav className="sidebar" aria-label="Dashboard navigation">
      <div className="sidebar-header">
        <div className="sidebar-title">{t('appTitle')}</div>
        <div className="sidebar-sub">Barishal District</div>
      </div>

      <div className="sidebar-nav">
        <NavItem id="overview"     label={t('navOverview')}        active={activePage === 'overview'}     onClick={nav('overview')} />
        <NavItem id="district"     label={t('navDistrict')}        active={activePage === 'district'}     onClick={nav('district')} />
        <NavItem id="court"        label={t('navCourtByCourtfull')} active={activePage === 'court'}        onClick={nav('court')} />
        <NavItem id="pending"      label={t('navPending')}         active={activePage === 'pending'}      onClick={nav('pending')} />
        <NavItem id="monthly"      label={t('navMonthly')}         active={activePage === 'monthly'}      onClick={nav('monthly')} />
        <NavItem id="casetypes"    label={t('navCaseTypes')}       active={activePage === 'casetypes'}    onClick={nav('casetypes')} />

        <div className="nav-group-label">NOS</div>
        <NavItem id="nos"          label={t('navNOS')}             active={activePage === 'nos'}          onClick={nav('nos')} />
        <NavItem id="nos_offences" label={t('navNOSOffences')}     active={activePage === 'nos_offences'} onClick={nav('nos_offences')} sub />
        <NavItem id="nos_barriers" label={t('navNOSBarriers')}     active={activePage === 'nos_barriers'} onClick={nav('nos_barriers')} sub />
        <NavItem id="nos_cases"    label={t('navNOSCases')}        active={activePage === 'nos_cases'}    onClick={nav('nos_cases')} sub />

        <NavItem id="methodology"  label={t('navMethodology')}     active={activePage === 'methodology'}  onClick={nav('methodology')} />
      </div>

      <div className="sidebar-footer">
        <div style={{ fontSize: 10, color: 'var(--color-text-3)', marginBottom: 6 }}>
          {t('lastUpdated')}: {lastUpdated}
        </div>
        <button className="lang-btn" onClick={toggle}>
          🌐 {t('langToggle')}
        </button>
      </div>
    </nav>
  )
}
