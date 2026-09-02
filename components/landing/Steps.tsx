'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BellRing, QrCode, Send, ShieldCheck } from 'lucide-react'

const STEPS = [
  {
    icon: Send,
    title: 'Name the amount',
    body: 'A charge is one object: amount, reason, and a tag derived from it. It lives in its own link, so there is no account and no database.',
  },
  {
    icon: QrCode,
    title: 'Show it or send it',
    body: 'Prop the phone up as a counter code, or drop the link in a chat. Whoever pays does it from their own wallet, straight to yours.',
  },
  {
    icon: BellRing,
    title: 'The bell rings',
    body: 'It rings only for that tag, that exact amount, that recipient, and only after the charge was made. Hands stay full, eyes stay up.',
  },
  {
    icon: ShieldCheck,
    title: 'The receipt outlives the moment',
    body: 'Every open re-reads the chain. The confirmation count climbs while you watch it. No screenshot can do that.',
  },
]

export function Steps() {
  const root = useRef<HTMLDivElement>(null)
  const line = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // the rail fills as the reader moves through the sequence
      if (line.current) {
        gsap.fromTo(
          line.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: 'top',
            scrollTrigger: {
              trigger: root.current,
              start: 'top 62%',
              end: 'bottom 72%',
              scrub: 0.6,
            },
          },
        )
      }

      gsap.utils.toArray<HTMLElement>('.lb-step').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 82%' },
          },
        )
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="relative mx-auto max-w-3xl px-5">
      <div className="absolute left-[34px] top-4 bottom-6 hidden w-px bg-line sm:block">
        <div ref={line} className="h-full w-px origin-top bg-gradient-to-b from-gold via-gold/60 to-transparent" />
      </div>

      <ol className="space-y-8 sm:space-y-10">
        {STEPS.map((step, i) => {
          const Icon = step.icon
          return (
            <li key={step.title} className="lb-step relative flex gap-5 sm:gap-7">
              <div className="relative z-10 flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-2xl border border-line bg-surface shadow-sm">
                <Icon className="h-6 w-6 text-gold" strokeWidth={1.75} />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold font-mono text-[11px] font-bold text-nimiq">
                  {i + 1}
                </span>
              </div>
              <div className="pt-1.5">
                <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">{step.title}</h3>
                <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">{step.body}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
