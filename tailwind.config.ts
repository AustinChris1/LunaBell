import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  // touch devices fire hover on tap; only real pointers get hover styles
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        // semantic, flipped by the .dark class in globals.css
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        raised: 'var(--raised)',
        line: 'var(--line)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        faint: 'var(--faint)',
        accent: 'var(--accent)',
        link: 'var(--link)',
        success: 'var(--success)',
        dangerText: 'var(--danger-text)',
        // brand constants, identical in both themes
        gold: '#E9B213',
        goldDeep: '#EC991C',
        glow: '#FFD668',
        nimiq: '#1F2348',
        sky: '#0582CA',
        mint: '#21BCA5',
        danger: '#D94432',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        ui: ['var(--font-ui)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: { xl2: '18px' },
      // one strong ease-out for every transition; the weak built-in curve is gone
      transitionTimingFunction: {
        DEFAULT: 'var(--ease-out)',
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
      },
      transitionDuration: { DEFAULT: '160ms' },
      keyframes: {
        sway: { '0%,100%': { transform: 'rotate(-8deg)' }, '50%': { transform: 'rotate(8deg)' } },
        ring: {
          '0%': { transform: 'scale(0.7)', opacity: '0.55' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.25' } },
        rise: { from: { opacity: '0', transform: 'translateY(12px) scale(0.98)' } },
        fade: { from: { opacity: '0' } },
        live: { '75%,100%': { transform: 'scale(2)', opacity: '0' } },
        shimmer: { '0%': { backgroundPosition: '0% 50%' }, '100%': { backgroundPosition: '200% 50%' } },
      },
      animation: {
        sway: 'sway 3.2s ease-in-out infinite',
        ring: 'ring 2.6s ease-out infinite',
        blink: 'blink 1.5s ease-in-out infinite',
        rise: 'rise 0.28s var(--ease-out)',
        fade: 'fade 0.2s ease',
        live: 'live 2.4s cubic-bezier(0, 0, 0.2, 1) infinite',
        shimmer: 'shimmer 3.5s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
