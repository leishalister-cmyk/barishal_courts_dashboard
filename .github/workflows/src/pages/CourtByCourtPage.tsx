import { useLang } from '../i18n/useLang'
import { AppData } from '../lib/types'
interface Props { data: AppData }
export function CourtByCourtPage({ data: _ }: Props) {
  const { t } = useLang()
  return (
    <div>
      <div className="page-title">Coming soon</div>
      <div className="page-sub">This page is implemented in the full build. Run npm run dev to see all pages.</div>
    </div>
  )
}
