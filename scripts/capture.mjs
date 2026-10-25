import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const BASE = 'http://127.0.0.1:4173/'
const OUT = path.resolve('shots')
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ executablePath: EDGE, headless: true })
const errors = []

async function open(route, viewport = { width: 1440, height: 1000 }) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`[console] ${message.text()}`)
  })
  page.on('pageerror', (error) => errors.push(`[pageerror] ${error.message}`))
  page.on('requestfailed', (request) => errors.push(`[requestfailed] ${request.url()} ${request.failure()?.errorText}`))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(`${BASE}#${route}`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(900)
  return page
}

async function scrollAll(page) {
  await page.evaluate(async () => {
    const step = Math.max(500, window.innerHeight * 0.75)
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 55))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(450)
}

async function shot(page, name, options = {}) {
  await page.screenshot({ path: path.join(OUT, name), ...options })
  console.log(`saved ${name}`)
}

let page = await open('/')
await shot(page, '01-home-hero.png')
await page.locator('.featured').scrollIntoViewIfNeeded()
await page.waitForTimeout(400)
await shot(page, '02-home-featured.png')
await page.locator('.collections').scrollIntoViewIfNeeded()
await page.waitForTimeout(400)
await shot(page, '03-home-collections.png')
await scrollAll(page)
await shot(page, '04-home-full.png', { fullPage: true })
await page.close()

page = await open('/shelf')
await shot(page, '05-shelf-hero.png')
await page.locator('.shelf-grid').scrollIntoViewIfNeeded()
await page.waitForTimeout(500)
await shot(page, '06-shelf-grid.png')
await page.getByRole('button', { name: '列表视图' }).click()
await page.waitForTimeout(500)
await shot(page, '07-shelf-list.png')
await page.close()

page = await open('/books/siddhartha')
await shot(page, '08-detail-top.png')
await page.getByRole('tab', { name: /读者短评/ }).click()
await page.waitForTimeout(1200)
await page.locator('.reviews').scrollIntoViewIfNeeded()
await page.waitForTimeout(400)
await shot(page, '09-detail-reviews.png')
await page.getByRole('tab', { name: /内容简介/ }).click()
await page.waitForTimeout(300)
await scrollAll(page)
await shot(page, '10-detail-full.png', { fullPage: true })
await page.close()

page = await open('/about')
await shot(page, '11-about-hero.png')
await page.locator('#story').scrollIntoViewIfNeeded()
await page.waitForTimeout(400)
await shot(page, '12-about-story.png')
await page.locator('#contact').scrollIntoViewIfNeeded()
await page.waitForTimeout(400)
await shot(page, '13-about-contact.png')
await scrollAll(page)
await shot(page, '14-about-full.png', { fullPage: true })
await page.close()

page = await open('/', { width: 390, height: 844 })
await shot(page, '15-mobile-home.png')
await page.locator('.featured').scrollIntoViewIfNeeded()
await page.waitForTimeout(300)
await shot(page, '16-mobile-featured.png')
await page.close()

page = await open('/shelf', { width: 390, height: 844 })
await page.locator('.shelf-toolbar').scrollIntoViewIfNeeded()
await page.waitForTimeout(400)
await shot(page, '17-mobile-shelf.png')
await page.close()

page = await open('/books/camellia', { width: 390, height: 844 })
await shot(page, '18-mobile-detail.png')
await page.close()

page = await open('/', { width: 390, height: 844 })
await page.getByRole('button', { name: '打开菜单' }).click()
await page.waitForTimeout(500)
await shot(page, '19-mobile-menu.png')
await page.close()

page = await open('/')
await page.locator('.book-card__toggle').nth(0).click()
await page.locator('.book-card__toggle').nth(1).click()
await page.waitForTimeout(3600)
await page.getByRole('button', { name: /打开我的书架/ }).first().click()
await page.waitForTimeout(600)
await shot(page, '20-drawer.png')
await page.close()

page = await open('/')
await page.getByRole('button', { name: '切换到夜读模式' }).click()
await page.waitForTimeout(600)
await shot(page, '21-home-night.png')
await page.close()

await browser.close()

if (errors.length) {
  console.log('\nBROWSER ISSUES:')
  console.log([...new Set(errors)].join('\n'))
  process.exitCode = 1
} else {
  console.log('\nNo browser console or page errors.')
}
