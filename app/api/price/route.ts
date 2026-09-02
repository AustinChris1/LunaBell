import { NextResponse } from 'next/server'

export const revalidate = 60

const SOURCE = 'https://api.coingecko.com/api/v3/simple/price?ids=nimiq-2&vs_currencies='

export async function GET(request: Request) {
  const currency = (new URL(request.url).searchParams.get('currency') ?? 'usd').toLowerCase()
  if (!/^[a-z]{3}$/.test(currency)) {
    return NextResponse.json({ error: 'invalid currency' }, { status: 400 })
  }
  try {
    const res = await fetch(SOURCE + currency, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error(`price http ${res.status}`)
    const body = await res.json()
    const rate = body?.['nimiq-2']?.[currency]
    if (typeof rate !== 'number') throw new Error('rate unavailable')
    return NextResponse.json({ currency, rate })
  } catch (error) {
    // A missing rate must never block a payment; the caller falls back to NIM.
    return NextResponse.json({ currency, rate: null, error: (error as Error).message })
  }
}
