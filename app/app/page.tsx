'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { BellRing } from 'lucide-react'
import { LunaBellMark, LunaBellWordmark } from '@/components/Logo'
import { Identicon } from '@/components/Identicon'
import { Keypad } from '@/components/Keypad'
import { NimiqAddress } from '@/components/NimiqAddress'
import { PayQr } from '@/components/PayQr'
import { StatusBar } from '@/components/StatusBar'
import { TakingsPanel } from '@/components/Takings'
import { ThemeToggle } from '@/components/Theme'
import { OpenInPay } from '@/components/OpenInPay'
import { useT } from '@/components/T'
import {
  type Charge,
  chargeData,
  encodeCharge,
  isNimiqAddress,
  newNonce,
  normalizeAddress,
  prettyAddress,
} from '@/lib/charge'
import { formatFiat, formatLuna, formatNim, lunaToNim, nimToLuna, shortHash } from '@/lib/format'
import { announce, unlockAudio, vibrate } from '@/lib/speech'
import { addTaking } from '@/lib/takings'
import { useChargeWatcher } from '@/lib/useCharge'
import { useNimiq } from '@/lib/useNimiq'

const CURRENCIES = ['nim', 'usd', 'eur', 'gbp', 'brl', 'inr']
const NIM_CHIPS = ['1', '5', '10', '25']

const CARD = 'rounded-[18px] border border-line bg-surface p-5'
const GHOST =
  'press w-full rounded-2xl border border-line px-4 py-3.5 text-sm font-bold text-ink active:bg-raised'
const PRIMARY =
  'press w-full rounded-2xl bg-gradient-to-b from-glow to-gold px-4 py-4 text-base font-extrabold uppercase tracking-wide text-nimiq shadow-[0_10px_30px_-12px_rgba(233,178,19,0.8)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none'
const LABEL = 'mb-2 block text-[11px] font-bold uppercase tracking-[0.09em] text-faint'
const INPUT =
  'w-full rounded-xl border border-line bg-bg px-3.5 py-3.5 text-ink outline-none transition-[border-color,box-shadow] placeholder:text-faint focus:border-gold focus:ring-2 focus:ring-gold/25'

type Stage = 'compose' | 'live'

