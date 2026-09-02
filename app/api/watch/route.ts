import { NextResponse } from 'next/server'
import { getBlockNumber, getTransactionsByAddress, matchCharge } from '@/lib/nimiq-rpc'
import { isNimiqAddress, prettyAddress } from '@/lib/charge'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const address = params.get('address') ?? ''
  const value = Number(params.get('value'))
  const tag = params.get('tag') ?? ''
  const minBlock = Number(params.get('minBlock') ?? 0)

  if (!isNimiqAddress(address)) {
    return NextResponse.json({ error: 'invalid address' }, { status: 400 })
  }
  if (!Number.isFinite(value) || value <= 0 || !tag) {
    return NextResponse.json({ error: 'invalid charge' }, { status: 400 })
  }

  try {
    const [head, txs] = await Promise.all([
      getBlockNumber(),
      getTransactionsByAddress(prettyAddress(address), 25),
    ])
    const match = matchCharge(txs ?? [], { recipient: address, value, tag, minBlock })
    return NextResponse.json({ head, match }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 })
  }
}
