import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(
  new URL('../itch/loader.js', import.meta.url),
  'utf8',
);
async function run({ protocol = 'http:', status = 200, stall = false } = {}) {
  const percentages = [];
  const elements = Object.fromEntries(
    ['boot-message', 'boot-progress', 'boot-percent', 'boot-retry'].map(
      (id) => [id, { hidden: true, textContent: '' }],
    ),
  );
  Object.defineProperty(elements['boot-progress'], 'value', {
    set(value) {
      percentages.push(value);
    },
  });
  let calls = 0;
  let timeout;
  let ready;
  const context = {
    location: { protocol },
    document: { getElementById: (id) => elements[id] },
    window: {
      veilfallDownloads: [{ url: './assets/game.js', bytes: 4, type: 'test' }],
      addEventListener: (_name, callback) => {
        ready = callback;
      },
    },
    AbortController,
    Blob,
    URL,
    setTimeout: (callback) => {
      timeout = callback;
      return 1;
    },
    clearTimeout() {},
    fetch: async () => {
      calls++;
      if (stall) return new Promise(() => {});
      let part = 0;
      return {
        ok: status === 200,
        status,
        body: {
          getReader: () => ({
            read: async () =>
              part++ < 2
                ? { value: new Uint8Array(2), done: false }
                : { done: true },
          }),
        },
      };
    },
  };
  vm.runInNewContext(source, context);
  await new Promise((resolve) => setImmediate(resolve));
  return {
    elements,
    percentages,
    calls,
    expire: () => timeout(),
    complete: () => ready(),
  };
}

const file = await run({ protocol: 'file:' });
assert.equal(
  file.calls,
  0,
  'Local-file loads must not attempt unsupported module downloads.',
);
const downloaded = await run();
assert.deepEqual(downloaded.percentages, [50, 100, 100]);
assert.match(downloaded.elements['boot-percent'].textContent, /starting game/);
downloaded.complete();
const failed = await run({ status: 404 });
assert.equal(failed.elements['boot-retry'].hidden, false);
assert.match(failed.elements['boot-message'].textContent, /could not load/);
const stalled = await run({ stall: true });
stalled.expire();
assert.equal(stalled.elements['boot-retry'].hidden, false);
assert.match(
  stalled.elements['boot-message'].textContent,
  /stopped responding/,
);
console.log(
  'Itch loader checks passed: real byte percentages, file guard, failed download, and stalled transfer recovery.',
);
