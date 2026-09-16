import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { unzipSync, zipSync } from 'fflate';
import { validateItchPackage } from './itch-package-policy.mjs';

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const buildDirectory = path.join(projectRoot, 'work', 'itch-build');
const outputDirectory = path.join(projectRoot, 'outputs');
const archivePath = path.join(outputDirectory, 'veilfall-ember-oath-beta.zip');

async function collectFiles(directory, relativeDirectory = '') {
  const entries = {};
  const children = await readdir(directory, { withFileTypes: true });

  for (const child of children) {
    const relativePath = path.posix.join(relativeDirectory, child.name);
    const absolutePath = path.join(directory, child.name);

    if (child.isDirectory()) {
      Object.assign(entries, await collectFiles(absolutePath, relativePath));
    } else if (child.isFile()) {
      entries[relativePath] = new Uint8Array(await readFile(absolutePath));
    } else {
      throw new Error(`Unsupported entry in itch build: ${relativePath}`);
    }
  }

  return entries;
}

const files = await collectFiles(buildDirectory);
validateItchPackage(files);

await mkdir(outputDirectory, { recursive: true });
const archive = zipSync(files, { level: 6 });
const extracted = unzipSync(archive);
validateItchPackage(extracted);
for (const [entryName, contents] of Object.entries(files)) {
  const roundTrip = extracted[entryName];
  if (!roundTrip || !Buffer.from(roundTrip).equals(Buffer.from(contents))) {
    throw new Error(`ZIP round-trip validation failed for ${entryName}.`);
  }
}
await writeFile(archivePath, archive);

const archiveSize = (await stat(archivePath)).size;
const html = files['index.html'];
const jsEntry = Object.keys(files).find((name) =>
  /^assets\/index-[\w-]+\.js$/.test(name),
);
const cssEntry = Object.keys(files).find((name) =>
  /^assets\/index-[\w-]+\.css$/.test(name),
);
const cover = files['art/caelan-east-gate.webp'];
const cover800 = files['art/caelan-east-gate-800.webp'];
const favicon = files['favicon.svg'];
const coldEntry = {
  encoding: 'identity',
  note: 'Local itch preview serves these bytes uncompressed. itch.io hosted gzip was not measured in this package step.',
  requests: [
    { path: 'index.html', rawBytes: html?.byteLength ?? 0 },
    { path: jsEntry ?? 'assets/index.js', rawBytes: jsEntry ? files[jsEntry].byteLength : 0 },
    { path: cssEntry ?? 'assets/index.css', rawBytes: cssEntry ? files[cssEntry].byteLength : 0 },
    { path: 'art/caelan-east-gate.webp', rawBytes: cover?.byteLength ?? 0 },
    { path: 'favicon.svg', rawBytes: favicon?.byteLength ?? 0 },
  ],
  cover800: {
    path: 'art/caelan-east-gate-800.webp',
    rawBytes: cover800?.byteLength ?? 0,
  },
  zip: { path: 'outputs/veilfall-ember-oath-beta.zip', rawBytes: archiveSize },
};
coldEntry.desktopRawTotal = coldEntry.requests.reduce(
  (sum, request) => sum + request.rawBytes,
  0,
);
coldEntry.mobile800RawTotal =
  coldEntry.desktopRawTotal -
  (cover?.byteLength ?? 0) +
  (cover800?.byteLength ?? 0);
await writeFile(
  path.join(outputDirectory, 'cold-entry-manifest.json'),
  `${JSON.stringify(coldEntry, null, 2)}\n`,
);

console.log(
  `Packaged ${Object.keys(files).length} files (${archiveSize.toLocaleString('en-US')} bytes): ${archivePath}`,
);
console.log(
  `Cold-entry raw totals: desktop ${coldEntry.desktopRawTotal} bytes, 800w ${coldEntry.mobile800RawTotal} bytes.`,
);
