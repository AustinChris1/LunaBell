import { LunaBellMark } from '@/components/Logo'

// Dev-only proof that the mark survives both grounds and shrinks to a favicon.
const SIZES = [64, 32, 24, 16]

export default function MarkTest() {
  return (
    <div className="grid min-h-dvh grid-cols-2">
      <div className="grid place-content-center gap-5 bg-[#070912] text-gold">
        <Row />
        <div className="text-[#eef1fb]">
          <Row />
        </div>
      </div>
      <div className="grid place-content-center gap-5 bg-[#f6f4ee] text-[#b07d0a]">
        <Row />
        <div className="text-[#0a0c18]">
          <Row />
        </div>
      </div>
    </div>
  )
}

function Row() {
  return (
    <div className="flex items-end gap-4">
      {SIZES.map((s) => (
        <LunaBellMark key={s} size={s} />
      ))}
    </div>
  )
}
