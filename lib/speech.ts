'use client'

// The announcement layer: a chime the room can hear, then the amount spoken.

type Phrase = (amount: string) => string

// Kept to the locales Nimiq Pay documents; anything else falls back to English.
const PHRASES: Record<string, { received: Phrase; voice: string }> = {
  en: { received: (a) => `Received ${a}`, voice: 'en-US' },
  de: { received: (a) => `${a} erhalten`, voice: 'de-DE' },
  es: { received: (a) => `Recibido ${a}`, voice: 'es-ES' },
  fr: { received: (a) => `${a} reçus`, voice: 'fr-FR' },
  pt: { received: (a) => `Recebido ${a}`, voice: 'pt-BR' },
}

export { resolveLocale } from './i18n'

let audioContext: AudioContext | null = null

function context(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext || (window as any).webkitAudioContext
  if (!Ctor) return null
  if (!audioContext) audioContext = new Ctor()
  return audioContext
}

// Mobile browsers only allow audio after a gesture, so unlock on the first tap.
export async function unlockAudio(): Promise<void> {
  const ctx = context()
  if (!ctx) return
  if (ctx.state === 'suspended') await ctx.resume()
  if (typeof speechSynthesis !== 'undefined') {
    const warmup = new SpeechSynthesisUtterance('')
    warmup.volume = 0
    speechSynthesis.speak(warmup)
  }
}

export function chime(): void {
  const ctx = context()
  if (!ctx) return
  const now = ctx.currentTime
  // Two struck partials, a bell rather than a notification blip.
  for (const [index, frequency] of [880, 1318.5].entries()) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = frequency
    const start = now + index * 0.14
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(0.35, start + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.1)
    osc.connect(gain).connect(ctx.destination)
    osc.start(start)
    osc.stop(start + 1.2)
  }
}

export function speak(amountSpoken: string, locale: string): void {
  if (typeof speechSynthesis === 'undefined') return
  const entry = PHRASES[locale] ?? PHRASES.en
  const utterance = new SpeechSynthesisUtterance(entry.received(amountSpoken))
  utterance.lang = entry.voice
  utterance.rate = 0.95
  utterance.volume = 1
  speechSynthesis.cancel()
  speechSynthesis.speak(utterance)
}

export function announce(amountSpoken: string, locale: string): void {
  chime()
  window.setTimeout(() => speak(amountSpoken, locale), 700)
}

export function vibrate(): void {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([120, 60, 120])
}
