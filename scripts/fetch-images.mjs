// Replaces the bundled demo photos in public/img with the product-matched
// photos listed in src/data/images.json (Unsplash and Pexels).
//
//   npm run images
//
// Needs an internet connection. Check each photo afterwards, then rebuild.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const images = JSON.parse(await readFile(join(root, 'src/data/images.json'), 'utf8'));
const outDir = join(root, 'public/img');
await mkdir(outDir, { recursive: true });

const sized = (url) =>
  url.includes('images.pexels.com')
    ? `${url}?auto=compress&cs=tinysrgb&w=1600`
    : `${url}?auto=format&fit=max&fm=jpg&q=80&w=1600`;

let ok = 0;
const failed = [];

for (const [key, entry] of Object.entries(images)) {
  let saved = false;
  for (const url of [entry.url, entry.backup].filter(Boolean)) {
    try {
      const res = await fetch(sized(url));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await writeFile(join(outDir, `${key}.jpg`), Buffer.from(await res.arrayBuffer()));
      console.log(`saved  ${key}.jpg`);
      saved = true;
      ok += 1;
      break;
    } catch (err) {
      console.warn(`retry  ${key}: ${err.message}`);
    }
  }
  if (!saved) failed.push(key);
}

console.log(`\n${ok} of ${Object.keys(images).length} photos saved to public/img`);
if (failed.length > 0) {
  console.log(`Could not download: ${failed.join(', ')}. These keep their current demo photo.`);
}
console.log('Next: look through public/img, then run npm run build.');
