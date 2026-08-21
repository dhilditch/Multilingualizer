import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(projectRoot, 'data/customer-intelligence/saas-screenshot-audit/raw');
const renderingDirectory = path.join(projectRoot, 'data/customer-intelligence/saas-screenshot-audit/rendering');
const annotationHeight = 112;
const renderToken = Date.now();
const normalisedSources = new Map();

const assets = [
  {
    tool: 'Spark Plugin', slug: 'spark-plugin', source: 'spark/german-physiks-announcement-wide-en.png',
    filename: 'spark-plugin-announcement-bar-german-physiks-english-wide.png', site: 'germanphysiks.squarespace.com',
    feature: 'Announcement bar and navigation treatment', language: 'English', framing: 'wide',
    crop: { x: 0, y: 0, width: 1280, height: 720 }, highlights: [{ x: 0, y: 0, width: 1280, height: 63 }],
  },
  {
    tool: 'Spark Plugin', slug: 'spark-plugin', source: 'spark/german-physiks-announcement-wide-en.png',
    filename: 'spark-plugin-announcement-bar-german-physiks-english-close-up.png', site: 'germanphysiks.squarespace.com',
    feature: 'Announcement bar and navigation treatment', language: 'English', framing: 'close-up',
    crop: { x: 0, y: 0, width: 1280, height: 230 }, highlights: [{ x: 0, y: 0, width: 1280, height: 63 }],
  },
  {
    tool: 'Spark Plugin', slug: 'spark-plugin', source: 'spark/minerva-animated-headline-wide-en.png',
    filename: 'spark-plugin-animated-headline-minerva-english-wide.png', site: 'minervaedu.com',
    feature: 'Animated headline treatment', language: 'English', framing: 'wide',
    crop: { x: 0, y: 0, width: 1280, height: 720 }, highlights: [{ x: 430, y: 370, width: 420, height: 170 }],
  },
  {
    tool: 'Spark Plugin', slug: 'spark-plugin', source: 'spark/minerva-animated-headline-wide-en.png',
    filename: 'spark-plugin-animated-headline-minerva-english-close-up.png', site: 'minervaedu.com',
    feature: 'Animated headline treatment', language: 'English', framing: 'close-up',
    crop: { x: 330, y: 115, width: 620, height: 480 }, highlights: [{ x: 430, y: 370, width: 420, height: 170 }],
  },
  {
    tool: 'Ghost Plugins', slug: 'ghost-plugins', source: 'ghost/broodkast-video-gallery-wide-nl.png',
    filename: 'ghost-plugins-video-popup-trigger-broodkast-dutch-wide.png', site: 'broodkast.video',
    feature: 'Video gallery before opening the pop-up', language: 'Dutch', framing: 'wide',
    crop: { x: 0, y: 0, width: 1280, height: 720 }, highlights: [{ x: 35, y: 480, width: 1210, height: 235 }],
  },
  {
    tool: 'Ghost Plugins', slug: 'ghost-plugins', source: 'ghost/broodkast-video-popup-wide-nl.png',
    filename: 'ghost-plugins-video-popup-broodkast-dutch-wide.png', site: 'broodkast.video',
    feature: 'Opened video pop-up', language: 'Dutch', framing: 'wide',
    crop: { x: 0, y: 0, width: 1280, height: 720 }, highlights: [{ x: 60, y: 34, width: 1160, height: 655 }],
  },
  {
    tool: 'Ghost Plugins', slug: 'ghost-plugins', source: 'ghost/broodkast-video-popup-wide-nl.png',
    filename: 'ghost-plugins-video-popup-broodkast-dutch-close-up.png', site: 'broodkast.video',
    feature: 'Opened video pop-up', language: 'Dutch', framing: 'close-up',
    crop: { x: 60, y: 34, width: 1160, height: 655 }, highlights: [{ x: 63, y: 37, width: 1154, height: 648 }],
  },
  {
    tool: 'HubSpot', slug: 'hubspot', source: 'hubspot/epihunter-newsletter-form-wide-en.png',
    filename: 'hubspot-newsletter-form-epihunter-english-wide.png', site: 'epihunter.com',
    feature: 'Newsletter and lead-qualification form', language: 'English', framing: 'wide',
    crop: { x: 0, y: 0, width: 1280, height: 720 }, highlights: [{ x: 280, y: 58, width: 720, height: 540 }],
  },
  {
    tool: 'HubSpot', slug: 'hubspot', source: 'hubspot/epihunter-newsletter-form-wide-en.png',
    filename: 'hubspot-newsletter-form-epihunter-english-close-up.png', site: 'epihunter.com',
    feature: 'Newsletter and lead-qualification form', language: 'English', framing: 'close-up',
    crop: { x: 240, y: 35, width: 800, height: 580 }, highlights: [{ x: 280, y: 58, width: 720, height: 540 }],
  },
];

