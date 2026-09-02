'use client'

import { useEffect, useState } from 'react'
import { type Key, type Locale, hostLocale, translate } from '@/lib/i18n'

// Locale is fixed for a Mini App session, so a hook is enough.
export function useT() {
  const [locale, setLocale] = useState<Locale>('en')
  useEffect(() => setLocale(hostLocale()), [])
  return {
    locale,
    t: (key: Key, vars?: Record<string, string>) => translate(locale, key, vars),
  }
}

export function T({ k, vars }: { k: Key; vars?: Record<string, string> }) {
  const { t } = useT()
  return <>{t(k, vars)}</>
}
