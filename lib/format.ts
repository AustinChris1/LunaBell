import { LUNA_PER_NIM } from './charge'

export const lunaToNim = (luna: number): number => luna / LUNA_PER_NIM
export const nimToLuna = (nim: number): number => Math.round(nim * LUNA_PER_NIM)

export function formatNim(luna: number): string {
  const nim = lunaToNim(luna)
  const decimals = nim >= 1000 ? 0 : nim >= 1 ? 2 : 5
  return nim.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: decimals })
}

export function formatLuna(luna: number): string {
  return luna.toLocaleString('en-US') + ' luna'
}

export function formatFiat(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      maximumFractionDigits: amount < 1 ? 4 : 2,
    }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency.toUpperCase()}`
  }
}

export function shortHash(hash: string): string {
  return `${hash.slice(0, 6)}...${hash.slice(-6)}`
}

export function timeAgo(ms: number): string {
  const seconds = Math.max(0, Math.floor((Date.now() - ms) / 1000))
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
