'use client'

import { useEffect } from 'react'

export function ServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') return
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* installability is a bonus, never a blocker */
    })
  }, [])
  return null
}
