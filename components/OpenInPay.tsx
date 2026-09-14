'use client'

import { useEffect, useState } from 'react'
import { type Platform, detectMobilePlatform, openInNimiqPay } from '@/lib/deeplink'
import { useT } from './T'

// One button that launches the current page inside Nimiq Pay on any phone.
export function OpenInPay({
  url,
  className,
  variant = 'link',
}: {
  url?: string
  className?: string
  variant?: 'link' | 'button'
}) {
  const { t } = useT()
  const [platform, setPlatform] = useState<Platform>(null)
  useEffect(() => setPlatform(detectMobilePlatform()), [])

  const target = () => url ?? (typeof window === 'undefined' ? '' : window.location.href)
  const label = t('openInNimiqPay')
  const hint = platform ? '' : ' (' + t('onYourPhone') + ')'

  const base =
    variant === 'button'
      ? 'press w-full rounded-2xl bg-gradient-to-b from-glow to-gold px-4 py-4 text-base font-extrabold uppercase tracking-wide text-nimiq shadow-[0_10px_30px_-12px_rgba(233,178,19,0.8)]'
      : 'press block min-h-[44px] w-full text-center text-[13px] font-bold text-link'

  return (
    <button type="button" onClick={() => openInNimiqPay(target())} className={base + ' ' + (className ?? '')}>
      {label}
      {variant === 'link' ? hint : ''}
    </button>
  )
}
