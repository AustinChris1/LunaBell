import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE || 'http://localhost:3000'
const OUT = process.env.OUT || 'shots'
const ADDR = 'NQ07' + '0'.repeat(32)
const REAL_TX = 'fbd90226a2c146bf63560a5fb57190afbdff43b26c251572105fc9ece1a3d87f'

mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome' })

for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  // seed the stored choice so the boot script paints the right theme on first frame
  await ctx.addInitScript((t) => localStorage.setItem('lb.theme', t), theme)
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  const tag = (n) => `${OUT}/${theme}-${n}.png`

  await page.goto(`${BASE}/app`, { waitUntil: 'networkidle' })
  await page.waitForSelector('input[placeholder="Two coffees"]', { timeout: 15000 })
  await page.waitForTimeout(800)
  await page.screenshot({ path: tag('1-compose') })

  await page.fill('input[placeholder="NQ.."]', ADDR)
  for (const d of ['2', '5', '0']) await page.click(`button:text-is("${d}")`)
  await page.fill('input[placeholder="Two coffees"]', 'Two coffees')
  await page.waitForTimeout(700)
  await page.screenshot({ path: tag('2-filled'), fullPage: true })

  await page.click('button:text-is("Listen")')
  await page.waitForTimeout(3000)
  await page.screenshot({ path: tag('3-live') })

  await page.goto(`${BASE}/r/${REAL_TX}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(900)
  await page.screenshot({ path: tag('4-receipt'), fullPage: true })

  await page.goto(`${BASE}/r/${'f'.repeat(64)}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  await page.screenshot({ path: tag('5-fake') })

  const wide = await ctx.newPage()
  await wide.setViewportSize({ width: 1280, height: 900 })
  await wide.goto(BASE, { waitUntil: 'networkidle' })
  await wide.waitForTimeout(2200)
  await wide.screenshot({ path: tag('6-landing') })
  await wide.evaluate(() => window.scrollTo(0, window.innerHeight * 2.9))
  await wide.waitForTimeout(1700)
  await wide.screenshot({ path: tag('7-proof') })

  console.log(`${theme}: captured, console errors: ${errors.length}${errors.length ? ' -> ' + errors[0] : ''}`)
  await ctx.close()
}

await browser.close()
console.log('screenshots written to', OUT)
