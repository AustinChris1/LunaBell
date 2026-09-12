'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { LunaBellMark, LunaBellWordmark } from '@/components/Logo'
import { Identicon } from '@/components/Identicon'
import { StatusBar } from '@/components/StatusBar'
import { ThemeToggle } from '@/components/Theme'
import { OpenInPay } from '@/components/OpenInPay'
import { type Charge, chargeData, decodeCharge, prettyAddress } from '@/lib/charge'
import { formatFiat, formatLuna, formatNim, lunaToNim } from '@/lib/format'
import { useNimiq } from '@/lib/useNimiq'
import { useT } from '@/components/T'

const CARD = 'rounded-[18px] border border-line bg-surface p-5'
const PRIMARY =
  'w-full rounded-2xl bg-gradient-to-b from-glow to-gold px-4 py-4 text-base font-extrabold uppercase tracking-wide text-nimiq shadow-[0_10px_30px_-12px_rgba(233,178,19,0.8)] transition active:translate-y-px disabled:opacity-40'

function PayView() {
  const params = useSearchParams()
  const nimiq = useNimiq()
  const { t } = useT()
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [rate, setRate] = useState<number | null>(null)

  const charge: Charge | null = useMemo(() => {
    const token = params.get('c')
    return token ? decodeCharge(token) : null
  }, [params])

  useEffect(() => {
    fetch('/api/price?currency=usd')
      .then((r) => r.json())
      .then((b) => setRate(typeof b.rate === 'number' ? b.rate : null))
      .catch(() => setRate(null))
  }, [])

  const pay = async () => {
    if (!charge || !nimiq.provider) return
    setStatus('sending')
    setMessage('')
    try {
      const data = await chargeData(charge)
      const result = await nimiq.provider.sendBasicTransactionWithData({
        recipient: prettyAddress(charge.r),
        value: charge.v,
        data,
      })
      if (result && typeof result === 'object' && 'error' in result) {
        throw new Error((result as { error: { message: string } }).error.message)
      }
      setStatus('sent')
    } catch (error) {
      setStatus('error')
      setMessage((error as Error).message || 'Payment was not completed')
    }
  }

  if (!charge) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-[430px] flex-col px-4 pb-9 pt-4">
        <Header inHost={false} consensus={null} />
        <section className={CARD + ' text-center'}>
          <h1 className="font-display text-2xl font-semibold text-ink">{t('notReadable')}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {t('notReadableBody')}
          </p>
        </section>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-[430px] flex-col px-4 pb-9 pt-4">
      <Header inHost={nimiq.inHost} consensus={nimiq.consensus} />

      <section className={CARD + ' text-center'}>
        <div className="mx-auto mb-3 w-fit">
          <Identicon address={charge.r} size={56} />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-faint">
          {t('askedToPay')}
        </p>
        <p className="mt-2 font-display text-[42px] font-bold leading-none tracking-tight text-ink">
          {formatNim(charge.v)} NIM
        </p>
        <p className="mt-1.5 font-mono text-xs text-muted">{formatLuna(charge.v)}</p>
        {rate !== null && (
          <p className="mt-1 text-sm text-muted">{formatFiat(lunaToNim(charge.v) * rate, 'usd')}</p>
        )}
        {charge.m && <p className="mt-1 text-sm text-muted">{charge.m}</p>}
      </section>

      <section className={CARD + ' mt-3.5'}>
        <div className="flex flex-col gap-1.5 border-b border-line py-3">
          <span className="text-sm text-muted">{t('to')}</span>
          <span className="break-all font-mono text-[13px] text-ink">{prettyAddress(charge.r)}</span>
        </div>
        <Row label={t('network')} value="Nimiq" />
        <Row label={t('binding')} value={t('taggedData')} />

        {status === 'sent' ? (
          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-mint/40 bg-mint/15 px-3 py-1.5 text-xs font-bold text-mint">
              {t('sent')}
            </span>
            <p className="mt-3 text-[13px] text-muted">
              {t('willRing')}
            </p>
          </div>
        ) : nimiq.inHost ? (
          <button className={PRIMARY + ' mt-4'} disabled={status === 'sending'} onClick={pay}>
            {status === 'sending' ? t('confirming') : t('pay') + ' ' + formatNim(charge.v) + ' NIM'}
          </button>
        ) : (
          <div className="mt-4">
            <OpenInPay variant="button" />
            <p className="mt-3 text-center text-[13px] text-muted">
              {t('payingHappens')}
            </p>
          </div>
        )}

        {status === 'error' && <p className="mt-3 text-center text-[13px] text-danger">{message}</p>}
      </section>

      <p className="mt-auto pt-6 text-center text-xs leading-relaxed text-faint">
        {t('amountFixed')}
      </p>
    </main>
  )
}

function Header({ inHost, consensus }: { inHost: boolean; consensus: boolean | null }) {
  return (
    <header className="mb-5 flex items-center justify-between gap-2">
      <LunaBellWordmark />
      <div className="flex items-center gap-2">
        <StatusBar inHost={inHost} consensus={consensus} />
        <ThemeToggle compact />
      </div>
    </header>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-3 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm text-ink">{value}</span>
    </div>
  )
}


export default function PayPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto min-h-dvh max-w-[430px] px-4 pt-4">
          <LunaBellMark size={28} />
        </main>
      }
    >
      <PayView />
    </Suspense>
  )
}
