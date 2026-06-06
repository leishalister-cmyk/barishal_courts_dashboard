import { createContext, useContext, useState, ReactNode } from 'react'
import { translations, Lang, TKey } from './translations'

interface LangCtx {
  lang: Lang
  t: (key: TKey) => string
  toggle: () => void
}

const LangContext = createContext<LangCtx | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const t = (key: TKey) => translations[lang][key] as string
  const toggle = () => setLang(l => l === 'en' ? 'bn' : 'en')
  return <LangContext.Provider value={{ lang, t, toggle }}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
