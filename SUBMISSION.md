# Submission text

Max 250 words per the rules. Paste the block below into the submission form.

---

LunaBell is the bell that only rings when the lunas are real.

It is a payment terminal you listen to instead of watch. Name an amount, show the QR or share the link, and put the phone down. When the payment settles on Nimiq, your phone chimes and speaks the amount in your Nimiq Pay language. Then you get a receipt that is a link, not a picture: every time anyone opens it, it re-reads the chain, so its confirmation count keeps climbing. A screenshot cannot do that.

The problem is the fake payment screenshot. India answered it with hardware: Paytm and PhonePe have deployed over nine million soundboxes whose only job is to announce verified payments aloud. LunaBell is that device as software, inside a wallet already available in 190+ countries, for a stall, a cafe, a freelancer, or a roommate who says "I sent it."

How it works: a charge (amount, memo, nonce, block height) lives entirely in its own link. The payer sends with sendBasicTransactionWithData carrying an LB: tag in the extra data. LunaBell matches recipient, exact luna amount, tag and block window, and rings only then. isConsensusEstablished gates the announcement. No database, no account, nothing custodial.

Also: a day's takings with a spoken total, one tap repeat, five languages, light and dark, installable, and a handoff URL any other Mini App can call.

MIT. NIM native. Built to be trusted with your hands full.

---

## Links to paste alongside

- Repo: https://github.com/AustinChris1/LunaBell
- Live: https://lunabell.vercel.app
- Open in Nimiq Pay: open https://lunabell.vercel.app on a phone and tap Open in Nimiq Pay (the nimpay.app/miniapps/open link 404s until the directory PR merges)
- Demo video: (link once recorded)

## Real users in 48 hours (15 scoring points)

Real usage is scored. It is not a submit-blocker. Unique Nimiq wallets that
open LunaBell inside Nimiq Pay and tap a wallet action count. The new
**Ring 1 NIM on this phone** button is the 60-second path: one wallet, one
tagged mainnet payment, the bell rings. No second phone.

Do these in order, today:

1. Open https://lunabell.vercel.app on your phone, tap **Open in Nimiq Pay**,
   then **Ring 1 NIM on this phone**. Confirm the native sheet. Film that.
2. Post in Skool, Promote Your Work, with the paste below. Ask every builder
   to do the same 1 NIM self-ring. That is how you get distinct wallets.
3. Post the same on X, tag @miniappscomp @nimiq.
4. If Sip & Ship is still on the calendar, demo the shout live.

### Skool / X paste

```
LunaBell is live for Cycle II.

It is a payment terminal you listen to. Name an amount, put the phone down.
When the NIM actually settles, the phone chimes and speaks it. The receipt
is a link that re-reads the chain, so a screenshot cannot fake it.

Takes 60 seconds inside Nimiq Pay:
1. Open https://lunabell.vercel.app on your phone
2. Tap Open in Nimiq Pay
3. Tap Ring 1 NIM on this phone
4. Confirm. The bell rings on a real tagged payment to yourself.

Repo: https://github.com/AustinChris1/LunaBell
Need 1 NIM of dust. Tell me if it rang.
```

## Demo video shot list (about 40 seconds)

1. 0 to 5s: phone on a counter showing a 5 NIM charge and its QR, LunaBell listening.
2. 5 to 15s: second phone opens Nimiq Pay, scans, taps Pay. Show the confirm sheet.
3. 15 to 22s: first phone chimes and speaks the amount. Do not cut before the voice finishes.
4. 22 to 32s: tap Receipt. Reload it once on camera so the confirmation count visibly rises.
5. 32 to 40s: back on the till, the Today tally shows the sale. Tap Say the total.

Film the sound first. The stall is garnish.
