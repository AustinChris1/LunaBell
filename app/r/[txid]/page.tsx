import Link from 'next/link'
import { LunaBellMark, LunaBellWordmark } from '@/components/Logo'
import { Confirmations } from '@/components/Confirmations'
import { Identicon } from '@/components/Identicon'
import { ThemeToggle } from '@/components/Theme'
import { T } from '@/components/T'
import { getBlockNumber, getTransactionByHash, readTag } from '@/lib/nimiq-rpc'
import { prettyAddress } from '@/lib/charge'
import { formatLuna, formatNim, shortHash } from '@/lib/format'

export const dynamic = 'force-dynamic'

const SHELL = 'mx-auto flex min-h-dvh max-w-[430px] flex-col px-4 pb-9 pt-4'
const CARD = 'rounded-[18px] border border-line bg-surface p-5'
const GHOST =
  'w-full rounded-2xl border border-line px-4 py-3.5 text-sm font-bold text-ink transition active:bg-raised'

export default async function ReceiptPage({ params }: { params: Promise<{ txid: string }> }) {
  const { txid } = await params

  if (!/^[0-9a-f]{64}$/i.test(txid)) {
    return <Problem titleKey="notValid" lineKey="notValidBody" />
  }

  let tx = null
  let head = 0
  try {
    ;[tx, head] = await Promise.all([getTransactionByHash(txid), getBlockNumber()])
  } catch {
    return (
      <Problem
        titleKey="unreachable"
        lineKey="unreachableBody"
      />
    )
  }

  if (!tx) {
    return (
      <Problem
        titleKey="noSuchPayment"
        lineKey="noSuchPaymentBody"
      />
    )
  }

  const tag = readTag(tx)
  const settledAt = new Date(tx.timestamp)

  return (
    <main className={SHELL}>
      <Header label="Receipt" />

      <section className="animate-rise rounded-[18px] border border-mint/40 bg-gradient-to-b from-mint/20 to-mint/5 p-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-mint/40 bg-mint/15 px-3 py-1.5 text-xs font-bold text-mint">
          <T k="verifiedJustNow" />
        </span>
        <p className="mt-3.5 font-display text-[42px] font-bold leading-none tracking-tight text-ink">
          {formatNim(tx.value)} NIM
        </p>
        <p className="mt-2 font-mono text-xs text-muted">{formatLuna(tx.value)}</p>
        <p className="mt-1 text-sm text-muted">{settledAt.toUTCString()}</p>
      </section>

      <section className={CARD + ' mt-3'}>
        <div className="mb-4 flex items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-1.5">
            <Identicon address={tx.from} size={56} />
            <small className="text-[11px] font-bold uppercase tracking-[0.09em] text-faint">
              <T k="from" />
            </small>
          </div>
          <span className="text-[22px] text-goldDeep">&rarr;</span>
          <div className="flex flex-col items-center gap-1.5">
            <Identicon address={tx.to} size={56} />
            <small className="text-[11px] font-bold uppercase tracking-[0.09em] text-faint">
              <T k="to" />
            </small>
          </div>
        </div>

        <Stacked label={<T k="from" />} value={prettyAddress(tx.from)} />
        <Stacked label={<T k="to" />} value={prettyAddress(tx.to)} />
        <Row label={<T k="payment" />} value={shortHash(tx.hash)} mono />
        <Row label={<T k="blockLabel" />} value={tx.blockNumber.toLocaleString()} />
        <Confirmations hash={tx.hash} initial={tx.confirmations} head={head} />
        {tag && <Row label={<T k="chargeTag" />} value={tag} mono />}
      </section>

      <section className={CARD + ' mt-3 text-center'}>
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-gold/15 text-goldDeep">
          <LunaBellMark size={32} />
        </div>
        <p className="text-[13px] leading-relaxed text-muted">
          <T k="reReads" />
        </p>
        <Link href="/app" className="mt-4 block">
          <button className={GHOST}><T k="openLunaBell" /></button>
        </Link>
      </section>

      <p className="mt-auto pt-6 text-center text-xs leading-relaxed text-faint">
        <T k="anyoneCanVerify" />
      </p>
    </main>
  )
}

function Header({ label }: { label: string }) {
  return (
    <header className="mb-5 flex items-center justify-between gap-2">
      <LunaBellWordmark />
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
          {label}
        </span>
        <ThemeToggle compact />
      </div>
    </header>
  )
}

function Row({ label, value, mono }: { label: React.ReactNode; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-3 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className={'text-sm text-ink ' + (mono ? 'font-mono' : '')}>{value}</span>
    </div>
  )
}

function Stacked({ label, value }: { label: React.ReactNode; value: string }) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-line py-3">
      <span className="text-sm text-muted">{label}</span>
      <span className="break-all font-mono text-[13px] text-ink">{value}</span>
    </div>
  )
}

function Problem({ titleKey, lineKey }: { titleKey: Parameters<typeof T>[0]['k']; lineKey: Parameters<typeof T>[0]['k'] }) {
  return (
    <main className={SHELL}>
      <Header label="Receipt" />
      <section className={CARD + ' text-center'}>
        <h1 className="font-display text-2xl font-semibold text-ink"><T k={titleKey} /></h1>
        <p className="mt-2 text-sm leading-relaxed text-muted"><T k={lineKey} /></p>
        <Link href="/app" className="mt-4 block">
          <button className={GHOST}><T k="openLunaBell" /></button>
        </Link>
      </section>
    </main>
  )
}
