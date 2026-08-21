import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDirectory = path.join(projectRoot, 'data/customer-intelligence/elfsight-review/screenshots');
const outputDirectory = path.join(projectRoot, 'content/assets/elfsight/customer-examples');
const workingDirectory = path.join(projectRoot, 'data/customer-intelligence/elfsight-review/rendering');
const annotationHeight = 88;
const renderToken = Date.now();

const assets = [
  {
    source: '01-flashtraducoes-whatsapp-chat.png',
    filename: 'elfsight-whatsapp-chat-flash-traducoes.png',
    site: 'flashtraducoes.com.br',
    widget: 'WhatsApp Chat',
    crop: { x: 720, y: 170, width: 560, height: 550 },
    highlights: [{ x: 895, y: 305, width: 370, height: 405 }],
  },
  {
    source: '02-foremanagement-all-in-one-chat.png',
    filename: 'elfsight-all-in-one-chat-fore-management.png',
    site: 'foremanagement.com',
    widget: 'All-in-One Chat',
    crop: { x: 750, y: 170, width: 523, height: 546 },
    highlights: [{ x: 883, y: 272, width: 370, height: 430 }],
  },
  {
    source: '03-helvate-google-reviews.png',
    filename: 'elfsight-google-reviews-helvate.png',
    site: 'helvate.ch',
    widget: 'Google Reviews',
    crop: { x: 80, y: 270, width: 1120, height: 410 },
    highlights: [{ x: 118, y: 326, width: 1048, height: 337 }],
  },
  {
    source: '04-joyfultours-photo-gallery-and-whatsapp.png',
    filename: 'elfsight-photo-gallery-whatsapp-chat-joyful-tours.png',
    site: 'joyfultoursrd.com',
    widget: 'Photo Gallery + WhatsApp Chat',
    crop: { x: 75, y: 230, width: 1185, height: 490 },
    highlights: [
      { x: 113, y: 532, width: 786, height: 188 },
      { x: 895, y: 252, width: 370, height: 400 },
    ],
  },
  {
    source: '05-onlinekarma-all-in-one-reviews.png',
    filename: 'elfsight-all-in-one-reviews-onlinekarma.png',
    site: 'onlinekarma.ch',
    widget: 'All-in-One Reviews',
    crop: { x: 120, y: 280, width: 1040, height: 440 },
    highlights: [{ x: 150, y: 324, width: 985, height: 396 }],
  },
  {
    source: '06-yesweconnect-number-counter.png',
    filename: 'elfsight-number-counter-yes-we-connect.png',
    site: 'yesweconnect.nl',
    widget: 'Number Counter',
    crop: { x: 40, y: 75, width: 1200, height: 410 },
    highlights: [{ x: 49, y: 140, width: 1183, height: 284 }],
  },
  {
    source: '07-eometric-google-reviews.png',
    filename: 'elfsight-google-reviews-eometric.png',
    site: 'eometric.squarespace.com',
    widget: 'Google Reviews',
    crop: { x: 150, y: 130, width: 980, height: 420 },
    highlights: [{ x: 180, y: 268, width: 923, height: 242 }],
  },
  {
    source: '08-theriderexperience-all-in-one-reviews.png',
    filename: 'elfsight-all-in-one-reviews-rider-experience.png',
    site: 'theriderexperience.com',
    widget: 'All-in-One Reviews + WhatsApp Chat',
    crop: { x: 75, y: 280, width: 1185, height: 440 },
    highlights: [{ x: 94, y: 382, width: 1090, height: 338 }],
  },
  {
    source: '09-yume-voyages-tripadvisor-reviews.png',
    filename: 'elfsight-tripadvisor-reviews-yume-voyages.png',
    site: 'yume-voyages.com',
    widget: 'Tripadvisor Reviews + WhatsApp Chat',
    crop: { x: 60, y: 130, width: 1160, height: 540 },
    highlights: [{ x: 71, y: 172, width: 1141, height: 430 }],
  },
  {
    source: '10-kitesurfspot-instagram-feed.png',
    filename: 'elfsight-instagram-feed-kitesurfspot.png',
    site: 'kitesurfspot.nl',
    widget: 'Instagram Feed',
    crop: { x: 0, y: 250, width: 1280, height: 470 },
    highlights: [{ x: 0, y: 300, width: 1280, height: 420 }],
  },
];

function escapeXml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
  })[character]);
}

