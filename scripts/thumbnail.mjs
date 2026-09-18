import { chromium } from 'playwright-core'
import { readFileSync, writeFileSync } from 'node:fs'

const svg = readFileSync('app/icon.svg', 'utf8')
const svg180 = svg.replace(/<svg /, '<svg style="width:180px;height:180px" ')
const svg240 = svg.replace(/<svg /, '<svg style="width:240px;height:240px" ').replace('rx="8"', 'rx="0"')

const og = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=Mulish:wght@400;700&display=swap" rel="stylesheet">
<style>
html,body{margin:0;width:1200px;height:630px;background:#070912;color:#eef1fb;font-family:Mulish,system-ui,sans-serif;overflow:hidden}
.wrap{position:relative;width:1200px;height:630px;display:flex;align-items:center;gap:56px;padding:0 88px;box-sizing:border-box}
.glow{position:absolute;left:520px;top:-260px;width:900px;height:900px;border-radius:50%;background:radial-gradient(closest-side,rgba(233,178,19,.22),transparent 70%)}
.mark{position:relative;flex:0 0 180px;filter:drop-shadow(0 20px 50px rgba(233,178,19,.35))}
.mark svg{border-radius:40px}
h1{position:relative;margin:0;font-family:Fraunces,Georgia,serif;font-weight:700;font-size:64px;line-height:1.04;letter-spacing:-.03em}
h1 b{color:#E9B213;font-weight:700}
p{position:relative;margin:22px 0 0;font-size:26px;line-height:1.35;color:rgba(238,241,251,.72);max-width:780px}
.pill{position:absolute;right:88px;bottom:56px;display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);border-radius:999px;padding:12px 20px;font-size:18px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(238,241,251,.75)}
.dot{width:10px;height:10px;border-radius:50%;background:#21BCA5;box-shadow:0 0 0 6px rgba(33,188,165,.18)}
.brand{position:absolute;left:88px;bottom:56px;font-family:Fraunces,Georgia,serif;font-size:30px;letter-spacing:-.02em}
.brand b{color:#E9B213}
</style></head><body><div class="wrap"><div class="glow"></div>
<div class="mark">${svg180}</div>
<div><h1>The bell that only rings<br>when the lunas are <b>real</b></h1>
<p>Someone says they paid. Their screen says sent. LunaBell rings only when the money is actually on-chain.</p></div>
<div class="brand">Luna<b>Bell</b></div>
<div class="pill"><span class="dot"></span>Nimiq Pay Mini App</div>
</div></body></html>`

const thumb = `<!doctype html><html><head><meta charset="utf-8">
<style>
html,body{margin:0;width:240px;height:240px;background:#E9B213;overflow:hidden}
svg{display:block;width:240px;height:240px}
</style></head><body>${svg240}</body></html>`

const browser = await chromium.launch({ channel: 'chrome' })

const ogPage = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await ogPage.setContent(og, { waitUntil: 'networkidle' })
await ogPage.waitForTimeout(800)
writeFileSync('submission/og.png', await ogPage.screenshot({ type: 'png' }))
await ogPage.close()

const tPage = await browser.newPage({ viewport: { width: 240, height: 240 }, deviceScaleFactor: 1 })
await tPage.setContent(thumb, { waitUntil: 'networkidle' })
await tPage.waitForTimeout(200)
writeFileSync('submission/thumbnail.png', await tPage.screenshot({ type: 'png' }))
await tPage.close()

await browser.close()
console.log('wrote submission/thumbnail.png 240x240 and submission/og.png 1200x630')
