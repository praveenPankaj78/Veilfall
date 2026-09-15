import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { unzipSync, zipSync } from 'fflate';

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
    }
  }

  return entries;
}

function requireEntry(entries, entryName) {
  if (!entries[entryName]) {
    throw new Error(`The itch build is missing ${entryName}.`);
  }
}

const files = await collectFiles(buildDirectory);

requireEntry(files, 'index.html');
requireEntry(files, 'favicon.svg');

if (!Object.keys(files).some((entry) => entry.startsWith('assets/'))) {
  throw new Error('The itch build has no top-level assets directory.');
}

if (!Object.keys(files).some((entry) => entry.startsWith('art/'))) {
  throw new Error('The itch build has no top-level art directory.');
}

const indexHtml = new TextDecoder().decode(files['index.html']);
if (/\b(?:href|src)=["']\/(?!\/)/i.test(indexHtml)) {
  throw new Error('index.html contains a root-absolute asset reference.');
}

await mkdir(outputDirectory, { recursive: true });
const archive = zipSync(files, { level: 6 });
await writeFile(archivePath, archive);

const extracted = unzipSync(archive);
for (const [entryName, contents] of Object.entries(files)) {
  const roundTrip = extracted[entryName];
  if (!roundTrip || roundTrip.length !== contents.length) {
    throw new Error(`ZIP round-trip validation failed for ${entryName}.`);
  }
}

const archiveSize = (await stat(archivePath)).size;
console.log(
  `Packaged ${Object.keys(files).length} files (${archiveSize.toLocaleString('en-US')} bytes): ${archivePath}`,
);
