'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { NimiqHex } from './Logo'

export function PayQr({ url, size = 200 }: { url: string; size?: number }) {
  const [src, setSrc] = useState('')

  useEffect(() => {
    if (!url) return
    QRCode.toDataURL(url, {
      margin: 1,
      width: 440,
      errorCorrectionLevel: 'H',
      color: { dark: '#1F2348', light: '#ffffff' },
    })
      .then(setSrc)
      .catch(() => setSrc(''))
  }, [url])

  if (!src) return null

  return (
    <div className="relative mx-auto w-fit rounded-2xl bg-white p-3.5 ring-1 ring-line">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="Scan to pay this charge in Nimiq Pay" width={size} height={size} style={{ width: size, height: size }} />
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-[0_0_0_4px_#fff]">
          <NimiqHex size={26} />
        </span>
      </div>
    </div>
  )
}
