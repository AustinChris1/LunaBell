# Competition portal, paste sheet

Submit at https://miniappscompetition.com/submit while signed in to GitHub as
**AustinChris1**. The portal commits `cycle2/AustinChris1/` to
`nimiq/miniappscompetition-submissions` and opens the PR itself. Do not hand
write the folder. The validator rejects folders without the portal's README.

Limits come from the repo's own validator (`scripts/lib/schema.mjs`). Its CI
also runs four live checks that block a merge: repo is anonymously cloneable,
GitHub reports the licence as exactly MIT, the demo URL returns 200, and the
video URL resolves as a public video through the platform's oEmbed API.
LunaBell already passes the first three. **The video is the only open blocker.**

Paste every field below as written. Do not improvise in the box.

---

## About your app

**App name**

```
LunaBell
```

**Category**

```
Food & dining
```

Why this and not Productivity: Cycle I already had invoice and request tools in
the productivity pile. LunaBell's screenshots, memos ("Two coffees"), and the
soundbox story are a counter at a stall or cafe. Food & dining is the empty
shelf. Productivity is the crowded one. If the portal ever rejects that label,
fall back to `On-chain services`, never back to Productivity.

**Tagline** (120 char cap, this is 49)

```
The bell that only rings when the lunas are real.
```

**Short description** (280 char cap, this is 230)

```
Someone says they paid. Their screen says sent. You still don't know if it arrived. LunaBell is a Nimiq payment soundbox: show the QR, put the phone down. The bell rings only when the money is on-chain, then a receipt re-reads it.
```

**Pricing**

```
Free
```

---

## Links & demo

**Repo URL**

```
https://github.com/AustinChris1/LunaBell
```

**Demo URL**

```
https://lunabell.vercel.app
```

**Video walkthrough** (required, blocking)

Record first. Public YouTube, Loom, or Vimeo. Unlisted is fine. Private is not.
See [demo.md](demo.md) for the shot list. Paste the watch URL here, not the
studio URL.

```
(paste after upload)
```

---

## Media

Re-attach every file. The portal does not keep previous uploads.

| File | Rule | Ours |
| --- | --- | --- |
| `icon.png` | PNG/JPG/WebP, 512x512 | app icon, gold bell + crescent |
| `thumbnail.png` | PNG/JPG/WebP/GIF, **240x240** | same mark, sized for the form |
| `screenshot-1.png` | first image = social preview | till, 250 NIM, Two coffees |
| `screenshot-2.png` | phone | listening, QR on screen |
| `screenshot-3.png` | phone | receipt, confirmations climbing |
| `screenshot-4.png` | phone | today's takings, cafe memos |
| `screenshot-5.png` | optional 5th | landing, the pitch |

Upload **all five** screenshots, in that order. First image is the social card,
so do not put the landing first.

`og.png` in this folder is the 1200x630 card for GitHub / X. The portal thumbnail
field is 240x240. Do not upload `og.png` into the thumbnail slot.

Total must stay under 14 MB. It does.

---

## About you

**GitHub username** (pre-filled by sign-in)

```
AustinChris1
```

**E-mail address**

```
(your real inbox, they will mail this)
```

**Team name**

leave empty

**Team members**

leave empty

**X account** (no @)

```
(your handle without @, or leave empty)
```

**Builder story** (4000 char cap)

```
Someone says they paid. Their screen says sent. You still don't know if the money arrived.

That is the oldest in-person crypto trick there is, and it is not a crypto-only trick. A customer flashes a "payment successful" screen, walks off with the goods, and nothing ever hits the till. India answered it with hardware. Paytm and PhonePe have deployed over nine million soundboxes whose only job is to announce a verified payment out loud, so the seller never has to look at a screen or trust a customer's phone. Merchants quoted by Rest of World in April 2023 named fake or doctored receipts as the reason they bought one.

LunaBell is that device as free software, inside Nimiq Pay.

I wanted a Mini App that uses Nimiq the way a merchant would actually use a wallet: name an amount, show a QR, put the phone down, and trust a sound more than a screenshot. Not another invoice form. Not another split. A phone that rings only when the lunas are real.

A charge is one object: amount, memo, nonce, and the block height it was made at. It lives entirely in its own link. There is no LunaBell account, no LunaBell wallet, and no LunaBell database. The payer sends with sendBasicTransactionWithData carrying an LB: tag. LunaBell matches the recipient, the exact luna amount, the tag, and the block window, and rings only then. A dust transfer, an untagged payment, or a replay of an older transaction stays silent. The tests in the repo assert each of those cases. isConsensusEstablished gates the announcement so nothing is spoken while the wallet is out of sync.

The receipt is a link, not a picture. Every time anyone opens it, it fetches the transaction again, so its confirmation count is higher than last time. That is the whole argument against a screenshot, made visible.

I am honest about the limit. The Mini App interface does not currently expose transaction watching or lookup, so LunaBell reads the public Nimiq chain through RPC and does not claim to be a light client. The claim is simpler: when the bell rings, the payment matched on-chain.

It is not only for a counter. A freelancer, a roommate, a group organiser, anyone who has ever been told "I sent it" gets the same two things: a sound they can trust, and a receipt they can forward.

Everything else is in service of that loop: a day's takings with a spoken total, one tap repeat, five languages that follow the wallet's own setting, light and dark, installable to a home screen, and a handoff URL any other Mini App can call to open a prefilled charge.

NIM native. MIT. Built to be trusted with your hands full.
```

---

## Promotion & discovery

**2 pts – Skool post** (after you post in Mini Apps Skool)

```
(paste https://www.skool.com/… )
```

**3 pts – Social post** (after you post on X)

```
(paste https://x.com/you/status/… )
```

Paste text for both posts is in [SUBMISSION.md](SUBMISSION.md).

**How did you hear about the competition?**

```
Nimiq Community
```

---

## Order of operations

1. Record the video first ([demo.md](demo.md)). Upload it. Paste the URL.
2. Post in Skool and on X. Copy both URLs.
3. Fill the portal from this sheet. Upload `icon.png`, `thumbnail.png`, and
   `screenshot-1` through `screenshot-5`.
4. Watch the PR the bot opens. The validator comments within minutes.
5. Once merged, LunaBell appears in the Nimiq Pay competition list automatically
   via the published feed. The permanent directory listing is a separate PR to
   `nimiq/awesome`, prepared in `submission/awesome/`. Until that merges, the
   `nimpay.app/miniapps/open` link for our host returns 404. Do not paste it
   anywhere.
