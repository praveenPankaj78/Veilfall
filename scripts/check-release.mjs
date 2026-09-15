import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadStory } from './story-loader.mjs';

const story = loadStory();
const game = story.game;
const saves = story.load('app/save-system.ts');
const pageSource = readFileSync('app/page.tsx', 'utf8');

class MemoryStorage {
  constructor(entries = {}) {
    this.values = new Map(Object.entries(entries));
    this.reads = 0;
    this.writes = 0;
  }

  getItem(key) {
    this.reads += 1;
    return this.values.get(key) ?? null;
  }

  setItem(key, value) {
    this.writes += 1;
    this.values.set(key, String(value));
  }

  removeItem(key) {
    this.values.delete(key);
  }
}

function expectFailure(result, pattern) {
  assert.equal(result.ok, false);
  assert.match(result.error, pattern);
}

const roman = game.chapterDefinitions.map((chapter) => chapter.roman);
assert.equal(roman.join(','), 'I,II,III,IV,V,VI,VII,VIII,IX,X,XI,XII');
for (const chapter of game.chapterDefinitions)
  assert.ok(
    game.nodes[chapter.entryNode],
    `Missing Chapter ${chapter.roman} entry node`,
  );

const checkpointTwo = saves.normaliseGameState({
  ...game.initialState,
  nodeId: 'c2-arrival',
  chapter: 2,
  chapterChoices: 0,
  completedChapters: [1],
  history: ['You continue to Bellweather Inn with every earlier consequence.'],
});
const checkpointTwelve = saves.normaliseGameState({
  ...checkpointTwo,
  nodeId: 'c12-inner-gate',
  chapter: 12,
  chapterChoices: 0,
  completedChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  history: [
    ...checkpointTwo.history,
    'You reach the inner Black Gate with every surviving consequence.',
  ],
});
const terminalGame = saves.normaliseGameState({
  ...checkpointTwelve,
  nodeId: 'c12-ending-sealed',
  chapterChoices: 16,
  completedChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  relationships: {
    ...checkpointTwelve.relationships,
    mara: {
      ...checkpointTwelve.relationships.mara,
      intent: 'committed',
    },
  },
  contentPreference: { intimacy: 'detailed', adultConfirmed: true },
  flags: [...checkpointTwelve.flags, 'c12-series-complete'],
  history: [
    ...checkpointTwelve.history,
    'The Ember Oath reaches its terminal ending.',
  ],
});
const document = saves.createStoredSave(
  terminalGame,
  { 2: checkpointTwo, 12: checkpointTwelve },
  'extra-large',
);
const portable = saves.createPortableSave(document, '2026-09-15T00:00:00.000Z');
const portableText = JSON.stringify(portable);
const parsed = saves.parsePortableSave(
  portableText,
  Buffer.byteLength(portableText),
);
assert.equal(parsed.ok, true);
assert.equal(
  JSON.stringify(parsed.document.game),
  JSON.stringify(terminalGame),
);
assert.equal(
  JSON.stringify(parsed.document.checkpoints),
  JSON.stringify(document.checkpoints),
);
assert.equal(parsed.document.readingPreference, 'extra-large');
assert.equal(parsed.document.game.relationships.mara.intent, 'committed');
assert.equal(parsed.document.game.contentPreference.intimacy, 'detailed');
assert.equal(parsed.summary.endingRecorded, true);
assert.equal(parsed.summary.checkpointCount, 2);

const migratedPortable = saves.parsePortableSave(
  JSON.stringify({ ...portable, saveSchemaVersion: 16 }),
);
assert.equal(migratedPortable.ok, true);

