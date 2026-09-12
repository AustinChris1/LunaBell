import { chargeData, decodeCharge, encodeCharge, hexToUtf8, utf8ToHex, type Charge } from '../lib/charge.ts'
import { matchCharge, readTag, type NimiqTx } from '../lib/nimiq-rpc.ts'

const ok = (label: string, pass: boolean) => {
  console.log((pass ? 'PASS  ' : 'FAIL  ') + label)
  if (!pass) process.exitCode = 1
}

const charge: Charge = {
  r: 'NQ07 0000 0000 0000 0000 0000 0000 0000 0000',
  v: 250000,
  m: 'Two coffees',
  n: 'a1b2c3d4e5f6',
  t: Date.now(),
  b: 60443000,
}

const tag = await chargeData(charge)
ok('charge tag has LB prefix and 8 hex chars: ' + tag, /^LB:[0-9a-f]{8}$/.test(tag))

const again = await chargeData(charge)
ok('tag is deterministic', tag === again)

const other = await chargeData({ ...charge, n: 'ffffffffffff' })
ok('different nonce yields different tag', tag !== other)

const roundTrip = decodeCharge(encodeCharge(charge))
ok('charge survives url round trip', roundTrip?.r === charge.r && roundTrip?.v === charge.v)

ok('tampered token is rejected', decodeCharge('not-a-real-token') === null)

ok('hex decodes utf8', hexToUtf8('596f75206d696e6564204e494d') === 'You mined NIM')

const base: NimiqTx = {
  hash: 'a'.repeat(64),
  blockNumber: 60443500,
  timestamp: Date.now(),
  confirmations: 3,
  from: 'NQ81 C01N BASE 0000 0000 0000 0000 0000 0000',
  to: charge.r,
  value: charge.v,
  fee: 0,
  senderData: '',
  recipientData: utf8ToHex(tag),
  executionResult: true,
}

ok('readTag decodes hex tag from a transaction', readTag(base) === tag)

const criteria = { recipient: charge.r, value: charge.v, tag, minBlock: charge.b }
ok('exact charge matches', matchCharge([base], criteria)?.hash === base.hash)
ok('wrong amount does not match', matchCharge([{ ...base, value: charge.v + 1 }], criteria) === null)
ok('wrong tag does not match', matchCharge([{ ...base, recipientData: utf8ToHex('LB:00000000') }], criteria) === null)
ok('untagged transfer does not match', matchCharge([{ ...base, recipientData: '' }], criteria) === null)
ok('wrong recipient does not match', matchCharge([{ ...base, to: 'NQ81 C01N BASE 0000 0000 0000 0000 0000 0000' }], criteria) === null)
ok('older block does not match (replay guard)', matchCharge([{ ...base, blockNumber: charge.b - 1 }], criteria) === null)
ok('failed execution does not match', matchCharge([{ ...base, executionResult: false }], criteria) === null)
ok('plain-text tag also accepted', readTag({ ...base, recipientData: tag }) === tag)

console.log('\nspec: a charge rings only for its own tag, exact amount, correct recipient, after creation.')

// deeplinks must match the official nimpay.app builders so launches behave identically
const { buildAndroidIntentUrl, buildIosCustomSchemeUrl, buildOpenPath } = await import('../lib/deeplink.ts')
const target = 'https://lunabell.vercel.app/pay?c=abc;def#frag'
ok('open path keeps host, path and query', buildOpenPath('https://lunabell.vercel.app/pay?c=abc') === '/miniapps/open/lunabell.vercel.app/pay?c=abc')
ok('open path drops a bare trailing slash', buildOpenPath('https://lunabell.vercel.app/') === '/miniapps/open/lunabell.vercel.app')
const android = buildAndroidIntentUrl(target)
ok('android intent targets the nimpay.app App Link host', android.startsWith('intent://nimpay.app/miniapps/open/lunabell.vercel.app/pay?c=abc'))
ok('android intent escapes ; and # inside the path', android.includes('%3Bdef') && !android.split('#Intent')[0].includes('#frag'))
ok('android intent names the Pay package and a store fallback', android.includes('package=com.nimiq.pay') && android.includes('S.browser_fallback_url=https%3A%2F%2Fplay.google.com'))
ok('ios scheme carries the full encoded url', buildIosCustomSchemeUrl('https://lunabell.vercel.app/pay?c=abc') === 'nimiqpay://miniapp?url=https%3A%2F%2Flunabell.vercel.app%2Fpay%3Fc%3Dabc')
