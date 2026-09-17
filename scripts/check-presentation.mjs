import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadStory } from './story-loader.mjs';

const story = loadStory();
const {
  canChoose,
  isChoiceVisible,
  initialState,
  nodes,
  relationshipChangeNotes,
  resolveNext,
} = story.game;
const transition = story.load('app/game-transition.ts');
const save = story.load('app/save-system.ts');
const art = story.load('app/expanded-art.ts');
const { applyPlayerChoice, cloneGameState, previewRelationshipChanges } =
  transition;
const {
  additionalArtwork,
  artworkForScene,
  romanceArtworkForScene,
  sceneArtOverrides,
  scrollLandingAfterTransition,
  visibleArtworkForState,
  ILYRA_KISS_RESULT,
} = art;

function highStats(state, flags = state.flags) {
  return {
    ...cloneGameState(state),
    flags: [...flags],
    stats: {
      health: 8,
      resolve: 8,
      command: 6,
      oathfire: 4,
      medicine: 2,
    },
  };
}

function choose(state, choiceId) {
  const choice = nodes[state.nodeId].choices.find((item) => item.id === choiceId);
  assert.ok(choice, `Missing choice ${choiceId} at ${state.nodeId}`);
  assert.ok(
    isChoiceVisible(choice, state) && canChoose(choice, state),
    `${choiceId} is not available at ${state.nodeId}`,
  );
  return applyPlayerChoice(state, choice);
}

function labelsFor(state, choiceId) {
  const choice = nodes[state.nodeId].choices.find((item) => item.id === choiceId);
  const preview = previewRelationshipChanges(state, choice);
  assert.equal(preview.inputUnchanged, true, `${choiceId} mutated preview input`);
  assert.deepEqual(
    preview.after,
    applyPlayerChoice(cloneGameState(state), choice).relationships,
    `${choiceId} preview does not match applyPlayerChoice`,
  );
  return preview.groups.map((group) => group.label).join(' | ');
}

function freeze(value) {
  return JSON.stringify(value);
}

// 1. Relationship previews vs actual transitions
const road = { ...cloneGameState(initialState), nodeId: 'road-conversation' };
const protect = nodes['road-conversation'].choices.find(
  (choice) => choice.id === 'protect-lysara-secret',
);
assert.match(labelsFor(road, 'protect-lysara-secret'), /Lysara: trust \+1, respect \+1/);
assert.match(labelsFor(road, 'tell-brann-seed'), /Lysara: friction \+1 \(more tension\)/);
assert.doesNotMatch(labelsFor(road, 'tell-brann-seed'), /trust -1/);
assert.equal(relationshipChangeNotes(protect, road.relationships).join(' | '), labelsFor(road, 'protect-lysara-secret'));
assert.doesNotMatch(labelsFor(road, 'protect-lysara-secret'), /attraction|interest acknowledged/);

const lysaraTrusted = {
  ...cloneGameState(road),
  relationships: {
    ...road.relationships,
    lysara: { ...road.relationships.lysara, trust: 2 },
  },
};
assert.match(
  labelsFor(lysaraTrusted, 'tell-brann-seed'),
  /Lysara: trust -1, friction \+1 \(more tension\)/,
);

const maraFlirt = { ...cloneGameState(initialState), nodeId: 'mara-returns' };
assert.match(labelsFor(maraFlirt, 'flirt-mara'), /Mara: attraction \+1, interest acknowledged/);
assert.match(labelsFor(maraFlirt, 'ask-marker'), /Mara: trust \+1/);
assert.doesNotMatch(labelsFor(maraFlirt, 'ask-marker'), /attraction|interest acknowledged/);
assert.match(labelsFor(maraFlirt, 'admit-unease'), /Mara: trust \+1, attraction \+1/);
assert.doesNotMatch(labelsFor(maraFlirt, 'admit-unease'), /interest acknowledged|commitment chosen/);

const watchTrees = nodes['road-conversation'].choices.find(
  (choice) => choice.id === 'watch-tree-line',
);
assert.equal(labelsFor(road, 'watch-tree-line'), '');
assert.equal(
  JSON.stringify(relationshipChangeNotes(watchTrees, road.relationships)),
  '[]',
);

