import { NextResponse } from 'next/server'
import { getBlockNumber } from '@/lib/nimiq-rpc'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const head = await getBlockNumber()
    return NextResponse.json({ head }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 })
  }
}
