import { chromium } from 'playwright-core'

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const BASE = 'http://127.0.0.1:4173/#'
const browser = await chromium.launch({ executablePath: EDGE, headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
const issues = []
page.on('console', (message) => {
  if (message.type() === 'error') issues.push(`[console] ${message.text()}`)
})
page.on('pageerror', (error) => issues.push(`[pageerror] ${error.message}`))
page.on('requestfailed', (request) => issues.push(`[requestfailed] ${request.url()}`))

await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
console.log('title:', await page.title())
console.log('h1:', await page.locator('h1').first().innerText())
console.log('cards:', await page.locator('.book-card').count())

await page.locator('.book-card__toggle').first().click()
await page.waitForTimeout(300)
console.log('shelf badge:', await page.locator('.header-action--shelf .header-action__badge').innerText())
console.log('toast:', await page.locator('.toast').first().innerText())

await page.getByRole('button', { name: /打开我的书架/ }).first().click()
await page.waitForTimeout(500)
console.log('drawer visible:', await page.locator('.drawer').isVisible())
console.log('drawer items:', await page.locator('.drawer-item').count())
await page.locator('.drawer__close').click()
await page.waitForTimeout(300)

await page.locator('.desktop-nav__link', { hasText: '书架' }).click()
await page.waitForTimeout(600)
console.log('shelf url:', page.url())
console.log('shelf cards:', await page.locator('.book-card').count())

await page.locator('#book-search').fill('悉达多')
await page.waitForTimeout(600)
console.log('search cards:', await page.locator('.book-card').count())
console.log('search url:', page.url())
await page.locator('.search__clear').click()
await page.waitForTimeout(400)

await page.getByRole('button', { name: '生活', exact: true }).click()
await page.waitForTimeout(500)
console.log('life cards:', await page.locator('.book-card').count())
await page.locator('.results-head__clear').click()
await page.waitForTimeout(700)

await page.getByRole('button', { name: '列表视图' }).click()
await page.waitForTimeout(500)
console.log('list rows:', await page.locator('.list-item').count())

await page.goto(`${BASE}/books/camellia`, { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
console.log('detail title:', await page.locator('.detail-info__title').innerText())
await page.locator('.detail-info__actions .btn--ghost').click()
await page.waitForTimeout(300)
console.log('detail shelf badge:', await page.locator('.header-action--shelf .header-action__badge').innerText())
await page.locator('.progress__range').evaluate((el) => {
  el.value = '60'
  el.dispatchEvent(new Event('input', { bubbles: true }))
})
await page.waitForTimeout(300)
console.log('progress text:', await page.locator('.progress__value').innerText())

await page.goto(`${BASE}/about`, { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
await page.locator('.faq__question').nth(1).click()
await page.waitForTimeout(400)
console.log('faq open:', await page.locator('.faq__answer').nth(1).isVisible())

await page.locator('.contact__form input[type=text]').fill('测试同学')
await page.locator('.contact__form input[type=email]').fill('test@example.com')
await page.locator('.contact__form textarea').fill('这是一封用于验收的测试信。')
await page.getByRole('button', { name: /把信寄出/ }).click()
await page.waitForTimeout(1200)
console.log('contact success:', await page.locator('.contact__sent').isVisible())

await page.goto(`${BASE}/not-a-page`, { waitUntil: 'networkidle' })
await page.waitForTimeout(400)
console.log('404 title:', await page.locator('.not-found h1').innerText())

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } })
mobile.on('pageerror', (error) => issues.push(`[mobile pageerror] ${error.message}`))
await mobile.goto(`${BASE}/`, { waitUntil: 'networkidle' })
await mobile.waitForTimeout(400)
await mobile.getByRole('button', { name: '打开菜单' }).click()
await mobile.waitForTimeout(500)
console.log('mobile menu:', await mobile.locator('.mobile-menu').isVisible())
await mobile.screenshot({ path: 'shots/19-mobile-menu.png' })
await mobile.locator('.mobile-menu__link', { hasText: '书架' }).click()
await mobile.waitForTimeout(700)
console.log('mobile shelf url:', mobile.url())
await mobile.screenshot({ path: 'shots/22-mobile-menu-closed.png' })

const night = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
await night.goto(`${BASE}/`, { waitUntil: 'networkidle' })
await night.waitForTimeout(500)
await night.getByRole('button', { name: '切换到夜读模式' }).click()
await night.waitForTimeout(700)
console.log('theme:', await night.evaluate(() => document.documentElement.dataset.theme))
await night.screenshot({ path: 'shots/21-home-night.png' })

const drawer = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
await drawer.goto(`${BASE}/`, { waitUntil: 'networkidle' })
await drawer.waitForTimeout(500)
await drawer.locator('.book-card__toggle').nth(0).click()
await drawer.locator('.book-card__toggle').nth(1).click()
await drawer.waitForTimeout(300)
await drawer.getByRole('button', { name: /打开我的书架/ }).first().click()
await drawer.waitForTimeout(700)
await drawer.screenshot({ path: 'shots/20-drawer.png' })

await browser.close()

if (issues.length) {
  console.log('\nISSUES:')
  console.log([...new Set(issues)].join('\n'))
  process.exitCode = 1
} else {
  console.log('\nNo console/page/request errors.')
}
