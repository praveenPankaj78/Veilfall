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
console.log(
  `Packaged ${Object.keys(files).length} files (${archiveSize.toLocaleString('en-US')} bytes): ${archivePath}`,
);