// Description controls are retired, but old v16/v17 save fields still round-trip.
// A relationship alone is not consent: only the explicit scene choice adds its flag.
assert.doesNotMatch(
  pageSource,
  /intimacyControls|adultConfirmed|Detailed requires|Fade skips/,
);
assert.ok(
  Object.values(game.nodes).every((node) => !('intimacyControls' in node)),
);
const romanceScenes = [
  {
    person: 'vexa',
    intent: 'interested',
    chapter: 9,
    nodeId: 'c9-private-choice',
    choiceId: 'c9-share-private-night',
    resultNode: 'c9-recover-fragment',
    passage: /unfasten each other’s armor/i,
    flags: ['c9-attacks-stopped', 'c9-vexa-attraction-acknowledged'],
    alternatives: ['c9-talk-with-vexa-only', 'c9-leave-vexa-private'],
  },
  ...['mara', 'lysara'].map((person) => ({
    person,
    intent: 'committed',
    chapter: 10,
    nodeId: 'c10-rest-choice',
    choiceId: `c10-rest-with-${person}`,
    resultNode: 'c10-guide-bargain',
    passage:
      person === 'mara'
        ? /unfasten travel leathers/i
        : /undress each other slowly/i,
    flags: [
      `c9-${person}-crossed-black-gate`,
      'c10-limits-respected',
      'c10-road-danger-ended',
    ],
    alternatives: ['c10-rest-apart'],
  })),
];
for (const scene of romanceScenes) {
  const state = saves.normaliseGameState({
    ...game.initialState,
    chapter: scene.chapter,
    nodeId: scene.nodeId,
    completedChapters: Array.from(
      { length: scene.chapter - 1 },
      (_, i) => i + 1,
    ),
    flags: scene.flags,
    relationships: {
      ...game.initialState.relationships,
      [scene.person]: {
        ...game.initialState.relationships[scene.person],
        intent: scene.intent,
      },
    },
  });
  const node = game.nodes[scene.nodeId];
  const choice = node.choices.find(
    (candidate) => candidate.id === scene.choiceId,
  );
  assert.ok(
    game.canChoose(choice, state),
    `${scene.person}: intimacy remains available`,
  );
  const resultBody = (s) => game.nodes[scene.resultNode].body(s).join('\n');
  assert.doesNotMatch(
    resultBody(state),
    scene.passage,
    'Relationship alone must not start intimacy',
  );
  for (const alternativeId of scene.alternatives) {
    const alternative = node.choices.find(
      (candidate) => candidate.id === alternativeId,
    );
    assert.ok(
      game.canChoose(alternative, state),
      `${alternativeId} remains available`,
    );
    assert.doesNotMatch(
      resultBody({
        ...state,
        flags: [...state.flags, ...alternative.addFlags],
      }),
      scene.passage,
    );
  }
  const withoutInterest = {
    ...state,
    relationships: {
      ...state.relationships,
      [scene.person]: {
        ...state.relationships[scene.person],
        intent: 'platonic',
      },
    },
  };
  assert.equal(game.canChoose(choice, withoutInterest), false);
  for (const requiredFlag of choice.requiresFlags ??
    choice.showIfAllFlags ??
    [])
    assert.equal(
      game.canChoose(choice, {
        ...state,
        flags: state.flags.filter((flag) => flag !== requiredFlag),
      }),
      false,
    );
  if (scene.person === 'vexa') {
    for (const person of ['mara', 'lysara', 'ilyra'])
      for (const intent of ['committed', 'exploring'])
        assert.equal(
          game.canChoose(choice, {
            ...state,
            relationships: {
              ...state.relationships,
              [person]: { ...state.relationships[person], intent },
            },
          }),
          false,
          `Vexa must respect ${person}'s ${intent} boundary`,
        );
  }
  let expectedBody;
  for (const intimacy of ['fade', 'detailed'])
    for (const adultConfirmed of [false, true])
      for (const saveSchemaVersion of [16, 17]) {
        const accepted = {
          ...state,
          nodeId: scene.resultNode,
          flags: [...state.flags, ...choice.addFlags],
          contentPreference: { intimacy, adultConfirmed },
        };
        const exported = saves.createPortableSave(
          saves.createStoredSave(accepted, {}, 'default'),
        );
        const imported = saves.parsePortableSave(
          JSON.stringify({ ...exported, saveSchemaVersion }),
        );
        assert.equal(imported.ok, true, imported.error);
        assert.equal(
          imported.document.game.contentPreference.intimacy,
          intimacy,
        );
        assert.equal(
          imported.document.game.contentPreference.adultConfirmed,
          adultConfirmed,
        );
        const body = resultBody(imported.document.game);
        assert.match(body, scene.passage);
        expectedBody ??= body;
        assert.equal(
          body,
          expectedBody,
          `${scene.person}: legacy fields must not alter the authored passage`,
        );
      }
}