function MiniApp() {
  const nimiq = useNimiq()
  const params = useSearchParams()
  const { t, locale } = useT()

  const [stage, setStage] = useState<Stage>('compose')
  const [digits, setDigits] = useState('')
  const [memo, setMemo] = useState('')
  const [manualAddress, setManualAddress] = useState('')
  const [unit, setUnit] = useState('nim')
  const [rate, setRate] = useState<number | null>(null)
  const [charge, setCharge] = useState<Charge | null>(null)
  const [tag, setTag] = useState('')
  const [copied, setCopied] = useState(false)
  const [announced, setAnnounced] = useState(false)
  const [lastSpoken, setLastSpoken] = useState('')
  const [testing, setTesting] = useState(false)
  const [paying, setPaying] = useState(false)
  const [takingsKey, setTakingsKey] = useState(0)

  const address = nimiq.account ?? manualAddress

  useEffect(() => {
    const saved = localStorage.getItem('lb.address')
    if (saved) setManualAddress(saved)
  }, [])

  // Another app or a website can hand off a ready made charge.
  useEffect(() => {
    const amount = params.get('amount')
    const unitParam = params.get('unit')
    const memoParam = params.get('memo')
    const to = params.get('to')
    if (amount && /^\d*\.?\d*$/.test(amount)) setDigits(amount)
    if (unitParam && CURRENCIES.includes(unitParam.toLowerCase())) setUnit(unitParam.toLowerCase())
    if (memoParam) setMemo(memoParam.slice(0, 60))
    if (to && isNimiqAddress(to)) setManualAddress(normalizeAddress(to))
  }, [params])

  const fiatUnit = unit === 'nim' ? 'usd' : unit

  useEffect(() => {
    let cancelled = false
    fetch('/api/price?currency=' + fiatUnit)
      .then((r) => r.json())
      .then((b) => {
        if (!cancelled) setRate(typeof b.rate === 'number' ? b.rate : null)
      })
      .catch(() => {
        if (!cancelled) setRate(null)
      })
    return () => {
      cancelled = true
    }
  }, [fiatUnit])

  const parsed = Number(digits.replace(',', '.'))
  const luna = useMemo(() => {
    if (!Number.isFinite(parsed) || parsed <= 0) return 0
    if (unit === 'nim') return nimToLuna(parsed)
    if (rate && rate > 0) return nimToLuna(parsed / rate)
    return 0
  }, [parsed, unit, rate])

  const watch = useChargeWatcher(
    stage === 'live' && !!charge,
    charge ? { address: charge.r, value: charge.v, tag, minBlock: charge.b } : null,
  )

  const shareUrl = useMemo(() => {
    if (!charge || typeof window === 'undefined') return ''
    return window.location.origin + '/pay?c=' + encodeCharge(charge)
  }, [charge])

  useEffect(() => {
    if (stage !== 'live' || watch.match) return
    let lock: { release: () => Promise<void> } | null = null
    const nav = navigator as Navigator & {
      wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> }
    }
    nav.wakeLock
      ?.request('screen')
      .then((l) => {
        lock = l
      })
      .catch(() => {})
    return () => {
      void lock?.release()
    }
  }, [stage, watch.match])

  useEffect(() => {
    if (!watch.match || announced || !charge) return
    if (nimiq.inHost && nimiq.consensus === false) return
    setAnnounced(true)
    vibrate()
    const spoken =
      unit !== 'nim' && rate !== null
        ? formatFiat(lunaToNim(charge.v) * rate, unit)
        : formatNim(charge.v) + ' NIM'
    setLastSpoken(spoken)
    announce(spoken, locale)
    addTaking({
      hash: watch.match.hash,
      value: charge.v,
      memo: charge.m,
      at: Date.now(),
      addr: charge.r,
    })
    setTakingsKey((k) => k + 1)
  }, [watch.match, announced, charge, rate, unit, locale, nimiq.inHost, nimiq.consensus])

  const pushDigit = (d: string) =>
    setDigits((prev) => (prev.replace('.', '').length >= 10 ? prev : prev === '0' ? d : prev + d))
  const pushDot = () => setDigits((prev) => (prev.includes('.') ? prev : (prev || '0') + '.'))
  const back = () => setDigits((prev) => prev.slice(0, -1))

  const testBell = async () => {
    if (testing) return
    setTesting(true)
    await unlockAudio()
    const sample =
      unit !== 'nim' && rate !== null ? formatFiat(12.5, fiatUnit) : formatNim(nimToLuna(25)) + ' NIM'
    announce(sample, locale)
    window.setTimeout(() => setTesting(false), 3200)
  }

  const repeat = (value: number, note: string) => {
    setUnit('nim')
    setDigits(String(lunaToNim(value)))
    setMemo(note)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const readHead = async (): Promise<number> => {
    try {
      if (nimiq.provider) return await nimiq.provider.getBlockNumber()
    } catch {
      /* fall through to public RPC */
    }
    try {
      const probe = await fetch('/api/head')
      const body = await probe.json()
      return typeof body.head === 'number' ? body.head : 0
    } catch {
      return 0
    }
  }

  const startCharge = useCallback(async () => {
    if (!isNimiqAddress(address) || luna <= 0) return
    await unlockAudio()
    const next: Charge = {
      r: address,
      v: luna,
      m: memo.slice(0, 60),
      n: newNonce(),
      t: Date.now(),
      b: await readHead(),
    }
    setCharge(next)
    setTag(await chargeData(next))
    setAnnounced(false)
    setStage('live')
    if (!nimiq.account) localStorage.setItem('lb.address', address)
  }, [address, luna, memo, nimiq.account, nimiq.provider])

  const payCharge = async (target: Charge) => {
    if (!nimiq.provider) return
    setPaying(true)
    try {
      const data = await chargeData(target)
      const result = await nimiq.provider.sendBasicTransactionWithData({
        recipient: prettyAddress(target.r),
        value: target.v,
        data,
      })
      if (result && typeof result === 'object' && 'error' in result) {
        throw new Error((result as { error: { message: string } }).error.message)
      }
    } catch {
      /* user rejected the native sheet; the charge stays live */
    } finally {
      setPaying(false)
    }
  }

  const ringSelf = async () => {
    if (!nimiq.provider || !nimiq.account) return
    await unlockAudio()
    const next: Charge = {
      r: nimiq.account,
      v: nimToLuna(1),
      m: 'Ring this phone',
      n: newNonce(),
      t: Date.now(),
      b: await readHead(),
    }
    const data = await chargeData(next)
    setDigits('1')
    setUnit('nim')
    setMemo(next.m)
    setCharge(next)
    setTag(data)
    setAnnounced(false)
    setStage('live')
    await payCharge(next)
  }

  const reset = () => {
    setStage('compose')
    setCharge(null)
    setTag('')
    setAnnounced(false)
    setDigits('')
    setMemo('')
  }

  const share = async () => {
    if (!shareUrl || !charge) return
    const label = charge.m
      ? charge.m + ' - ' + formatNim(charge.v) + ' NIM'
      : formatNim(charge.v) + ' NIM'
    if (navigator.share) {
      try {
        await navigator.share({ title: 'LunaBell', text: label, url: shareUrl })
        return
      } catch {
        /* fall through to clipboard */
      }
    }
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const figure = digits || '0'
  const fiatLine =
    unit === 'nim' && rate !== null && luna > 0
      ? formatFiat(lunaToNim(luna) * rate, 'usd')
      : unit !== 'nim' && luna > 0
        ? formatNim(luna) + ' NIM'
        : null

  return (
    <main className="mx-auto flex min-h-dvh max-w-[430px] flex-col px-4 pb-9 pt-4">
      <header className="mb-5 flex items-center justify-between gap-2">
        <LunaBellWordmark />
        <div className="flex items-center gap-2">
          <StatusBar inHost={nimiq.inHost} consensus={nimiq.consensus} head={watch.head} />
          <ThemeToggle compact />
        </div>
      </header>

      {stage === 'compose' && (
        <section className={CARD}>
          <div className="px-2 pb-1 pt-2 text-center">
            <div className="text-sm font-bold uppercase tracking-[0.14em] text-accent">
              {unit === 'nim' ? 'NIM' : unit.toUpperCase()}
            </div>
            <p className="mt-1 font-display text-[52px] font-extrabold leading-none tracking-tight tabular-nums text-ink">
              {figure}
            </p>
            {fiatLine && <p className="mt-1.5 text-sm text-muted">{fiatLine}</p>}
            {luna > 0 && <p className="mt-1 font-mono text-xs tabular-nums text-faint">{formatLuna(luna)}</p>}
          </div>

          <div className="mt-3.5 flex flex-wrap justify-center gap-2">
            {CURRENCIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setUnit(c)}
                className={
                  'press min-h-[44px] rounded-full px-3.5 text-[13px] font-bold ' +
                  (unit === c ? 'bg-nimiq text-white dark:bg-gold dark:text-nimiq' : 'bg-raised text-ink')
                }
              >
                {c.toUpperCase()}
              </button>
            ))}
          </div>

          {unit === 'nim' && (
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {NIM_CHIPS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setDigits(n)}
                  className="press min-h-[44px] rounded-full bg-raised px-3.5 text-[13px] font-bold text-ink"
                >
                  {n} NIM
                </button>
              ))}
            </div>
          )}

          <Keypad onDigit={pushDigit} onDot={pushDot} onBack={back} />

          <label className="mt-3 block">
            <span className={LABEL}>{t('whatIsItFor')}</span>
            <input
              className={INPUT}
              placeholder={t('memoPlaceholder')}
              maxLength={60}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </label>

          {!nimiq.account && !nimiq.loading && (
            <label className="mt-4 block">
              <span className={LABEL}>{t('payTo')}</span>
              {isNimiqAddress(manualAddress) && (
                <div className="mb-2.5">
                  <Identicon address={manualAddress} size={64} />
                </div>
              )}
              <input
                className={INPUT + ' font-mono text-[13px]'}
                placeholder="NQ.."
                value={prettyAddress(manualAddress)}
                onChange={(e) => setManualAddress(normalizeAddress(e.target.value))}
              />
              <p className="mt-1.5 text-[13px] text-muted">{t('addressHint')}</p>
            </label>
          )}

          {nimiq.account && (
            <div className="mt-4">
              <NimiqAddress address={nimiq.account} label={t('payToYou')} />
            </div>
          )}

          <button
            type="button"
            onClick={testBell}
            className="press mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl border border-gold/40 bg-gold/10 px-4 text-[13px] font-bold text-accent active:bg-gold/20"
          >
            <BellRing className={'h-4 w-4 ' + (testing ? 'animate-sway' : '')} strokeWidth={2} />
            {testing ? t('testing') : t('testBell')}
          </button>

          {nimiq.inHost && nimiq.account && (
            <button
              type="button"
              onClick={ringSelf}
              disabled={paying}
              className="press mt-2 inline-flex min-h-[44px] w-full items-center justify-center rounded-2xl border border-nimiq/20 bg-nimiq/5 px-4 text-[13px] font-bold text-ink active:bg-nimiq/10 disabled:opacity-40"
            >
              {paying ? t('ringingSelf') : t('ringSelf')}
            </button>
          )}

          <div className="mt-3">
            <button
              className={PRIMARY}
              disabled={luna <= 0 || !isNimiqAddress(address)}
              onClick={startCharge}
            >
              {t('listen')}
            </button>
            {!nimiq.inHost && <OpenInPay className="mt-2.5" />}
          </div>

          <TakingsPanel
            refreshKey={takingsKey}
            rate={rate}
            unit={unit}
            onRepeat={repeat}
          />
        </section>
      )}

      {stage === 'live' && charge && (
        <section className="space-y-3.5">
          {watch.match ? (
            <div className="animate-rise rounded-[18px] border border-success/40 bg-gradient-to-b from-success/15 to-success/5 p-6 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-success/40 bg-success/10 px-3 py-1.5 text-xs font-bold text-success">
                {t('verified')}
              </span>
              <div className="mx-auto mt-3.5 grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
                <LunaBellMark size={40} />
              </div>
              <p className="mt-2 font-display text-[42px] font-bold leading-none tracking-tight tabular-nums text-ink">
                {formatNim(charge.v)} NIM
              </p>
              <p className="mt-1.5 font-mono text-xs text-muted">{formatLuna(charge.v)}</p>
              {charge.m && <p className="mt-1 text-sm text-muted">{charge.m}</p>}
            </div>
          ) : (
            <div className={CARD + ' animate-rise text-center'}>
              <div className="mb-3 flex items-center gap-3 text-left">
                <Identicon address={charge.r} size={44} />
                <div className="min-w-0">
                  <p className="font-display text-[30px] font-bold leading-none tracking-tight tabular-nums text-ink">
                    {formatNim(charge.v)} NIM
                  </p>
                  <p className="mt-1 font-mono text-[12px] tabular-nums text-muted">
                    {formatLuna(charge.v)}
                    {rate !== null ? ' - ' + formatFiat(lunaToNim(charge.v) * rate, fiatUnit) : ''}
                  </p>
                  {charge.m && <p className="mt-0.5 text-[13px] text-muted">{charge.m}</p>}
                </div>
                <div className="ml-auto grid h-12 w-12 shrink-0 animate-sway place-items-center rounded-full bg-gold/15 text-accent">
                  <LunaBellMark size={28} />
                </div>
              </div>

              {shareUrl && <PayQr url={shareUrl} />}

              <p className="mt-3 inline-flex items-center gap-2 text-[13px] text-muted">
                <span className="h-2 w-2 animate-blink rounded-full bg-gold" />
                {t('listening')}
                {watch.head ? ' - ' + t('block') + ' ' + watch.head.toLocaleString() : ''}
              </p>
              {nimiq.inHost && nimiq.consensus === false && (
                <p className="mt-1.5 text-[13px] text-dangerText">{t('waitingConsensus')}</p>
              )}

              {nimiq.inHost &&
                nimiq.account &&
                normalizeAddress(nimiq.account) === normalizeAddress(charge.r) && (
                  <button
                    className={PRIMARY + ' mt-3'}
                    disabled={paying}
                    onClick={() => payCharge(charge)}
                  >
                    {paying ? t('ringingSelf') : t('payThisCharge')}
                  </button>
                )}

              <div className="mt-3 flex gap-2.5">
                <button className={GHOST} onClick={share}>
                  {copied ? t('copied') : t('share')}
                </button>
                <button className={GHOST} onClick={reset}>
                  {t('cancel')}
                </button>
              </div>
              <p className="mt-2 text-[13px] text-muted">
                {t('scanPays', { addr: prettyAddress(charge.r).slice(0, 14) })}
              </p>
            </div>
          )}

          {watch.match && (
            <div className={CARD}>
              <div className="mb-3 flex items-center justify-center gap-6">
                <div className="flex flex-col items-center gap-1.5">
                  <Identicon address={watch.match.from} size={56} />
                  <small className="text-[11px] font-bold uppercase tracking-[0.09em] text-faint">
                    {t('from')}
                  </small>
                </div>
                <span className="text-[22px] text-accent">&rarr;</span>
                <div className="flex flex-col items-center gap-1.5">
                  <Identicon address={watch.match.to} size={56} />
                  <small className="text-[11px] font-bold uppercase tracking-[0.09em] text-faint">
                    {t('to')}
                  </small>
                </div>
              </div>
              <Row label={t('payment')} value={shortHash(watch.match.hash)} mono />
              <Row label={t('blockLabel')} value={watch.match.blockNumber.toLocaleString()} />
              <Row label={t('confirmations')} value={watch.match.confirmations.toLocaleString()} />
              <div className="mt-4 flex gap-2.5">
                <button className={GHOST} onClick={() => lastSpoken && announce(lastSpoken, locale)}>
                  {t('replay')}
                </button>
                <a href={'/r/' + watch.match.hash} className="flex-1">
                  <button className={GHOST}>{t('receipt')}</button>
                </a>
              </div>
              <button className={PRIMARY + ' mt-2.5'} onClick={reset}>
                {t('newCharge')}
              </button>
            </div>
          )}

          {watch.error && (
            <p className="text-center text-[13px] text-dangerText">
              {t('chainLookup')}: {watch.error}
            </p>
          )}
        </section>
      )}

      <p className="mt-auto pt-6 text-center text-xs leading-relaxed text-faint">
        {t('footerA')}
        <br />
        {t('footerB')}
      </p>
    </main>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-3 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className={'text-sm text-ink ' + (mono ? 'font-mono' : '')}>{value}</span>
    </div>
  )
}


export default function AppPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto min-h-dvh max-w-[430px] px-4 pt-4">
          <LunaBellMark size={28} />
        </main>
      }
    >
      <MiniApp />
    </Suspense>
  )
}
