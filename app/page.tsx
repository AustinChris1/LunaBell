import Link from 'next/link'
import { ArrowRight, Code2, Languages, Link2, ShieldCheck, Volume2, WalletMinimal } from 'lucide-react'
import { LunaBellMark, LunaBellWordmark } from '@/components/Logo'
import { CountUp, HearIt, HostRedirect, LiveBlock, Reveal } from '@/components/landing/Pieces'
import { ThemeToggle } from '@/components/Theme'
import { MotionConfig } from 'framer-motion'
import { Proof } from '@/components/landing/Proof'
import { Steps } from '@/components/landing/Steps'
import { OpenInPay } from '@/components/OpenInPay'

const FEATURES = [
  {
    icon: Volume2,
    title: 'It speaks, so you can look away',
    body: 'A struck bell, then the amount in the language Nimiq Pay is already set to. Serve the next person without checking a screen.',
  },
  {
    icon: ShieldCheck,
    title: 'It rings only for your charge',
    body: 'Matched on tag, exact amount, recipient and block window. A dust transfer or a replayed old payment cannot set it off.',
  },
  {
    icon: Link2,
    title: 'The receipt is a link, not a picture',
    body: 'Forward it into the argument. It re-reads the chain on every open, so its confirmation count keeps climbing.',
  },
  {
    icon: WalletMinimal,
    title: 'Nothing is ever held',
    body: 'Payment goes wallet to wallet. No custody, no deposits, no account, no database. The charge lives in its own link.',
  },
  {
    icon: Languages,
    title: 'Speaks the local money',
    body: 'Amounts announced in NIM or the local currency, with the luna count shown for anyone who wants the exact figure.',
  },
  {
    icon: Code2,
    title: 'Open, MIT, auditable',
    body: 'Every matching rule is in the repo with tests that assert the bell stays silent when it should.',
  },
]

