'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, RotateCcw, Volume2 } from 'lucide-react'
import { useT } from './T'
import { announce, unlockAudio } from '@/lib/speech'
import { formatFiat, formatNim, lunaToNim } from '@/lib/format'
import { type Taking, clearTakings, loadTakings, sumLuna, takingsToday } from '@/lib/takings'

export function TakingsPanel({
  refreshKey,
  rate,
  unit,
  onRepeat,
}: {
  refreshKey: number
  rate: number | null
  unit: string
  onRepeat: (luna: number, memo: string) => void
}) {
  const { t, locale } = useT()
  const [list, setList] = useState<Taking[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => setList(loadTakings()), [refreshKey])

  const today = takingsToday(list)
  const total = sumLuna(today)
  // 'nim' is not a currency Intl knows, so the fiat line always uses a real code
  const fiatCode = unit === 'nim' ? 'usd' : unit

  const speakTotal = async () => {
    await unlockAudio()
    const amount =
      unit !== 'nim' && rate !== null
        ? formatFiat(lunaToNim(total) * rate, fiatCode)
        : formatNim(total) + ' NIM'
    announce(t('totalSpoken', { amount }), locale)
  }

  if (today.length === 0) {
    return (
      <div className="mt-4 rounded-2xl border border-dashed border-line px-4 py-3 text-center text-[13px] text-faint">
        {t('noneYet')}
      </div>
    )
  }

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-raised">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-faint">
            {t('today')} · {today.length}
          </p>
          <p className="font-display text-[22px] font-bold leading-tight tabular-nums text-ink">
            {formatNim(total)} NIM
          </p>
          {rate !== null && (
            <p className="text-[12px] text-muted">{formatFiat(lunaToNim(total) * rate, fiatCode)}</p>
          )}
        </div>
        <ChevronDown
          className={'h-4 w-4 shrink-0 text-faint transition-transform ' + (open ? 'rotate-180' : '')}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div className="animate-rise border-t border-line">
          <ul className="max-h-64 overflow-y-auto">
            {today.map((entry) => (
              <li key={entry.hash} className="flex items-center gap-2 border-b border-line px-4 py-2.5 last:border-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold tabular-nums text-ink">{formatNim(entry.value)} NIM</p>
                  <p className="truncate text-[12px] text-muted">
                    {entry.memo || t('paidAt')} ·{' '}
                    {new Date(entry.at).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <a
                  href={'/r/' + entry.hash}
                  className="press inline-flex min-h-[44px] items-center rounded-full border border-line px-3 text-[12px] font-bold text-muted"
                >
                  {t('receipt')}
                </a>
                <button
                  type="button"
                  onClick={() => onRepeat(entry.value, entry.memo)}
                  aria-label={t('repeat')}
                  className="press grid h-11 w-11 place-items-center rounded-full border border-line text-muted active:bg-surface"
                >
                  <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex gap-2 px-4 py-3">
            <button
              type="button"
              onClick={speakTotal}
              className="press inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-line px-3 text-[13px] font-bold text-ink"
            >
              <Volume2 className="h-3.5 w-3.5" strokeWidth={2} />
              {t('sayTotal')}
            </button>
            <button
              type="button"
              onClick={() => {
                clearTakings()
                setList([])
              }}
              className="press min-h-[44px] rounded-xl border border-line px-3 text-[13px] font-bold text-muted"
            >
              {t('clearHistory')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