const alreadyZero = {
  ...cloneGameState(initialState),
  nodeId: 'road-conversation',
  relationships: {
    ...initialState.relationships,
    lysara: { ...initialState.relationships.lysara, trust: 0, friction: 0 },
  },
};
assert.doesNotMatch(labelsFor(alreadyZero, 'tell-brann-seed'), /trust -1/);
assert.match(labelsFor(alreadyZero, 'tell-brann-seed'), /friction \+1 \(more tension\)/);

const exploringMara = {
  ...cloneGameState(initialState),
  nodeId: 'c5-mara-burns',
  relationships: {
    ...initialState.relationships,
    mara: {
      ...initialState.relationships.mara,
      trust: 4,
      attraction: 3,
      intent: 'exploring',
    },
  },
};
assert.match(
  labelsFor(exploringMara, 'c5-admit-future-with-mara'),
  /Mara: trust \+2, attraction \+1, commitment chosen/,
);

const dualBond = {
  ...cloneGameState(initialState),
  nodeId: 'c12-relationship-ending',
  chapter: 12,
  flags: ['c9-mara-crossed-black-gate'],
  relationships: {
    ...initialState.relationships,
    mara: {
      ...initialState.relationships.mara,
      intent: 'exploring',
      trust: 5,
    },
    lysara: {
      ...initialState.relationships.lysara,
      intent: 'committed',
      trust: 5,
    },
  },
};
const dualNotes = labelsFor(dualBond, 'c12-continue-with-mara');
assert.match(dualNotes, /Mara: trust \+1, respect \+1, commitment chosen/);
assert.match(
  dualNotes,
  /Lysara: trust -1, friction \+2 \(more tension\), romance ended/,
);

const finaleBase = {
  ...cloneGameState(initialState),
  nodeId: 'c12-relationship-ending',
  chapter: 12,
  relationships: {
    ...initialState.relationships,
    mara: { ...initialState.relationships.mara, intent: 'committed', trust: 6 },
    lysara: {
      ...initialState.relationships.lysara,
      intent: 'interested',
      trust: 3,
    },
    ilyra: {
      ...initialState.relationships.ilyra,
      intent: 'exploring',
      trust: 2,
    },
    vexa: { ...initialState.relationships.vexa, intent: 'unresolved', trust: 1 },
  },
};
assert.match(
  labelsFor(finaleBase, 'c12-choose-enduring-friendship'),
  /Mara: friendship chosen/,
);
assert.match(
  labelsFor(finaleBase, 'c12-choose-enduring-friendship'),
  /Lysara: friendship chosen/,
);
assert.match(
  labelsFor(finaleBase, 'c12-choose-enduring-friendship'),
  /Ilyra: friendship chosen/,
);
assert.doesNotMatch(
  labelsFor(finaleBase, 'c12-choose-enduring-friendship'),
  /Vexa: friendship chosen/,
);
assert.match(labelsFor(finaleBase, 'c12-close-relationship-honestly'), /romance ended/);
assert.match(
  labelsFor(finaleBase, 'c12-choose-fulfilled-single-life'),
  /romance ended/,
);
assert.doesNotMatch(
  labelsFor(finaleBase, 'c12-choose-honest-distance'),
  /commitment chosen|friendship chosen|romance ended/,
);

const beforePreview = freeze(finaleBase);
previewRelationshipChanges(
  finaleBase,
  nodes['c12-relationship-ending'].choices.find(
    (choice) => choice.id === 'c12-choose-enduring-friendship',
  ),
);
assert.equal(freeze(finaleBase), beforePreview);

