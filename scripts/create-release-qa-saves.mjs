import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { loadStory } from './story-loader.mjs';
import { checkSeriesReview } from './series-review.mjs';

// Real continuous route states from the same transition harness as check:game.
// Import these only into an isolated QA origin, never a player's browser save.
const story = loadStory();
const saves = story.load('app/save-system.ts');
const memory = story.load('app/story-memory.ts');
const transition = story.load('app/game-transition.ts');
const promiseRecords = story.load('app/promise-records.ts');
const wanted = new Set([
  'c5-north-road',
  'c5-memory-wall',
  'c6-steppe-road',
  'c8-gate-ring',
  'c10-ash-road',
  'c11-vathis-gate',
  'c12-inner-gate',
  'c12-four-laws',
]);
const directory = 'work/release-qa-saves';
await mkdir(directory, { recursive: true });
const failures = [];
await checkSeriesReview(
  story.game,
  memory,
  await readFile('app/page.tsx', 'utf8'),
  failures,
  saves,
  async (game, checkpoints) => {
    if (
      !wanted.has(game.nodeId) &&
      !(game.chapter === 12 && story.game.nodes[game.nodeId].final)
    )
      return;
    const data = saves.createPortableSave(
      saves.createStoredSave(game, checkpoints, 'default'),
    );
    const text = JSON.stringify(data, null, 2);
    const validated = saves.parsePortableSave(text);
    if (!validated.ok) throw new Error(validated.error);
    await writeFile(`${directory}/${game.nodeId}.json`, text);
    console.log(
      `Validated QA save: ${game.nodeId}, ${game.history.length} actual decisions`,
    );
  },
  transition,
  promiseRecords,
);
if (failures.length) throw new Error(failures.join('\n'));
