import { chromium } from 'playwright-core'

const BASE = process.env.BASE || 'http://localhost:3000'
const ADDR = 'NQ07' + '0'.repeat(32)
const REAL_TX = 'fbd90226a2c146bf63560a5fb57190afbdff43b26c251572105fc9ece1a3d87f'
const today = Date.now() - 60 * 60 * 1000
const phone = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }

const takings = [
  { hash: 'a'.repeat(64), value: 2_500_000, memo: 'Two coffees', at: today, addr: ADDR },
  { hash: 'b'.repeat(64), value: 1_000_000, memo: 'Croissant', at: today - 30 * 60 * 1000, addr: ADDR },
]

const browser = await chromium.launch({ channel: 'chrome' })

const compose = await browser.newContext({ ...phone, viewport: { width: 390, height: 920 } })
await compose.addInitScript(() => localStorage.setItem('lb.theme', 'light'))
const page = await compose.newPage()
await page.goto(`${BASE}/app`, { waitUntil: 'networkidle' })
await page.waitForSelector('input[placeholder="Two coffees"]', { timeout: 20000 })
await page.fill('input[placeholder="NQ.."]', ADDR)
for (const d of ['2', '5', '0']) await page.click(`button:text-is("${d}")`)
await page.fill('input[placeholder="Two coffees"]', 'Two coffees')
await page.waitForTimeout(800)
await page.screenshot({ path: 'submission/screenshot-1.png', fullPage: true })

await page.click('button:text-is("Listen")')
await page.waitForTimeout(2800)
await page.getByLabel(/Theme:/).click()
await page.waitForTimeout(500)
await page.setViewportSize({ width: 390, height: 844 })
await page.screenshot({ path: 'submission/screenshot-2.png' })
await compose.close()

const receipt = await browser.newContext(phone)
await receipt.addInitScript(() => localStorage.setItem('lb.theme', 'light'))
const r = await receipt.newPage()
await r.goto(`${BASE}/r/${REAL_TX}`, { waitUntil: 'networkidle' })
await r.waitForTimeout(1000)
await r.screenshot({ path: 'submission/screenshot-3.png', fullPage: true })
await receipt.close()

const till = await browser.newContext(phone)
await till.addInitScript(() => localStorage.setItem('lb.theme', 'light'))
await till.addInitScript(
  ([key, rows]) => localStorage.setItem(key, JSON.stringify(rows)),
  ['lb.takings', takings],
)
const t = await till.newPage()
await t.goto(`${BASE}/app`, { waitUntil: 'networkidle' })
await t.waitForSelector('input[placeholder="Two coffees"]', { timeout: 20000 })
await t.fill('input[placeholder="NQ.."]', ADDR)
await t.click('button:text-is("25 NIM")')
await t.fill('input[placeholder="Two coffees"]', 'Two coffees')
await t.getByRole('button', { name: /today/i }).click()
await t.getByText('Croissant').scrollIntoViewIfNeeded()
await t.waitForTimeout(400)
await t.screenshot({ path: 'submission/screenshot-4.png' })
await till.close()

const wide = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
await wide.addInitScript(() => localStorage.setItem('lb.theme', 'dark'))
await wide.goto(BASE, { waitUntil: 'networkidle' })
await wide.waitForTimeout(2400)
await wide.screenshot({ path: 'submission/screenshot-5.png' })
await wide.close()

await browser.close()
console.log('wrote submission/screenshot-1..5.png')