// 2. Independent artwork assignments and legitimate returns
assert.equal(artworkForScene(nodes['c2-threshold']).src, '/art/bellweather-inn.webp');
assert.equal(artworkForScene(nodes['c2-triage']).src, '/art/bellweather-infirmary.webp');
assert.equal(artworkForScene(nodes['c2-eleven-years']).src, '/art/bellweather-infirmary.webp');
assert.equal(artworkForScene(nodes['c2-investigate']).src, '/art/bellweather-infirmary.webp');
assert.equal(artworkForScene(nodes['c2-ledger']).src, '/art/bellweather-infirmary.webp');
assert.equal(artworkForScene(nodes['c2-attacker']).src, '/art/bellweather-infirmary.webp');
assert.equal(artworkForScene(nodes['c2-night-watch']).src, '/art/bellweather-infirmary.webp');
assert.equal(artworkForScene(nodes['c2-cellar']).src, '/art/bellweather-folded-cellar.webp');
assert.equal(artworkForScene(nodes['c2-last-testimony']).src, '/art/bellweather-inn.webp');
assert.equal(
  scrollLandingAfterTransition(
    { ...initialState, nodeId: 'c2-threshold' },
    { ...initialState, nodeId: 'c2-triage' },
  ),
  'hero',
);
assert.equal(
  scrollLandingAfterTransition(
    { ...initialState, nodeId: 'c2-triage' },
    { ...initialState, nodeId: 'c2-medicine' },
  ),
  'story',
);
assert.equal(
  scrollLandingAfterTransition(
    { ...initialState, nodeId: 'c2-medicine' },
    { ...initialState, nodeId: 'c2-eleven-years' },
  ),
  'story',
);
assert.equal(
  scrollLandingAfterTransition(
    { ...initialState, nodeId: 'c2-eleven-years' },
    { ...initialState, nodeId: 'c2-investigate' },
  ),
  'story',
);
assert.equal(
  scrollLandingAfterTransition(
    { ...initialState, nodeId: 'c2-investigate' },
    { ...initialState, nodeId: 'c2-cellar' },
  ),
  'hero',
);

const ilyraBefore = {
  ...cloneGameState(initialState),
  nodeId: 'c7-ilyra-future',
  chapter: 7,
};
const ilyraKiss = choose(ilyraBefore, 'c7-ilyra-deepen-bond');
assert.equal(ilyraKiss.nodeId, 'c7-marshal-parley');
assert.equal(
  visibleArtworkForState(ilyraKiss).romance,
  additionalArtwork.ilyraromance,
);
assert.notEqual(
  visibleArtworkForState(ilyraBefore).hero.src,
  visibleArtworkForState(ilyraKiss).hero.src,
);
assert.equal(scrollLandingAfterTransition(ilyraBefore, ilyraKiss), 'hero');
const ilyraSlow = choose(ilyraBefore, 'c7-ilyra-slow-interest');
assert.equal(visibleArtworkForState(ilyraSlow).romance, null);
assert.ok(typeof ILYRA_KISS_RESULT === 'string' && ILYRA_KISS_RESULT.length > 0);
assert.equal(
  romanceArtworkForScene({
    ...ilyraKiss,
    history: [],
  }),
  null,
);
assert.equal(
  romanceArtworkForScene({
    ...ilyraKiss,
    history: [ILYRA_KISS_RESULT, 'A later parley event'],
  }),
  null,
);

const maraRest = {
  ...cloneGameState(initialState),
  nodeId: 'c10-rest-choice',
  chapter: 10,
  flags: [
    'c9-mara-crossed-black-gate',
    'c10-limits-respected',
    'c10-road-danger-ended',
  ],
  relationships: {
    ...initialState.relationships,
    mara: { ...initialState.relationships.mara, intent: 'committed' },
  },
};
const maraAfterRest = choose(maraRest, 'c10-rest-with-mara');
assert.equal(maraAfterRest.nodeId, 'c10-guide-bargain');
assert.equal(visibleArtworkForState(maraAfterRest).romance, additionalArtwork.mararomance);
assert.equal(scrollLandingAfterTransition(maraRest, maraAfterRest), 'romance');
assert.equal(
  romanceArtworkForScene({
    ...maraAfterRest,
    nodeId: 'c11-vathis-gate',
  }),
  null,
);

const platonicRest = choose(
  {
    ...cloneGameState(initialState),
    nodeId: 'c10-rest-choice',
    chapter: 10,
    flags: ['c10-limits-respected', 'c10-road-danger-ended'],
  },
  'c10-rest-apart',
);
assert.equal(visibleArtworkForState(platonicRest).romance, null);

