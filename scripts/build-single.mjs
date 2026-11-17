// Folds the `--mode single` build into one HTML file that opens with a double-click.
// Fonts, styles, scripts and every photo in public/img are embedded in the file.
//   npm run build:single   ->  VEXORA-demo.html

import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'demo-build');
let html = await readFile(join(dir, 'index.html'), 'utf8');

const attr = (tag, name) => new RegExp(`${name}="([^"]+)"`).exec(tag)?.[1];
const local = (p) => join(dir, p.replace(/^\.?\//, ''));

for (const tag of html.match(/<link[^>]+rel="stylesheet"[^>]*>/g) ?? []) {
  const css = await readFile(local(attr(tag, 'href')), 'utf8');
  html = html.replace(tag, () => `<style>${css}</style>`);
}

// Photos: embedded as data URIs and handed to the app on a global.
const imgDir = join(root, 'public/img');
const photos = {};
for (const file of (await readdir(imgDir).catch(() => [])).filter((f) => f.endsWith('.jpg'))) {
  photos[file.replace(/\.jpg$/, '')] = `data:image/jpeg;base64,${(await readFile(join(imgDir, file))).toString('base64')}`;
}
const photoScript = `<script>window.__VEXORA_IMAGES__=${JSON.stringify(photos)}</script>`;

for (const tag of html.match(/<script[^>]+src="[^"]+"[^>]*><\/script>/g) ?? []) {
  const js = (await readFile(local(attr(tag, 'src')), 'utf8')).replace(/<\/script/g, '<\\/script');
  html = html.replace(tag, () => `${photoScript}<script type="module">${js}</script>`);
}

for (const tag of html.match(/<link[^>]+rel="icon"[^>]*>/g) ?? []) {
  const svg = await readFile(local(attr(tag, 'href')), 'utf8');
  const uri = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  html = html.replace(tag, () => `<link rel="icon" type="image/svg+xml" href="${uri}" />`);
}

html = html.replace(/<link[^>]+rel="(modulepreload|preconnect)"[^>]*>\s*/g, '');

const out = join(root, 'VEXORA-demo.html');
await writeFile(out, html);
await rm(dir, { recursive: true, force: true });
console.log(
  `Wrote ${out} (${(Buffer.byteLength(html) / 1024 / 1024).toFixed(1)} MB, ${Object.keys(photos).length} photos embedded)`,
);
