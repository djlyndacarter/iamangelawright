// Netlify build step: put each article's preview photo (og:image) on its Press card.
// A photo committed as assets/press/<slug>.(jpg|png|webp) wins; otherwise it is
// downloaded at build time. Any failure just leaves that card without a photo.
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';

const PAGE = 'press.html';
const DIR = 'assets/press';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const get = (url, ms = 12000) =>
  fetch(url, { headers: { 'user-agent': UA, accept: '*/*' }, redirect: 'follow', signal: AbortSignal.timeout(ms) });

function metaImage(html, base) {
  for (const key of ['og:image:secure_url', 'og:image', 'twitter:image', 'twitter:image:src']) {
    const k = key.replace(/:/g, '\\:');
    const m = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${k}["'][^>]*content=["']([^"']+)["']`, 'i'))
      || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']${k}["']`, 'i'));
    if (m) return new URL(m[1].replace(/&amp;/g, '&'), base).href;
  }
  return null;
}

async function findImage(url) {
  try {
    const r = await get(url);
    if (r.ok) {
      const img = metaImage(await r.text(), r.url);
      if (img) return img;
    }
    console.log(`  page fetch gave ${r.status}`);
  } catch (e) { console.log(`  page fetch failed: ${e.message}`); }
  try {
    const r = await get(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
    const j = await r.json();
    if (j?.data?.image?.url) return j.data.image.url;
  } catch (e) { console.log(`  lookup failed: ${e.message}`); }
  return null;
}

async function download(src, slug) {
  const r = await get(src, 20000);
  const type = r.headers.get('content-type') || '';
  if (!r.ok || !type.startsWith('image/')) throw new Error(`${r.status} ${type}`);
  const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : type.includes('avif') ? 'avif' : 'jpg';
  await writeFile(`${DIR}/${slug}.${ext}`, Buffer.from(await r.arrayBuffer()));
  return `${slug}.${ext}`;
}

let html = await readFile(PAGE, 'utf8');
await mkdir(DIR, { recursive: true });
const have = new Set(await readdir(DIR));
const cards = [...html.matchAll(/<a class="aw-press-card[^"]*" href="([^"]+)"[^>]*><!--press-thumb:([a-z0-9-]+)-->/g)];

for (const [, rawUrl, slug] of cards) {
  const url = rawUrl.replace(/&amp;/g, '&');
  console.log(`press: ${slug}`);
  let file = [...have].find(f => f.startsWith(`${slug}.`));
  if (!file) {
    const src = await findImage(url);
    if (src) {
      try { file = await download(src, slug); } catch (e) { console.log(`  image download failed: ${e.message}`); }
    }
  }
  const tag = file ? `<img class="aw-press-img" src="/${DIR}/${file}" alt="" width="1280" height="720" loading="lazy">` : '';
  html = html.replace(`<!--press-thumb:${slug}-->`, tag);
  console.log(file ? `  photo: ${file}` : '  no photo');
}

await writeFile(PAGE, html);

// Home page tiles marked data-press-thumb="<slug>" reuse that article's Press photo.
const photos = new Set(await readdir(DIR));
let home = await readFile('index.html', 'utf8');
home = home.replace(/data-press-thumb="([a-z0-9-]+)" src="[^"]*"/g, (tag, slug) => {
  const file = [...photos].find(f => f.startsWith(`${slug}.`));
  console.log(`home tile: ${slug} ${file ? `uses ${file}` : 'keeps its fallback'}`);
  return file ? `src="/${DIR}/${file}"` : tag;
});
await writeFile('index.html', home);
