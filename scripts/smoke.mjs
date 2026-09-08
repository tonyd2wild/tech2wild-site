#!/usr/bin/env node
// Visual smoke test: builds nothing itself. Run `npm run build` first, then `node scripts/smoke.mjs`.
// Starts `vite preview`, screenshots key sections at desktop + mobile, fails on page errors.
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, '.sweep', 'shots')
fs.mkdirSync(OUT, { recursive: true })
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const PORT = 4173
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let puppeteer
try { puppeteer = (await import('puppeteer-core')).default } catch {
  console.error('puppeteer-core is not installed. Run: npm i -D puppeteer-core'); process.exit(2)
}

const viteBin = path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js')
const preview = spawn(process.execPath, [viteBin, 'preview', '--port', String(PORT), '--strictPort'], { cwd: ROOT, stdio: 'ignore' })
await sleep(4000)
const errors = []
try {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
  for (const [w, h, tag, mobile] of [[1440, 900, 'desktop', false], [390, 844, 'mobile', true]]) {
    const page = await browser.newPage()
    await page.setViewport({ width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile })
    page.on('pageerror', (e) => errors.push(`[${tag}] ${e.message}`))
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${tag}] console: ${m.text()}`) })
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle2', timeout: 60000 })
    await sleep(4500)
    await page.screenshot({ path: path.join(OUT, `${tag}-hero.png`) })
    for (const sel of ['#lab', '#models', '#benchmarks', '#videos', '#feed', '#github', '#join']) {
      await page.evaluate((s) => window.scrollTo(0, document.querySelector(s).getBoundingClientRect().top + window.scrollY + 300), sel)
      await sleep(1800)
      await page.screenshot({ path: path.join(OUT, `${tag}-${sel.slice(1)}.png`) })
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    if (overflow > 0) errors.push(`[${tag}] horizontal overflow ${overflow}px`)
    await page.close()
  }
  await browser.close()
} finally {
  preview.kill()
}
console.log(`screenshots in ${OUT}`)
if (errors.length) { console.error('SMOKE FAILED:\n' + errors.join('\n')); process.exit(1) }
console.log('smoke ok')
