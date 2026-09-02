import { DATA_PREFIX, hexToUtf8, normalizeAddress } from './charge.ts'

const RPC_URL = process.env.NIMIQ_RPC_URL || 'https://rpc.nimiqwatch.com'

export interface NimiqTx {
  hash: string
  blockNumber: number
  timestamp: number
  confirmations: number
  from: string
  to: string
  value: number
  fee: number
  senderData: string
  recipientData: string
  executionResult?: boolean
}

async function rpc<T>(method: string, params: unknown[]): Promise<T> {
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`rpc ${method} http ${res.status}`)
  const body = await res.json()
  if (body.error) throw new Error(`rpc ${method}: ${body.error.message ?? 'failed'}`)
  return body.result?.data as T
}

export function getBlockNumber(): Promise<number> {
  return rpc<number>('getBlockNumber', [])
}

export function getTransactionsByAddress(address: string, max = 25): Promise<NimiqTx[]> {
  return rpc<NimiqTx[]>('getTransactionsByAddress', [address, max, null])
}

// The node answers an unknown hash with a generic error, so absence is not an outage.
export async function getTransactionByHash(hash: string): Promise<NimiqTx | null> {
  try {
    return (await rpc<NimiqTx | null>('getTransactionByHash', [hash])) ?? null
  } catch (error) {
    if (/internal error|not found|no transaction/i.test((error as Error).message)) return null
    throw error
  }
}

// Transaction data arrives hex encoded; accept either a hex or a plain-text tag.
export function readTag(tx: NimiqTx): string {
  const raw = tx.recipientData ?? ''
  if (raw.startsWith(DATA_PREFIX)) return raw
  const decoded = hexToUtf8(raw)
  return decoded.startsWith(DATA_PREFIX) ? decoded : ''
}

export interface MatchCriteria {
  recipient: string
  value: number
  tag: string
  minBlock: number
}

// A charge rings only for its own tag, exact amount, and only after it was created.
export function matchCharge(txs: NimiqTx[], c: MatchCriteria): NimiqTx | null {
  const recipient = normalizeAddress(c.recipient)
  for (const tx of txs) {
    if (tx.executionResult === false) continue
    if (normalizeAddress(tx.to) !== recipient) continue
    if (tx.value !== c.value) continue
    if (tx.blockNumber < c.minBlock) continue
    if (readTag(tx) !== c.tag) continue
    return tx
  }
  return null
}
