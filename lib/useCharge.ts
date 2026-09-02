'use client'

import { useEffect, useRef, useState } from 'react'
import type { NimiqTx } from './nimiq-rpc'

const POLL_MS = 3500

export interface WatchResult {
  match: NimiqTx | null
  head: number | null
  error: string | null
}

// Polls the chain for a payment matching this exact charge, then stops.
export function useChargeWatcher(
  active: boolean,
  params: { address: string; value: number; tag: string; minBlock: number } | null,
): WatchResult {
  const [result, setResult] = useState<WatchResult>({ match: null, head: null, error: null })
  const settled = useRef(false)

  useEffect(() => {
    settled.current = false
    setResult({ match: null, head: null, error: null })
  }, [params?.tag])

  useEffect(() => {
    if (!active || !params) return
    let cancelled = false

    const tick = async () => {
      if (cancelled || settled.current) return
      try {
        const query = new URLSearchParams({
          address: params.address,
          value: String(params.value),
          tag: params.tag,
          minBlock: String(params.minBlock),
        })
        const res = await fetch(`/api/watch?${query}`, { cache: 'no-store' })
        const body = await res.json()
        if (cancelled) return
        if (body.error) {
          setResult((r) => ({ ...r, error: body.error }))
          return
        }
        if (body.match) settled.current = true
        setResult({ match: body.match ?? null, head: body.head ?? null, error: null })
      } catch (err) {
        if (!cancelled) setResult((r) => ({ ...r, error: (err as Error).message }))
      }
    }

    void tick()
    const timer = window.setInterval(tick, POLL_MS)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [active, params?.address, params?.value, params?.tag, params?.minBlock])

  return result
}