expectFailure(saves.parsePortableSave('{broken', 7), /not valid JSON/i);
expectFailure(
  saves.parsePortableSave(portableText, saves.MAX_IMPORT_BYTES + 1),
  /too large/i,
);
expectFailure(
  saves.parsePortableSave(JSON.stringify({ ...portable, exportVersion: 99 })),
  /export version is not supported/i,
);
expectFailure(
  saves.parsePortableSave(
    JSON.stringify({ ...portable, saveSchemaVersion: 99 }),
  ),
  /unsupported game version/i,
);
expectFailure(
  saves.parsePortableSave(
    JSON.stringify({
      ...portable,
      game: { ...terminalGame, nodeId: 'missing-node' },
    }),
  ),
  /unknown story node/i,
);
expectFailure(
  saves.parsePortableSave(
    JSON.stringify({
      ...portable,
      game: {
        ...terminalGame,
        stats: { ...terminalGame.stats, health: 'many' },
      },
    }),
  ),
  /invalid health value/i,
);
expectFailure(
  saves.parsePortableSave(
    JSON.stringify({
      ...portable,
      game: {
        ...terminalGame,
        relationships: {
          ...terminalGame.relationships,
          mara: { ...terminalGame.relationships.mara, intent: 'secret' },
        },
      },
    }),
  ),
  /invalid mara intent/i,
);
expectFailure(
  saves.parsePortableSave(
    JSON.stringify({
      ...portable,
      checkpoints: {
        12: { ...checkpointTwelve, nodeId: 'c12-door-order' },
      },
    }),
  ),
  /not a clean start/i,
);

const cancellationStorage = new MemoryStorage();
const cancellable = saves.parsePortableSave(
  portableText,
  Buffer.byteLength(portableText),
);
assert.equal(cancellable.ok, true);
assert.equal(
  cancellationStorage.writes,
  0,
  'Validation alone must not replace a save',
);
assert.match(pageSource, /Keep current progress/);
assert.match(pageSource, /A recoverable backup of your current progress/);

const stored = new MemoryStorage();
assert.equal(saves.writeStoredSave(stored, document).ok, true);
assert.equal(saves.readStoredSave(stored).ok, true);

const readFailure = saves.readStoredSave({
  getItem() {
    throw new Error('blocked');
  },
  setItem() {},
  removeItem() {},
});
expectFailure(readFailure, /storage is unavailable/i);
const writeFailure = saves.writeStoredSave(
  {
    getItem() {
      return null;
    },
    setItem() {
      throw new Error('quota');
    },
    removeItem() {},
  },
  document,
);
expectFailure(writeFailure, /could not write/i);

const originalDocument = saves.createStoredSave(
  game.initialState,
  {},
  'default',
);
const originalRaw = JSON.stringify(originalDocument);
const failedBackupStorage = new MemoryStorage({
  [saves.CURRENT_SAVE_KEY]: originalRaw,
});
failedBackupStorage.setItem = () => {
  throw new Error('quota');
};
expectFailure(
  saves.replaceStoredSave(failedBackupStorage, document, originalDocument),
  /backup.*cancelled/i,
);
assert.equal(
  failedBackupStorage.values.get(saves.CURRENT_SAVE_KEY),
  originalRaw,
);

