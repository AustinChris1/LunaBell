'use client'

import { useEffect, useState } from 'react'
import { prettyAddress } from '@/lib/charge'

export function Identicon({ address, size = 64 }: { address: string; size?: number }) {
  const [svg, setSvg] = useState('')

  useEffect(() => {
    if (!address) {
      setSvg('')
      return
    }
    let alive = true
    ;(async () => {
      try {
        const { default: Identicons } = await import('@nimiq/identicons')
        // the shipped default points at node_modules, which does not exist once deployed
        ;(Identicons as unknown as { svgPath: string }).svgPath = '/identicons.min.svg'
        const markup = await Identicons.svg(prettyAddress(address))
        if (alive) setSvg(markup)
      } catch {
        if (alive) setSvg('')
      }
    })()
    return () => {
      alive = false
    }
  }, [address])

  return (
    <div
      className={'identicon shrink-0 rounded-full' + (svg ? '' : ' bg-raised')}
      style={{ width: size, height: size }}
      aria-hidden="true"
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  )
}
