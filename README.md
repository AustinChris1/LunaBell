# LunaBell

**The bell that only rings when the lunas are real.**

A Nimiq Pay Mini App. Name an amount, share it or show the QR, and put the phone
down. LunaBell watches the Nimiq chain and announces the payment out loud the
moment it actually settles, then hands over a receipt that re-reads the chain
every time anyone opens it.

Built for the Nimiq Mini Apps Competition, Cycle II.

## The problem

The fake payment screenshot. A customer shows a "sent" screen, walks off, and
nothing ever arrives. India answered this in hardware: per Rest of World
(4 April 2023), Paytm had deployed 6.8 million Soundboxes and PhonePe 2.2 million
Smart Speakers, and the merchants quoted in that piece name doctored receipts as
the reason they bought one. A silent screen is how the fraud works. LunaBell is
that device as free software, inside a wallet people already have.

It is not only for a counter. Anyone waiting on money, a roommate, a freelancer,
a friend who says "I sent it," gets the same two things: a sound they can trust
and a receipt they can forward.

## How it works

A **charge** is the only object in the app: an amount, a memo, a nonce, and the
block height when it was created. It lives entirely in its own URL. There is no
database, no account, and nothing custodial.

1. **Create.** The payee names an amount. The app derives a short tag,
   `LB:` plus the first 8 hex characters of `SHA-256(recipient|value|nonce)`.
2. **Share.** The charge travels as a link or a QR code. A payer without Nimiq
   Pay installs it and pays from their own wallet to the payee's address.
3. **Pay.** The payer sends with `sendBasicTransactionWithData`, carrying the tag
   in the transaction data. That binds the payment to this charge on chain.
4. **Ring.** A watcher matches recipient, exact amount, tag, and a block height
   at or after creation. Only then does the phone chime and speak the amount, in
   the host language Nimiq Pay exposes as `window.nimiqPay.language`.
5. **Verify.** `/r/<txid>` fetches the transaction again on every open. The
   confirmation count rises each time you reload it. A screenshot cannot do that.

### What is honest about the verification

The Mini App provider surface is `listAccounts`, `sign`, `isConsensusEstablished`,
`getBlockNumber`, and the send methods. There is no watch, no transaction lookup,
and no inclusion proof. So this app does not claim to be a light client.
`isConsensusEstablished()` is used as a **gate**, never announce while the host
wallet is out of sync, and the match itself is read from a public Nimiq RPC node.
The anti-fraud property comes from the receipt re-deriving state from the chain
on every open, not from where the query runs.

### Why it never rings by accident

A charge rings only for its own tag, its exact amount, its recipient, and only
for blocks at or after the moment it was created. A dust transfer, a repeat of an
older payment, or an untagged transfer cannot trigger it. `pnpm test` asserts each
of those cases.

## The day's takings

Every ring is written to the phone's own storage: amount, memo, time and the
transaction hash. The compose screen shows a running total for today, expands
into the list, speaks the total aloud on demand, and repeats any past charge in
one tap. Nothing leaves the device and there is still no database.

## Hand off from another app

Any site, QR or Mini App can open LunaBell with a charge already filled in:

```
https://your-app.vercel.app/app?amount=12.5&unit=usd&memo=Table%204&to=NQ...
```

| Parameter | Meaning |
| --- | --- |
| `amount` | Digits, decimal point allowed |
| `unit` | `nim` (default) or `usd` `eur` `gbp` `brl` `inr` |
| `memo` | Shown to the payer, 60 characters |
| `to` | Receiving address; ignored inside Nimiq Pay, which uses the wallet |

The payee still presses Listen, so a link can never start a charge silently.

## Install it

The app ships a manifest and a network-first service worker, so it installs to a
home screen and opens fullscreen on `/app`, which is what a counter phone wants.
The service worker never caches `/api/`, so chain reads are always live.

## Languages

The interface and the spoken amount both follow `window.nimiqPay.language`:
English, German, Spanish, French and Portuguese, falling back to English.

## Light and dark

One theme choice covers the landing page and the Mini App: light, dark, or follow
the system. It is stored per browser and applied before first paint, so there is
no flash. Light is the Nimiq Pay palette so the Mini App sits inside the host
without a seam; dark is the LunaBell night. Every screen is screenshotted in both
by `pnpm shots`.

## Looks like Nimiq Pay

Light gray canvas, white cards, Nimiq gold (`#E9B213`) and blue (`#1F2348`), Muli/Mulish
and Fira Mono, pill buttons, IBAN-grouped addresses, and official Nimiq Identicons on
every address. The listen screen is a till: amount pad, live luna count, consensus
pill, block height, and a QR with the Nimiq hexagon at its centre. The receipt is
the Hub-style from/to identicon pair, with a confirmation count that keeps rising.

## The mark

A bell carrying a crescent: the bell that rings only when the lunas are real.
One NIM is 100,000 luna, so the subunit is the thing the bell is listening for.
It is drawn as geometry in `components/Logo.tsx`, inherits `currentColor`, and
holds its silhouette down to 16px.

## Run it

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 for the landing page; the Mini App itself is at /app. Outside Nimiq Pay the app runs in web preview and
asks for the receiving address by hand, so the whole flow is testable in a normal
browser. Inside Nimiq Pay the address fills in from the wallet.

```bash
pnpm test    # charge, tag, and matcher rules, run on Node's native type stripping
pnpm shots   # every screen in light and dark, needs a local server
```

See [TESTING.md](TESTING.md) for a full walkthrough of every feature, including
what can be checked without a wallet and what cannot.

## Deploy

Vercel, zero configuration. No database and no environment variables are
required.

```bash
npx vercel --prod
```

| Variable | Default | Purpose |
| --- | --- | --- |
| `NIMIQ_RPC_URL` | `https://rpc.nimiqwatch.com` | Nimiq mainnet RPC used by the watcher and receipts |

Point a Mini App at the deployed origin with either share form:

```
nimiqpay://miniapp?url=your-app.vercel.app
https://nimpay.app/miniapps/open/your-app.vercel.app
```

## Layout

```
app/
  page.tsx            landing page, forwards to /app inside Nimiq Pay
  app/page.tsx        compose a charge, then listen
  pay/page.tsx        the payer view a shared link opens
  r/[txid]/page.tsx   the receipt, re-read from chain on every open
  api/watch           matches a charge against recent transactions
  api/tx/[hash]       a single transaction, for receipts
  api/price           NIM to fiat, for the spoken amount
lib/
  charge.ts           the charge object, its tag, and URL encoding
  nimiq-rpc.ts        RPC client and the matching rules
  speech.ts           the chime and the spoken announcement
```

## License

MIT. See [LICENSE](LICENSE).
