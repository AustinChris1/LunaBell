# Testing LunaBell

Everything below runs against Nimiq mainnet. Nothing is mocked.

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Automated

```bash
pnpm test    # 15 assertions on the charge, tag and matcher rules
pnpm shots   # every screen in light and dark, plus a console error count
```

`pnpm shots` needs a server running (`pnpm dev` or `pnpm build && pnpm start`);
point it with `BASE=http://localhost:3000`. Images land in `shots/`.

## What each test asserts

`pnpm test` is the safety net for the one rule that matters: **the bell must not
ring for anything except your charge.** It asserts the tag is deterministic and
unique per nonce, the charge survives a URL round trip, a tampered token is
rejected, and that a match fails on a wrong amount, a wrong tag, a wrong
recipient, an untagged transfer, a block older than the charge, and a failed
execution.

## Manual walkthrough, no wallet needed

Nothing here needs NIM. The app runs in any browser in web preview.

| # | Do this | Expect |
| --- | --- | --- |
| 1 | Open `/` | Landing. Live Nimiq block height in the header, ticking every 6s |
| 2 | Click **Hear the bell** | Two struck bell tones, then a spoken "Received $12.50" |
| 3 | Scroll | Counters count up, the gold rail fills, cards slide in |
| 4 | Read the two receipt cards | Left is frozen at 14,864. Right climbs every 5s, read live from mainnet |
| 5 | Toggle the theme (header) | Light, dark, system. Whole page recolours, both pages agree |
| 6 | Reload | Theme persists. No white flash before paint |
| 7 | Click **Open LunaBell** | `/app`, the Mini App |
| 8 | Type an amount on the pad | Big figure, luna count, live fiat conversion |
| 9 | Switch the unit chips to USD | You now type dollars; NIM equivalent shown below |
| 10 | Paste any NQ address into **Pay to** | Groups itself IBAN style, identicon appears |
| 11 | Press **Listen** | QR with the Nimiq hexagon, "Listening, block N" |
| 12 | Press **Share** | Native share sheet, or the link is copied |
| 13 | Open that link in another tab | Payer view: amount fixed, "Open in Nimiq Pay" |
| 14 | Edit the `?c=` token in the URL | "This request is not readable" |
| 15 | Open `/r/fbd90226a2c146bf63560a5fb57190afbdff43b26c251572105fc9ece1a3d87f` | A real receipt. Watch confirmations climb |
| 16 | Reload it | Higher confirmation count than a moment ago |
| 17 | Open `/r/` + 64 letter f's | "No such payment" |
| 18 | Open `/mark-test` | The logo on both grounds at 64, 32, 24 and 16px |
| 19 | Press **Test the bell** | Chime then a spoken sample amount, before any real money |
| 20 | Open `/app?amount=7.5&memo=Table%204&to=NQ...` | Amount and memo already filled in |
| 21 | After a ring, look under the pad | **Today** with a running total and a count |
| 22 | Expand it, press **Say the total** | Speaks what you took today |
| 23 | Press the repeat arrow on a row | Same amount and memo loaded, ready to listen again |
| 24 | Install to home screen | Opens fullscreen on `/app` |

Step 16 is the whole product argument: a screenshot of step 15 cannot do what
step 16 does.

## Testing the bell without spending anything

The ring path is the one thing a browser cannot fake for you, but you can prove
the matcher fires without a wallet:

1. Start a charge for a round amount to an address you control.
2. Copy the tag the app generated (`LB:` plus 8 hex characters); it is in the
   share link's charge token and in the transaction data the payer sends.
3. Send that exact luna amount to that address with that string as the
   transaction message, from any Nimiq wallet.
4. The bell rings within about one block, and the screen shows the transaction.

Sending a different amount, or the right amount with no message, is the useful
negative test: nothing should happen.

## Inside Nimiq Pay

The parts that only exist in the host app:

- The receiving address fills in from the wallet, so the **Pay to** field disappears.
- The status pill reads **Synced** or **Syncing** from `isConsensusEstablished()`.
- Announcements are held back while consensus is not established.
- The payer view shows a real **Pay** button that calls `sendBasicTransactionWithData`.
- Spoken amounts follow the wallet's language via `window.nimiqPay.language`.

Open a deployed build with either share form:

```
nimiqpay://miniapp?url=your-app.vercel.app
https://nimpay.app/miniapps/open/your-app.vercel.app
```

Opening `/` inside Nimiq Pay forwards to `/app` automatically.

## Things worth breaking on purpose

| Try | Expect |
| --- | --- |
| Kill your network mid listen | "Chain lookup" message, recovers on its own |
| Set the system to dark, theme to System | Follows the OS, and follows a live OS change |
| Open the app on a 320px wide screen | No horizontal scroll, the pad stays reachable |
| Leave the listen screen open | Screen stays awake where the Wake Lock API exists |
| Load with sound muted | Vibration still fires, the paid banner still shows |

## Known gaps

- **No real payment has been put through it yet.** The matcher is proven against
  real mainnet transaction shapes and synthetic tagged ones, but the full loop
  needs one real tagged transfer.
- **NIM only.** USDT is not implemented. Rules allow NIM alone and it carries the
  bonus, but it is a deliberate cut, not a finished feature.
- Speech depends on the browser's voices. Some Android builds have no voice for a
  given locale; the chime and the visual confirmation still fire.
