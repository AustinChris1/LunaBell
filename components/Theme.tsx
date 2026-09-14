'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'

export type ThemeChoice = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'lb.theme'

// Runs before paint so the first frame is already in the right theme.
export const THEME_BOOT_SCRIPT = `(function(){try{var c=localStorage.getItem('${STORAGE_KEY}')||'system';var d=c==='dark'||(c!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})()`

interface ThemeState {
  choice: ThemeChoice
  resolved: 'light' | 'dark'
  setChoice: (c: ThemeChoice) => void
}

const ThemeContext = createContext<ThemeState | null>(null)

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [choice, setChoiceState] = useState<ThemeChoice>('system')
  const [resolved, setResolved] = useState<'light' | 'dark'>('light')

  const apply = useCallback((next: ThemeChoice) => {
    const dark = next === 'dark' || (next === 'system' && systemPrefersDark())
    document.documentElement.classList.toggle('dark', dark)
    setResolved(dark ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemeChoice | null) ?? 'system'
    setChoiceState(stored)
    apply(stored)
  }, [apply])

  useEffect(() => {
    if (choice !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => apply('system')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [choice, apply])

  const setChoice = useCallback(
    (next: ThemeChoice) => {
      setChoiceState(next)
      localStorage.setItem(STORAGE_KEY, next)
      apply(next)
    },
    [apply],
  )

  return <ThemeContext.Provider value={{ choice, resolved, setChoice }}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeState {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme used outside ThemeProvider')
  return ctx
}

const ORDER: ThemeChoice[] = ['light', 'dark', 'system']
const ICONS = { light: Sun, dark: Moon, system: Monitor }
const LABELS = { light: 'Light', dark: 'Dark', system: 'System' }

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { choice, setChoice } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const active = mounted ? choice : 'system'
  const Icon = ICONS[active]

  const cycle = () => setChoice(ORDER[(ORDER.indexOf(active) + 1) % ORDER.length])

  if (compact) {
    return (
      <button
        type="button"
        onClick={cycle}
        aria-label={`Theme: ${LABELS[active]}. Tap to change.`}
        title={`Theme: ${LABELS[active]}`}
        className="press inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-muted hover:text-ink"
      >
        <Icon className="h-4 w-4" strokeWidth={1.9} />
      </button>
    )
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1">
      {ORDER.map((option) => {
        const OptionIcon = ICONS[option]
        const on = active === option
        return (
          <button
            key={option}
            type="button"
            onClick={() => setChoice(option)}
            aria-label={LABELS[option]}
            aria-pressed={on}
            title={LABELS[option]}
            className={
              'press inline-flex h-8 w-8 items-center justify-center rounded-full ' +
              (on ? 'bg-gold text-nimiq' : 'text-faint hover:text-ink')
            }
          >
            <OptionIcon className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        )
      })}
    </div>
  )
}
