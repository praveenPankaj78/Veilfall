import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { loadStory } from './story-loader.mjs';

const story = loadStory();
const { nodes, initialState } = story.game;
const { sceneArtwork } = story.load('app/scene-art.ts');
const {
  additionalArtwork,
  sceneArtOverrides,
  artworkForScene,
  artworkAssignmentKind,
  romanceArtworkForScene,
  visibleArtworkForState,
  scrollLandingAfterTransition,
  ILYRA_KISS_RESULT,
} = story.load('app/expanded-art.ts');

for (const id of Object.keys(sceneArtOverrides))
  assert.ok(nodes[id], `Unknown art scene: ${id}`);

const coverage = [];
for (let chapter = 1; chapter <= 12; chapter++) {
  const scenes = Object.values(nodes).filter(
    (node) => Number(node.id.match(/^c(\d+)-/)?.[1] ?? 1) === chapter,
  );
  const plates = new Set(scenes.map((node) => artworkForScene(node).src));
  assert.ok(
    plates.size >= 5,
    `Chapter ${chapter} should have at least five distinct scene plates, found ${plates.size}`,
  );
  coverage.push({ chapter, scenePlates: plates.size });
}

const allArt = [
  ...Object.values(sceneArtwork),
  ...Object.values(additionalArtwork),
];
assert.ok(
  new Set(allArt.map((art) => art.src)).size >= 69,
  'The shipped artwork set should not shrink below the 69 integrated plates',
);
for (const art of allArt) {
  assert.ok(art.alt.trim());
  await access(`public${art.src}`);
  await access(`public${art.src800}`);
}

const assignedExamples = [
  ['c2-threshold', '/art/bellweather-inn.webp'],
  ['c2-triage', '/art/bellweather-infirmary.webp'],
  ['c2-medicine', '/art/bellweather-infirmary.webp'],
  ['c2-eleven-years', '/art/bellweather-infirmary.webp'],
  ['c2-investigate', '/art/bellweather-infirmary.webp'],
  ['c2-ledger', '/art/bellweather-infirmary.webp'],
  ['c2-attacker', '/art/bellweather-infirmary.webp'],
  ['c2-night-watch', '/art/bellweather-upper-landing.webp'],
  ['c2-cellar', '/art/bellweather-folded-cellar.webp'],
  ['c2-last-testimony', '/art/bellweather-inn.webp'],
  ['low-road', '/art/kings-road-drowned-mile.webp'],
  ['inspection-yard', '/art/eastwatch-saboteur.webp'],
  ['c3-archive', '/art/harrowfen-burning-archive.webp'],
  ['c3-healer', '/art/harrowfen-wrong-mile.webp'],
  ['c3-broker', '/art/harrowfen-wrong-mile.webp'],
  ['c4-three-spans', '/art/mileless-three-spans.webp'],
  ['c4-storm-span', '/art/mileless-storm-span.webp'],
  ['c4-snow-span', '/art/mileless-snow-span.webp'],
  ['c4-brass-span', '/art/mileless-brass-span.webp'],
  ['ridge-road', '/art/eastwatch-ridge-road.webp'],
  ['march-order', '/art/kings-road-alderwood-rise.webp'],
  ['road-conversation', '/art/kings-road-alderwood-rise.webp'],
  ['c6-herd-duty', '/art/kharad-vey-wheel-city.webp'],
  ['c6-forge-duty', '/art/kharad-brake-forge.webp'],
  ['c6-shrine-duty', '/art/kharad-vey-wheel-city.webp'],
  ['c7-salt-trap', '/art/salt-basin-fracture.webp'],
  ['c7-order-exposure', '/art/salt-basin-battle.webp'],
  ['c7-steppe-duel', '/art/marshal-field-confrontation.webp'],
];
for (const [nodeId, src] of assignedExamples) {
  assert.equal(
    artworkForScene(nodes[nodeId]).src,
    src,
    `${nodeId} should resolve to ${src}`,
  );
}

assert.equal(artworkAssignmentKind(nodes['ridge-road']), 'override');
assert.equal(artworkAssignmentKind(nodes['march-order']), 'override');
assert.equal(artworkAssignmentKind(nodes['road-conversation']), 'override');
assert.equal(artworkAssignmentKind(nodes['c2-investigate']), 'override');
assert.equal(artworkAssignmentKind(nodes['c2-night-watch']), 'override');
assert.equal(artworkAssignmentKind(nodes['c2-cellar']), 'override');
assert.equal(artworkForScene(nodes['gate-yard']).src, '/art/caelan-east-gate.webp');
assert.equal(artworkForScene(nodes['c4-stage-turn']).src, '/art/mileless-three-spans.webp');

const encounters = [
  ['c9-recover-fragment', 'c9-shared-private-night', 'vexaromance'],
  ['c10-guide-bargain', 'c10-rest-with-mara', 'mararomance'],
  ['c10-guide-bargain', 'c10-rest-with-lysara', 'lysararomance'],
];
for (const [nodeId, flag, key] of encounters) {
  const state = { ...initialState, nodeId, flags: [flag] };
  assert.equal(romanceArtworkForScene(state), additionalArtwork[key]);
  assert.equal(romanceArtworkForScene({ ...state, flags: [] }), null);
  assert.equal(
    romanceArtworkForScene({ ...state, nodeId: 'c12-relationship-ending' }),
    null,
  );
  assert.equal(
    romanceArtworkForScene({ ...state, nodeId: 'c9-private-choice' }),
    null,
  );
}
const ilyraChoices = nodes['c7-ilyra-future'].choices;
for (const choice of ilyraChoices) {
  const state = {
    ...initialState,
    nodeId: 'c7-marshal-parley',
    history: [choice.result],
  };
  assert.equal(
    romanceArtworkForScene(state),
    choice.id === 'c7-ilyra-deepen-bond'
      ? additionalArtwork.ilyraromance
      : null,
  );
  assert.equal(
    romanceArtworkForScene({
      ...state,
      history: [...state.history, 'Later event'],
    }),
    null,
  );
}
assert.equal(
  romanceArtworkForScene({ ...initialState, nodeId: 'c7-marshal-parley' }),
  null,
);
assert.ok(typeof ILYRA_KISS_RESULT === 'string' && ILYRA_KISS_RESULT.length > 0);
assert.equal(
  romanceArtworkForScene({
    ...initialState,
    nodeId: 'c7-marshal-parley',
    history: [],
  }),
  null,
);

const threshold = { ...initialState, nodeId: 'c2-threshold' };
const triage = { ...initialState, nodeId: 'c2-triage' };
assert.equal(scrollLandingAfterTransition(threshold, triage), 'hero');
assert.equal(
  visibleArtworkForState(threshold).hero.src,
  '/art/bellweather-inn.webp',
);
assert.equal(
  visibleArtworkForState(triage).hero.src,
  '/art/bellweather-infirmary.webp',
);

console.log(
  `Verified ${new Set(allArt.map((art) => art.src)).size} artworks, at least five scene plates per chapter, both delivery sizes, independently specified assignments, and four encounter-specific romance paths.`,
);
console.table(coverage);