function escapeXml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
  })[character]);
}

function headerSvgFor(asset) {
  const title = `${asset.feature} on ${asset.site}`;
  const label = `${asset.tool} · ${asset.language} · ${asset.framing} · verified customer example`;
  const maximumTitleSize = asset.crop.width > 1000 ? 18 : 20;
  const titleFontSize = Math.max(14, Math.min(maximumTitleSize, Math.floor((asset.crop.width - 48) / (title.length * 0.72))));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${asset.crop.width}" height="${annotationHeight}" viewBox="0 0 ${asset.crop.width} ${annotationHeight}">
  <rect width="${asset.crop.width}" height="${annotationHeight}" fill="#111827"/>
  <rect y="${annotationHeight - 4}" width="${asset.crop.width}" height="4" fill="#38bdf8"/>
  <text x="24" y="27" fill="#7dd3fc" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="700" letter-spacing="1.2">${escapeXml(label.toUpperCase())}</text>
  <text x="24" y="60" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="${titleFontSize}" font-weight="700">${escapeXml(title)}</text>
</svg>\n`;
}

function cropPng(source, crop) {
  let normalised = normalisedSources.get(source);
  if (!normalised) {
    normalised = path.join(renderingDirectory, `${renderToken}-normalised-${path.basename(source)}`);
    execFileSync('/usr/bin/sips', ['-s', 'format', 'png', source, '--out', normalised], { stdio: 'ignore' });
    normalisedSources.set(source, normalised);
  }
  const input = PNG.sync.read(fs.readFileSync(normalised));
  if (crop.x < 0 || crop.y < 0 || crop.x + crop.width > input.width || crop.y + crop.height > input.height) {
    throw new Error(`Crop exceeds ${source}: ${JSON.stringify(crop)} for ${input.width}x${input.height}`);
  }
  const output = new PNG({ width: crop.width, height: crop.height });
  PNG.bitblt(input, output, crop.x, crop.y, crop.width, crop.height, 0, 0);
  return output;
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
  const right = Math.min(image.width - 1, box.x + box.width - crop.x - 1);
  const bottom = Math.min(image.height - 1, annotationHeight + box.y + box.height - crop.y - 1);
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

function renderHeader(svgPath, outputPath, width) {
  execFileSync('/usr/bin/qlmanage', ['-t', '-s', String(width), '-o', renderingDirectory, svgPath], { stdio: 'ignore' });
  const rendered = path.join(renderingDirectory, `${path.basename(svgPath)}.png`);
  if (rendered !== outputPath) fs.copyFileSync(rendered, outputPath);
}

for (const asset of assets) {
  const sourcePath = path.join(sourceRoot, asset.source);
  if (!fs.existsSync(sourcePath)) throw new Error(`Missing raw capture: ${sourcePath}`);
  const outputRoot = path.join(projectRoot, 'content/assets', asset.slug, 'customer-examples');
  const cleanDirectory = path.join(outputRoot, 'clean');
  const annotatedDirectory = path.join(outputRoot, 'annotated');
  fs.mkdirSync(cleanDirectory, { recursive: true });
  fs.mkdirSync(annotatedDirectory, { recursive: true });
  fs.mkdirSync(renderingDirectory, { recursive: true });

  const clean = cropPng(sourcePath, asset.crop);
  const cleanPath = path.join(cleanDirectory, asset.filename);
  fs.writeFileSync(cleanPath, PNG.sync.write(clean));

  const svgPath = path.join(renderingDirectory, `${renderToken}-${asset.slug}-${asset.filename}.svg`);
  const headerPath = `${svgPath}.png`;
  fs.writeFileSync(svgPath, headerSvgFor(asset));
  renderHeader(svgPath, headerPath, asset.crop.width);
  const header = PNG.sync.read(fs.readFileSync(headerPath));
  const annotated = new PNG({ width: clean.width, height: annotationHeight + clean.height });
  PNG.bitblt(header, annotated, 0, 0, header.width, annotationHeight, 0, 0);
  PNG.bitblt(clean, annotated, 0, 0, clean.width, clean.height, 0, annotationHeight);
  for (const highlight of asset.highlights) drawHighlight(annotated, highlight, asset.crop);
  fs.writeFileSync(path.join(annotatedDirectory, asset.filename), PNG.sync.write(annotated));
}

console.log(`Prepared ${assets.length * 2} clean and annotated SaaS article assets.`);
