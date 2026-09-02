// A charge is carried entirely in its URL: no database, nothing custodial.

export const LUNA_PER_NIM = 1e5
export const DATA_PREFIX = 'LB:'

export interface Charge {
  r: string // recipient address
  v: number // value in luna
  m: string // memo shown to the payer
  n: string // nonce, makes two identical charges distinct
  t: number // created at, ms
  b: number // block height when created, bounds the replay window
}

export function normalizeAddress(address: string): string {
  return address.replace(/\s+/g, '').toUpperCase()
}

export function isNimiqAddress(address: string): boolean {
  return /^NQ[0-9A-Z]{34}$/.test(normalizeAddress(address))
}

export function prettyAddress(address: string): string {
  const raw = normalizeAddress(address)
  return raw.match(/.{1,4}/g)?.join(' ') ?? raw
}

export function newNonce(): string {
  const bytes = new Uint8Array(6)
  crypto.getRandomValues(bytes)
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Short id binding recipient, amount and nonce; it travels in the transaction.
export async function chargeId(charge: Charge): Promise<string> {
  const canonical = `${normalizeAddress(charge.r)}|${charge.v}|${charge.n}`
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical))
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 8)
}

export async function chargeData(charge: Charge): Promise<string> {
  return DATA_PREFIX + (await chargeId(charge))
}

export function encodeCharge(charge: Charge): string {
  const json = JSON.stringify(charge)
  const b64 = typeof window === 'undefined'
    ? Buffer.from(json, 'utf8').toString('base64')
    : btoa(unescape(encodeURIComponent(json)))
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeCharge(token: string): Charge | null {
  try {
    const b64 = token.replace(/-/g, '+').replace(/_/g, '/')
    const json = typeof window === 'undefined'
      ? Buffer.from(b64, 'base64').toString('utf8')
      : decodeURIComponent(escape(atob(b64)))
    const parsed = JSON.parse(json) as Charge
    if (!isNimiqAddress(parsed.r) || !Number.isFinite(parsed.v) || parsed.v <= 0) return null
    return parsed
  } catch {
    return null
  }
}

export function hexToUtf8(hex: string): string {
  if (!hex || hex.length % 2 !== 0) return ''
  try {
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
    return new TextDecoder('utf-8', { fatal: false }).decode(bytes)
  } catch {
    return ''
  }
}

export function utf8ToHex(text: string): string {
  return [...new TextEncoder().encode(text)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
