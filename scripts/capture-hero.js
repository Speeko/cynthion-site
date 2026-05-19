// Capture high-resolution snapshots of cynthiongame.com for press kits, Discord
// posts, social shares, print one-pagers.
//
// Writes three image pairs (PNG + PDF) to ~/Desktop:
//
//   cynthion-hero        — title + copy + gallery (no timeline)        [social-share / pinned post]
//   cynthion-timeline    — timeline section alone                       [standalone lore asset]
//   cynthion-hero-full   — title + copy + gallery + timeline            [press kit / one-pager]
//
// Setup (once):
//   cd ~/Documents/GitHub/cynthion-site
//   npm install
//   npx playwright install chromium
//
// Run:
//   npm run capture-hero
//
// PNG is 3x device-scale (retina-sharp raster). PDF is vector — text stays
// sharp at any zoom level; images embedded as raster.

const { chromium } = require('playwright');
const path = require('path');
const os = require('os');

const URL = 'https://cynthiongame.com/';
const DESKTOP = path.join(os.homedir(), 'Desktop');
const DPR = 3;

// Padding around the captured region (in CSS pixels).
const PAD_X = 48;
const PAD_Y = 32;

// Each capture target: { name, selector }. Selector identifies the section
// whose bounding box becomes the bottom of the clip; the top of the clip is
// always page top (for hero variants) or the selector's top (for timeline-only).
const TARGETS = [
  { name: 'cynthion-hero',      mode: 'top-to', selector: '.gallery'  },
  { name: 'cynthion-timeline',  mode: 'isolate', selector: '.timeline' },
  { name: 'cynthion-hero-full', mode: 'top-to', selector: '.timeline' },
];

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({
    viewport: { width: 1400, height: 1800 },
    deviceScaleFactor: DPR,
  });
  const page = await ctx.newPage();

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.fonts.ready);

  // Strip body's vertical centering so content sits at the top of the page.
  await page.addStyleTag({ content: `
    body {
      display: block !important;
      min-height: 0 !important;
      padding-top: 2.5rem !important;
    }
  ` });
  await page.waitForTimeout(400);

  const mainRect = await page.evaluate(() => {
    const r = document.querySelector('main').getBoundingClientRect();
    return { left: r.left + window.scrollX, width: r.width };
  });

  for (const t of TARGETS) {
    const box = await page.evaluate((sel) => {
      const r = document.querySelector(sel).getBoundingClientRect();
      return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
    }, t.selector);

    // Grow viewport tall enough to render everything we need.
    const needed = box.bottom + 200;
    if (needed > 1700) {
      await page.setViewportSize({ width: 1400, height: Math.ceil(needed) });
      await page.waitForTimeout(200);
    }

    const clipY = t.mode === 'isolate' ? Math.max(0, box.top - PAD_Y) : 0;
    const clipHeight = (t.mode === 'isolate'
      ? (box.bottom - box.top) + (PAD_Y * 2)
      : box.bottom + PAD_Y);
    const clipX = Math.max(0, mainRect.left - PAD_X);
    const clipWidth = Math.min(1400, mainRect.width + PAD_X * 2);

    const pngPath = path.join(DESKTOP, `${t.name}.png`);
    await page.screenshot({
      path: pngPath,
      clip: { x: clipX, y: clipY, width: clipWidth, height: clipHeight },
    });
    console.log(`Wrote ${pngPath}`);
    console.log(`  ${Math.round(clipWidth * DPR)}×${Math.round(clipHeight * DPR)} px @ ${DPR}x`);

    // For PDF: shift main left so content begins at PDF page edge.
    // Inject CSS, render PDF, then strip the shift before the next iteration.
    await page.addStyleTag({ content: `
      main { margin-left: -${clipX}px !important; margin-top: -${clipY}px !important; }
    ` });
    const pdfPath = path.join(DESKTOP, `${t.name}.pdf`);
    await page.pdf({
      path: pdfPath,
      width: `${clipWidth}px`,
      height: `${clipHeight}px`,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      pageRanges: '1',
    });
    console.log(`Wrote ${pdfPath}`);
    console.log(`  ${Math.round(clipWidth)}×${Math.round(clipHeight)} CSS px (vector)`);

    // Reset the shift before the next target.
    await page.addStyleTag({ content: `
      main { margin-left: 0 !important; margin-top: 0 !important; }
    ` });
  }

  await browser.close();
})();
