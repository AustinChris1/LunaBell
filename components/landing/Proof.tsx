'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { EASE_OUT } from './Pieces'
import { CheckCheck, ImageOff, Lock, RefreshCw } from 'lucide-react'

// A real mainnet transaction, so the confirmation count on this page is genuine.
const SAMPLE_TX = 'fbd90226a2c146bf63560a5fb57190afbdff43b26c251572105fc9ece1a3d87f'

export function Proof() {
  const [confirmations, setConfirmations] = useState<number | null>(null)
  const [head, setHead] = useState<number | null>(null)
  const [pulse, setPulse] = useState(0)

  useEffect(() => {
    let alive = true
    const tick = async () => {
      try {
        const res = await fetch('/api/tx/' + SAMPLE_TX, { cache: 'no-store' })
        const body = await res.json()
        if (!alive || !body.tx) return
        setConfirmations(body.tx.confirmations)
        setHead(body.head)
        setPulse((p) => p + 1)
      } catch {
        /* keep last */
      }
    }
    void tick()
    const id = window.setInterval(tick, 5000)
    return () => {
      alive = false
      window.clearInterval(id)
    }
  }, [])

  return (
    <div className="mx-auto grid max-w-4xl gap-5 px-5 sm:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, transform: 'translateX(-20px)' }}
        whileInView={{ opacity: 1, transform: 'translateX(0px)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="relative overflow-hidden rounded-3xl border border-line bg-surface p-6"
      >
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-danger/30 bg-danger/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-dangerText">
          <ImageOff className="h-3.5 w-3.5" strokeWidth={2} />
          A screenshot
        </div>

        <div className="space-y-3 opacity-60">
          <div className="text-3xl font-black tracking-tight text-ink">250 NIM</div>
          <div className="text-sm text-muted">Payment sent</div>
          <div className="h-px bg-line" />
          <Row label="Confirmations" value="14,864" />
          <Row label="Captured" value="whenever they liked" />
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-line bg-bg px-4 py-3 text-[13px] text-muted">
          <Lock className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          Frozen the instant it was taken. Editable by anyone with a photo app.
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, transform: 'translateX(20px)' }}
        whileInView={{ opacity: 1, transform: 'translateX(0px)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.08, ease: EASE_OUT }}
        className="relative overflow-hidden rounded-3xl border border-mint/25 bg-gradient-to-b from-mint/[0.09] to-transparent p-6"
      >
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-success">
          <CheckCheck className="h-3.5 w-3.5" strokeWidth={2} />
          A LunaBell receipt
        </div>

        <div className="space-y-3">
          <div className="text-3xl font-black tracking-tight text-ink">17.82 NIM</div>
          <div className="text-sm text-muted">Verified against the chain just now</div>
          <div className="h-px bg-line" />
          <Row
            label="Confirmations"
            value={confirmations !== null ? confirmations.toLocaleString() : '...'}
            live
            pulseKey={pulse}
          />
          <Row label="Chain head" value={head !== null ? head.toLocaleString() : '...'} />
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-mint/20 bg-bg px-4 py-3 text-[13px] text-muted">
          <RefreshCw className="h-4 w-4 shrink-0 text-success" strokeWidth={1.75} />
          Climbing while you read this. Re-read from Nimiq every five seconds.
        </div>
      </motion.div>
    </div>
  )
}

function Row({
  label,
  value,
  live,
  pulseKey,
}: {
  label: string
  value: string
  live?: boolean
  pulseKey?: number
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-[13px] text-faint">{label}</span>
      <motion.span
        key={live ? pulseKey : undefined}
        initial={live ? { opacity: 0.3, transform: 'translateY(-3px)' } : false}
        animate={live ? { opacity: 1, transform: 'translateY(0px)' } : undefined}
        transition={{ duration: 0.3, ease: EASE_OUT }}
        className={'font-mono text-sm tabular-nums ' + (live ? 'text-success' : 'text-ink')}
      >
        {value}
      </motion.span>
    </div>
  )
}
