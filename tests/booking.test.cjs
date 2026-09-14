/* Run with Node and Playwright available (optionally set PLAYWRIGHT_BROWSER_EXECUTABLE).
   All Cal.com traffic is mocked; these tests never create real appointments. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const services = [
  ['hiustenleikkaus', 'Haircut (adults)', 'fi', 'Hiustenleikkaus (aikuiset)'],
  ['opiskelijat', 'Students', 'sv', 'Studerande'],
  ['lasten-leikkaus', "Kids' haircut", 'ro', 'Tuns copii'],
  ['parta', 'Beard', 'ru', 'Борода'],
  ['leikkaus-parta', 'Cut + beard', 'uk', 'Стрижка + борода']
];
const server = http.createServer((req, res) => {
  const filename = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
  if (!filename.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
  fs.readFile(filename, (error, data) => {
    if (error) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream' }).end(data);
  });
});
let browser;
let base;

function slotsFor(first, offset = 3) {
  const data = {};
  for (let day = 0; day < 3; day++) {
    const date = new Date(first + 'T12:00:00Z');
    date.setUTCDate(date.getUTCDate() + day);
    const iso = date.toISOString().slice(0, 10);
    data[iso] = Array.from({ length: 8 }, (_, i) => ({ start: iso + 'T' + String(10 + i - offset).padStart(2, '0') + ':00:00Z' }));
  }
  return { status: 'success', data };
}
async function fixture({ date = '2026-09-14T06:00:00Z', slotHandler, bookingHandler, mobile = false } = {}) {
  const context = await browser.newContext({ timezoneId: 'Asia/Baghdad', reducedMotion: 'reduce',
    viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 } });
  await context.addInitScript(({ now }) => {
    const NativeDate = Date;
    window.Date = class extends NativeDate {
      constructor(...args) { super(...(args.length ? args : [now])); }
      static now() { return now; }
    };
  }, { now: new Date(date).getTime() });
  const gets = [];
  const posts = [];
  await context.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin === base) return route.continue();
    if (url.hostname === 'api.cal.com' && url.pathname === '/v2/slots') {
      gets.push(url);
      assert.equal(url.searchParams.get('eventTypeSlug'), 'ajanvaraus');
      assert.equal(url.searchParams.get('timeZone'), 'Europe/Helsinki');
      if (slotHandler) return slotHandler(route, url);
      return route.fulfill({ json: slotsFor(url.searchParams.get('start'), date.includes('-11-') ? 2 : 3) });
    }
    if (url.hostname === 'api.cal.com' && url.pathname === '/v2/bookings') {
      const body = request.postDataJSON();
      posts.push(body);
      if (bookingHandler) return bookingHandler(route, body);
      return route.fulfill({ json: { status: 'success', data: { status: 'pending' } } });
    }
    return route.abort();
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base);
  await page.locator('#slotsService option').first().waitFor({ state: 'attached' });
  return { context, page, gets, posts, errors };
}
async function selectFirstSlot(page) {
  await page.locator('button.slot').first().click();
  await page.locator('#slotsNext').click();
  await page.locator('#bkName').waitFor({ state: 'visible' });
}
async function fillBooking(page) {
  await page.locator('#bkName').fill('Test Customer');
  await page.locator('#bkEmail').fill('test@example.invalid');
  await page.locator('#bkPhone').fill('040 123 4567');
}
async function language(page, value) {
  await page.evaluate(lang => { document.documentElement.lang = lang; document.dispatchEvent(new Event('vp:lang')); }, value);
}

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = 'http://127.0.0.1:' + server.address().port;
  browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_BROWSER_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_BROWSER_EXECUTABLE } : {}) });

  {
    const { context, page, gets, posts, errors } = await fixture({ mobile: true });
    await page.locator('button.slot').first().waitFor();
    assert.equal(await page.locator('#slotsService option').count(), 5);
    assert.match(await page.locator('#slotsServiceHint').innerText(), /1 tunti/);
    assert.equal(await page.locator('[data-cal-link="vaalanparturi"]').count(), 0);
    // Every entry point targets the native service picker, including mobile navigation.
    await page.locator('.js-book').evaluateAll(buttons => buttons.forEach(button => button.click()));
    assert.equal(await page.evaluate(() => document.activeElement.id), 'slotsService');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    for (const [key, providerValue, uiLanguage, localizedLabel] of services) {
      await language(page, uiLanguage);
      const requestsBefore = gets.length;
      await page.locator('#slotsService').selectOption(key);
      assert.equal(await page.locator('#slotsService option:checked').innerText(), localizedLabel, 'The customer sees the service in the chosen UI language');
      assert.equal(gets.length, requestsBefore, 'Changing services must reuse the same calendar');
      const slot = await page.locator('button.slot').first().getAttribute('data-start');
      await selectFirstSlot(page);
      assert.equal(await page.locator('.bk-summary strong').innerText(), localizedLabel);
      const summary = await page.locator('.bk-summary em').innerText();
      const [start, end] = summary.split('–').map(time => time.split(':').map(Number)).map(([h, m]) => h * 60 + m);
      assert.equal(end - start, 60);
      assert.equal(await page.locator('#slotsGridPane').evaluate(element => element.inert), true);
      assert.equal(await page.locator('#slotsGridPane').evaluate(element => getComputedStyle(element).visibility), 'hidden');
      await fillBooking(page);
      await page.locator('#bkSubmit').click();
      await page.locator('#bkDone').waitFor();
      const payload = posts.at(-1);
      assert.equal(payload.eventTypeSlug, 'ajanvaraus');
      assert.equal(payload.bookingFieldsResponses.palvelu, providerValue);
      assert.equal(payload.attendee.language, uiLanguage === 'zh' ? 'zh-CN' : uiLanguage, 'Customer email language stays independent of English organizer details');
      assert.equal(payload.attendee.timeZone, 'Europe/Helsinki');
      assert.equal(payload.attendee.phoneNumber, '+358401234567');
      await language(page, 'en');
      assert.equal(await page.locator('#bkDone').count(), 1, 'Language change must preserve confirmation');
      assert.equal(await page.locator('#bkSubmit').count(), 0);
      await page.locator('#bkDone').click();
      await page.locator('button.slot').first().waitFor();
      assert.equal(await page.locator('button.slot[data-start="' + slot + '"]').count(), 0, 'A reserved hour must stay unavailable for all services, even if availability is briefly stale');
    }
    assert.equal(posts.length, 5);
    assert.deepEqual(errors, []);
    await context.close();
    console.log('PASS: five localized services send English organizer details, share one 60-minute calendar, and preserve dropdown/CTA mobile layout and cross-service invalidation');
  }

  {
    let resolveBooking;
    const { context, page, posts, errors } = await fixture({ bookingHandler: async route => {
      await new Promise(resolve => { resolveBooking = resolve; });
      return route.fulfill({ json: { status: 'success', data: { status: 'pending' } } });
    } });
    await selectFirstSlot(page);
    await fillBooking(page);
    await page.locator('#bkSubmit').click();
    await page.waitForFunction(() => document.getElementById('bkSubmit').disabled);
    await language(page, 'en');
    assert.equal(await page.locator('#bkSubmit').isDisabled(), true);
    assert.equal(await page.locator('#bkBack').isDisabled(), true);
    await page.locator('#bkSubmit').evaluate(button => button.click());
    assert.equal(posts.length, 1, 'Language changes cannot submit a second booking');
    while (!resolveBooking) await new Promise(resolve => setTimeout(resolve, 5));
    resolveBooking();
    await page.locator('#bkDone').waitFor();
    assert.deepEqual(errors, []);
    await context.close();
    console.log('PASS: pending submission stays locked across language changes');
  }

  {
    let resolveOld;
    const { context, page, errors } = await fixture({ slotHandler: async (route, url) => {
      const first = url.searchParams.get('start');
      if (first === '2026-09-15') await new Promise(resolve => { resolveOld = resolve; });
      return route.fulfill({ json: slotsFor(first) });
    } });
    await page.locator('button.slot').first().waitFor();
    await page.locator('#slotsDateBtn').click();
    await page.locator('#dp button[data-iso="2026-09-15"]').click();
    assert.equal(await page.locator('button.slot').count(), 0, 'Loading must remove stale clickable slots');
    assert.equal(await page.locator('#slotsNext').isHidden(), true);
    await page.locator('#slotsDateBtn').click();
    await page.locator('#dp button[data-iso="2026-09-16"]').click();
    await page.locator('button.slot[data-iso="2026-09-16"]').first().waitFor();
    while (!resolveOld) await new Promise(resolve => setTimeout(resolve, 5));
    resolveOld();
    await page.waitForTimeout(50);
    assert.equal(await page.locator('button.slot').first().getAttribute('data-iso'), '2026-09-16');
    assert.deepEqual(errors, []);
    await context.close();
    console.log('PASS: slower old date responses cannot replace the chosen date');
  }

  {
    let fetchCount = 0;
    let finishSuccessfulRefresh;
    let finishFailedRefresh;
    const successfulRefresh = new Promise(resolve => { finishSuccessfulRefresh = resolve; });
    const failedRefresh = new Promise(resolve => { finishFailedRefresh = resolve; });
    const { context, page, gets, posts, errors } = await fixture({ slotHandler: async (route, url) => {
      const requestNumber = ++fetchCount;
      if (requestNumber === 2) await successfulRefresh;
      if (requestNumber === 3) {
        await failedRefresh;
        return route.fulfill({ status: 503, json: { error: 'temporary focus refresh failure' } });
      }
      const response = slotsFor(url.searchParams.get('start'));
      if (requestNumber >= 4) response.data['2026-09-14'].shift();
      return route.fulfill({ json: response });
    } });
    await page.locator('button.slot').first().click();
    await page.evaluate(() => document.fonts.ready);
    const snapshot = () => page.locator('#slots').evaluate(wrap => ({
      boardHeight: wrap.offsetHeight,
      gridHeight: document.getElementById('slotsGrid').offsetHeight,
      slotCount: wrap.querySelectorAll('button.slot').length,
      selectedStart: wrap.querySelector('button.slot.is-selected')?.dataset.start
    }));
    const before = await snapshot();
    const startFocusRefresh = async () => {
      const started = page.waitForRequest(request => new URL(request.url()).pathname === '/v2/slots');
      await page.evaluate(() => window.dispatchEvent(new Event('focus')));
      await started;
      await page.locator('#slotsGrid[aria-busy="true"]').waitFor();
    };
    await startFocusRefresh();
    assert.deepEqual(await snapshot(), before, 'Delayed focus refresh must keep the board height and selected slot');
    assert.equal(await page.locator('#slotsNext').isDisabled(), true);
    await language(page, 'en');
    assert.deepEqual(await snapshot(), before, 'Translating a background refresh must keep the existing calendar');
    assert.equal(await page.locator('#slotsNext').isDisabled(), true);
    await page.locator('#slotsNext').evaluate(button => button.click());
    assert.equal(gets.length, 2, 'Next cannot start another request while background availability is pending');
    assert.equal(await page.locator('#bkName').count(), 0);
    finishSuccessfulRefresh();
    await page.locator('#slotsGrid[aria-busy="false"]').waitFor();
    assert.deepEqual(await snapshot(), before, 'A successful unchanged refresh must retain the selected hour and geometry');
    assert.equal(await page.locator('#slotsNext').isEnabled(), true);

    await startFocusRefresh();
    assert.deepEqual(await snapshot(), before);
    finishFailedRefresh();
    await page.locator('#slotsGrid[aria-busy="false"]').waitFor();
    assert.deepEqual(await snapshot(), before, 'A failed background refresh must keep the calendar and selection visible');
    assert.equal(await page.locator('#slotsNext').isEnabled(), true);
    await page.locator('#slotsNext').click();
    await page.locator('#slotsNotice.is-visible').waitFor();
    assert.equal(gets.length, 4, 'Next must freshly validate after a failed background refresh');
    assert.equal(await page.locator('button.slot.is-selected').count(), 0);
    assert.equal(await page.locator('button.slot').first().getAttribute('data-hhmm'), '11:00');
    assert.equal(await page.locator('#bkName').count(), 0, 'The stale selected hour cannot reach customer details');
    assert.equal(posts.length, 0);
    assert.deepEqual(errors, []);
    await context.close();
    console.log('PASS: focus refresh keeps height and selection through loading, translation and failure; Next still revalidates');
  }

  {
    let fetchCount = 0;
    const { context, page, posts, errors } = await fixture({ slotHandler: (route, url) => {
      const response = slotsFor(url.searchParams.get('start'));
      if (++fetchCount > 1) response.data['2026-09-14'].shift();
      return route.fulfill({ json: response });
    } });
    await page.locator('button.slot').first().click();
    await page.locator('#slotsNext').click();
    await page.locator('#slotsNotice.is-visible').waitFor();
    assert.equal(await page.locator('#bkName').count(), 0, 'Fresh availability must reject a slot taken since the grid loaded');
    assert.equal(await page.locator('button.slot').first().getAttribute('data-hhmm'), '11:00');
    assert.equal(posts.length, 0);
    assert.deepEqual(errors, []);
    await context.close();
    console.log('PASS: Next revalidates availability before collecting customer details');
  }

  {
    const { context, page, posts, errors } = await fixture({ bookingHandler: route => route.fulfill({ status: 400,
      json: { status: 'error', error: { code: 'no_available_users_found_error', message: 'User either already has booking at this time or is not available' } } }) });
    const slot = await page.locator('button.slot').first().getAttribute('data-start');
    await selectFirstSlot(page);
    await fillBooking(page);
    await page.locator('#bkNote').fill('Keep this note');
    await page.locator('#bkSubmit').click();
    await page.locator('#bkError.is-visible').waitFor();
    assert.equal(await page.locator('#bkSubmit').isDisabled(), true);
    await language(page, 'en');
    assert.equal(await page.locator('#bkSubmit').isDisabled(), true, 'A known conflict must stay invalid after translation');
    await page.locator('#bkSubmit').evaluate(button => button.click());
    assert.equal(posts.length, 1);
    await page.locator('#bkBack').click();
    await page.locator('button.slot').first().waitFor();
    assert.equal(await page.locator('button.slot[data-start="' + slot + '"]').count(), 0);
    await selectFirstSlot(page);
    assert.equal(await page.locator('#bkName').inputValue(), 'Test Customer');
    assert.equal(await page.locator('#bkEmail').inputValue(), 'test@example.invalid');
    assert.equal(await page.locator('#bkNote').inputValue(), 'Keep this note');
    assert.equal(await page.locator('#bkSubmit').isEnabled(), true);
    assert.deepEqual(errors, []);
    await context.close();
    console.log('PASS: Cal HTTP400 conflicts remain blocked through language changes and preserve details for a new time');
  }

  {
    const { context, page, errors } = await fixture({ date: '2026-11-02T06:00:00Z' });
    await page.locator('button.slot').first().waitFor();
    assert.equal(await page.locator('button.slot').first().getAttribute('data-hhmm'), '10:00', 'Winter times must be Helsinki UTC+2 even when the browser is Baghdad UTC+3');
    await selectFirstSlot(page);
    assert.equal(await page.locator('.bk-summary em').innerText(), '10:00–11:00');
    assert.deepEqual(errors, []);
    await context.close();
    console.log('PASS: Finnish winter timezone and one-hour end time');
  }

  {
    const { context, page, gets, errors } = await fixture({ slotHandler: route => route.fulfill({ status: 503, json: { error: 'test failure' } }) });
    await page.locator('#slotsRetry').waitFor();
    await page.locator('#slotsService').selectOption('leikkaus-parta');
    const fallback = page.locator('#slotsGrid [data-cal-link]');
    assert.equal(await fallback.getAttribute('data-cal-link'), 'vaalanparturi/ajanvaraus');
    assert.equal(JSON.parse(await fallback.getAttribute('data-cal-config')).palvelu, 'Cut + beard');
    assert.equal(await page.locator('button.slot').count(), 0);
    await page.locator('#slotsRetry').click();
    await page.locator('#slotsRetry').waitFor();
    assert.equal(gets.length, 2);
    assert.deepEqual(errors, []);
    await context.close();
    console.log('PASS: failure/retry and shared event fallback preserve the selected service');
  }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
});
