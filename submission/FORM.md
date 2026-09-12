# Competition portal, paste sheet

Submit at https://miniappscompetition.com/submit while signed in to GitHub as
AustinChris1. The portal commits `cycle2/AustinChris1/` to
`nimiq/miniappscompetition-submissions` and opens the PR itself; do not hand
write the folder, the validator rejects folders without the portal's README.

Limits come from the repo's own validator (`scripts/lib/schema.mjs`). Its CI
also runs four live checks that block a merge: repo is anonymously cloneable,
GitHub reports the licence as exactly MIT, the demo URL returns 200, and the
video URL resolves as a public video through the platform's oEmbed API.
LunaBell already passes the first three; the video is the only open item.

| Field | Limit | Value |
| --- | --- | --- |
| App name | 80 chars | `LunaBell` |
| Category | one of the list | `Productivity` |
| Tagline | 120 chars | `The bell that only rings when the lunas are real.` |
| Description | 280 chars | see below |
| Pricing | Free / Freemium / Paid | `Free` |
| Repo URL | required, https | `https://github.com/AustinChris1/LunaBell` |
| Demo URL | required, https | `https://lunabell.vercel.app` |
| Video URL | **required, blocking** public YouTube / Loom / Vimeo link | record first, see SUBMISSION.md shot list |
| Contact email | valid email | your choice |
| Team name | 80 chars, optional | leave empty |
| Team members | up to 5, optional | leave empty |
| X account | 80 chars, optional | your handle, no @ |
| Builder story | 4000 chars, optional | see below |
| Skool post URL | https | paste after posting |
| Social post URL | https | paste after posting |
| Heard about | free text | e.g. `X` |

## Description (280 char cap)

```
A payment terminal you listen to. Name an amount, show the QR, put the phone down. LunaBell watches Nimiq and speaks the payment aloud the moment it settles, then gives you a receipt that re-reads the chain on every open. No screenshot can fake it.
```

## Builder story (4000 char cap)

```
The fake payment screenshot is one of the oldest tricks against anyone who sells in person: a customer shows a "sent" screen, walks away, and nothing ever arrives. India answered it with hardware. Paytm and PhonePe have deployed over nine million soundboxes whose only job is to announce a verified payment out loud so the seller never has to look at a screen or trust a customer's phone.

LunaBell is that device as software, inside Nimiq Pay.

A charge is one object: amount, memo, nonce and the block height it was made at. It lives entirely in its own link, so there is no database, no account and nothing custodial. The payer sends with sendBasicTransactionWithData carrying an LB: tag in the extra data. LunaBell matches the recipient, the exact luna amount, the tag and the block window, and rings only then. A dust transfer, an untagged payment or a replay of an older transaction stays silent, and the tests in the repo assert each of those cases. isConsensusEstablished gates the announcement so nothing is spoken while the wallet is out of sync.

The receipt is a link, not a picture. Every time anyone opens it, it fetches the transaction again, so its confirmation count is higher than the last time. That is the whole argument against a screenshot, made visible.

It is not only for a counter. A freelancer, a roommate, a group organiser, anyone who has ever been told "I sent it" gets the same two things: a sound they can trust and a receipt they can forward.

Everything else is in service of that loop: a day's takings with a spoken total, one tap repeat, five languages that follow the wallet's own setting, light and dark, installable to a home screen, and a handoff URL any other Mini App can call to open a prefilled charge.

NIM native, MIT, and built to be trusted with your hands full.
```

## Images (in this folder)

| File | Rule | Ours |
| --- | --- | --- |
| icon.png | png/jpg/webp, under 2 MB | 512x512 |
| thumbnail.png | png/jpg/webp/gif, under 2 MB, 1200x630 | 1200x630 |
| screenshot-1..4.png | 3 to 5 files, png/jpg/webp, under 2 MB each | 780x1688 phone captures from production |

Total must stay under 14 MB. It does.

## Order of operations

1. Record the video first (SUBMISSION.md has the 40 second shot list). Upload it.
2. Post in Skool and on X, copy both URLs.
3. Fill the portal from this sheet. Upload the six images from this folder.
4. Watch the PR the bot opens; the validator comments within minutes.
5. Once merged, LunaBell appears in the Nimiq Pay competition list automatically
   via the published feed. The permanent directory listing is a separate PR to
   nimiq/awesome, prepared in `submission/awesome/`.
