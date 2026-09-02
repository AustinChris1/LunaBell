import { prettyAddress } from '@/lib/charge'
import { Identicon } from './Identicon'

export function NimiqAddress({
  address,
  size = 40,
  label,
}: {
  address: string
  size?: number
  label?: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-raised px-3.5 py-3">
      <Identicon address={address} size={size} />
      <div className="min-w-0">
        {label && (
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.09em] text-faint">
            {label}
          </span>
        )}
        <span className="block break-all font-mono text-[13px] text-ink">{prettyAddress(address)}</span>
      </div>
    </div>
  )
}
