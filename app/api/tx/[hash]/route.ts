import { NextResponse } from 'next/server'
import { getBlockNumber, getTransactionByHash, readTag } from '@/lib/nimiq-rpc'

export const dynamic = 'force-dynamic'

export async function GET(_request: Request, context: { params: Promise<{ hash: string }> }) {
  const { hash } = await context.params
  if (!/^[0-9a-f]{64}$/i.test(hash)) {
    return NextResponse.json({ error: 'invalid hash' }, { status: 400 })
  }
  try {
    const [tx, head] = await Promise.all([getTransactionByHash(hash), getBlockNumber()])
    if (!tx) return NextResponse.json({ error: 'not found' }, { status: 404 })
    return NextResponse.json({ tx, tag: readTag(tx), head }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 })
  }
}