// 3. Sibling branch coverage with independently specified plates
const siblingExpectations = [
  ['low-road', '/art/kings-road-drowned-mile.webp'],
  ['ridge-road', '/art/eastwatch-ridge-road.webp'],
  ['inspection-yard', '/art/eastwatch-saboteur.webp'],
  ['march-order', '/art/kings-road-alderwood-rise.webp'],
  ['road-conversation', '/art/kings-road-alderwood-rise.webp'],
  ['c3-archive', '/art/harrowfen-burning-archive.webp'],
  ['c3-healer', '/art/harrowfen-wrong-mile.webp'],
  ['c3-broker', '/art/harrowfen-wrong-mile.webp'],
  ['c4-storm-span', '/art/mileless-storm-span.webp'],
  ['c4-snow-span', '/art/mileless-snow-span.webp'],
  ['c4-brass-span', '/art/mileless-brass-span.webp'],
  ['c4-stage-turn', '/art/mileless-three-spans.webp'],
  ['c6-herd-duty', '/art/kharad-vey-wheel-city.webp'],
  ['c6-forge-duty', '/art/kharad-brake-forge.webp'],
  ['c6-shrine-duty', '/art/kharad-vey-wheel-city.webp'],
  ['c7-salt-trap', '/art/salt-basin-fracture.webp'],
  ['c7-order-exposure', '/art/salt-basin-battle.webp'],
  ['c7-steppe-duel', '/art/marshal-field-confrontation.webp'],
  ['c12-ending-sealed', '/art/black-gate-sealed.webp'],
  ['c12-ending-consent-passage', '/art/black-gate-mutual-passage.webp'],
  ['c12-ending-broken', '/art/black-gate-broken.webp'],
  ['c12-ending-gatekeeper', '/art/caelan-living-gate.webp'],
];
for (const [nodeId, src] of siblingExpectations) {
  assert.equal(
    artworkForScene(nodes[nodeId]).src,
    src,
    `${nodeId} artwork drifted from the audited assignment`,
  );
}

assert.notEqual(
  artworkForScene(nodes['c3-healer']).src,
  artworkForScene(nodes['c3-archive']).src,
);
assert.notEqual(
  artworkForScene(nodes['c7-steppe-duel']).src,
  artworkForScene(nodes['c7-salt-trap']).src,
);
assert.notEqual(
  artworkForScene(nodes['c6-forge-duty']).src,
  artworkForScene(nodes['c6-shrine-duty']).src,
);

assert.notEqual(
  artworkForScene(nodes['c4-snow-span']).src,
  artworkForScene(nodes['c4-storm-span']).src,
);
assert.notEqual(
  artworkForScene(nodes['c4-brass-span']).src,
  artworkForScene(nodes['c4-snow-span']).src,
);
assert.notEqual(
  artworkForScene(nodes['ridge-road']).src,
  artworkForScene(nodes['low-road']).src,
);

function chapterOf(id) {
  const match = String(id).match(/^c(\d+)-/);
  return match ? Number(match[1]) : 1;
}

function locationParts(location) {
  const [prefix, ...rest] = String(location || '')
    .split(',')
    .map((part) => part.trim().toLowerCase());
  return { prefix, room: rest.join(', ') };
}

function stillInSamePlace(fromLocation, toLocation) {
  const from = locationParts(fromLocation);
  const to = locationParts(toLocation);
  if (!from.prefix || from.prefix !== to.prefix) return false;
  if (from.room && to.room && from.room !== to.room) return false;
  return true;
}

const nodesByChapter = new Map();
for (const node of Object.values(nodes)) {
  const chapter = chapterOf(node.id);
  if (!nodesByChapter.has(chapter)) nodesByChapter.set(chapter, []);
  nodesByChapter.get(chapter).push(node);
}
for (const [chapter, list] of nodesByChapter) {
  const firstPlate = artworkForScene(list[0]).src;
  for (const node of list) {
    if (!sceneArtOverrides[node.id]) continue;
    const uniqueSrc = artworkForScene(node).src;
    if (uniqueSrc === firstPlate) continue;
    for (const choice of node.choices) {
      const dest = nodes[choice.next];
      if (!dest || chapterOf(dest.id) !== chapter) continue;
      if (!stillInSamePlace(node.location, dest.location)) continue;
      const destSrc = artworkForScene(dest).src;
      if (destSrc === uniqueSrc || destSrc !== firstPlate) continue;
      assert.fail(
        `${node.id} unique plate ${uniqueSrc} snaps back to ${destSrc} at ${dest.id} while still in ${dest.location}`,
      );
    }
  }
}

