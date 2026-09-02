// The mark: a bell carrying a crescent, for the bell that rings only when the lunas are real.
export function LunaBellMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <mask id="lb-crescent">
          <rect width="32" height="32" fill="black" />
          <circle cx="16" cy="15" r="6.2" fill="white" />
          <circle cx="19.4" cy="12.6" r="5.6" fill="black" />
        </mask>
      </defs>

      {/* bell crown */}
      <path d="M16 3.2v2.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />

      {/* bell body */}
      <path
        d="M16 5.4c-5 0-7.7 3.7-7.7 9.1 0 4.2-.9 6.3-2.1 7.6-.5.5-.2 1.4.5 1.4h18.6c.7 0 1-.9.5-1.4-1.2-1.3-2.1-3.4-2.1-7.6 0-5.4-2.7-9.1-7.7-9.1Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />

      {/* the luna inside */}
      <circle cx="16" cy="15" r="6.2" fill="currentColor" mask="url(#lb-crescent)" opacity="0.95" />

      {/* clapper */}
      <path
        d="M13.2 26.2a2.9 2.9 0 0 0 5.6 0"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function LunaBellWordmark({ size = 26 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2 font-display text-[21px] tracking-tight text-goldDeep">
      <LunaBellMark size={size} />
      <span className="text-ink">
        Luna<strong className="font-bold">Bell</strong>
      </span>
    </span>
  )
}

export function NimiqHex({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <polygon points="16,2.4 28.4,9.2 28.4,22.8 16,29.6 3.6,22.8 3.6,9.2" fill="#E9B213" />
    </svg>
  )
}