export default function Landing() {
  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-dvh bg-bg font-ui text-ink antialiased">
      <HostRedirect />

      {/* hero */}
      <section className="relative overflow-hidden px-5 pb-24 pt-10 sm:pt-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-18%] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gold/[0.13] blur-[130px]" />
          <div className="absolute right-[-10%] top-[22%] h-[380px] w-[420px] rounded-full bg-nimiq/[0.16] blur-[120px]" />
        </div>

        <header className="relative mx-auto flex max-w-5xl items-center justify-between">
          <LunaBellWordmark size={30} />
          <div className="flex items-center gap-2">
            <LiveBlock />
            <ThemeToggle />
          </div>
        </header>

        <div className="relative mx-auto mt-16 max-w-3xl text-center sm:mt-24">
          <Reveal>
            <div className="relative mx-auto mb-9 flex h-[132px] w-[132px] items-center justify-center">
              <span className="absolute h-full w-full rounded-full border border-gold/25 animate-ring" />
              <span
                className="absolute h-full w-full rounded-full border border-gold/25 animate-ring"
                style={{ animationDelay: '0.9s' }}
              />
              <span className="absolute h-[92px] w-[92px] rounded-full bg-gold/10 blur-md" />
              <span className="relative text-gold animate-sway">
                <LunaBellMark size={78} />
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.04}>
            <p className="mx-auto mb-5 max-w-xl text-[15px] font-semibold leading-snug text-muted sm:text-[17px]">
              Someone says they paid. Their screen says sent. You still don&apos;t know.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="font-display text-[40px] font-semibold leading-[1.06] tracking-[-0.03em] text-ink sm:text-[62px]">
              The bell that only rings{' '}
              <br className="hidden sm:inline" />
              when the lunas are{' '}
              <span className="font-bold text-accent">real</span>
            </h1>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-muted">
              LunaBell turns a phone into a Nimiq payment soundbox. Create a charge, show the QR,
              put the phone down. When the payment actually settles on-chain, the bell rings and
              speaks how much arrived.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <OpenInPay
                url="https://lunabell.vercel.app/app"
                variant="button"
                className="!w-auto min-h-[44px] rounded-full px-7 shadow-[0_10px_40px_-8px_rgba(240,180,41,0.6)]"
              />
              <Link
                href="/app"
                className="press group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line bg-surface px-7 text-sm font-bold text-ink hover:bg-raised"
              >
                Open in browser
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
              </Link>
              <HearIt />
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <p className="mt-6 text-[13px] text-faint">
              Runs inside Nimiq Pay. Works in any browser for a look around.
            </p>
          </Reveal>
        </div>
      </section>

      {/* the problem, with the hardware precedent */}
      <section className="relative border-y border-line bg-surface/60 px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-display text-[30px] font-semibold leading-tight tracking-[-0.02em] sm:text-[42px]">
              A silent screen is how the fraud works
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-muted">
              Someone shows you a payment screen, you hand over the goods, nothing ever arrives.
              India answered this in hardware, and merchants bought it by the million.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {[
              { n: 6.8, s: 'M', label: 'Paytm Soundboxes deployed', sub: 'company figure, Apr 2023' },
              { n: 2.2, s: 'M', label: 'PhonePe Smart Speakers', sub: 'company figure, Apr 2023' },
              { n: 0, s: '', label: 'Of them are software', sub: 'every one is a device you buy' },
            ].map((stat, i) => (
              <div key={stat.label}>
                <div className="h-full rounded-3xl border border-line bg-surface p-7 text-center">
                  <div className="font-display text-[46px] font-bold leading-none tracking-tight tabular-nums text-accent">
                    {stat.n === 0 ? '0' : <CountUp to={stat.n} decimals={1} />}
                    {stat.s}
                  </div>
                  <p className="mt-3 text-[14px] font-semibold text-ink">{stat.label}</p>
                  <p className="mt-1 text-[12px] text-faint">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <p className="mx-auto mt-8 max-w-2xl text-center text-[14px] leading-relaxed text-faint">
              &ldquo;Before sound boxes, people were using apps to create fake payment receipts. I got
              conned a few times.&rdquo;
              <span className="mt-1 block text-[12px] text-faint">
                a merchant, quoted by Rest of World, 4 April 2023
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="px-5 py-20 sm:py-28">
        <div className="mx-auto mb-14 max-w-3xl px-5 text-center">
          <h2 className="font-display text-[30px] font-semibold leading-tight tracking-[-0.02em] sm:text-[42px]">
            One charge, start to settled
          </h2>
        </div>
        <Steps />
      </section>

      {/* screenshot vs receipt */}
      <section className="border-y border-line bg-surface/60 px-5 py-20 sm:py-24">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="font-display text-[30px] font-semibold leading-tight tracking-[-0.02em] sm:text-[42px]">
            One of these keeps counting
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-muted">
            The numbers on the right are read live from Nimiq mainnet, right now, in your browser.
          </p>
        </div>
        <Proof />
      </section>

      {/* features */}
      <section className="px-5 py-20 sm:py-28">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="font-display text-[30px] font-semibold leading-tight tracking-[-0.02em] sm:text-[42px]">
            Small on purpose
          </h2>
        </div>

        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <div key={f.title}>
                <div className="group h-full rounded-3xl border border-line bg-surface p-7 transition hover:border-gold/25 hover:bg-raised">
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-bg">
                    <Icon className="h-5 w-5 text-gold" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-display text-[19px] font-semibold text-ink">{f.title}</h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted">{f.body}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* close */}
      <section className="relative overflow-hidden px-5 pb-28 pt-8">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] bg-gradient-to-t from-gold/[0.09] to-transparent" />
        <div className="relative mx-auto max-w-2xl text-center">
          <span className="inline-flex text-gold animate-sway">
            <LunaBellMark size={54} />
          </span>
          <h2 className="mt-7 font-display text-[32px] font-semibold leading-tight tracking-[-0.02em] sm:text-[46px]">
            Put it on the counter
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-muted">
            Or in the group chat where someone still owes you. Same bell, same receipt.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <OpenInPay
              url="https://lunabell.vercel.app/app"
              variant="button"
              className="!w-auto min-h-[48px] rounded-full px-8 shadow-[0_10px_40px_-8px_rgba(240,180,41,0.6)]"
            />
            <Link
              href="/app"
              className="press group inline-flex min-h-[48px] items-center gap-2 rounded-full border border-line bg-surface px-8 text-sm font-bold text-ink hover:bg-raised"
            >
              Open in browser
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
            </Link>
            <HearIt />
          </div>
        </div>
      </section>

      <footer className="border-t border-line px-5 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <LunaBellWordmark size={22} />
          <p className="text-[12px] leading-relaxed text-faint">
            Built for the Nimiq Mini Apps Competition, Cycle II. MIT licensed.
          </p>
        </div>
      </footer>
    </div>
    </MotionConfig>
  )
}