assert.equal(
  scrollLandingAfterTransition(
    { ...initialState, nodeId: 'choose-road' },
    { ...initialState, nodeId: 'ridge-road', flags: ['ridge-route'] },
  ),
  'hero',
);
assert.equal(
  scrollLandingAfterTransition(
    { ...initialState, nodeId: 'c4-three-spans' },
    { ...initialState, nodeId: 'c4-snow-span', flags: ['c4-snow-route'] },
  ),
  'hero',
);
assert.equal(
  scrollLandingAfterTransition(
    { ...initialState, nodeId: 'c4-snow-span', flags: ['c4-snow-route'] },
    { ...initialState, nodeId: 'c4-stage-turn', flags: ['c4-snow-route'] },
  ),
  'hero',
);

const documentedPending = new Set();
const greyhavenOk = new Set(
  Object.values(nodes)
    .filter((node) => node.location?.includes('Greyhaven') && node.art === 'departure')
    .map((node) => node.id),
);
for (const node of Object.values(nodes)) {
  const resolved = artworkForScene(node);
  if (resolved.src !== '/art/caelan-east-gate.webp') continue;
  if (greyhavenOk.has(node.id) || node.art === 'departure') continue;
  if (documentedPending.has(node.id)) continue;
  assert.fail(`${node.id} unexpectedly falls back to Greyhaven departure art`);
}

assert.equal(
  artworkForScene(nodes['c5-royal-camp']).src,
  '/art/dragonspine-royal-drill.webp',
);
assert.equal(
  artworkForScene(nodes['c5-heart-memory']).src,
  '/art/orivane-concord-memory.webp',
);
assert.equal(
  artworkForScene(nodes['c8-hidden-record']).src,
  '/art/fourth-fort-ledgers.webp',
);
assert.equal(
  artworkForScene(nodes['c8-chain-plan']).src,
  '/art/black-gate-buried-chain.webp',
);
assert.equal(
  artworkForScene(nodes['c9-name-demonstration']).src,
  '/art/vexa-name-beads.webp',
);
assert.equal(
  artworkForScene(nodes['c11-petition-hearing']).src,
  '/art/vathis-public-hearing.webp',
);
assert.equal(
  artworkForScene(nodes['c11-revolt-crisis']).src,
  '/art/vathis-lifting-roofs.webp',
);
assert.equal(
  artworkForScene(nodes['c10-road-danger']).src,
  '/art/ash-road-falling-stones.webp',
);

// 4. Save/load and replay restore the same presentation
const savedKiss = save.createStoredSave(ilyraKiss, {}, 'default');
const restoredKiss = save.parsePortableSave(
  JSON.stringify(save.createPortableSave(savedKiss)),
);
assert.equal(restoredKiss.ok, true);
assert.equal(
  JSON.stringify(visibleArtworkForState(restoredKiss.document.game)),
  JSON.stringify(visibleArtworkForState(ilyraKiss)),
);
const replayStart = save.normaliseGameState({
  ...ilyraKiss,
  nodeId: 'c7-red-horizon',
  chapter: 7,
  chapterChoices: 0,
  history: [],
});
assert.equal(visibleArtworkForState(replayStart).romance, null);

