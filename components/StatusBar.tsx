'use client'

import { useEffect, useState } from 'react'

export function StatusBar({
  inHost,
  consensus,
  head,
}: {
  inHost: boolean
  consensus: boolean | null
  head?: number | null
}) {
  const [liveHead, setLiveHead] = useState<number | null>(head ?? null)

  useEffect(() => {
    if (typeof head === 'number') setLiveHead(head)
  }, [head])

  useEffect(() => {
    let cancelled = false
    const tick = async () => {
      try {
        const res = await fetch('/api/head', { cache: 'no-store' })
        const body = await res.json()
        if (!cancelled && typeof body.head === 'number') setLiveHead(body.head)
      } catch {
        /* keep last known height */
      }
    }
    void tick()
    const id = window.setInterval(tick, 6000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [])

  const ok = inHost ? consensus === true : liveHead !== null
  const label = inHost
    ? consensus === true
      ? 'Synced'
      : consensus === false
        ? 'Syncing'
        : 'Nimiq Pay'
    : liveHead
      ? 'Block ' + liveHead.toLocaleString()
      : 'Mainnet'

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] tabular-nums text-muted">
      <span className="relative flex h-2 w-2">
        <span
          className={
            'absolute inline-flex h-full w-full rounded-full opacity-75 ' +
            (ok ? 'animate-live bg-success' : 'bg-gold')
          }
        />
        <span className={'relative inline-flex h-2 w-2 rounded-full ' + (ok ? 'bg-success' : 'bg-gold')} />
      </span>
      {label}
    </span>
  )
}
