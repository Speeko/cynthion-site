// Capture a high-resolution "title-through-timeline" snapshot of cynthiongame.com
// for use in press kits, Discord posts, social shares.
//
// Output: ~/Desktop/cynthion-hero.png (~2200x~3700 at 3x device-scale)
//
// Setup (once):
//   cd ~/Documents/GitHub/cynthion-site
//   npm install --save-dev playwright
//   npx playwright install chromium
//
// Run:
//   node scripts/capture-hero.js
//
// The script overrides the page's vertical centering so content sits at the top
// of the capture, finds the bottom edge of the .timeline section, and clips the
// screenshot to exactly that area (wordmark, copy, gallery, timeline) plus
// a small padding margin. The signup form, Steam note, and footer are excluded.

const { chromium } = require('playwright');
const path = require('path');
const os = require('os');

const URL = 'https://cynthiongame.com/';
const OUTPUT = path.join(os.homedir(), 'Desktop', 'cynthion-hero.png');
const DPR = 3;

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({
    viewport: { width: 1400, height: 1800 },
    deviceScaleFactor: DPR,
  });
  const page = await ctx.newPage();

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.fonts.ready);

  // Disable body's flex/min-height so content lives at top of capture instead
  // of being vertically centered in the viewport.
  await page.addStyleTag({ content: `
    body {
      display: block !important;
      min-height: 0 !important;
      padding-top: 2.5rem !important;
    }
  ` });
  await page.waitForTimeout(400);

  const cropBottom = await page.evaluate(() =>
    document.querySelector('.timeline').getBoundingClientRect().bottom + window.scrollY
  );
  const mainRect = await page.evaluate(() => {
    const r = document.querySelector('main').getBoundingClientRect();
    return { left: r.left + window.scrollX, width: r.width };
  });

  // Expand viewport if needed so the timeline is rendered before clip
  if (cropBottom > 1700) {
    await page.setViewportSize({ width: 1400, height: Math.ceil(cropBottom + 100) });
    await page.waitForTimeout(300);
  }

  const PAD_X = 48;
  const PAD_Y = 32;
  await page.screenshot({
    path: OUTPUT,
    clip: {
      x: Math.max(0, mainRect.left - PAD_X),
      y: 0,
      width: Math.min(1400, mainRect.width + PAD_X * 2),
      height: cropBottom + PAD_Y,
    },
  });

  console.log(`Wrote ${OUTPUT}`);
  console.log(`(content: ${Math.round(mainRect.width + PAD_X * 2)}×${Math.round(cropBottom + PAD_Y)} CSS px, ` +
              `output: ${Math.round((mainRect.width + PAD_X * 2) * DPR)}×${Math.round((cropBottom + PAD_Y) * DPR)} actual px @ ${DPR}x)`);

  await browser.close();
})();
