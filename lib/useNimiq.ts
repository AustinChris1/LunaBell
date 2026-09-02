'use client'

import { useCallback, useEffect, useState } from 'react'
import type { NimiqProvider } from '@nimiq/mini-app-sdk/provider'

export interface NimiqState {
  provider: NimiqProvider | null
  account: string | null
  inHost: boolean // running inside Nimiq Pay
  consensus: boolean | null
  loading: boolean
  language?: string
}

export function useNimiq(): NimiqState & { refresh: () => void } {
  const [state, setState] = useState<NimiqState>({
    provider: null,
    account: null,
    inHost: false,
    consensus: null,
    loading: true,
  })

  const load = useCallback(async () => {
    if (typeof window === 'undefined') return
    try {
      const { init, getHostLanguage } = await import('@nimiq/mini-app-sdk')
      const provider = await init({ timeout: 2500 })
      const accounts = await provider.listAccounts()
      const account = Array.isArray(accounts) ? accounts[0] ?? null : null
      let consensus: boolean | null = null
      try {
        consensus = await provider.isConsensusEstablished()
      } catch {
        consensus = null
      }
      setState({
        provider,
        account,
        inHost: true,
        consensus,
        loading: false,
        language: getHostLanguage(),
      })
    } catch {
      // Outside Nimiq Pay the app still works: the payee types their address.
      setState((s) => ({ ...s, provider: null, inHost: false, loading: false }))
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!state.provider) return
    const tick = async () => {
      try {
        const consensus = await state.provider!.isConsensusEstablished()
        setState((s) => (s.consensus === consensus ? s : { ...s, consensus }))
      } catch {
        /* host may drop the provider between polls */
      }
    }
    const id = window.setInterval(tick, 4000)
    return () => window.clearInterval(id)
  }, [state.provider])

  return { ...state, refresh: () => void load() }
}
