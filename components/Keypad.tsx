export function Keypad({
  onDigit,
  onDot,
  onBack,
}: {
  onDigit: (d: string) => void
  onDot: () => void
  onBack: () => void
}) {
  const key =
    'h-[46px] rounded-xl bg-surface text-[22px] font-bold text-ink shadow-[0_1px_0_var(--line)] transition active:bg-raised'
  const soft = 'h-[46px] rounded-xl bg-raised text-base font-bold text-muted transition active:opacity-70'

  return (
    <div className="my-4 grid grid-cols-3 gap-2">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
        <button key={d} type="button" className={key} onClick={() => onDigit(d)}>
          {d}
        </button>
      ))}
      <button type="button" className={soft} onClick={onDot}>
        .
      </button>
      <button type="button" className={key} onClick={() => onDigit('0')}>
        0
      </button>
      <button type="button" className={soft} onClick={onBack} aria-label="Delete">
        &#9003;
      </button>
    </div>
  )
}