function headerSvgFor(asset) {
  const { crop } = asset;
  const title = `${asset.widget} on ${asset.site}`;
  const titleFontSize = title.length > 76 ? 18 : title.length > 62 ? 20 : 25;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${crop.width}" height="${annotationHeight}" viewBox="0 0 ${crop.width} ${annotationHeight}">
  <rect x="0" y="0" width="${crop.width}" height="${annotationHeight}" fill="#111827"/>
  <rect x="0" y="${annotationHeight - 4}" width="${crop.width}" height="4" fill="#38bdf8"/>
  <text x="24" y="25" fill="#7dd3fc" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" letter-spacing="1.5">ELFSIGHT · VERIFIED CUSTOMER EXAMPLE</text>
  <text x="24" y="54" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="${titleFontSize}" font-weight="700">${escapeXml(title)}</text>
</svg>\n`;
}

function setPixel(image, x, y, red, green, blue, alpha = 255) {
  if (x < 0 || y < 0 || x >= image.width || y >= image.height) return;
  const offset = (image.width * y + x) << 2;
  image.data[offset] = red;
  image.data[offset + 1] = green;
  image.data[offset + 2] = blue;
  image.data[offset + 3] = alpha;
}

function drawHighlight(image, box, crop) {
  const left = Math.max(0, box.x - crop.x);
  const top = annotationHeight + Math.max(0, box.y - crop.y);
  const right = Math.min(image.width - 1, left + box.width - 1);
  const bottom = Math.min(image.height - 1, top + box.height - 1);
  const thickness = 5;
  for (let line = 0; line < thickness; line += 1) {
    for (let x = left; x <= right; x += 1) {
      setPixel(image, x, top + line, 255, 179, 71);
      setPixel(image, x, bottom - line, 255, 179, 71);
    }
    for (let y = top; y <= bottom; y += 1) {
      setPixel(image, left + line, y, 255, 179, 71);
      setPixel(image, right - line, y, 255, 179, 71);
    }
  }
}

function composeAnnotated(headerPath, cleanPath, outputPath, asset) {
  const header = PNG.sync.read(fs.readFileSync(headerPath));
  const clean = PNG.sync.read(fs.readFileSync(cleanPath));
  const output = new PNG({ width: clean.width, height: header.height + clean.height });
  PNG.bitblt(header, output, 0, 0, header.width, header.height, 0, 0);
  PNG.bitblt(clean, output, 0, 0, clean.width, clean.height, 0, header.height);
  for (const highlight of asset.highlights) drawHighlight(output, highlight, asset.crop);
  fs.writeFileSync(outputPath, PNG.sync.write(output));
}

function renderSvg(svgPath, outputPath, width, height) {
  const thumbnailSize = Math.max(width, height);
  execFileSync('/usr/bin/qlmanage', ['-t', '-s', String(thumbnailSize), '-o', workingDirectory, svgPath], { stdio: 'ignore' });
  const renderedPath = path.join(workingDirectory, `${path.basename(svgPath)}.png`);
  // sips treats a zero crop offset as "centre". A one-pixel offset preserves the
  // top-left-aligned Quick Look rendering without materially changing the crop.
  execFileSync('/usr/bin/sips', ['-c', String(height), String(width), '--cropOffset', '1', '1', renderedPath, '--out', outputPath], { stdio: 'ignore' });
}

for (const directory of [
  workingDirectory,
  path.join(outputDirectory, 'clean'),
  path.join(outputDirectory, 'annotated'),
]) fs.mkdirSync(directory, { recursive: true });

for (const asset of assets) {
  const sourcePath = path.join(sourceDirectory, asset.source);
  if (!fs.existsSync(sourcePath)) throw new Error(`Missing source screenshot: ${sourcePath}`);
  const cleanPath = path.join(outputDirectory, 'clean', asset.filename);
  const annotatedPath = path.join(outputDirectory, 'annotated', asset.filename);
  execFileSync('/usr/bin/sips', [
    '-s', 'format', 'png',
    '-c', String(asset.crop.height), String(asset.crop.width),
    '--cropOffset', String(Math.max(1, asset.crop.y)), String(Math.max(1, asset.crop.x)),
    sourcePath,
    '--out', cleanPath,
  ], { stdio: 'ignore' });
  const svgPath = path.join(workingDirectory, `${renderToken}-header-${asset.filename}.svg`);
  const headerPath = path.join(workingDirectory, `${renderToken}-header-${asset.filename}.png`);
  fs.writeFileSync(svgPath, headerSvgFor(asset));
  renderSvg(svgPath, headerPath, asset.crop.width, annotationHeight);
  composeAnnotated(headerPath, cleanPath, annotatedPath, asset);
}

console.log(`Prepared ${assets.length * 2} Elfsight article assets in ${outputDirectory}`);
