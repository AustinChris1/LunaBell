'use client'

import { useEffect, useState } from 'react'

export function Confirmations({ hash, initial, head }: { hash: string; initial: number; head: number }) {
  const [count, setCount] = useState(initial)
  const [tip, setTip] = useState(head)

  useEffect(() => {
    let cancelled = false
    const tick = async () => {
      try {
        const res = await fetch('/api/tx/' + hash, { cache: 'no-store' })
        const body = await res.json()
        if (cancelled || !body.tx) return
        setCount(body.tx.confirmations)
        setTip(body.head)
      } catch {
        /* keep last known count */
      }
    }
    const id = window.setInterval(tick, 4000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [hash])

  const row = 'flex items-baseline justify-between gap-4 border-b border-line py-3 last:border-0'

  return (
    <>
      <div className={row}>
        <span className="text-sm text-muted">Confirmations</span>
        <span className="font-mono text-sm tabular-nums text-ink">{count.toLocaleString()}</span>
      </div>
      <div className={row}>
        <span className="text-sm text-muted">Chain head</span>
        <span className="font-mono text-sm tabular-nums text-ink">{tip.toLocaleString()}</span>
      </div>
    </>
  )
}
