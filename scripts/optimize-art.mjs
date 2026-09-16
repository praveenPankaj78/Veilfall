import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDirectory = path.join(projectRoot, 'source', 'art');
const deliveryDirectory = path.join(projectRoot, 'public', 'art');

// Only distinct playable scene images ship. World maps remain in source/art.
const runtimeBasenames = new Set([
  'caelan-east-gate',
  'kings-road-ambush',
  'kings-road-folded',
  'bellweather-inn',
  'bellweather-other-nights',
  'bellweather-folded-cellar',
  'bellweather-road-pin',
  'harrowfen-wrong-mile',
  'harrowfen-shifting-market',
  'mileless-bridge-reveal',
  'mileless-bridge-chase',
  'mileless-three-spans',
  'nine-nails-revelation',
  'dragonspine-coldfire',
  'vaor-memory-grave',
  'ember-bearer-vision',
  'kharad-vey-wheel-city',
  'ancestor-storm-attack',
  'red-moot-ilyra',
  'red-wind-pursuit',
  'salt-basin-battle',
  'marshal-field-confrontation',
  'black-gate-fortress-ring',
  'futureless-fort-breach',
  'first-devil-embassy',
  'cinder-deep-embassy',
  'two-sided-assassination',
  'black-gate-crossing',
  'ash-road-first-offer',
  'ash-road-private-offers',
  'vathis-approach',
  'vathis-contract-streets',
  'vathis-invasion-auction',
  'vathis-engine-gate',
  'black-gate-two-faces',
  'black-gate-sealed',
  'black-gate-mutual-passage',
  'black-gate-broken',
  'caelan-living-gate',
]);

const variants = [
  { suffix: '', width: 1536, quality: 78 },
  { suffix: '-800', width: 800, quality: 76 },
];

const sourceFiles = (await readdir(sourceDirectory)).filter((name) =>
  /\.(?:png|webp|jpe?g)$/i.test(name),
);
const knownSources = new Set(sourceFiles.map((name) => path.parse(name).name));
for (const basename of runtimeBasenames) {
  if (!knownSources.has(basename)) {
    throw new Error(`Missing source artwork for ${basename}`);
  }
}

await mkdir(deliveryDirectory, { recursive: true });
await mkdir(path.join(projectRoot, 'work'), { recursive: true });
for (const existing of await readdir(deliveryDirectory)) {
  await rm(path.join(deliveryDirectory, existing), { force: true });
}

const manifest = [];
for (const filename of sourceFiles) {
  const basename = path.parse(filename).name;
  if (!runtimeBasenames.has(basename)) continue;
  const sourcePath = path.join(sourceDirectory, filename);
  const image = sharp(sourcePath).rotate();
  for (const variant of variants) {
    const buffer = await image
      .clone()
      .resize({ width: variant.width, withoutEnlargement: true })
      .webp({ quality: variant.quality, effort: 4 })
      .toBuffer();
    const deliveryName = `${basename}${variant.suffix}.webp`;
    await writeFile(path.join(deliveryDirectory, deliveryName), buffer);
    manifest.push({
      source: filename,
      delivery: deliveryName,
      width: variant.width,
      quality: variant.quality,
      bytes: buffer.length,
    });
  }
}

const totalBytes = manifest.reduce((sum, entry) => sum + entry.bytes, 0);
console.log(
  `Wrote ${manifest.length} delivery images (${totalBytes.toLocaleString('en-US')} bytes) from ${runtimeBasenames.size} source plates.`,
);
await writeFile(
  path.join(projectRoot, 'work', 'art-delivery-manifest.json'),
  `${JSON.stringify({ totalBytes, files: manifest }, null, 2)}\n`,
);
