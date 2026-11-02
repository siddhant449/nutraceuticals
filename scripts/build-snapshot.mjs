// Builds src/data/store.snapshot.json from raw captures in data/raw/.
// Refresh: open https://seoulceuticals.com in a browser (it sits behind a Cloudflare check),
// save /products.json?limit=250 to data/raw/products.json, then run `npm run snapshot`.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { normalizeProducts } from '../src/lib/snapshot.ts';

const root = new URL('../', import.meta.url);
const readJson = async (rel) => JSON.parse(await readFile(new URL(rel, root), 'utf8'));

const products = await readJson('data/raw/products.json');
const ratings = await readJson('data/raw/ratings.json');
const home = await readJson('data/raw/home.json');

const snapshot = normalizeProducts(products, ratings, home.capturedAt);
await mkdir(new URL('src/data/', root), { recursive: true });
await writeFile(new URL('src/data/store.snapshot.json', root), `${JSON.stringify(snapshot, null, 2)}\n`);

const rated = snapshot.products.filter((p) => p.rating).length;
console.log(`snapshot: ${snapshot.products.length} products (${rated} rated), captured ${snapshot.capturedAt}`);
