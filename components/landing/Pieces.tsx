'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { useRouter } from 'next/navigation'

// Inside Nimiq Pay nobody wants marketing, so hand them the app.
export function HostRedirect() {
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== 'undefined' && window.nimiqPay) router.replace('/app')
  }, [router])
  return null
}

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function CountUp({
  to,
  decimals = 0,
  suffix = '',
  duration = 1.8,
}: {
  to: number
  decimals?: number
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const value = useMotionValue(0)
  const spring = useSpring(value, { duration: duration * 1000, bounce: 0 })
  const [shown, setShown] = useState('0')

  useEffect(() => {
    if (inView) value.set(to)
  }, [inView, to, value])

  useEffect(
    () =>
      spring.on('change', (v) =>
        setShown(v.toLocaleString('en-US', { maximumFractionDigits: decimals, minimumFractionDigits: decimals })),
      ),
    [spring, decimals],
  )

  return (
    <span ref={ref}>
      {shown}
      {suffix}
    </span>
  )
}

// Real chain height, so the page itself is evidence the rails are live.
export function LiveBlock() {
  const [head, setHead] = useState<number | null>(null)
  useEffect(() => {
    let alive = true
    const tick = async () => {
      try {
        const res = await fetch('/api/head', { cache: 'no-store' })
        const body = await res.json()
        if (alive && typeof body.head === 'number') setHead(body.head)
      } catch {
        /* keep last */
      }
    }
    void tick()
    const id = window.setInterval(tick, 6000)
    return () => {
      alive = false
      window.clearInterval(id)
    }
  }, [])

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted backdrop-blur">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
      </span>
      {head ? 'Nimiq block ' + head.toLocaleString() : 'Connecting to Nimiq'}
    </span>
  )
}

// The product is a sound, so the page lets you hear it before anything else.
export function HearIt({ className }: { className?: string }) {
  const [playing, setPlaying] = useState(false)

  const play = async () => {
    if (playing) return
    setPlaying(true)
    const { announce, unlockAudio } = await import('@/lib/speech')
    await unlockAudio()
    announce('$12.50', 'en')
    window.setTimeout(() => setPlaying(false), 3200)
  }

  return (
    <button
      type="button"
      onClick={play}
      className={
        'group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-gold/40 bg-gold/10 px-6 py-3.5 text-sm font-bold text-goldDeep transition hover:border-gold hover:bg-gold/20 ' +
        (className ?? '')
      }
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        <span
          className={
            'absolute h-4 w-4 rounded-full border border-glow ' + (playing ? 'animate-ring' : 'opacity-0')
          }
        />
        <span className="h-1.5 w-1.5 rounded-full bg-glow" />
      </span>
      {playing ? 'Listening...' : 'Hear the bell'}
    </button>
  )
}
