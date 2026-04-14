import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, 'exported slides');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 }); // 2x = crisp quality
await page.goto('http://localhost:3001/instagram-posts', { waitUntil: 'networkidle2', timeout: 30000 });

const slides = await page.evaluate(() =>
  Array.from(document.querySelectorAll('.slide')).map(el => el.id)
);

for (const id of slides) {
  const el = await page.$(`#${id}`);
  const box = await el.boundingBox();
  const filepath = path.join(outputDir, `${id}.png`);
  await page.screenshot({
    path: filepath,
    type: 'png',
    clip: { x: box.x, y: box.y, width: box.width, height: box.height },
  });
  console.log(`✓ ${id}.png`);
}

await browser.close();
console.log(`\nAll slides saved to: exported slides/`);
