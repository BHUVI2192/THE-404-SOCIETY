/**
 * Captures every page and every flowchart stage.
 *   npm run build && npm run preview &   then   npm run screenshots
 * Output: screenshots/pages, screenshots/stages/<roadmap>
 */
import { chromium } from 'playwright';
import { mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = process.env.BASE_URL || 'http://localhost:4173';
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'screenshots');
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'pages'), { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--no-sandbox'] });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 })).newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

/** Lets the document grow so full-page captures include the scrolling area. */
const EXPAND = `html,body,#app{height:auto!important}.app{height:auto!important;min-height:900px}.main{height:auto!important;overflow:visible!important}.sidebar{height:900px!important;align-self:start}`;

const open = async (hash, { wait = 1200 } = {}) => {
  await page.goto(`${BASE}/#/`);
  await page.goto(`${BASE}/#${hash}`);
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(wait);
};
const expand = async () => { await page.addStyleTag({ content: EXPAND }); await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(250); };
const complete = (indexes) => page.evaluate((ix) => {
  const chips = [...document.querySelectorAll('.tchip')];
  ix.forEach((i) => chips[i]?.querySelector('[data-act="toggle"]').dispatchEvent(new MouseEvent('click', { bubbles: true })));
}, indexes);

const pageShot = async (name, hash, { full = true, maxHeight, wait, before } = {}) => {
  await open(hash, { wait });
  if (before) await before();
  if (full) await expand();
  const opts = { path: join(OUT, 'pages', `${name}.png`) };
  if (full) { opts.fullPage = true; if (maxHeight) opts.clip = { x: 0, y: 0, width: 1440, height: maxHeight }; }
  await page.screenshot(opts);
  console.log('page ', name);
};

await pageShot('01-dashboard', '/');
await pageShot('02-universe', '/universe', { full: false, wait: 2600 });
await pageShot('03-roadmaps', '/roadmaps', { maxHeight: 1900 });
await pageShot('04-resources', '/resources', { maxHeight: 1700 });
await pageShot('05-videos', '/videos', { maxHeight: 1700 });
await pageShot('06-insights', '/insights', { wait: 1600 });
await pageShot('07-roadmap-list-view', '/roadmap/python', { full: false, before: async () => { await page.click('#mode [data-m="list"]'); await page.waitForTimeout(400); } });
await pageShot('07b-roadmap-graph-view', '/roadmap/frontend', { full: false, wait: 2400, before: async () => { await page.click('#mode [data-m="graph"]'); await page.waitForTimeout(2200); } });
await pageShot('07c-roadmap-resources-tab', '/roadmap/frontend', { full: false, before: async () => { await page.click('#mode [data-m="res"]'); await page.waitForTimeout(500); } });

// flowcharts: full-width overview, one capture per stage, topic panel
const flowchart = async (slug, doneIdx) => {
  const dir = join(OUT, 'stages', slug);
  mkdirSync(dir, { recursive: true });
  await open(`/roadmap/${slug}`, { wait: 1500 });
  await complete(doneIdx);
  await page.waitForTimeout(300);
  await expand();
  const count = await page.evaluate(() => document.querySelectorAll('.stage').length);
  const titles = await page.evaluate(() => [...document.querySelectorAll('.snode .sn-t')].map((t) => t.textContent));
  const svg = await page.locator('.flow-scroll svg').boundingBox();
  // top of page through the first stage header
  await page.screenshot({ path: join(dir, '00-overview.png'), clip: { x: 0, y: 0, width: 1440, height: svg.y + 900 }, fullPage: true });
  for (let i = 0; i < count; i++) {
    const box = await page.locator(`#stage-${i}`).boundingBox();
    const slugTitle = titles[i].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await page.screenshot({
      path: join(dir, `${String(i + 1).padStart(2, '0')}-${slugTitle}.png`),
      clip: { x: Math.max(0, svg.x - 20), y: Math.max(0, box.y - 36), width: Math.min(1440 - Math.max(0, svg.x - 20), svg.width + 40), height: box.height + 76 },
      fullPage: true,
    });
  }
  console.log('flow ', slug, count, 'stages');
};
await flowchart('frontend', [0, 1, 2, 3, 8, 9, 10, 20, 21, 30, 45, 60, 61, 62, 63]);
await flowchart('ai-engineer', [0, 1, 2, 3, 4, 14, 15, 16, 30, 31, 55, 56, 57, 90, 91]);

// topic panel
await open('/roadmap/frontend', { wait: 1500 });
await page.evaluate(() => document.querySelector('#stage-1').scrollIntoView());
await page.waitForTimeout(400);
await page.click('#stage-1 .tchip >> nth=2');
await page.waitForTimeout(700);
await page.screenshot({ path: join(OUT, 'pages', '08-topic-panel.png') });
console.log('page  topic panel');

// dark theme
await page.goto(BASE);
await page.evaluate(() => localStorage.setItem('theme', 'dark'));
await page.reload();
await pageShot('09-dashboard-dark', '/');
await pageShot('10-universe-dark', '/universe', { full: false, wait: 2600 });
await open('/roadmap/backend', { wait: 1500 });
await complete([0, 1, 2, 5, 6, 12, 13]);
await page.waitForTimeout(300);
await page.screenshot({ path: join(OUT, 'pages', '11-flowchart-dark.png') });
await page.evaluate(() => document.querySelector('#stage-1').scrollIntoView());
await page.waitForTimeout(500);
await page.screenshot({ path: join(OUT, 'pages', '12-flowchart-stage-dark.png') });

await browser.close();
console.log(errors.length ? `Console errors:\n${errors.join('\n')}` : 'No console errors');