const failedReplacementStorage = new MemoryStorage({
  [saves.CURRENT_SAVE_KEY]: originalRaw,
});
failedReplacementStorage.setItem = function setItem(key, value) {
  this.writes += 1;
  if (key === saves.CURRENT_SAVE_KEY) throw new Error('quota');
  this.values.set(key, String(value));
};
expectFailure(
  saves.replaceStoredSave(failedReplacementStorage, document, originalDocument),
  /existing save remains active/i,
);
assert.equal(
  failedReplacementStorage.values.get(saves.CURRENT_SAVE_KEY),
  originalRaw,
);
assert.equal(
  failedReplacementStorage.values.get(saves.BACKUP_SAVE_KEY),
  originalRaw,
);

const replacedStorage = new MemoryStorage({
  [saves.CURRENT_SAVE_KEY]: originalRaw,
});
assert.equal(
  saves.replaceStoredSave(replacedStorage, document, originalDocument).ok,
  true,
);
assert.equal(replacedStorage.values.get(saves.BACKUP_SAVE_KEY), originalRaw);
assert.equal(
  saves.readBackupSave(replacedStorage).document.game.nodeId,
  game.initialState.nodeId,
);

const damagedRaw = '{not-json';
const damagedStorage = new MemoryStorage({
  [saves.CURRENT_SAVE_KEY]: damagedRaw,
});
const damagedResult = saves.readStoredSave(damagedStorage);
expectFailure(damagedResult, /damaged/i);
assert.equal(damagedResult.damagedRaw, damagedRaw);
assert.equal(damagedStorage.values.get(saves.CURRENT_SAVE_KEY), damagedRaw);

const legacyRelationships = Object.fromEntries(
  Object.entries(game.initialState.relationships).map(([person, score]) => {
    const { intent: _intent, ...legacyScore } = score;
    return [person, legacyScore];
  }),
);
const legacyStats = { ...game.initialState.stats, stamina: 5 };
delete legacyStats.health;
const legacyStorage = new MemoryStorage({
  'veilfall.saga.v16.save': JSON.stringify({
    ...game.initialState,
    nodeId: 'c10-ash-road',
    chapter: 10,
    chapterChoices: 0,
    completedChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    stats: legacyStats,
    relationships: legacyRelationships,
    flags: ['c5-admitted-future-with-mara'],
  }),
});
const legacyResult = saves.readStoredSave(legacyStorage);
assert.equal(legacyResult.ok, true);
assert.equal(legacyResult.migrated, true);
assert.equal(legacyResult.document.game.stats.health, 5);
assert.equal(legacyResult.document.game.relationships.mara.intent, 'committed');
assert.ok(
  legacyResult.document.game.flags.some((flag) => flag.startsWith('c9-')),
);

const readingStorage = new MemoryStorage();
assert.equal(saves.readReadingPreference(readingStorage), 'default');
assert.equal(saves.writeReadingPreference(readingStorage, 'large').ok, true);
assert.equal(saves.readReadingPreference(readingStorage), 'large');
expectFailure(
  saves.writeReadingPreference(
    {
      getItem() {
        return null;
      },
      setItem() {
        throw new Error('blocked');
      },
      removeItem() {},
    },
    'extra-large',
  ),
  /could not save the reading preference/i,
);

const chapterTwelveEndings = Object.values(game.nodes).filter(
  (node) => node.id.startsWith('c12-') && node.final,
);
assert.equal(chapterTwelveEndings.length, 4);
for (const ending of chapterTwelveEndings)
  assert.equal(
    ending.choices.length,
    0,
    `${ending.id} has a dead continuation control`,
  );
assert.match(pageSource, /Caelan’s complete adventure has ended/);
assert.doesNotMatch(
  pageSource,
  /Continue to Rook|startRook|nextChapter:\s*['"]rook/i,
);

console.log(
  'Release regressions passed: XII labels; save round trip; checkpoint replay data; invalid, oversized, unsupported, and cancelled imports; storage failures and backup recovery; legacy migration; terminal endings; reading persistence; single-version romance, consent boundaries, and legacy content-field compatibility.',
);
