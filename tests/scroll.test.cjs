/* Run with Node and Playwright available (optionally set PLAYWRIGHT_BROWSER_EXECUTABLE).
   Uses real GSAP/ScrollTrigger/Lenis motion. External traffic is mocked or blocked;
   no appointment is created and no existing browser profile is used. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  const filename = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
  if (!filename.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(filename, (error, data) => {
    if (error) { res.writeHead(404).end(); return; }
    const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
    res.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream' }).end(data);
  });
});
let browser;
let base;

function slotsFor(first) {
  const data = {};
  for (let i = 0; i < 3; i++) {
    const day = new Date(first + 'T12:00:00Z');
    day.setUTCDate(day.getUTCDate() + i);
    const iso = day.toISOString().slice(0, 10);
    data[iso] = [{ start: iso + 'T07:00:00Z' }, { start: iso + 'T08:00:00Z' }];
  }
  return { status: 'success', data };
}
async function fixture({ mobile = false } = {}) {
  const context = await browser.newContext({ reducedMotion: 'no-preference',
    viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 } });
  let nextSlotRequest;
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin === base) return route.continue();
    if (url.hostname === 'api.cal.com' && url.pathname === '/v2/slots') {
      if (nextSlotRequest) {
        const handler = nextSlotRequest;
        nextSlotRequest = null;
        return handler(route, url);
      }
      return route.fulfill({ json: slotsFor(url.searchParams.get('start')) });
    }
    return route.abort();
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base);
  await page.locator('button.slot').first().waitFor({ state: 'attached' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.getElementById('loader').classList.contains('is-done') &&
    [...document.querySelectorAll('.ht-l')].every(el => Math.abs(gsap.getProperty(el, 'y')) < 0.1));
  return { context, page, errors, holdNextSlots() {
    let resolveRequest;
    const request = new Promise(resolve => { resolveRequest = resolve; });
    nextSlotRequest = (route, url) => new Promise(resolve => {
      resolveRequest(async () => {
        await route.fulfill({ json: slotsFor(url.searchParams.get('start')) });
        resolve();
      });
    });
    return request;
  } };
}
async function snapshot(page) {
  return page.evaluate(() => ({
    y: scrollY,
    height: document.documentElement.scrollHeight,
    pins: ScrollTrigger.getAll().filter(trigger => trigger.pin).map(trigger => ({
      id: trigger.pin.id, start: trigger.start, end: trigger.end,
      top: trigger.pin.getBoundingClientRect().top, progress: trigger.progress
    })),
    heroStart: ScrollTrigger.getAll().find(trigger => trigger.trigger?.classList.contains('hero')).start
  }));
}
async function jumpIntoPin(page, id) {
  const y = await page.evaluate(id => {
    const trigger = ScrollTrigger.getAll().find(item => item.pin?.id === id);
    const target = Math.round((trigger.start + trigger.end) / 2);
    window.scrollTo({ top: target, behavior: 'instant' });
    return target;
  }, id);
  await page.waitForFunction(({ y, id }) => Math.abs(scrollY - y) < 1 &&
    !document.documentElement.classList.contains('lenis-smooth') &&
    Math.abs(document.getElementById(id).getBoundingClientRect().top) < 2, { y, id }, { timeout: 5000 }).catch(async () => {
    throw new Error('Expected pin ' + id + ' at scroll ' + y + '; actual: ' + JSON.stringify(await snapshot(page)));
  });
}
function assertLayoutSame(before, after) {
  assert.ok(Math.abs(after.y - before.y) < 2, 'Refresh must preserve the current scroll position');
  assert.ok(Math.abs(after.height - before.height) < 2, 'Refresh must preserve document height');
  assert.equal(after.heroStart, before.heroStart, 'Hero trigger must remain at the document top');
  assert.deepEqual(after.pins.map(({ id, start, end }) => ({ id, start, end })),
    before.pins.map(({ id, start, end }) => ({ id, start, end })), 'Pinned trigger positions must not shift on refresh');
  after.pins.forEach((pin, i) => assert.ok(Math.abs(pin.top - before.pins[i].top) < 2, 'Pinned content must not jump'));
}
async function assertTopRestored(page) {
  await page.waitForFunction(() => scrollY < 1 &&
    !document.documentElement.classList.contains('lenis-scrolling') &&
    Number(getComputedStyle(document.querySelector('.hero-content')).opacity) > 0.999 &&
    Math.abs(gsap.getProperty('.hero-content', 'yPercent')) < 0.01 &&
    Math.abs(gsap.getProperty('#servicesTrack', 'x')) < 0.1 &&
    [...document.querySelectorAll('.ht-l')].every(el => Math.abs(gsap.getProperty(el, 'x')) < 0.1));
  const layout = await snapshot(page);
  assert.equal(layout.heroStart, 0);
  assert.ok(layout.pins.every(pin => pin.progress === 0 && pin.top > 0), 'Pinned sections must leave the hero unobstructed');
  assert.ok(await page.evaluate(() => Math.abs(gsap.getProperty('.hero-content', 'yPercent')) < 0.01));
  assert.ok(await page.evaluate(() => Math.abs(gsap.getProperty('#servicesTrack', 'x')) < 0.1));
}

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = 'http://127.0.0.1:' + server.address().port;
  browser = await chromium.launch({ headless: true,
    ...(process.env.PLAYWRIGHT_BROWSER_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_BROWSER_EXECUTABLE } : {}) });

  {
    const { context, page, errors } = await fixture();
    for (const pin of ['servicesPin', 'cutPin', 'servicesPin']) {
      await jumpIntoPin(page, pin);
      const before = await snapshot(page);
      /* ScrollTrigger temporarily scrolls to zero to measure. This used to be
         animated by CSS while Lenis was idle, shifting starts by -scrollY. */
      await page.evaluate(() => ScrollTrigger.refresh());
      assertLayoutSame(before, await snapshot(page));
      await page.evaluate(() => {
        window.dispatchEvent(new Event('blur'));
        window.dispatchEvent(new Event('focus'));
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await page.waitForFunction(() => document.getElementById('slotsGrid').getAttribute('aria-busy') === 'false');
      assertLayoutSame(before, await snapshot(page));
      await page.locator('#totop').click();
      await assertTopRestored(page);
    }
    assert.deepEqual(errors, []);
    await context.close();
    console.log('PASS: desktop full-motion focus/refresh and repeated back-to-top preserve hero and both pinned sections');
  }

  {
    const test = await fixture();
    const { context, page, errors } = test;
    await page.evaluate(() => document.querySelector('button.slot').click());
    await jumpIntoPin(page, 'servicesPin');
    const before = await snapshot(page);
    const pending = test.holdNextSlots();
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    const release = await pending;
    assertLayoutSame(before, await snapshot(page));
    assert.equal(await page.locator('.slot.is-selected').count(), 1, 'Background refresh must preserve the selected time');
    await page.locator('#totop').click();
    await page.waitForFunction(start => scrollY > 20 && scrollY < start - 20, before.y);
    await release();
    await page.waitForFunction(() => document.getElementById('slotsGrid').getAttribute('aria-busy') === 'false');
    await assertTopRestored(page);
    assert.equal(await page.locator('.slot.is-selected').count(), 1);
    assert.equal((await snapshot(page)).height, before.height);
    assert.deepEqual(errors, []);
    await context.close();
    console.log('PASS: delayed availability response during back-to-top keeps layout and selected appointment stable');
  }

  {
    const { context, page, errors } = await fixture({ mobile: true });
    assert.equal((await snapshot(page)).pins.length, 1, 'Mobile services use natural horizontal scrolling');
    await jumpIntoPin(page, 'cutPin');
    const before = await snapshot(page);
    await page.evaluate(() => ScrollTrigger.refresh());
    assertLayoutSame(before, await snapshot(page));
    await page.locator('#totop').click();
    await assertTopRestored(page);
    assert.deepEqual(errors, []);
    await context.close();
    console.log('PASS: mobile full-motion pinned refresh and back-to-top restore the hero');
  }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
});