// 5. Story mechanics preserved against the pre-change baseline
const baseline = JSON.parse(readFileSync('work/story-mechanical-baseline.json', 'utf8'));
function mechanicalChoice(choice) {
  return {
    id: choice.id,
    label: choice.label,
    detail: choice.detail,
    advantage: choice.advantage ?? null,
    result: choice.result,
    next: typeof choice.next === 'string' ? choice.next : 'dynamic',
    changes: choice.changes ?? null,
    requires: choice.requires ?? null,
    requiresRelationships: choice.requiresRelationships ?? null,
    requiresFlags: choice.requiresFlags ?? null,
    showIfAnyFlags: choice.showIfAnyFlags ?? null,
    showIfAllFlags: choice.showIfAllFlags ?? null,
    hideIfAnyFlags: choice.hideIfAnyFlags ?? null,
    showIfRelationshipIntents: choice.showIfRelationshipIntents ?? null,
    forbidsRelationshipIntents: choice.forbidsRelationshipIntents ?? null,
    addFlags: choice.addFlags ?? null,
  };
}
for (const [nodeId, expected] of Object.entries(baseline.nodes)) {
  const node = nodes[nodeId];
  assert.ok(node, `Missing node ${nodeId}`);
  assert.equal(node.title, expected.title);
  assert.equal(node.kicker, expected.kicker);
  assert.equal(node.location, expected.location);
  assert.equal(node.threat, expected.threat);
  assert.equal(Boolean(node.final), expected.final);
  assert.equal(node.nextChapter ?? null, expected.nextChapter);
  assert.equal(
    JSON.stringify(node.choices.map(mechanicalChoice)),
    JSON.stringify(expected.choices),
  );
}
for (const sample of baseline.sampleTransitions) {
  const state = { ...structuredClone(initialState), nodeId: sample.nodeId };
  const choice = nodes[sample.nodeId].choices.find((item) => item.id === sample.choiceId);
  const after = applyPlayerChoice(state, choice);
  assert.equal(after.nodeId, sample.to);
  assert.equal(JSON.stringify(after.stats), JSON.stringify(sample.stats));
  assert.equal(
    JSON.stringify(after.relationships),
    JSON.stringify(sample.relationships),
  );
  assert.equal(JSON.stringify(after.flags), JSON.stringify(sample.flags));
  assert.equal(after.history.at(-1), sample.historyTail);
}

// 6. Representative reachable route art, labelled as representative rather than exhaustive
const routeArt = [];
let cursor = cloneGameState(initialState);
const opening = [
  'check-people',
  'flirt-mara',
  'trust-tivik',
  'answer-lysara',
  'trust-memory',
  'take-low',
  'rescue-family',
  'swear-safe-arrival',
  'protect-lysara-secret',
];
for (const choiceId of opening) {
  routeArt.push({
    nodeId: cursor.nodeId,
    src: visibleArtworkForState(cursor).hero.src,
  });
  const choice = nodes[cursor.nodeId].choices.find((item) => item.id === choiceId);
  if (!choice || !canChoose(choice, highStats(cursor))) break;
  cursor = applyPlayerChoice(highStats(cursor), choice);
}
assert.ok(
  routeArt.some((entry) => entry.src.includes('kings-road-drowned-mile')),
  'Low-road representative route never encountered the drowned-mile plate',
);
assert.ok(
  routeArt.some((entry) => entry.src.includes('kings-road-alderwood-rise')),
  'Low-road representative route never encountered the shared King’s Road plate',
);

const ridgeRouteArt = [];
let ridgeCursor = cloneGameState(initialState);
const ridgeOpening = [
  'check-people',
  'flirt-mara',
  'trust-tivik',
  'answer-lysara',
  'trust-memory',
  'take-ridge',
];
for (const choiceId of ridgeOpening) {
  ridgeRouteArt.push({
    nodeId: ridgeCursor.nodeId,
    src: visibleArtworkForState(ridgeCursor).hero.src,
  });
  const choice = nodes[ridgeCursor.nodeId].choices.find(
    (item) => item.id === choiceId,
  );
  if (!choice || !canChoose(choice, highStats(ridgeCursor))) break;
  ridgeCursor = applyPlayerChoice(highStats(ridgeCursor), choice);
}
ridgeRouteArt.push({
  nodeId: ridgeCursor.nodeId,
  src: visibleArtworkForState(ridgeCursor).hero.src,
});
assert.ok(
  ridgeRouteArt.some((entry) => entry.src.includes('eastwatch-ridge-road')),
  'Ridge representative route never encountered the ridge plate',
);
assert.ok(
  !ridgeRouteArt.some((entry) => entry.src.includes('kings-road-drowned-mile')),
  'Ridge representative route leaked the low-road flood plate',
);

console.log(
  'Presentation integration checks passed: relationship previews, resolved-art scrolling, sibling coverage, romance gating, save restore, and story preservation.',
);
console.log(
  JSON.stringify(
    {
      pendingArtNodes: [...documentedPending],
      representativeOpeningArt: [...new Set(routeArt.map((entry) => entry.src))],
      ilyraKissResultPresent: Boolean(ILYRA_KISS_RESULT),
      resolveNextSample: resolveNext(protect, road),
    },
    null,
    2,
  ),
);
