import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { unzipSync } from 'fflate';
import { validateItchPackage } from './itch-package-policy.mjs';

const bytes = (text) => new TextEncoder().encode(text);
const valid = {
  'index.html': bytes('<html><body>Game</body></html>'),
  'favicon.svg': bytes('<svg/>'),
  'assets/index-12345678.js': bytes('console.log("game");'),
  'assets/index-12345678.css': bytes('body{color:white}'),
  'art/cover.webp': new Uint8Array([1]),
};
assert.equal(validateItchPackage(valid).fileCount, 5);
let rejected = 0;
for (const name of [
  'app/page.tsx',
  'app/game-data.ts',
  'assets/index-12345678.js.map',
  'art/notes.md',
  '.env',
  '.git/config',
  '.openai/hosting.json',
  'node_modules/react/index.js',
  'package.json',
  'scripts/package-itch.mjs',
  'assets/source.js',
  '../outside.png',
  'art/../secret.png',
  'art/.env',
  'art/cover.png.txt',
  'art\\cover.png',
]) {
  assert.throws(
    () => validateItchPackage({ ...valid, [name]: bytes('test') }),
    /Unexpected file/,
  );
  rejected++;
}
for (const payload of [
  '{"scripts":{"package:itch":"internal build command"}}',
  '//# sourceMappingURL=game.js.map',
  '/*# sourceMappingURL=data:application/json;base64,e30= */',
  '//# sourceURL=app/page.tsx',
  '{"sourcesContent":["private source"]}',
  'import "/@vite/client"',
  'import "@react-refresh"',
  'C:\\Users\\someone\\Projects\\game',
  '/Users/someone/game',
  '/home/someone/game',
  '-----BEGIN PRIVATE KEY-----',
]) {
  assert.throws(
    () =>
      validateItchPackage({
        ...valid,
        'assets/index-12345678.js': bytes(payload),
      }),
    /Rejected/,
  );
  rejected++;
}
for (const name of Object.keys(valid)) {
  const incomplete = { ...valid };
  delete incomplete[name];
  assert.throws(
    () => validateItchPackage(incomplete),
    /missing|no compiled|no artwork/,
  );
  rejected++;
}
assert.throws(
  () =>
    validateItchPackage({
      ...valid,
      'index.html': bytes('<script src="/assets/game.js"></script>'),
    }),
  /root-absolute/,
);
rejected++;
const archivePath = process.argv[2] ?? 'outputs/veilfall-ember-oath-beta.zip';
const archive = await readFile(archivePath);
const result = validateItchPackage(unzipSync(archive));
const runtimeFiles = unzipSync(archive);
const gameScript = Object.entries(runtimeFiles)
  .filter(([name]) => name.endsWith('.js'))
  .map(([, data]) => new TextDecoder().decode(data))
  .join('\n');
assert.ok(
  !gameScript.includes('Expected advantage'),
  'Itch must omit the developer advantage label, not merely hide it with CSS',
);
console.log(
  `Passed ${rejected} rejection regressions and valid-package control.`,
);
console.log(
  `Audited ${result.fileCount} runtime files in ${archivePath} (${archive.length} bytes). No repository source or source maps permitted.`,
);
