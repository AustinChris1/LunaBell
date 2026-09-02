import { chromium } from 'playwright-core'
import { readFileSync, writeFileSync } from 'node:fs'

// Rasterise the same inline SVG the app uses, so the icons never drift from the mark.
const svg = readFileSync('app/icon.svg', 'utf8')
const browser = await chromium.launch({ channel: 'chrome' })

for (const size of [192, 512]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } })
  await page.setContent(
    `<style>html,body{margin:0;padding:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
  )
  const buf = await page.screenshot({ omitBackground: false })
  writeFileSync(`public/icon-${size}.png`, buf)
  console.log('wrote public/icon-' + size + '.png')
  await page.close()
}

await browser.close()
