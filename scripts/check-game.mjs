import { access, readFile } from 'node:fs/promises';
import { loadStory } from './story-loader.mjs';
import { checkSeriesReview } from './series-review.mjs';
import {
  activeConsequenceContracts,
  chapterFiveContinuityContract,
  chapterSixContinuityContract,
  chapterSevenContinuityContract,
  documentedSeriesRoutes,
  firstMeetingContracts,
  implementedChapterContracts,
  playableHeroes,
  protectedPlotTransitions,
  terminalHistoryFlagReasons,
} from './continuity-contract.mjs';

const story = loadStory();
const exported = story.game;
const context = { module: { exports: exported } };
const source = story.sources.get('app/game-data.ts');
const pageSource = await readFile('app/page.tsx', 'utf8');
const adventureExports = story.load('app/adventure-revision.ts');
const chapterFourSource = story.sources.get('app/chapter-four.ts');
const chapterFiveSource = story.sources.get('app/chapter-five.ts');
const chapterSixSource = story.sources.get('app/chapter-six.ts');
const chapterSevenSource = story.sources.get('app/chapter-seven.ts');
const chapterEightSource = story.sources.get('app/chapter-eight.ts');
const chapterNineSource = story.sources.get('app/chapter-nine.ts');
const chapterTenSource = story.sources.get('app/chapter-ten.ts');
const chapterElevenSource = story.sources.get('app/chapter-eleven.ts');
const chapterTwelveSource = story.sources.get('app/chapter-twelve.ts');
const memoryExports = story.load('app/story-memory.ts');
const saveExports = story.load('app/save-system.ts');
const saveSource = story.sources.get('app/save-system.ts');
const transition = story.load('app/game-transition.ts');
const promiseRecords = story.load('app/promise-records.ts');
const {
  applyChoice,
  applyPlayerChoice,
  drainAutomaticAcknowledgments,
  chapterRecoveryDisplay,
  cloneGameState,
  wouldBeFatal,
  AUTOMATIC_ACKNOWLEDGMENT_IDS,
  statesEquivalent,
  captureFatalRetry,
  captureDeathCause,
  deathCauseText,
} = transition;

const {
  canChoose,
  isChoiceVisible,
  initialState,
  nodeOrder,
  nodes,
  nextRelationships,
  normaliseRelationships,
  relationshipSummary,
  relationshipChanges,
  relationshipChangeNotes,
  resolveNext,
  statLabels,
} = context.module.exports;
const { caelanFinaleExport, knownTruths, majorConsequences } = memoryExports;
const {
  adventureChoiceUpdates,
  adventureNodeUpdates,
  chapterThreeChoiceRevisionAudit,
  chapterTwoChoiceRevisionAudit,
  reviewedUnchangedChoiceIds,
} = adventureExports;
const producedFlagUniverse = [
  ...new Set(
    Object.values(nodes)
      .flatMap((node) => node.choices)
      .flatMap((choice) => choice.addFlags ?? []),
  ),
];

const failures = [];
await checkSeriesReview(
  exported,
  memoryExports,
  pageSource,
  failures,
  saveExports,
  undefined,
  transition,
  promiseRecords,
);

const postBridgeSources = [
  chapterFiveSource,
  chapterSixSource,
  chapterSevenSource,
  chapterEightSource,
  chapterNineSource,
  chapterTenSource,
  chapterElevenSource,
  chapterTwelveSource,
];
const activeRookAction =
  /\bRook (?:walks|waits|follows|looks|points|returns|offers|asks|says|carries|pulls|uses|takes|finds|helps|stands|runs|rides|scouts)\b/i;
for (const [index, chapterSource] of postBridgeSources.entries()) {
  if (activeRookAction.test(chapterSource)) {
    failures.push(
      `Chapter ${index + 5} places Rook physically on Caelan’s route after the Mileless Bridge exit`,
    );
  }
}
if (/\bRook\b/i.test(chapterSevenSource)) {
  failures.push(
    'Chapter Seven places Rook and Ilyra together before their planned Serekh meeting',
  );
}
if (/\bRook\b/i.test(chapterEightSource)) {
  failures.push(
    'Chapter Eight places Rook on Caelan’s route after his Underways exit',
  );
}
const activeIlyraAction =
  /\bIlyra (?:arrives|appears|stands|walks|waits|follows|speaks|points|returns|offers|asks|says|carries|pulls|uses|takes|helps|rides)\b/i;
if (
  activeIlyraAction.test(chapterEightSource) ||
  !/Ilyra took another road.*trace the hidden command/is.test(
    chapterEightSource,
  )
) {
  failures.push(
    'Chapter Eight does not explain Ilyra’s separate route without placing her physically at the Gate',
  );
}
for (const node of Object.values(nodes)) {
  for (const choice of node.choices) {
    if (/^c[567].*rook/i.test(choice.id)) {
      failures.push(
        `Post bridge Caelan choice still assigns an active action to Rook: ${choice.id}`,
      );
    }
  }
}
const nodeIds = Object.keys(nodes);
const ordered = new Set(nodeOrder);
const reviewedUnchangedChoices = new Set(reviewedUnchangedChoiceIds);

const chapterFourArtAssets = {
  mileless: 'public/art/mileless-bridge-chase.webp',
  crossroads: 'public/art/mileless-three-spans.webp',
  nails: 'public/art/nine-nails-revelation.webp',
};
const chapterFiveArtAssets = {
  dragonspine: 'public/art/dragonspine-coldfire.webp',
  vaor: 'public/art/vaor-memory-grave.webp',
  ember: 'public/art/ember-bearer-vision.webp',
};
const chapterSixArtAssets = {
  kharad: 'public/art/kharad-vey-wheel-city.webp',
  storm: 'public/art/ancestor-storm-attack.webp',
  moot: 'public/art/red-moot-ilyra.webp',
};
const chapterSevenArtAssets = {
  redwind: 'public/art/red-wind-pursuit.webp',
  saltbattle: 'public/art/salt-basin-battle.webp',
  marshal: 'public/art/marshal-field-confrontation.webp',
};
const chapterEightArtAssets = {
  blackgate: 'public/art/black-gate-fortress-ring.webp',
  futureless: 'public/art/futureless-fort-breach.webp',
  embassy: 'public/art/first-devil-embassy.webp',
};
const chapterNineArtAssets = {
  cinderembassy: 'public/art/cinder-deep-embassy.webp',
  twosidedattack: 'public/art/two-sided-assassination.webp',
  gatecrossing: 'public/art/black-gate-crossing.webp',
};
const chapterTenArtAssets = {
  ashroadoffer: 'public/art/ash-road-first-offer.webp',
  privateoffers: 'public/art/ash-road-private-offers.webp',
  vathisapproach: 'public/art/vathis-approach.webp',
};
const chapterElevenArtAssets = {
  vathisstreets: 'public/art/vathis-contract-streets.webp',
  vathisauction: 'public/art/vathis-invasion-auction.webp',
  vathisengine: 'public/art/vathis-engine-gate.webp',
};
const chapterTwelveArtAssets = {
  blackgatecollision: 'public/art/black-gate-two-faces.webp',
  blackgatesealed: 'public/art/black-gate-sealed.webp',
  blackgatepassage: 'public/art/black-gate-mutual-passage.webp',
  blackgatebroken: 'public/art/black-gate-broken.webp',
  blackgatekeeper: 'public/art/caelan-living-gate.webp',
};
const earlierChapterArt = new Set([
  'departure',
  'ambush',
  'folded',
  'inn',
  'othernights',
  'foldedcellar',
  'roadpin',
  'harrowfen',
  'shiftingmarket',
  'bridgereveal',
]);
const chapterFourArtUsed = new Set();
for (const [id, node] of Object.entries(nodes)) {
  if (!id.startsWith('c4-')) continue;
  if (!node.art) failures.push(`Chapter Four node has no explicit art: ${id}`);
  if (earlierChapterArt.has(node.art)) {
    failures.push(
      `Chapter Four node reuses earlier chapter art: ${id} uses ${node.art}`,
    );
  }
  if (node.art) chapterFourArtUsed.add(node.art);
}
const chapterFourChaseNodes = new Set([
  'c4-bridge-start',
  'c4-chase',
  'c4-corner',
  'c4-collapse',
  'c4-wounded',
]);
const chapterFourNailsNodes = new Set([
  'c4-nine-marks',
  'c4-mara',
  'c4-soldiers',
  'c4-theatre-plan',
  'c4-anchor',
  'c4-duty',
  'c4-ending-arrest',
  'c4-ending-bargain',
  'c4-ending-trust',
]);
for (const [id, node] of Object.entries(nodes)) {
  if (!id.startsWith('c4-')) continue;
  const expected = chapterFourNailsNodes.has(id)
    ? 'nails'
    : chapterFourChaseNodes.has(id)
      ? 'mileless'
      : 'crossroads';
  if (node.art !== expected) {
    failures.push(
      `Chapter Four node ${id} uses ${node.art} instead of ${expected}`,
    );
  }
}
for (const [art, asset] of Object.entries(chapterFourArtAssets)) {
  if (!chapterFourArtUsed.has(art))
    failures.push(`Chapter Four never uses its ${art} artwork`);
  try {
    await access(asset);
  } catch {
    failures.push(`Chapter Four artwork is missing: ${asset}`);
  }
}
const chapterSixArtUsed = new Set();
for (const [id, node] of Object.entries(nodes)) {
  if (!id.startsWith('c6-')) continue;
  if (!node.art) failures.push(`Chapter Six node has no explicit art: ${id}`);
  if (
    earlierChapterArt.has(node.art) ||
    chapterFourArtAssets[node.art] ||
    chapterFiveArtAssets[node.art]
  ) {
    failures.push(
      `Chapter Six node reuses earlier chapter art: ${id} uses ${node.art}`,
    );
  }
  if (node.art) chapterSixArtUsed.add(node.art);
}
for (const [art, asset] of Object.entries(chapterSixArtAssets)) {
  if (!chapterSixArtUsed.has(art))
    failures.push(`Chapter Six never uses its ${art} artwork`);
  try {
    await access(asset);
  } catch {
    failures.push(`Missing Chapter Six art asset: ${asset}`);
  }
}
const earlierThanFiveArt = new Set([
  ...earlierChapterArt,
  ...Object.keys(chapterFourArtAssets),
]);
const chapterFiveArtUsed = new Set();
for (const [id, node] of Object.entries(nodes)) {
  if (!id.startsWith('c5-')) continue;
  if (!node.art) failures.push(`Chapter Five node has no explicit art: ${id}`);
  if (earlierThanFiveArt.has(node.art)) {
    failures.push(
      `Chapter Five node reuses earlier chapter art: ${id} uses ${node.art}`,
    );
  }
  if (node.art) chapterFiveArtUsed.add(node.art);
}
for (const [art, asset] of Object.entries(chapterFiveArtAssets)) {
  if (!chapterFiveArtUsed.has(art))
    failures.push(`Chapter Five never uses its ${art} artwork`);
  try {
    await access(asset);
  } catch {
    failures.push(`Chapter Five artwork is missing: ${asset}`);
  }
}
const earlierThanSevenArt = new Set([
  ...earlierChapterArt,
  ...Object.keys(chapterFourArtAssets),
  ...Object.keys(chapterFiveArtAssets),
  ...Object.keys(chapterSixArtAssets),
]);
const chapterSevenArtUsed = new Set();
for (const [id, node] of Object.entries(nodes)) {
  if (!id.startsWith('c7-')) continue;
  if (!node.art) failures.push(`Chapter Seven node has no explicit art: ${id}`);
  if (earlierThanSevenArt.has(node.art)) {
    failures.push(
      `Chapter Seven node reuses earlier chapter art: ${id} uses ${node.art}`,
    );
  }
  if (node.art) chapterSevenArtUsed.add(node.art);
}
for (const [art, asset] of Object.entries(chapterSevenArtAssets)) {
  if (!chapterSevenArtUsed.has(art))
    failures.push(`Chapter Seven never uses its ${art} artwork`);
  try {
    await access(asset);
  } catch {
    failures.push(`Chapter Seven artwork is missing: ${asset}`);
  }
}
const earlierThanEightArt = new Set([
  ...earlierThanSevenArt,
  ...Object.keys(chapterSevenArtAssets),
]);
const chapterEightArtUsed = new Set();
for (const [id, node] of Object.entries(nodes)) {
  if (!id.startsWith('c8-')) continue;
  if (!node.art) failures.push(`Chapter Eight node has no explicit art: ${id}`);
  if (earlierThanEightArt.has(node.art)) {
    failures.push(
      `Chapter Eight node reuses earlier chapter art: ${id} uses ${node.art}`,
    );
  }
  if (node.art) chapterEightArtUsed.add(node.art);
}
for (const [art, asset] of Object.entries(chapterEightArtAssets)) {
  if (!chapterEightArtUsed.has(art))
    failures.push(`Chapter Eight never uses its ${art} artwork`);
  try {
    await access(asset);
  } catch {
    failures.push(`Chapter Eight artwork is missing: ${asset}`);
  }
}
const earlierThanNineArt = new Set([
  ...earlierThanEightArt,
  ...Object.keys(chapterEightArtAssets),
]);
const chapterNineArtUsed = new Set();
for (const [id, node] of Object.entries(nodes)) {
  if (!id.startsWith('c9-')) continue;
  if (!node.art) failures.push(`Chapter Nine node has no explicit art: ${id}`);
  if (earlierThanNineArt.has(node.art)) {
    failures.push(
      `Chapter Nine node reuses earlier chapter art: ${id} uses ${node.art}`,
    );
  }
  if (node.art) chapterNineArtUsed.add(node.art);
}
for (const [art, asset] of Object.entries(chapterNineArtAssets)) {
  if (!chapterNineArtUsed.has(art)) {
    failures.push(`Chapter Nine never uses its ${art} artwork`);
  }
  try {
    await access(asset);
  } catch {
    failures.push(`Chapter Nine artwork is missing: ${asset}`);
  }
}
const earlierThanTenArt = new Set([
  ...earlierThanNineArt,
  ...Object.keys(chapterNineArtAssets),
]);
const chapterTenArtUsed = new Set();
for (const [id, node] of Object.entries(nodes)) {
  if (!id.startsWith('c10-')) continue;
  if (!node.art) failures.push(`Chapter Ten node has no explicit art: ${id}`);
  if (earlierThanTenArt.has(node.art))
    failures.push(
      `Chapter Ten node reuses earlier chapter art: ${id} uses ${node.art}`,
    );
  if (node.art) chapterTenArtUsed.add(node.art);
}
for (const [art, asset] of Object.entries(chapterTenArtAssets)) {
  if (!chapterTenArtUsed.has(art))
    failures.push(`Chapter Ten never uses its ${art} artwork`);
  try {
    await access(asset);
  } catch {
    failures.push(`Chapter Ten artwork is missing: ${asset}`);
  }
}
const earlierThanElevenArt = new Set([
  ...earlierThanTenArt,
  ...Object.keys(chapterTenArtAssets),
]);
const chapterElevenArtUsed = new Set();
for (const [id, node] of Object.entries(nodes)) {
  if (!id.startsWith('c11-')) continue;
  if (!node.art)
    failures.push(`Chapter Eleven node has no explicit art: ${id}`);
  if (earlierThanElevenArt.has(node.art))
    failures.push(
      `Chapter Eleven node reuses earlier chapter art: ${id} uses ${node.art}`,
    );
  if (node.art) chapterElevenArtUsed.add(node.art);
}
for (const [art, asset] of Object.entries(chapterElevenArtAssets)) {
  if (!chapterElevenArtUsed.has(art))
    failures.push(`Chapter Eleven never uses its ${art} artwork`);
  try {
    await access(asset);
  } catch {
    failures.push(`Chapter Eleven artwork is missing: ${asset}`);
  }
}
const earlierThanTwelveArt = new Set([
  ...earlierThanElevenArt,
  ...Object.keys(chapterElevenArtAssets),
]);
const chapterTwelveArtUsed = new Set();
for (const [id, node] of Object.entries(nodes)) {
  if (!id.startsWith('c12-')) continue;
  if (!node.art)
    failures.push(`Chapter Twelve node has no explicit art: ${id}`);
  if (earlierThanTwelveArt.has(node.art))
    failures.push(
      `Chapter Twelve node reuses earlier chapter art: ${id} uses ${node.art}`,
    );
  if (node.art) chapterTwelveArtUsed.add(node.art);
}
for (const [art, asset] of Object.entries(chapterTwelveArtAssets)) {
  if (!chapterTwelveArtUsed.has(art))
    failures.push(`Chapter Twelve never uses its ${art} artwork`);
  try {
    await access(asset);
  } catch {
    failures.push(`Chapter Twelve artwork is missing: ${asset}`);
  }
}

for (const id of nodeIds) {
  if (!ordered.has(id)) failures.push(`Node missing from nodeOrder: ${id}`);
}
for (const id of nodeOrder) {
  if (!nodes[id]) failures.push(`nodeOrder references a missing node: ${id}`);
}
for (const nodeId of Object.keys(adventureNodeUpdates)) {
  if (!nodeId.startsWith('c2-') && !nodeId.startsWith('c3-')) continue;
  for (const choice of nodes[nodeId].choices) {
    if (
      !adventureChoiceUpdates[choice.id] &&
      !reviewedUnchangedChoices.has(choice.id)
    ) {
      failures.push(
        `Revised node ${nodeId} inherits unaudited choice ${choice.id}`,
      );
    }
  }
}
for (const choiceId of reviewedUnchangedChoices) {
  const owners = Object.values(nodes).filter((node) =>
    node.choices.some((choice) => choice.id === choiceId),
  );
  if (owners.length !== 1)
    failures.push(
      `Reviewed unchanged choice ${choiceId} has ${owners.length} owning nodes`,
    );
  if (adventureChoiceUpdates[choiceId])
    failures.push(`Choice ${choiceId} is both revised and marked unchanged`);
}

const auditedChapterTwoChoiceIds = Object.values(
  chapterTwoChoiceRevisionAudit,
).flatMap((group) => group.ids);
const duplicateChapterTwoAuditIds = auditedChapterTwoChoiceIds.filter(
  (choiceId, index) => auditedChapterTwoChoiceIds.indexOf(choiceId) !== index,
);
for (const choiceId of new Set(duplicateChapterTwoAuditIds)) {
  failures.push(
    `Chapter Two choice revision audit lists ${choiceId} more than once`,
  );
}
const revisedChapterTwoChoiceIds = Object.keys(adventureChoiceUpdates).filter(
  (choiceId) => choiceId.startsWith('c2-'),
);
for (const choiceId of revisedChapterTwoChoiceIds) {
  if (!auditedChapterTwoChoiceIds.includes(choiceId)) {
    failures.push(
      `Chapter Two choice revision ${choiceId} has no mechanical audit classification`,
    );
  }
}
for (const choiceId of auditedChapterTwoChoiceIds) {
  if (!adventureChoiceUpdates[choiceId]) {
    failures.push(
      `Chapter Two choice audit references missing revision ${choiceId}`,
    );
  }
}
for (const group of Object.values(chapterTwoChoiceRevisionAudit)) {
  if (!group.reason || group.reason.length < 40) {
    failures.push(
      'Chapter Two choice revision audit contains an unexplained classification',
    );
  }
}
for (const choiceId of chapterTwoChoiceRevisionAudit.explicitMechanics.ids) {
  const revision = adventureChoiceUpdates[choiceId];
  const ownsMechanicalField = [
    'changes',
    'requires',
    'requiresRelationships',
    'requiresFlags',
    'showIfAnyFlags',
    'showIfAllFlags',
    'hideIfAnyFlags',
    'addFlags',
    'advantage',
  ].some((field) => Object.hasOwn(revision, field));
  if (!ownsMechanicalField || !Object.hasOwn(revision, 'result')) {
    failures.push(
      `Meaning-changing Chapter Two revision ${choiceId} lacks an explicit mechanical field or result`,
    );
  }
}

const revisedChapterThreeChoiceIds = Object.keys(adventureChoiceUpdates).filter(
  (choiceId) => choiceId.startsWith('c3-'),
);
const auditedChapterThreeChoiceIds = [...chapterThreeChoiceRevisionAudit.ids];
for (const choiceId of revisedChapterThreeChoiceIds) {
  if (!auditedChapterThreeChoiceIds.includes(choiceId)) {
    failures.push(
      `Chapter Three choice revision ${choiceId} has no full mechanical audit`,
    );
  }
}
for (const choiceId of auditedChapterThreeChoiceIds) {
  const revision = adventureChoiceUpdates[choiceId];
  if (!revision) {
    failures.push(
      `Chapter Three choice audit references missing revision ${choiceId}`,
    );
    continue;
  }
  const requiredRevisionFields = [
    'next',
    'changes',
    'requires',
    'requiresRelationships',
    'forbidsRelationshipIntents',
    'requiresFlags',
    'showIfAnyFlags',
    'showIfAllFlags',
    'hideIfAnyFlags',
    'showIfRelationshipIntents',
    'addFlags',
    'advantage',
    'result',
  ];
  for (const field of requiredRevisionFields) {
    if (!Object.hasOwn(revision, field)) {
      failures.push(
        `Chapter Three choice revision ${choiceId} did not explicitly audit ${field}`,
      );
    }
  }
}
if (
  new Set(auditedChapterThreeChoiceIds).size !==
  auditedChapterThreeChoiceIds.length
) {
  failures.push(
    'Chapter Three choice revision audit contains a duplicate choice ID',
  );
}
if (
  !chapterThreeChoiceRevisionAudit.reason.includes('clears inherited mechanics')
) {
  failures.push(
    'Chapter Three choice revision audit does not explain how partial overrides are prevented',
  );
}

const expectedChapterThreeRelationshipEffects = {
  'c3-shield-wounded': { mara: { trust: 1, attraction: 0 } },
  'c3-let-mara-search-you': { mara: { trust: 1, attraction: 1 } },
  'c3-focus-archive': { lysara: { trust: 1, attraction: 0 } },
  'c3-focus-wounded': { mara: { trust: 1, attraction: 0 } },
  'c3-ask-lysara-what-she-sees': { lysara: { trust: 1, attraction: 1 } },
  'c3-stand-with-mara': { mara: { trust: 1, respect: 1 } },
  'c3-stand-with-lysara': { lysara: { trust: 1, respect: 1 } },
  'c3-name-the-real-plan': {
    mara: { trust: 1, attraction: 0 },
    lysara: { trust: 1, attraction: 0 },
  },
  'c3-send-real-mara': { mara: { trust: 1, attraction: 0 } },
  'c3-prepare-fast-pursuit': { mara: { trust: 1, respect: 1 } },
  'c3-prepare-safe-pursuit': { lysara: { trust: 1, respect: 1 } },
};
for (const choiceId of chapterThreeChoiceRevisionAudit.relationshipEffectIds) {
  const owner = Object.values(nodes).find((node) =>
    node.choices.some((choice) => choice.id === choiceId),
  );
  const choice = owner?.choices.find((candidate) => candidate.id === choiceId);
  if (!choice) {
    failures.push(
      `Chapter Three relationship audit references missing choice ${choiceId}`,
    );
    continue;
  }
  const actual = JSON.stringify(relationshipChanges(choice));
  const expected = JSON.stringify(
    expectedChapterThreeRelationshipEffects[choiceId],
  );
  if (actual !== expected) {
    failures.push(
      `Chapter Three relationship effect changed without an audit update: ${choiceId}`,
    );
  }
}

const statKeyByLabel = Object.fromEntries(
  Object.entries(statLabels).map(([key, label]) => [label.toLowerCase(), key]),
);
const visibleCostPattern =
  /(Spend(?:s)?|Lose(?:s)?|Gain(?:s)?) ([0-9]+) (Health|Resolve|Command|Oathfire|Medicine|Wayfire)/gi;

function choiceContractProblems(choice) {
  const problems = [];
  const disclosedChanges = {};
  for (const match of choice.detail.matchAll(visibleCostPattern)) {
    const stat = statKeyByLabel[match[3].toLowerCase()];
    const verb = match[1].toLowerCase();
    const direction =
      verb.startsWith('spend') || verb.startsWith('lose') ? -1 : 1;
    disclosedChanges[stat] =
      (disclosedChanges[stat] ?? 0) + direction * Number(match[2]);
  }
  for (const [stat, value] of Object.entries(choice.changes ?? {})) {
    if ((value ?? 0) < 0 && disclosedChanges[stat] !== value) {
      problems.push(`hides ${Math.abs(value)} ${stat}`);
    }
  }

  const trustClaim = choice.detail.match(
    /Available with (?:deep|established) (Mara|Lysara|Ilyra) trust/i,
  );
  if (trustClaim) {
    const person = trustClaim[1].toLowerCase();
    const relationshipGate = choice.requiresRelationships?.[person]?.trust;
    const flagGate = choice.requiresFlags?.some(
      (flag) =>
        flag.toLowerCase().includes(person) &&
        flag.toLowerCase().includes('trust'),
    );
    if (!relationshipGate && !flagGate)
      problems.push(`claims ${person} trust without a gate`);
  }
  return problems;
}

for (const node of Object.values(nodes)) {
  for (const choice of node.choices) {
    const resourceCosts = Object.entries(choice.changes ?? {}).filter(
      ([, value]) => (value ?? 0) < 0,
    );
    const relationshipCosts = Object.values(relationshipChanges(choice))
      .flatMap((changes) => Object.values(changes ?? {}))
      .filter((value) => (value ?? 0) < 0);
    const hasKnownCost = resourceCosts.length || relationshipCosts.length;
    if (hasKnownCost && !choice.advantage?.trim()) {
      failures.push(
        `Costly choice ${choice.id} has no player facing advantage`,
      );
    }
    const storesRelationshipConsequence = Object.keys(
      relationshipChanges(choice),
    ).length;
    const changesRoute = node.choices.some(
      (sibling) =>
        sibling.id !== choice.id &&
        resolveNext(sibling, initialState) !==
          resolveNext(choice, initialState),
    );
    if (
      hasKnownCost &&
      !choice.addFlags?.length &&
      !storesRelationshipConsequence &&
      !changesRoute
    ) {
      failures.push(`Costly choice ${choice.id} stores no consequence flag`);
    }
    for (const match of choice.detail.matchAll(visibleCostPattern)) {
      const stat = statKeyByLabel[match[3].toLowerCase()];
      const verb = match[1].toLowerCase();
      const direction =
        verb.startsWith('spend') || verb.startsWith('lose') ? -1 : 1;
      const visibleChange = direction * Number(match[2]);
      const actualChange = choice.changes?.[stat] ?? 0;
      if (actualChange !== visibleChange) {
        failures.push(
          `Choice ${choice.id} says ${match[0]} but changes ${stat} by ${actualChange}`,
        );
      }
    }
    for (const problem of choiceContractProblems(choice)) {
      failures.push(`Choice ${choice.id} ${problem}`);
    }
  }
}

const deliberateHiddenCost = choiceContractProblems({
  id: 'fixture-hidden-cost',
  label: 'Run through the fire.',
  detail: 'Reach the door first.',
  next: 'fixture-next',
  changes: { health: -1 },
  result: 'You reach it.',
});
if (
  !deliberateHiddenCost.some((problem) => problem.includes('hides 1 health'))
) {
  failures.push(
    'Choice contract validator does not reject a deliberate hidden cost',
  );
}
const deliberateFalseTrustGate = choiceContractProblems({
  id: 'fixture-false-trust',
  label: 'Ask Mara to take the shot.',
  detail: 'Available with deep Mara trust.',
  next: 'fixture-next',
  result: 'Mara acts.',
});
if (
  !deliberateFalseTrustGate.some((problem) =>
    problem.includes('trust without a gate'),
  )
) {
  failures.push(
    'Choice contract validator does not reject a deliberate false trust gate',
  );
}

for (const [id, node] of Object.entries(nodes)) {
  const spokenChoices = node.choices.filter((choice) =>
    isSpokenReplyLabel(choice.label),
  );
  if (!spokenChoices.length) continue;
  const paragraphs = node.body(initialState);
  const lastParagraph = paragraphs.at(-1) ?? '';
  if (!lastParagraphSupportsReply(lastParagraph)) {
    failures.push(
      `Spoken reply choices in ${id} need a spoken line in the last paragraph (${spokenChoices.map((choice) => choice.id).join(', ')})`,
    );
  }
}

function isSpokenReplyLabel(label) {
  const text = label.trim();
  if (/^[“"]/.test(text)) return true;
  if (/^Tell (her|him|them|[A-Z\p{Lu}])/u.test(text)) return true;
  if (/^(Promise|Admit|Answer)\b/i.test(text)) return true;
  if (/^Ask (who|what|how|why|whether|if)\b/i.test(text)) return true;
  if (/^Ask [\p{L}’']+ (what|who|how|why|whether|if)\b/iu.test(text))
    return true;
  if (/^(Demand|Challenge)\b/i.test(text)) return true;
  if (/^Offer [A-Z\p{Lu}]/u.test(text)) return true;
  if (/^Make [\p{L}’']+ answer\b/iu.test(text)) return true;
  if (/^Accept .+\baccount\b/i.test(text)) return true;
  return false;
}

function lastParagraphSupportsReply(paragraph) {
  return (
    /[“"]/.test(paragraph) ||
    /\bwaits for (an honest )?answer\b/i.test(paragraph)
  );
}

function stateKey(state) {
  const navigationFlags = new Set([
    'low-route',
    'ridge-route',
    'inspection-route',
    'captured-attacker',
    'c2-searched-inn',
    'c2-kept-crown-orders',
    'c2-trusted-maelin',
    'c2-has-pin-key',
    'c2-saved-attacker',
    'c2-mara-below',
    'c2-lysara-below',
    'c2-maelin-below',
    'c2-safe-removal',
    'c5-chose-mara-care',
    'c5-chose-lysara-care',
    'c5-chose-sorin-care',
    'c6-red-moot-war',
    'c6-red-moot-alliance',
    'c6-red-moot-neutral',
    'c7-copied-gate-diversion',
    'c7-teren-saw-gate-order',
    'c9-route-bargain',
    'c9-route-theft',
    'c9-route-exposure',
    'c10-offer-method-shared',
    'c10-offer-method-private',
    'c10-offer-method-oath',
    'c11-route-revolt',
    'c11-route-auction',
    'c11-route-force',
    'c12-gate-sealed',
    'c12-gate-consent-passage',
    'c12-gate-broken',
    'c12-gatekeeper',
    'c12-destination-road',
    'c12-destination-fortress',
    'c12-destination-threshold',
    'c12-destination-cinder-deep',
    'c12-relationship-together',
    'c12-relationship-distance',
    'c12-relationship-friendship',
    'c12-relationship-closed',
    'c12-relationship-political-truce',
    'c12-relationship-single',
  ]);
  const currentNode = nodes[state.nodeId];
  for (const choice of currentNode?.choices ?? []) {
    for (const field of [
      'requiresFlags',
      'showIfAnyFlags',
      'showIfAllFlags',
      'hideIfAnyFlags',
    ]) {
      for (const flag of choice[field] ?? []) navigationFlags.add(flag);
    }
  }
  const requirementCaps = {
    health: 2,
    resolve: 4,
    command: 2,
    oathfire: 2,
    medicine: 1,
  };
  const stats = Object.entries(state.stats)
    .map(
      ([key, value]) =>
        `${key}:${Math.min(value, requirementCaps[key] ?? value)}`,
    )
    .join('|');
  const flags = state.flags
    .filter((flag) => navigationFlags.has(flag))
    .sort()
    .join('|');
  const continuityDimensions = [];
  if (state.chapter >= 6) {
    const vaorOutcome = state.flags.includes('c5-freed-vaor')
      ? 'gift'
      : state.flags.includes('c5-took-ember-by-force')
        ? 'theft'
        : state.flags.includes('c5-vaor-pact')
          ? 'pact'
          : 'unknown';
    const serviceMerit = [
      'c6-whole-herd-saved',
      'c6-saved-all-herders',
      'c6-forge-service-complete',
      'c6-shrine-service-complete',
      'c6-trial-won-moot',
      'c6-oath-recognised-red-moot',
      'c6-oath-crown-restitution',
      'c6-oath-defends-refusal',
    ].some((flag) => state.flags.includes(flag));
    continuityDimensions.push(
      `vaor:${vaorOutcome}`,
      `merit:${serviceMerit}`,
      `respect:${state.flags.includes('c6-korran-respect')}`,
      `origin:${state.flags.includes('c6-declared-ember-origin')}`,
      `pending:${state.flags.includes('c6-ember-disclosure-pending')}`,
      `refused:${state.flags.includes('c6-refused-ember-disclosure')}`,
      `concealed:${state.flags.includes('c6-concealed-ember-theft')}`,
      `limited:${state.flags.includes('c6-oath-honest-limit')}`,
    );
  }
  if (state.chapter >= 7) {
    const activeSteppeOath =
      [
        'c6-oath-recognised-red-moot',
        'c6-oath-crown-restitution',
        'c6-oath-defends-refusal',
        'c6-oath-honest-limit',
        'c6-oath-investigate-unsea',
      ].find((flag) => state.flags.includes(flag)) ?? 'none';
    continuityDimensions.push(`steppe-oath:${activeSteppeOath}`);
  }
  if (state.chapter >= 8) {
    const damagedSeed = [
      'c5-stair-scorched-thread',
      'c5-seed-scorched-river',
      'c5-seed-strained-memory',
      'c5-lysara-reading-strain',
      'c6-seed-critically-weakened',
      'c6-seed-scorched-by-horn',
      'c6-lysara-hand-strained-by-horn',
      'c8-seed-weakened-saving-pell',
    ].some((flag) => state.flags.includes(flag));
    continuityDimensions.push(`seed-damaged:${damagedSeed}`);
  }
  const relationships = Object.entries(state.relationships)
    .map(
      ([person, score]) =>
        `${person}:${Math.min(score.trust, 6)}:${Math.min(score.attraction, 4)}:${Math.min(score.respect ?? 0, 4)}:${Math.min(score.friction ?? 0, 3)}:${score.intent ?? 'unresolved'}`,
    )
    .join('|');
  return `${state.nodeId}|${stats}|${relationships}|${flags}|${continuityDimensions.join('|')}`;
}

const chapterTwoKnownTerms = Object.keys(statLabels).filter(
  (term) => term !== 'medicine',
);
const chapterTwoKnownStoryTerms = ['Oathwarden', 'glass seed'];
const chapterTwoBase = {
  ...initialState,
  nodeId: 'c2-arrival',
  chapter: 2,
  chapterChoices: 0,
  completedChapters: [1],
  stats: {
    ...initialState.stats,
    health: 8,
    resolve: 6,
    command: 4,
    oathfire: 4,
    medicine: 1,
  },
};
const chapterThreeKnownTerms = Object.keys(statLabels);
const chapterThreeKnownStoryTerms = [
  ...chapterTwoKnownStoryTerms,
  'mire hound',
  'road pin',
];
const chapterThreeBase = {
  ...initialState,
  nodeId: 'c3-arrival',
  chapter: 3,
  chapterChoices: 0,
  completedChapters: [1, 2],
  stats: {
    ...initialState.stats,
    health: 7,
    resolve: 6,
    command: 5,
    oathfire: 4,
    medicine: 0,
  },
};
const chapterFourKnownTerms = Object.keys(statLabels);
const chapterFourKnownStoryTerms = [
  ...chapterThreeKnownStoryTerms,
  'Mileless Bridge',
  'World Nail',
];
const chapterFourBase = {
  ...initialState,
  nodeId: 'c4-bridge-start',
  chapter: 4,
  chapterChoices: 0,
  completedChapters: [1, 2, 3],
  stats: {
    ...initialState.stats,
    health: 7,
    resolve: 6,
    command: 5,
    oathfire: 4,
    medicine: 0,
  },
};
const chapterFiveKnownTerms = Object.keys(statLabels);
const chapterFiveKnownStoryTerms = [
  ...chapterFourKnownStoryTerms,
  'nine Nails',
  'Dragonspine',
  'Regent Malrec',
];
const chapterFiveBase = {
  ...initialState,
  nodeId: 'c5-north-road',
  chapter: 5,
  chapterChoices: 0,
  completedChapters: [1, 2, 3, 4],
  stats: {
    ...initialState.stats,
    health: 7,
    resolve: 7,
    command: 5,
    oathfire: 4,
    medicine: 0,
  },
};
const chapterSixKnownTerms = Object.keys(statLabels);
const chapterSixKnownStoryTerms = [
  ...chapterFiveKnownStoryTerms,
  'cold fire',
  'Vaor',
  'Orivane',
  'Kharad Vey',
];
const chapterSixBase = {
  ...initialState,
  nodeId: 'c6-steppe-road',
  chapter: 6,
  chapterChoices: 0,
  completedChapters: [1, 2, 3, 4, 5],
  flags: ['c5-freed-vaor'],
  stats: {
    ...initialState.stats,
    health: 7,
    resolve: 7,
    command: 5,
    oathfire: 5,
    medicine: 0,
  },
};
const chapterSevenKnownTerms = Object.keys(statLabels);
const chapterSevenKnownStoryTerms = [
  ...chapterSixKnownStoryTerms,
  'Ember Steppe',
  'ancestor storm',
  'Black Gate',
  'Red Moot',
  'Ilyra Fen',
  'Threadread',
  'Unsea',
];
const chapterSevenBase = {
  ...initialState,
  nodeId: 'c7-red-horizon',
  chapter: 7,
  chapterChoices: 0,
  completedChapters: [1, 2, 3, 4, 5, 6],
  flags: ['c5-freed-vaor', 'c6-red-moot-alliance'],
  stats: {
    ...initialState.stats,
    health: 7,
    resolve: 7,
    command: 5,
    oathfire: 5,
    medicine: 0,
  },
};
const chapterEightKnownTerms = Object.keys(statLabels);
const chapterEightKnownStoryTerms = [
  ...chapterSevenKnownStoryTerms,
  'Crown March',
  'dead command',
  'Marshal Teren Voss',
];
const chapterEightBase = {
  ...initialState,
  nodeId: 'c8-gate-ring',
  chapter: 8,
  chapterChoices: 0,
  completedChapters: [1, 2, 3, 4, 5, 6, 7],
  flags: ['c5-freed-vaor', 'c6-red-moot-alliance', 'c7-gained-full-army'],
  stats: {
    ...initialState.stats,
    health: 7,
    resolve: 7,
    command: 5,
    oathfire: 5,
    medicine: 1,
  },
};
const chapterNineKnownTerms = Object.keys(statLabels);
const chapterNineKnownStoryTerms = [
  ...chapterEightKnownStoryTerms,
  'Futureless',
  'Ash Compact',
  'Vexa Ash',
];
const chapterNineBase = {
  ...initialState,
  nodeId: 'c9-embassy-watch',
  chapter: 9,
  chapterChoices: 0,
  completedChapters: [1, 2, 3, 4, 5, 6, 7, 8],
  flags: [
    'c5-freed-vaor',
    'c6-red-moot-alliance',
    'c7-gained-full-army',
    'c8-united-wardens',
    'c8-preserved-original-ledgers',
    'c8-surrendered-homecoming',
    'c8-vexa-entered-publicly',
    'c8-pell-survived',
    'c8-complete-lock-map',
  ],
  stats: {
    ...initialState.stats,
    health: 7,
    resolve: 7,
    command: 5,
    oathfire: 5,
    medicine: 1,
  },
};
const chapterTenKnownTerms = Object.keys(statLabels);
const chapterTenKnownStoryTerms = [
  ...chapterNineKnownStoryTerms,
  'Cinder Deep',
  'true name',
  'House Sableglass',
];
const chapterTenBase = {
  ...chapterNineBase,
  nodeId: 'c10-ash-road',
  chapter: 10,
  chapterChoices: 0,
  completedChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  flags: [
    ...chapterNineBase.flags,
    'c9-route-bargain',
    'c9-fragment-recovered-bargain',
    'c9-return-promise-owned',
    'c9-true-name-freely-disclosed',
    'c9-kept-true-name-clause',
    'c9-learned-desire-offer-danger',
    'c9-vexa-guarded-trust',
    'c9-malrec-cinder-alliance-proved',
    'c9-roster-futureless',
    'c9-no-mortal-partner-crossed',
    'c9-crossed-black-gate',
  ],
};
const chapterElevenKnownTerms = Object.keys(statLabels);
const chapterElevenKnownStoryTerms = [
  ...chapterTenKnownStoryTerms,
  'Ash Road',
  'Vathis',
  'Free Ledger',
];
const chapterElevenBase = {
  ...chapterTenBase,
  nodeId: 'c11-vathis-gate',
  chapter: 11,
  chapterChoices: 0,
  completedChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  flags: [
    ...chapterTenBase.flags,
    'c10-offer-method-shared',
    'c10-shared-terms-only',
    'c10-listening-ash-broken',
    'c10-exact-roster-crossed-bridge',
    'c10-road-danger-ended',
    'c10-limits-respected',
    'c10-free-ledger-guide-accepted',
    'c10-free-ledger-petition-owed',
    'c10-reached-vathis',
  ],
};
const chapterTwelveKnownTerms = Object.keys(statLabels);
const chapterTwelveKnownStoryTerms = [
  ...chapterElevenKnownStoryTerms,
  'Price Court',
  'invasion right',
  'Elian',
];
const chapterTwelveBase = {
  ...chapterElevenBase,
  nodeId: 'c12-inner-gate',
  chapter: 12,
  chapterChoices: 0,
  completedChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  flags: [
    ...chapterElevenBase.flags,
    'c11-engine-control-proved',
    'c11-route-revolt',
    'c11-revolt-collar-proof',
    'c11-revolt-refusal-record',
    'c11-elian-voice-heard',
    'c11-elian-record-bounded',
    'c11-alliance-free-ledger-refusers',
    'c11-inner-gate-opening',
  ],
};

const chapterBaseStates = {
  1: initialState,
  2: chapterTwoBase,
  3: chapterThreeBase,
  4: chapterFourBase,
  5: chapterFiveBase,
  6: chapterSixBase,
  7: chapterSevenBase,
  8: chapterEightBase,
  9: chapterNineBase,
  10: chapterTenBase,
  11: chapterElevenBase,
  12: chapterTwelveBase,
};

function nodeIsInChapter(nodeId, chapter) {
  if (chapter === 1) return !/^c(?:[2-9]|10|11|12)-/.test(nodeId);
  return nodeId.startsWith(`c${chapter}-`);
}

function sceneObjectiveText(node, state) {
  return typeof node.objective === 'function'
    ? node.objective(state)
    : node.objective;
}

function visibleNodeText(node, state) {
  const body = typeof node.body === 'function' ? node.body(state) : node.body;
  return [
    node.kicker,
    node.title,
    node.location,
    sceneObjectiveText(node, state),
    node.lesson?.title,
    node.lesson?.body,
    ...body,
    ...node.choices.flatMap((choice) => [
      choice.label,
      choice.detail,
      choice.advantage,
      choice.result,
    ]),
  ]
    .filter(Boolean)
    .join(' ');
}

const allStoryFlags = [
  ...new Set(
    Object.values(nodes)
      .flatMap((node) => node.choices)
      .flatMap((choice) => choice.addFlags ?? []),
  ),
];

for (const contract of implementedChapterContracts) {
  if (!nodes[contract.entryNode]) {
    failures.push(
      `Continuity contract has a missing Chapter ${contract.chapter} entry: ${contract.entryNode}`,
    );
  }
  if ((nodes[contract.entryNode]?.introducesStoryTerms?.length ?? 0) > 3) {
    failures.push(
      `Chapter ${contract.chapter} opening introduces more than three story terms before the first decision`,
    );
  }
  for (const endingId of contract.endingNodes) {
    const ending = nodes[endingId];
    if (!ending?.final)
      failures.push(
        `Continuity contract ending is missing or not final: ${endingId}`,
      );
    if (
      contract.nextNode !== null &&
      ending?.nextChapter !== contract.nextNode
    ) {
      failures.push(
        `${endingId} no longer reaches the protected next plot node ${contract.nextNode}`,
      );
    }
  }

  const baseState = chapterBaseStates[contract.chapter];
  const chapterNodes = nodeOrder.filter((nodeId) =>
    nodeIsInChapter(nodeId, contract.chapter),
  );
  const sampleStates = [
    baseState,
    ...allStoryFlags.map((flag) => ({
      ...baseState,
      flags: [...baseState.flags, flag],
    })),
  ];
  const permitted = new Set([
    contract.series,
    ...contract.activeGuests,
    ...contract.legacyOnlyHeroes,
  ]);

  for (const nodeId of chapterNodes) {
    const node = nodes[nodeId];
    for (const state of sampleStates) {
      const text = visibleNodeText(node, state);
      for (const [hero, displayName] of Object.entries(playableHeroes)) {
        if (
          !permitted.has(hero) &&
          new RegExp(`\\b${displayName}\\b`, 'i').test(text)
        ) {
          failures.push(
            `${nodeId} introduces ${displayName} outside an approved crossover or legacy window`,
          );
          break;
        }
      }
    }
  }

  for (const [hero, introductionNode] of Object.entries(
    contract.introductions ?? {},
  )) {
    const introductionIndex = nodeOrder.indexOf(introductionNode);
    const displayName = playableHeroes[hero];
    for (const nodeId of chapterNodes) {
      if (nodeOrder.indexOf(nodeId) >= introductionIndex) continue;
      if (
        new RegExp(`\\b${displayName}\\b`, 'i').test(
          visibleNodeText(nodes[nodeId], baseState),
        )
      ) {
        failures.push(
          `${displayName} is named in ${nodeId} before the protected introduction at ${introductionNode}`,
        );
      }
    }
  }
}

for (const transition of protectedPlotTransitions) {
  for (const endingId of transition.endingNodes) {
    const chapter =
      implementedChapterContracts.find((contract) =>
        contract.endingNodes.includes(endingId),
      )?.chapter ?? 1;
    const endingText = visibleNodeText(
      nodes[endingId],
      chapterBaseStates[chapter],
    );
    for (const term of transition.requiredTerms) {
      if (!endingText.toLocaleLowerCase().includes(term.toLocaleLowerCase())) {
        failures.push(
          `${endingId} dropped protected plot term ${term} from ${transition.id}`,
        );
      }
    }
  }
}

const worldMapSource = await readFile('docs/WORLD_MAP.md', 'utf8');
for (const [hero, route] of Object.entries(documentedSeriesRoutes)) {
  const writtenRoute = route.join(' to ');
  if (!worldMapSource.includes(writtenRoute)) {
    failures.push(
      `WORLD_MAP.md no longer contains the protected ${hero} route: ${writtenRoute}`,
    );
  }
}

const seriesBibleSource = await readFile(
  'docs/CHARACTER_SERIES_BIBLE.md',
  'utf8',
);
for (const meeting of firstMeetingContracts) {
  const heroNames = meeting.heroes.map((hero) => playableHeroes[hero]);
  if (
    !seriesBibleSource.includes(heroNames[0]) ||
    !seriesBibleSource.includes(heroNames[1]) ||
    !seriesBibleSource.includes(meeting.place)
  ) {
    failures.push(
      `The documented first meeting for ${heroNames.join(' and ')} is missing its protected location ${meeting.place}`,
    );
  }
}
const storyTermRules = {
  Oathwarden: {
    use: /\bOathwarden\b/i,
    introduction:
      /Caelan is an Oathwarden\. When he makes a serious promise aloud/i,
  },
  'glass seed': {
    use: /\bglass seed\b/i,
    introduction:
      /shows you a glass seed, a clear shell holding a curl of green light/i,
  },
  'mire hound': {
    use: /\bmire hound\b/i,
    introduction: /“Mire hound,” she says, giving the creature a name/i,
  },
  'road pin': {
    use: /\broad pin\b/i,
    introduction:
      /(?:words remain deep enough to read: road pin|stamped into the bracket: ROAD PIN|called it a road pin.*iron anchor)/is,
  },
  'Mileless Bridge': {
    use: /\bMileless Bridge\b/i,
    introduction: /route to the hidden Mileless Bridge/i,
  },
  'World Nail': {
    use: /\bWorld Nail\b/i,
    introduction: /names the iron at last\. “World Nail,”/i,
  },
  'nine Nails': {
    use: /\bnine (?:World )?Nails\b/i,
    introduction: /(?:There are nine World Nails|one of nine anchors)/i,
  },
  Dragonspine: {
    use: /\bDragonspine\b/i,
    introduction:
      /Dragonspine (?:is the northern mountain realm|guards another Nail)/i,
  },
  'Regent Malrec': {
    use: /\bRegent Malrec\b/i,
    introduction:
      /Regent Malrec Vale rules Asterra while the young Queen is ill/i,
  },
  'cold fire': {
    use: /\bcold fire\b/i,
    introduction: /While cold fire burns nearby.*Health cannot recover/i,
  },
  Vaor: {
    use: /\bVaor\b/i,
    introduction: /Vaor is an ancient dragon imprisoned beside the fire Nail/i,
  },
  Orivane: {
    use: /\bOrivane\b/i,
    introduction:
      /Orivane (?:willingly )?(?:gave|gives) her living heart to create the Concord/i,
  },
  'Kharad Vey': {
    use: /\bKharad Vey\b/i,
    introduction:
      /Kharad Vey, the moving orc town|Kharad Vey rises.*(?:travelling orc town|town is built).*twelve wooden platforms|Kharad Vey moves across the red steppe.*travelling orc town/i,
  },
  'Ember Steppe': {
    use: /\bEmber Steppe\b/i,
    introduction: /This (?:red country )?is the Ember Steppe/i,
  },
  'ancestor storm': {
    use: /\bancestor storm\b/i,
    introduction: /Ancestor storm.*honoured dead/i,
  },
  'Black Gate': {
    use: /\bBlack Gate\b/i,
    introduction:
      /black stone you saw.*call it the Black Gate|black stone you saw is the Black Gate/i,
  },
  'Red Moot': {
    use: /\bRed Moot\b/i,
    introduction: /Red Moot meets at sunset/i,
  },
  'Ilyra Fen': {
    use: /\bIlyra Fen\b/i,
    introduction: /Ilyra Fen steps onto the (?:moving )?deck/i,
  },
  Threadread: {
    use: /\bThreadread\b/i,
    introduction:
      /Threadread shows connection|see emotional and magical connections/i,
  },
  Unsea: {
    use: /\bUnsea\b/i,
    introduction:
      /calls the hidden (?:current|place) beneath erased roads the Unsea/i,
  },
  'Crown March': {
    use: /\bCrown March\b/i,
    introduction:
      /(?:Crown March is an army of Asterra|force ahead is the Crown March, Asterra’s main field army)/i,
  },
  'dead command': {
    use: /\bdead command\b/i,
    introduction:
      /(?:Dead command means a voice inside the ancestor storm|storm is also copying dead officers’ voices.*called dead command|call that a dead command.*dead officer’s voice.*without a living messenger)/is,
  },
  'Marshal Teren Voss': {
    use: /\bMarshal Teren Voss\b/i,
    introduction: /Marshal Teren Voss rides beneath a white truce cloth/i,
  },
  Futureless: {
    use: /\bFutureless\b/i,
    introduction: /call them the Futureless/i,
  },
  'Ash Compact': {
    use: /\bAsh Compact\b/i,
    introduction: /Ash Compact is one organised group/i,
  },
  'Vexa Ash': {
    use: /\bVexa Ash\b/i,
    introduction: /“Vexa Ash,” she says/i,
  },
  'Cinder Deep': {
    use: /\bCinder Deep\b/i,
    introduction: /first Cinder Deep embassy/i,
  },
  'true name': {
    use: /\btrue name (?:gives|is|guides|for one use|so the fragment)\b/i,
    introduction: /private answer a person chooses for who they are/i,
  },
  'House Sableglass': {
    use: /\bHouse Sableglass\b/i,
    introduction:
      /contract seal shaped like six joined fingers.*House Sableglass/is,
  },
  'Ash Road': {
    use: /\bAsh Road\b/i,
    introduction:
      /(?:calls it the Ash Road after everyone sees its surface move|“Vathis,” she says\. “The Ash Road reaches its public gate)/i,
  },
  Vathis: {
    use: /\bVathis\b/i,
    introduction: /points to the distant towers\. “Vathis,” she says/i,
  },
  'Free Ledger': {
    use: /\bFree Ledger\b/i,
    introduction:
      /calls them the Free Ledger only after every listening mark is gone/i,
  },
  'Price Court': {
    use: /\bPrice Court\b/i,
    introduction:
      /Price Court.+sells public use of the city|Price Court controls Vathis’s public contracts and auction/i,
  },
  'invasion right': {
    use: /\binvasion right\b/i,
    introduction:
      /permits one Gate opening, one named force, and one bell inside Edrath/i,
  },
  Elian: {
    use: /\bElian\b/i,
    introduction: /“My name is Elian,” the voice says/i,
  },
};
for (const [id, node] of Object.entries(nodes)) {
  const sampleState = id.startsWith('c12-')
    ? chapterTwelveBase
    : id.startsWith('c11-')
      ? chapterElevenBase
      : id.startsWith('c10-')
        ? chapterTenBase
        : id.startsWith('c9-')
          ? chapterNineBase
          : id.startsWith('c8-')
            ? chapterEightBase
            : id.startsWith('c7-')
              ? chapterSevenBase
              : id.startsWith('c6-')
                ? chapterSixBase
                : id.startsWith('c5-')
                  ? chapterFiveBase
                  : id.startsWith('c4-')
                    ? chapterFourBase
                    : id.startsWith('c3-')
                      ? chapterThreeBase
                      : id.startsWith('c2-')
                        ? chapterTwoBase
                        : initialState;
  const introductionText = [
    node.lesson?.title,
    node.lesson?.body,
    ...node.body(sampleState),
  ]
    .filter(Boolean)
    .join(' ');
  for (const term of node.introducesStoryTerms ?? []) {
    const rule = storyTermRules[term];
    if (!rule) {
      failures.push(
        `Story term ${term} introduced in ${id} is missing from the controlled term registry`,
      );
    } else if (!rule.introduction.test(introductionText)) {
      failures.push(`Story term ${term} is not plainly introduced in ${id}`);
    }
  }
}
const retiredPlotPhrases = [
  /eleven years/i,
  /other versions?/i,
  /different years/i,
  /false Caelan/i,
  /false escort/i,
  /the man with your face/i,
  /a trail through memory/i,
  /\bSenna\b/i,
  /room (?:built )?tomorrow/i,
  /died twice/i,
  /living Nilo/i,
];
for (const [id, node] of Object.entries(nodes)) {
  if (!id.startsWith('c2-') && !id.startsWith('c3-')) continue;
  const sampleState = id.startsWith('c2-') ? chapterTwoBase : chapterThreeBase;
  const activeText = [
    node.kicker,
    node.title,
    node.location,
    sceneObjectiveText(node, sampleState),
    node.lesson?.title,
    node.lesson?.body,
    ...node.body(sampleState),
    ...node.choices.flatMap((choice) => [
      choice.label,
      choice.detail,
      choice.result,
    ]),
  ]
    .filter(Boolean)
    .join(' ');
  for (const phrase of retiredPlotPhrases) {
    if (phrase.test(activeText))
      failures.push(`Retired plot phrase ${phrase} remains active in ${id}`);
  }
}

const closePointOfViewPattern = /\byou(?:r)?\b/i;
for (const chapter of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
  const chapterNodes = nodeOrder.filter((id) =>
    chapter === 1
      ? !/^c(?:[2-9]|10|11|12)-/.test(id)
      : id.startsWith(`c${chapter}-`),
  );
  const sampleState =
    chapter === 1
      ? initialState
      : chapter === 2
        ? chapterTwoBase
        : chapter === 3
          ? chapterThreeBase
          : chapter === 4
            ? chapterFourBase
            : chapter === 5
              ? chapterFiveBase
              : chapter === 6
                ? chapterSixBase
                : chapter === 7
                  ? chapterSevenBase
                  : chapter === 8
                    ? chapterEightBase
                    : chapter === 9
                      ? chapterNineBase
                      : chapter === 10
                        ? chapterTenBase
                        : chapter === 11
                          ? chapterElevenBase
                          : chapterTwelveBase;
  const closeNodes = chapterNodes.filter((id) =>
    closePointOfViewPattern.test(nodes[id].body(sampleState).join(' ')),
  );
  if (closeNodes.length / chapterNodes.length < 0.6) {
    failures.push(
      `Chapter ${chapter} close point of view coverage fell below 60 percent (${closeNodes.length} of ${chapterNodes.length} scenes: ${closeNodes.join(', ')})`,
    );
  }
}

function renderedBody(nodeId, state) {
  return nodes[nodeId].body(state).join(' ');
}

function highResourceState(baseState, flags = baseState.flags) {
  return {
    ...baseState,
    flags: [...flags],
    stats: Object.fromEntries(
      Object.keys(baseState.stats).map((key) => [key, 20]),
    ),
    relationships: Object.fromEntries(
      Object.entries(baseState.relationships).map(([person, score]) => [
        person,
        {
          ...score,
          trust: 20,
          attraction: 20,
          respect: 20,
          friction: 0,
          intent: 'unresolved',
        },
      ]),
    ),
  };
}

function playableNodeSnapshot(nodeId, state) {
  const node = nodes[nodeId];
  return JSON.stringify({
    body: node.body(state),
    choices: node.choices.map((choice) => ({
      id: choice.id,
      visible: isChoiceVisible(choice, state),
      available: canChoose(choice, state),
      next: resolveNext(choice, state),
    })),
  });
}

function mechanicalNodeSnapshot(nodeId, state) {
  const node = nodes[nodeId];
  return JSON.stringify(
    node.choices.map((choice) => ({
      id: choice.id,
      visible: isChoiceVisible(choice, state),
      available: canChoose(choice, state),
      next: resolveNext(choice, state),
    })),
  );
}

function stateForChoice(baseState, choice) {
  const flags = new Set(baseState.flags);
  for (const flag of choice.requiresFlags ?? []) flags.add(flag);
  for (const flag of choice.showIfAllFlags ?? []) flags.add(flag);
  if (choice.showIfAnyFlags?.length) flags.add(choice.showIfAnyFlags[0]);
  const exclusiveFlagGroups = [
    ['c5-freed-vaor', 'c5-took-ember-by-force', 'c5-vaor-pact'],
    ['c6-red-moot-war', 'c6-red-moot-alliance', 'c6-red-moot-neutral'],
    [
      'c7-lio-prisoner',
      'c7-lio-returned',
      'c7-lio-joined',
      'c7-lio-under-guard',
    ],
  ];
  for (const group of exclusiveFlagGroups) {
    const selected = group.find(
      (flag) =>
        choice.requiresFlags?.includes(flag) ||
        choice.showIfAllFlags?.includes(flag) ||
        choice.showIfAnyFlags?.includes(flag),
    );
    if (!selected) continue;
    for (const flag of group) {
      if (flag !== selected) flags.delete(flag);
    }
  }
  return highResourceState(baseState, [...flags]);
}

function flagChangesLaterMechanics(flag, ownerNodeId, baseState) {
  const ownerChapter =
    implementedChapterContracts.find((contract) =>
      nodeIsInChapter(ownerNodeId, contract.chapter),
    )?.chapter ?? 1;
  const baseFlags = baseState.flags.filter((candidate) => candidate !== flag);
  return nodeOrder.some((nodeId) => {
    if (nodeId === ownerNodeId || nodes[nodeId].final) return false;
    const nodeChapter =
      implementedChapterContracts.find((contract) =>
        nodeIsInChapter(nodeId, contract.chapter),
      )?.chapter ?? 1;
    if (nodeChapter < ownerChapter) return false;
    const supportSets = [[]];
    for (const choice of nodes[nodeId].choices) {
      const conditions = [
        ...(choice.requiresFlags ?? []),
        ...(choice.showIfAllFlags ?? []),
      ].filter((candidate) => candidate !== flag);
      const visibilityFlags = [
        ...(choice.requiresFlags ?? []),
        ...(choice.showIfAllFlags ?? []),
        ...(choice.showIfAnyFlags ?? []),
        ...(choice.hideIfAnyFlags ?? []),
      ];
      if (visibilityFlags.includes(flag)) {
        if (!(choice.showIfAnyFlags ?? []).includes(flag)) {
          const showAnySupport = (choice.showIfAnyFlags ?? [])[0];
          if (showAnySupport) conditions.push(showAnySupport);
        }
        supportSets.push(conditions);
      }
    }
    return supportSets.some((support) => {
      const supportedFlags = [...new Set([...baseFlags, ...support])];
      const withoutFlag = highResourceState(baseState, supportedFlags);
      const withFlag = highResourceState(baseState, [...supportedFlags, flag]);
      return (
        mechanicalNodeSnapshot(nodeId, withoutFlag) !==
        mechanicalNodeSnapshot(nodeId, withFlag)
      );
    });
  });
}

function flagChangesLaterPlay(flag, ownerNodeId, baseState) {
  const ownerChapter =
    implementedChapterContracts.find((contract) =>
      nodeIsInChapter(ownerNodeId, contract.chapter),
    )?.chapter ?? 1;
  const baseFlags = baseState.flags.filter((candidate) => candidate !== flag);
  const withoutFlag = highResourceState(baseState, baseFlags);
  const withFlag = highResourceState(baseState, [...baseFlags, flag]);
  return nodeOrder.some((nodeId) => {
    if (nodeId === ownerNodeId || nodes[nodeId].final) return false;
    const nodeChapter =
      implementedChapterContracts.find((contract) =>
        nodeIsInChapter(nodeId, contract.chapter),
      )?.chapter ?? 1;
    if (nodeChapter < ownerChapter) return false;
    return (
      playableNodeSnapshot(nodeId, withoutFlag) !==
      playableNodeSnapshot(nodeId, withFlag)
    );
  });
}

function firstLaterBodyConsumer(flag, ownerNodeId, baseState) {
  const ownerChapter =
    implementedChapterContracts.find((contract) =>
      nodeIsInChapter(ownerNodeId, contract.chapter),
    )?.chapter ?? 1;
  const baseFlags = baseState.flags.filter((candidate) => candidate !== flag);
  const withoutFlag = highResourceState(baseState, baseFlags);
  const withFlag = highResourceState(baseState, [...baseFlags, flag]);
  return nodeOrder.find((nodeId) => {
    if (nodeId === ownerNodeId || nodes[nodeId].final) return false;
    const nodeChapter =
      implementedChapterContracts.find((contract) =>
        nodeIsInChapter(nodeId, contract.chapter),
      )?.chapter ?? 1;
    if (nodeChapter < ownerChapter) return false;
    return (
      JSON.stringify(nodes[nodeId].body(withoutFlag)) !==
      JSON.stringify(nodes[nodeId].body(withFlag))
    );
  });
}

function declaredConsumerNodes(flag) {
  return Object.values(nodes).filter((node) =>
    [
      ...(node.activeConsequences?.complications ?? []),
      ...(node.activeConsequences?.reactions ?? []),
      ...(activeConsequenceContracts[node.id]?.complications ?? []),
      ...(activeConsequenceContracts[node.id]?.reactions ?? []),
    ].includes(flag),
  );
}

function declaredConsumerChangesActivePlay(
  flag,
  ownerNodeId,
  producerState,
  producerChoice,
) {
  const ownerIndex = nodeOrder.indexOf(ownerNodeId);
  const companionFlags = (producerChoice?.addFlags ?? []).filter(
    (candidate) => candidate !== flag,
  );
  return declaredConsumerNodes(flag).some((node) => {
    const consumerIndex = nodeOrder.indexOf(node.id);
    if (consumerIndex <= ownerIndex || node.final) return false;
    const baseFlags = [
      ...new Set([
        ...producerState.flags.filter((candidate) => candidate !== flag),
        ...companionFlags,
      ]),
    ];
    const supportSets = [
      [],
      ...producedFlagUniverse
        .filter(
          (candidate) => candidate !== flag && !baseFlags.includes(candidate),
        )
        .map((candidate) => [candidate]),
    ];
    return supportSets.some((support) => {
      const supportedFlags = [...new Set([...baseFlags, ...support])];
      const withoutFlag = highResourceState(producerState, supportedFlags);
      const withFlag = highResourceState(producerState, [
        ...supportedFlags,
        flag,
      ]);
      return (
        playableNodeSnapshot(node.id, withoutFlag) !==
        playableNodeSnapshot(node.id, withFlag)
      );
    });
  });
}

function producerForFlag(flag) {
  for (const node of Object.values(nodes)) {
    for (const choice of node.choices) {
      if (choice.addFlags?.includes(flag)) return { node, choice };
    }
  }
  return null;
}

function flagHasMeaningfulConsumer(
  flag,
  ownerNodeId,
  producerState,
  producerChoice,
) {
  return consumerKindsAreMeaningful({
    mechanical: flagChangesLaterMechanics(flag, ownerNodeId, producerState),
    declaredActive: declaredConsumerChangesActivePlay(
      flag,
      ownerNodeId,
      producerState,
      producerChoice,
    ),
    exactFutureContract: Boolean(terminalHistoryFlagReasons[flag]),
  });
}

function consumerKindsAreMeaningful(kinds) {
  return Boolean(
    kinds.mechanical || kinds.declaredActive || kinds.exactFutureContract,
  );
}

function normalisedConsequence(choice) {
  return JSON.stringify({
    advantage:
      choice.advantage?.replace(/\s+/g, ' ').trim().toLowerCase() ?? '',
    result: choice.result.replace(/\s+/g, ' ').trim().toLowerCase(),
    flags: [...(choice.addFlags ?? [])].sort((left, right) =>
      left.localeCompare(right),
    ),
  });
}

function choiceHasDistinctConsequence(choice, freeSiblings) {
  const signature = normalisedConsequence(choice);
  return (
    Boolean(choice.advantage?.trim()) &&
    Boolean(choice.result.trim()) &&
    Boolean(choice.addFlags?.length) &&
    freeSiblings.every(
      (sibling) => normalisedConsequence(sibling) !== signature,
    )
  );
}

const paidSiblingContracts = [];
for (const node of Object.values(nodes)) {
  const chapter =
    implementedChapterContracts.find((contract) =>
      nodeIsInChapter(node.id, contract.chapter),
    )?.chapter ?? 1;
  const baseState = highResourceState(chapterBaseStates[chapter]);
  for (const choice of node.choices) {
    const hasResourceCost = Object.values(choice.changes ?? {}).some(
      (value) => (value ?? 0) < 0,
    );
    if (!hasResourceCost) continue;
    const choiceState = stateForChoice(baseState, choice);
    const destination = resolveNext(choice, choiceState);
    const freeSiblings = node.choices.filter(
      (sibling) =>
        sibling.id !== choice.id &&
        isChoiceVisible(sibling, choiceState) &&
        resolveNext(sibling, choiceState) === destination &&
        !Object.values(sibling.changes ?? {}).some((value) => (value ?? 0) < 0),
    );
    if (!freeSiblings.length) continue;
    const materialFlags = (choice.addFlags ?? []).filter((flag) =>
      flagHasMeaningfulConsumer(flag, node.id, choiceState, choice),
    );
    const reachesFinalOutcome = Boolean(nodes[destination]?.final);
    paidSiblingContracts.push({
      choiceId: choice.id,
      materialFlags,
      distinct: choiceHasDistinctConsequence(choice, freeSiblings),
    });
    if (!reachesFinalOutcome && !materialFlags.length) {
      failures.push(
        `Paid sibling choice ${choice.id} has no flag that changes later playable state`,
      );
    }
    if (!choiceHasDistinctConsequence(choice, freeSiblings)) {
      failures.push(
        `Paid sibling choice ${choice.id} does not record a distinct consequence from its free sibling`,
      );
    }
  }
}

const deliberateDominatedChoice = {
  id: 'fixture-dominated-paid-choice',
  advantage: 'Reach the same door.',
  result: 'You reach the same door.',
  addFlags: ['fixture-same-result'],
};
const deliberateFreeSibling = {
  ...deliberateDominatedChoice,
  id: 'fixture-free-choice',
};
if (
  choiceHasDistinctConsequence(deliberateDominatedChoice, [
    deliberateFreeSibling,
  ])
) {
  failures.push(
    'Generic paid sibling audit does not reject a deliberately dominated choice',
  );
}
const duplicateProducerFixture = {
  addFlags: ['fixture-duplicate-producer-only'],
};
if (
  flagHasMeaningfulConsumer(
    'fixture-duplicate-producer-only',
    'gate-yard',
    initialState,
    duplicateProducerFixture,
  )
) {
  failures.push(
    'Flag lifecycle audit mistakes duplicate producers for a meaningful consumer',
  );
}
if (
  consumerKindsAreMeaningful({
    bodyRecap: true,
    journalRecap: true,
    endingRecap: true,
  })
) {
  failures.push(
    'Lifecycle audit mistakes body, journal, or ending recap for a meaningful consumer',
  );
}

const lifecycleAuditedChapters = implementedChapterContracts.map(
  (contract) => contract.chapter,
);
const lifecycleAuditedFlags = [
  ...new Set(
    Object.values(nodes)
      .filter((node) =>
        lifecycleAuditedChapters.some((chapter) =>
          nodeIsInChapter(node.id, chapter),
        ),
      )
      .flatMap((node) => node.choices)
      .flatMap((choice) => choice.addFlags ?? []),
  ),
];
const lifecycleBodyCandidates = [];
for (const flag of lifecycleAuditedFlags) {
  const producer = producerForFlag(flag);
  if (!producer) continue;
  const producerChapter =
    implementedChapterContracts.find((contract) =>
      nodeIsInChapter(producer.node.id, contract.chapter),
    )?.chapter ?? 1;
  const producerState = stateForChoice(
    highResourceState(chapterBaseStates[producerChapter]),
    producer.choice,
  );
  const hasConsumer = flagHasMeaningfulConsumer(
    flag,
    producer.node.id,
    producerState,
    producer.choice,
  );
  if (!hasConsumer) {
    const bodyCandidate = firstLaterBodyConsumer(
      flag,
      producer.node.id,
      producerState,
    );
    lifecycleBodyCandidates.push({
      flag,
      producer: producer.node.id,
      consumer: bodyCandidate ?? null,
    });
    failures.push(
      `Lifecycle audited flag ${flag} has no mechanical choice, active complication, reaction, or exact future contract${bodyCandidate ? `; body candidate ${bodyCandidate}` : ''}`,
    );
  }
}
if (process.argv.includes('--print-lifecycle-candidates')) {
  console.log(JSON.stringify(lifecycleBodyCandidates, null, 2));
  process.exit(0);
}

function normaliseStoryText(value) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

for (const node of Object.values(nodes)) {
  const chapter =
    implementedChapterContracts.find((contract) =>
      nodeIsInChapter(node.id, contract.chapter),
    )?.chapter ?? 1;
  for (const choice of node.choices) {
    const choiceState = stateForChoice(
      highResourceState(chapterBaseStates[chapter]),
      choice,
    );
    const afterChoice = applyChoice(choiceState, choice);
    const nextNode = nodes[afterChoice.nodeId];
    if (!nextNode) continue;
    const result = normaliseStoryText(choice.result);
    if (result.length < 40) continue;
    const repeatsResult = nextNode
      .body(afterChoice)
      .map(normaliseStoryText)
      .some((paragraph) =>
        paragraph.length > 0 && paragraph.length >= result.length
          ? paragraph.includes(result)
          : paragraph.length > 0 && result.includes(paragraph),
      );
    if (repeatsResult) {
      failures.push(
        `${nextNode.id} repeats the immediately preceding result of ${choice.id}`,
      );
    }
  }
}

for (const node of Object.values(nodes)) {
  const consequenceDeclarations = {
    complications: [
      ...(node.activeConsequences?.complications ?? []),
      ...(activeConsequenceContracts[node.id]?.complications ?? []),
    ],
    reactions: [
      ...(node.activeConsequences?.reactions ?? []),
      ...(activeConsequenceContracts[node.id]?.reactions ?? []),
    ],
  };
  for (const [kind, flags] of Object.entries(consequenceDeclarations)) {
    for (const flag of flags) {
      const producer = producerForFlag(flag);
      if (!producer) {
        failures.push(`${node.id} declares unknown ${kind} flag ${flag}`);
        continue;
      }
      const producerIndex = nodeOrder.indexOf(producer.node.id);
      const consumerIndex = nodeOrder.indexOf(node.id);
      if (consumerIndex <= producerIndex || node.final) {
        failures.push(
          `${node.id} declares ${flag} as an active ${kind} without a later non-ending scene`,
        );
      }
      const producerChapter =
        implementedChapterContracts.find((contract) =>
          nodeIsInChapter(producer.node.id, contract.chapter),
        )?.chapter ?? 1;
      const producerState = stateForChoice(
        highResourceState(chapterBaseStates[producerChapter]),
        producer.choice,
      );
      if (
        !declaredConsumerChangesActivePlay(
          flag,
          producer.node.id,
          producerState,
          producer.choice,
        )
      ) {
        failures.push(
          `${node.id} declares ${flag} as an active ${kind}, but toggling it does not change rendered play`,
        );
      }
    }
  }
}
for (const [flag, reason] of Object.entries(terminalHistoryFlagReasons)) {
  if (!lifecycleAuditedFlags.includes(flag))
    failures.push(
      `Terminal history classification references unused flag ${flag}`,
    );
  if (reason.length < 40)
    failures.push(`Terminal history flag ${flag} lacks a useful reason`);
  if (/preserve this recorded Ash Road choice or consequence/i.test(reason))
    failures.push(
      `Terminal history flag ${flag} uses a generic ledger contract instead of naming its playable consumer`,
    );
}

const safeTreatyArrival = renderedBody('c2-arrival', {
  ...chapterTwoBase,
  flags: ['treaty-safe'],
});
if (
  !/sealed treaty chest/i.test(safeTreatyArrival) ||
  /cracked treaty chest/i.test(safeTreatyArrival)
) {
  failures.push('Chapter Two does not preserve the protected treaty chest');
}
const damagedTreatyArrival = renderedBody('c2-arrival', {
  ...chapterTwoBase,
  flags: ['treaty-damaged'],
});
if (!/cracked treaty chest/i.test(damagedTreatyArrival)) {
  failures.push('Chapter Two does not preserve the damaged treaty chest');
}
const chapterTwoArrivalRoutes = [
  {
    name: 'silver road',
    flags: ['chose-silver-road'],
    expected: /hidden road rises from the flood/i,
    forbidden: /Rainwatch Hill|Your Oath pulls/i,
  },
  {
    name: 'high ground',
    flags: ['chose-high-ground'],
    expected: /path from Rainwatch Hill descends/i,
    forbidden: /hidden road rises|Your Oath pulls/i,
  },
  {
    name: 'Oath road',
    flags: ['oath-bring-them-home'],
    expected: /Oath pulls.*roped escort.*shallow road beneath the sea/is,
    forbidden: /Rainwatch Hill|hidden road rises/i,
  },
];
for (const route of chapterTwoArrivalRoutes) {
  const arrival = renderedBody('c2-arrival', {
    ...chapterTwoBase,
    flags: route.flags,
  });
  if (!route.expected.test(arrival) || route.forbidden.test(arrival)) {
    failures.push(
      `Chapter Two ${route.name} opening does not preserve its physical Chapter One ending`,
    );
  }
}
const foldedRoadSeedInjury = renderedBody('folded-road', initialState);
const chapterTwoTriage = renderedBody('c2-triage', chapterTwoBase);
if (
  !/seed cracks in her palm.*living shard cuts through her glove/is.test(
    foldedRoadSeedInjury,
  ) ||
  !/living magic belongs to Lysara’s glass seed/i.test(chapterTwoTriage) ||
  !/hand is how she guides the seed/i.test(chapterTwoTriage)
) {
  failures.push(
    'Lysara’s seed injury or living magic rule lacks a visible and consistent cause',
  );
}
if (
  !/Joren.*cleaned and stitched.*stable.*does not need the sealed medicine/is.test(
    chapterTwoTriage,
  )
) {
  failures.push(
    'Chapter Two triage does not account for Joren or explain why he is not a medicine candidate',
  );
}
const lowHealthTriage = renderedBody('c2-triage', {
  ...chapterTwoBase,
  stats: { ...chapterTwoBase.stats, health: 2 },
});
const highHealthTriage = renderedBody('c2-triage', {
  ...chapterTwoBase,
  stats: { ...chapterTwoBase.stats, health: 8 },
});
if (
  !/cannot survive one/i.test(lowHealthTriage) ||
  !/cuts beneath your coat.*can wait/is.test(highHealthTriage)
) {
  failures.push(
    'Chapter Two triage does not preserve low and high Health states',
  );
}
const uncapturedGarranTriage = renderedBody('c2-triage', chapterTwoBase);
if (
  !/Maelin found him crawling from the cellar at dawn/i.test(
    uncapturedGarranTriage,
  )
) {
  failures.push(
    'Chapter Two does not establish where Garran came from when no attacker was captured on the road',
  );
}
const knownPrisonerThreshold = renderedBody('c2-threshold', {
  ...chapterTwoBase,
  flags: ['captured-attacker'],
});
if (
  !/your wounded prisoner/i.test(knownPrisonerThreshold) ||
  /Maelin found him/i.test(knownPrisonerThreshold)
) {
  failures.push('Chapter Two does not preserve the captured attacker route');
}
const thresholdBeforeEntry = renderedBody('c2-threshold', {
  ...chapterTwoBase,
  flags: ['c2-ordered-entry'],
});
if (
  !/front step|threshold|door open/i.test(thresholdBeforeEntry) ||
  /bars the door behind you/i.test(thresholdBeforeEntry)
) {
  failures.push(
    'Chapter Two threshold does not remain outside until the player chooses how to enter',
  );
}
const maraEntryThreshold = renderedBody('c2-threshold', {
  ...chapterTwoBase,
  flags: ['c2-mara-led-entry'],
});
if (
  !/searches the wrong side of the yard/i.test(maraEntryThreshold) ||
  !/buying Maelin time/i.test(maraEntryThreshold) ||
  /Mara found firm stones|never came close enough/i.test(maraEntryThreshold)
) {
  failures.push(
    'Mara’s successful entry does not advance to a new threshold consequence',
  );
}
const urgentLeads = renderedBody('c3-triage', chapterThreeBase);
if (
  !/Elene explains the third lead/i.test(urgentLeads) ||
  !/watchm(?:a|e)n saw Ordan pay Varris/i.test(urgentLeads)
) {
  failures.push(
    'Caelan learns about Varris without an identified source at the Chapter Three leads',
  );
}
if (
  !/service gate for the wounded wagons and six armed escorts/i.test(
    urgentLeads,
  ) ||
  !/remaining Wardens form a shield line outside/i.test(urgentLeads) ||
  !/drops the iron gate between them and Ordan’s charging riders/i.test(
    urgentLeads,
  )
) {
  failures.push(
    'The Chapter Three gate transition does not account for the wounded, remaining Wardens, and Crown riders',
  );
}
const gatePolitics = renderedBody('c3-gate', chapterThreeBase);
if (
  !/Asterra’s Crown, your own/i.test(gatePolitics) ||
  !/Ordan’s private order/i.test(gatePolitics) ||
  !/young Queen lies ill/i.test(gatePolitics) ||
  !/Inside Harrowfen, even the Regent’s soldiers answer to her law/i.test(
    gatePolitics,
  )
) {
  failures.push(
    'The Chapter Three gate does not plainly explain the Asterra force and Harrowfen command structure',
  );
}
const roadPinDiscoveryChecks = [
  ['c2-ledger', /words remain deep enough to read: road pin/i],
  ['c2-cellar', /stamped into the bracket: ROAD PIN/i],
  ['c2-attacker', /called it a road pin.*iron anchor/is],
];
for (const [nodeId, expected] of roadPinDiscoveryChecks) {
  if (!expected.test(renderedBody(nodeId, chapterTwoBase))) {
    failures.push(
      `${nodeId} sets road pin knowledge without introducing the term`,
    );
  }
}
const effectiveChapterTwoText = nodeOrder
  .filter((nodeId) => nodeId.startsWith('c2-'))
  .flatMap((nodeId) => {
    const node = nodes[nodeId];
    return [
      node.kicker,
      node.title,
      node.location,
      sceneObjectiveText(node, chapterTwoBase),
      node.lesson?.title ?? '',
      node.lesson?.body ?? '',
      ...node.body(chapterTwoBase),
      ...node.choices.flatMap((choice) => [
        choice.label,
        choice.detail,
        choice.result,
      ]),
    ];
  })
  .join(' ');
for (const nodeId of nodeOrder.filter((id) => id.startsWith('c2-'))) {
  for (const choice of nodes[nodeId].choices) {
    for (const [stat, value] of Object.entries(choice.changes ?? {}).filter(
      ([, amount]) => (amount ?? 0) < 0,
    )) {
      const label = statLabels[stat];
      const disclosedCost = new RegExp(
        `\\bspends? ${Math.abs(value)} ${label}\\b`,
        'i',
      );
      if (!disclosedCost.test(choice.detail)) {
        failures.push(
          `Chapter Two choice ${choice.id} does not disclose its ${Math.abs(value)} ${label} cost`,
        );
      }
    }
  }
}
if (/\broad seal\b/i.test(effectiveChapterTwoText)) {
  failures.push(
    'Chapter Two uses road seal instead of the canonical term route authority',
  );
}
const routeAuthorityDefinitions =
  effectiveChapterTwoText.match(
    /route authority means your signed road order and Warden seal together/gi,
  ) ?? [];
if (routeAuthorityDefinitions.length < 1) {
  failures.push(
    'Chapter Two does not plainly define the canonical term route authority',
  );
}
const smallerRoadTests = renderedBody('c2-eleven-years', chapterTwoBase);
const fullRoadUnlock = renderedBody('c2-road-pin', chapterTwoBase);
if (
  !/smaller tests moved one doorway briefly.*could not hold a whole road open/is.test(
    smallerRoadTests,
  ) ||
  !/two stored signatures woke its locks.*drag whole road ends together/is.test(
    fullRoadUnlock,
  )
) {
  failures.push(
    'Chapter Two does not connect Ordan’s smaller tests to the later two-lock road movement',
  );
}
const lysaraBelowLock = renderedBody('c2-road-pin', {
  ...chapterTwoBase,
  flags: ['c2-lysara-below'],
});
const lysaraUpstairsLock = renderedBody('c2-road-pin', {
  ...chapterTwoBase,
  flags: ['c2-mara-below'],
});
if (
  !/Lysara’s cracked seed beside you/i.test(lysaraBelowLock) ||
  !/Lysara is upstairs.*threshold stored her seed’s living magic/is.test(
    lysaraUpstairsLock,
  )
) {
  failures.push(
    'The road pin’s second lock does not work consistently with Lysara present or upstairs',
  );
}
const roadPinCallbackChecks = [
  ['c2-ledger-route', /named in Ordan’s midnight note/i],
  ['c2-cellar-route', /identified on the cellar bracket/i],
  ['c2-attacker-route', /Garran warned you about/i],
];
for (const [flag, expected] of roadPinCallbackChecks) {
  const chamber = renderedBody('c2-road-pin', {
    ...chapterTwoBase,
    flags: [flag],
  });
  if (!expected.test(chamber))
    failures.push(
      `The road pin chamber forgets how ${flag} introduced the term`,
    );
}
const cellarRouteBell = renderedBody('c2-bell', {
  ...chapterTwoBase,
  flags: ['c2-cellar-route'],
});
if (
  /Garran’s warning|Garran described/i.test(cellarRouteBell) ||
  !/two sides of the attack/i.test(cellarRouteBell)
) {
  failures.push('The bell scene invents a Garran warning on the cellar route');
}
const sableRouteBell = renderedBody('c2-bell', {
  ...chapterTwoBase,
  flags: ['c2-attacker-route'],
});
if (!/Garran’s warning/i.test(sableRouteBell)) {
  failures.push(
    'The bell scene does not remember Garran’s warning on his investigation route',
  );
}
const shieldLineCrisis = renderedBody('c2-common-room-crisis', {
  ...chapterTwoBase,
  flags: ['c2-rope-line'],
});
if (
  !/behind a disciplined shield line/i.test(shieldLineCrisis) ||
  /wounded remain tied/i.test(shieldLineCrisis)
) {
  failures.push(
    'The common room crisis misremembers the shield line as tied patients',
  );
}
const companionPayoffs = [
  ['c2-mara-below', /Mara finds two soldiers/i, /Maelin strikes the wall/i],
  ['c2-lysara-below', /Lysara ties green thread/i, /Maelin strikes the wall/i],
  [
    'c2-maelin-below',
    /Maelin strikes the wall/i,
    /Mara finds two soldiers|Lysara ties green thread/i,
  ],
];
for (const [flag, expected, forbidden] of companionPayoffs) {
  const tunnel = renderedBody('c2-folded-cellar', {
    ...chapterTwoBase,
    flags: [flag],
  });
  if (!expected.test(tunnel) || forbidden.test(tunnel)) {
    failures.push(`The folded cellar does not preserve companion flag ${flag}`);
  }
}
const earlyRoadExplanation = [
  nodes['c2-eleven-years'].lesson?.body ?? '',
  ...nodes['c2-eleven-years'].body(chapterTwoBase),
].join(' ');
if (
  /road pin|two kinds of authority|Ordan.*(?:brought|needed)/i.test(
    earlyRoadExplanation,
  )
) {
  failures.push(
    'Chapter Two reveals the road pin or Ordan’s full plan before the investigation',
  );
}
const investigateSetup = [
  ...nodes['c2-investigate'].body(chapterTwoBase),
  ...nodes['c2-investigate'].choices.flatMap((choice) => [
    choice.label,
    choice.detail,
    choice.advantage ?? '',
  ]),
].join(' ');
if (/road pin/i.test(investigateSetup)) {
  failures.push(
    'The Chapter Two investigation menu names the road pin before the player can discover it',
  );
}
const earlyChapterTwoTruths = knownTruths({
  ...chapterTwoBase,
  nodeId: 'c2-eleven-years',
});
if (
  earlyChapterTwoTruths.some((truth) =>
    /unlock the road pin|Ordan lured/i.test(truth),
  )
) {
  failures.push('The Chapter Two journal reveals Ordan’s full plan too early');
}
const pinChamberTruths = knownTruths({
  ...chapterTwoBase,
  nodeId: 'c2-road-pin',
});
if (
  !pinChamberTruths.some((truth) =>
    /Ordan lured|unlock the road pin/i.test(truth),
  )
) {
  failures.push(
    'The Chapter Two journal does not record Ordan’s plan at the pin chamber',
  );
}
if (pinChamberTruths.some((truth) => /\bCaelan(?:’s)?\b/i.test(truth))) {
  failures.push(
    'The Chapter Two journal steps outside Caelan’s first person point of view',
  );
}
if (
  !pinChamberTruths.some((truth) =>
    /Lysara and me|my road authority/i.test(truth),
  )
) {
  failures.push(
    'The Chapter Two journal does not phrase the pin reveal as Caelan’s own knowledge',
  );
}
const repairedPinTruths = knownTruths({
  ...chapterTwoBase,
  nodeId: 'c2-last-testimony',
});
if (
  !repairedPinTruths.some((truth) =>
    /I drove the road pin back into place/i.test(truth),
  )
) {
  failures.push(
    'The Chapter Two journal does not update after Caelan repairs the road pin',
  );
}
const roadPinLesson = nodes['c2-road-pin'].lesson?.body ?? '';
if (
  /Ordan|Caelan|Lysara|road authority|living magic|old locks/i.test(
    roadPinLesson,
  )
) {
  failures.push(
    'The road pin lesson reveals the conspiracy before Caelan sees the two active locks',
  );
}
const chapterTwoChoiceSummaryPattern =
  /\b(?:you (?:can|must|need to|have to) (?:choose|decide)|your choice|each method|the choice is)\b/i;
for (const nodeId of nodeOrder.filter((id) => id.startsWith('c2-'))) {
  const lastParagraph = nodes[nodeId].body(chapterTwoBase).at(-1) ?? '';
  if (chapterTwoChoiceSummaryPattern.test(lastParagraph)) {
    failures.push(
      `Chapter Two scene ${nodeId} ends with narrator choice coaching`,
    );
  }
}
const expectedAdvantageLanguage =
  /\b(?:should|could|may|might|likely|chance|aim)\b/i;
for (const nodeId of nodeOrder.filter((id) => id.startsWith('c2-'))) {
  for (const choice of nodes[nodeId].choices) {
    const hasCost = Object.values(choice.changes ?? {}).some(
      (value) => (value ?? 0) < 0,
    );
    if (
      hasCost &&
      choice.advantage &&
      !expectedAdvantageLanguage.test(choice.advantage)
    ) {
      failures.push(
        `Chapter Two choice ${choice.id} presents its expected advantage as a guaranteed outcome`,
      );
    }
  }
}
const keyholeResult =
  nodes['c2-road-pin'].choices.find(
    (choice) => choice.id === 'c2-study-keyhole',
  )?.result ?? '';
if (
  !/back into its socket/i.test(keyholeResult) ||
  /remove|pull (?:it|the pin) out/i.test(keyholeResult)
) {
  failures.push(
    'The keyhole choice still describes removing the road pin instead of reseating it',
  );
}
const cellarChoices = nodes['c2-cellar'].choices;
const brokenBracket = cellarChoices.find(
  (choice) => choice.id === 'c2-break-bracket',
);
const latchRoute = nodes['c2-folded-cellar'].choices.find(
  (choice) => choice.id === 'c2-use-pin-key',
);
if (
  !/iron latch/i.test(brokenBracket?.result ?? '') ||
  !latchRoute?.requiresFlags?.includes('c2-has-pin-key') ||
  !/iron latch/i.test(`${latchRoute?.label} ${latchRoute?.result}`) ||
  /Maelin’s (?:cellar )?key/i.test(effectiveChapterTwoText)
) {
  failures.push(
    'Chapter Two iron latch ownership or terminology is inconsistent',
  );
}
const cutRopeDescent = renderedBody('c2-descend', {
  ...chapterTwoBase,
  flags: ['c2-cellar-route', 'c2-has-pin-key'],
});
if (!/rope you cut has been replaced by an enemy chain/i.test(cutRopeDescent)) {
  failures.push('Chapter Two reuses the cellar rope after the player cuts it');
}
const intactRopeTunnel = renderedBody('c2-folded-cellar', {
  ...chapterTwoBase,
  flags: ['c2-cellar-route'],
});
const cutRopeTunnel = renderedBody('c2-folded-cellar', {
  ...chapterTwoBase,
  flags: ['c2-cellar-route', 'c2-has-pin-key'],
});
if (
  !/rope you found is knotted to a chain/i.test(intactRopeTunnel) ||
  !/replacement chain/i.test(cutRopeTunnel)
) {
  failures.push(
    'Chapter Two does not show how the cellar rope becomes the enemy chain on both item routes',
  );
}
const directRouteResult =
  nodes['c2-folded-cellar'].choices.find(
    (choice) => choice.id === 'c2-use-rope-path',
  )?.result ?? '';
const directRouteCallback = renderedBody('c2-road-pin', {
  ...chapterTwoBase,
  flags: ['c2-rope-path'],
});
if (
  !/reach them before the next pull/i.test(directRouteResult) ||
  !/fastest path.*Two soldiers wait/is.test(directRouteCallback)
) {
  failures.push(
    'The fastest Chapter Two tunnel route is called slow or hides its stated ambush risk',
  );
}
const companionNavigationContracts = [
  ['c2-mara-below', 'c2-follow-companion', /Mara.*boot edge.*arrow/is],
  ['c2-lysara-below', 'c2-follow-lysara', /Lysara.*green thread/is],
  [
    'c2-maelin-below',
    'c2-follow-maelin-path',
    /Maelin.*support marks|Maelin.*builders’ ledge/is,
  ],
];
for (const [
  flag,
  expectedChoiceId,
  expectedCallback,
] of companionNavigationContracts) {
  const state = {
    ...chapterTwoBase,
    nodeId: 'c2-folded-cellar',
    flags: [flag],
  };
  const companionChoices = nodes['c2-folded-cellar'].choices
    .filter((choice) => isChoiceVisible(choice, state))
    .filter((choice) => choice.id.startsWith('c2-follow'))
    .map((choice) => choice.id);
  if (
    companionChoices.length !== 1 ||
    companionChoices[0] !== expectedChoiceId
  ) {
    failures.push(
      `Chapter Two companion navigation is not exclusive for ${flag}`,
    );
  }
  const selectedChoice = nodes['c2-folded-cellar'].choices.find(
    (choice) => choice.id === expectedChoiceId,
  );
  const callbackState = selectedChoice
    ? applyChoice(state, selectedChoice)
    : state;
  if (!expectedCallback.test(renderedBody('c2-road-pin', callbackState))) {
    failures.push(
      `Chapter Two does not use ${flag} companion speciality in the pin approach`,
    );
  }
}
const safePreparationState = {
  ...chapterTwoBase,
  nodeId: 'c2-remove-pin',
  flags: ['c2-safe-removal'],
};
const unsafePreparationState = {
  ...chapterTwoBase,
  nodeId: 'c2-remove-pin',
  flags: [],
};
const safeRemovalIds = nodes['c2-remove-pin'].choices
  .filter((choice) => isChoiceVisible(choice, safePreparationState))
  .map((choice) => choice.id);
const unsafeRemovalIds = nodes['c2-remove-pin'].choices
  .filter((choice) => isChoiceVisible(choice, unsafePreparationState))
  .map((choice) => choice.id);
if (
  !safeRemovalIds.includes('c2-wagon-break') ||
  safeRemovalIds.includes('c2-wagon-sacrifice') ||
  !unsafeRemovalIds.includes('c2-wagon-sacrifice') ||
  unsafeRemovalIds.includes('c2-wagon-break')
) {
  failures.push(
    'The safe-removal preparation does not produce its exact earned wagon method',
  );
}
const preparedWagonChoice = nodes['c2-remove-pin'].choices.find(
  (choice) => choice.id === 'c2-wagon-break',
);
const fallbackWagonChoice = nodes['c2-remove-pin'].choices.find(
  (choice) => choice.id === 'c2-wagon-sacrifice',
);
if (
  preparedWagonChoice?.addFlags?.includes('treaty-damaged') ||
  preparedWagonChoice?.addFlags?.includes('c2-pin-broken') ||
  !preparedWagonChoice?.addFlags?.includes('c2-wagon-axle-lost') ||
  !fallbackWagonChoice?.addFlags?.includes('c2-wagon-lost')
) {
  failures.push(
    'Chapter Two wagon methods inherit obsolete treaty or pin damage mechanics',
  );
}
const removalChoices = nodes['c2-remove-pin'].choices;
const removalSignatures = new Set(
  removalChoices.map((choice) =>
    JSON.stringify({
      changes: choice.changes ?? {},
      flags: choice.addFlags ?? [],
      visibility: {
        required: choice.requiresFlags ?? [],
        hidden: choice.hideIfAnyFlags ?? [],
      },
    }),
  ),
);
if (removalSignatures.size !== removalChoices.length) {
  failures.push(
    'A Chapter Two pin-repair choice has the same mechanical outcome as a sibling choice',
  );
}
const removalClimax = renderedBody('c2-remove-pin', {
  ...chapterTwoBase,
  flags: ['c2-mara-below'],
});
const repairedAftermath = renderedBody('c2-last-testimony', chapterTwoBase);
if (
  !/Mara’s arrows hold two soldiers.*mire hound/is.test(removalClimax) ||
  !/Brann reaches the chamber with two guards.*take the loose end of the enemy chain/is.test(
    removalClimax,
  ) ||
  !/rear supply wagon.*Maelin’s old coach ramp/is.test(removalClimax) ||
  !/beach, mountain, and distant rain pull away.*mire hound follows their blood scent/is.test(
    repairedAftermath,
  )
) {
  failures.push(
    'The Chapter Two climax does not continuously account for the defenders, chain, axle, soldiers, and mire hound',
  );
}
if (
  !/Ordan.*tears a waxed map sheet.*eastern service passage/is.test(
    fullRoadUnlock,
  ) ||
  !/You saw Ordan escape.*waxed map page/i.test(repairedAftermath)
) {
  failures.push(
    'Chapter Two claims Ordan escaped with a map page before Caelan observes both facts',
  );
}
const chapterTwoEndingIds = [
  'c2-ending-testimony',
  'c2-ending-pin',
  'c2-ending-oath',
];
for (const endingId of chapterTwoEndingIds) {
  const endingText = renderedBody(endingId, chapterTwoBase);
  if (
    !/fragment/i.test(endingText) ||
    !/pack|evidence|paper|orders|testimony/i.test(endingText)
  ) {
    failures.push(
      `${endingId} does not visibly carry the fragment and surviving evidence toward Harrowfen`,
    );
  }
}
if (
  !/Every piece of surviving evidence will travel to Harrowfen.*decides which proof the gate sees first/is.test(
    repairedAftermath,
  )
) {
  failures.push(
    'Chapter Two closing choice still implies that unselected evidence is abandoned',
  );
}
const chapterThreeInjuryOpening = renderedBody('c3-arrival', {
  ...chapterThreeBase,
  flags: ['c2-caelan-injured'],
});
if (!/back injury from driving the pin home/i.test(chapterThreeInjuryOpening)) {
  failures.push(
    'Chapter Three drops Caelan’s lasting pin injury at the chapter boundary',
  );
}
const chapterThreeSupplyLossOpening = renderedBody('c3-arrival', {
  ...chapterThreeBase,
  flags: ['c2-wagon-lost'],
});
const chapterThreeAxleLossOpening = renderedBody('c3-arrival', {
  ...chapterThreeBase,
  flags: ['c2-wagon-axle-lost'],
});
if (
  !/spare food and rope at Bellweather/i.test(chapterThreeSupplyLossOpening) ||
  !/saved its food and blankets/i.test(chapterThreeAxleLossOpening)
) {
  failures.push(
    'Chapter Three does not distinguish the supply wagon sacrifice from the prepared axle loss',
  );
}
const chapterTwoPreparationPayoffs = [
  [
    'c2-organised-care',
    'c2-medicine',
    /helpers give the clear reports you asked for/i,
  ],
  [
    'c2-lysara-led-care',
    'c2-medicine',
    /Lysara has checked each wound herself/i,
  ],
  [
    'c2-demanded-answer',
    'c2-eleven-years',
    /Jory’s warning is already in your hand/i,
  ],
  [
    'c2-tested-ledger',
    'c2-investigate',
    /ink and paper in Jory’s warning are real/i,
  ],
  ['c2-knows-midnight-pattern', 'c2-bell', /copied ledger warned you/i],
  [
    'c2-found-pantry-entry',
    'c2-common-room-crisis',
    /pantry break you found earlier/i,
  ],
  [
    'c2-united-versions',
    'c2-descend',
    /hired blades who saw Ordan’s orders have lowered their weapons/i,
  ],
  ['c2-maelin-secret-path', 'c2-descend', /service stair puts a stone wall/i],
  [
    'c2-left-supplies',
    'c2-last-testimony',
    /crushed the remaining bandages and lamp oil/i,
  ],
  [
    'c2-proved-crown-tool',
    'c2-last-testimony',
    /damaged point in the crown mark matches Ordan’s seal/i,
  ],
  [
    'c2-offered-sable-safety',
    'c2-last-testimony',
    /promise of protection still binds you/i,
  ],
  ['c2-command-repair', 'c2-last-testimony', /timed pull left the pin whole/i],
  [
    'c2-oath-repair-road',
    'c2-last-testimony',
    /promise still burns through the road lines/i,
  ],
  ['c2-caelan-injured', 'c2-last-testimony', /pain locks your back/i],
  [
    'c2-chain-ambush',
    'c2-last-testimony',
    /fastest path cost her blood|fastest path put new blood/i,
  ],
];
for (const [flag, nodeId, expected] of chapterTwoPreparationPayoffs) {
  const payoff = renderedBody(nodeId, { ...chapterTwoBase, flags: [flag] });
  if (!expected.test(payoff))
    failures.push(
      `Material Chapter Two flag ${flag} has no later practical or narrative payoff`,
    );
}
for (const chapter of [3, 4]) {
  const chapterPrefix = `c${chapter}-`;
  const chapterState = chapter === 3 ? chapterThreeBase : chapterFourBase;
  for (const nodeId of nodeOrder.filter((id) => id.startsWith(chapterPrefix))) {
    const lastParagraph = nodes[nodeId].body(chapterState).at(-1) ?? '';
    if (chapterTwoChoiceSummaryPattern.test(lastParagraph)) {
      failures.push(
        `Chapter ${chapter} scene ${nodeId} ends with narrator choice coaching`,
      );
    }
    for (const choice of nodes[nodeId].choices) {
      const hasCost = Object.values(choice.changes ?? {}).some(
        (value) => (value ?? 0) < 0,
      );
      if (
        hasCost &&
        choice.advantage &&
        !expectedAdvantageLanguage.test(choice.advantage)
      ) {
        failures.push(
          `Chapter ${chapter} choice ${choice.id} presents its expected advantage as a guaranteed outcome`,
        );
      }
    }
  }
}
const chapterThreeJournal = knownTruths({
  ...chapterThreeBase,
  nodeId: 'c3-world-nail',
});
if (chapterThreeJournal.some((truth) => /\bCaelan(?:’s)?\b/i.test(truth))) {
  failures.push(
    'The Chapter Three journal steps outside Caelan’s first person point of view',
  );
}
if (!chapterThreeJournal.some((truth) => /\bI\b|\bmy\b|\bme\b/i.test(truth))) {
  failures.push(
    'The Chapter Three journal does not preserve Caelan’s first person voice',
  );
}
const chapterFourJournal = knownTruths({
  ...chapterFourBase,
  nodeId: 'c4-duty',
});
if (chapterFourJournal.some((truth) => /\bCaelan(?:’s)?\b/i.test(truth))) {
  failures.push(
    'The Chapter Four journal steps outside Caelan’s first person point of view',
  );
}
if (!chapterFourJournal.some((truth) => /\bI\b|\bmy\b|\bme\b/i.test(truth))) {
  failures.push(
    'The Chapter Four journal does not preserve Caelan’s first person voice',
  );
}
const chapterFiveJournal = knownTruths({
  ...chapterFiveBase,
  nodeId: 'c5-ember-choice',
});
if (chapterFiveJournal.some((truth) => /\bCaelan(?:’s)?\b/i.test(truth))) {
  failures.push(
    'The Chapter Five journal steps outside Caelan’s first person point of view',
  );
}
if (!chapterFiveJournal.some((truth) => /\bI\b|\bmy\b|\bme\b/i.test(truth))) {
  failures.push(
    'The Chapter Five journal does not preserve Caelan’s first person voice',
  );
}
const shelterJournal = knownTruths({
  ...chapterFiveBase,
  nodeId: 'c5-glass-shelter',
});
if (shelterJournal.some((truth) => /\bVaor\b/i.test(truth))) {
  failures.push(
    'The Chapter Five journal names Vaor before Sorin introduces him in the shelter scene',
  );
}
const campJournal = knownTruths({
  ...chapterFiveBase,
  nodeId: 'c5-royal-camp',
});
if (
  !campJournal.some((truth) =>
    /Vaor was imprisoned beneath memory glass a century ago/i.test(truth),
  )
) {
  failures.push(
    'The Chapter Five journal does not record Sorin’s Vaor reveal after the shelter',
  );
}
const heartMemoryJournal = knownTruths({
  ...chapterFiveBase,
  nodeId: 'c5-heart-memory',
});
if (heartMemoryJournal.some((truth) => /\bOrivane\b/i.test(truth))) {
  failures.push(
    'The Chapter Five journal reveals Orivane before the player witnesses her memory',
  );
}
const collapseJournal = knownTruths({
  ...chapterFiveBase,
  nodeId: 'c5-grave-collapse',
});
if (
  !collapseJournal.some((truth) =>
    /Orivane willingly gave her living heart/i.test(truth),
  )
) {
  failures.push(
    'The Chapter Five journal does not record Orivane after her memory ends',
  );
}
for (const nodeId of nodeOrder.filter((id) => id.startsWith('c5-'))) {
  const lastParagraph = nodes[nodeId].body(chapterFiveBase).at(-1) ?? '';
  if (chapterTwoChoiceSummaryPattern.test(lastParagraph)) {
    failures.push(
      `Chapter 5 scene ${nodeId} ends with narrator choice coaching`,
    );
  }
  const bodyText = nodes[nodeId].body(chapterFiveBase).join(' ');
  if (
    /\bYou (?:notice|understand|realise|must decide|need to choose|have to choose)\b/i.test(
      bodyText,
    )
  ) {
    failures.push(
      `Chapter 5 scene ${nodeId} labels Caelan’s interpretation instead of dramatising it`,
    );
  }
  for (const choice of nodes[nodeId].choices) {
    const hasCost = Object.values(choice.changes ?? {}).some(
      (value) => (value ?? 0) < 0,
    );
    if (
      hasCost &&
      choice.advantage &&
      !expectedAdvantageLanguage.test(choice.advantage)
    ) {
      failures.push(
        `Chapter 5 choice ${choice.id} presents its expected advantage as a guaranteed outcome`,
      );
    }
  }
}
if (
  nodes['c5-glass-shelter'].lesson ||
  nodes['c5-heart-memory'].lesson ||
  nodes['c5-ember-choice'].lesson
) {
  failures.push(
    'Chapter Five still reveals a dramatic discovery in a lesson before the scene prose',
  );
}
const worldNailLessonText = nodes['c3-world-nail'].lesson?.body ?? '';
if (/World Nail/i.test(worldNailLessonText)) {
  failures.push(
    'The Chapter Three lesson names the World Nail before Lysara reveals it in the scene',
  );
}
if (nodes['c4-nine-marks'].lesson) {
  failures.push(
    'The Chapter Four lesson interrupts the nine Nails reveal before Lysara speaks',
  );
}
const descentRoutePayoffs = [
  [
    'c2-cellar-route',
    /rope you found earlier/i,
    /Garran’s warning|listed among Ordan’s supplies/i,
  ],
  [
    'c2-ledger-route',
    /listed among Ordan’s supplies/i,
    /rope you found earlier|Garran’s warning/i,
  ],
  [
    'c2-attacker-route',
    /Garran’s warning/i,
    /rope you found earlier|listed among Ordan’s supplies/i,
  ],
];
for (const [flag, expected, forbidden] of descentRoutePayoffs) {
  const descent = renderedBody('c2-descend', {
    ...chapterTwoBase,
    flags: [flag],
  });
  if (!expected.test(descent) || forbidden.test(descent)) {
    failures.push(`The descent does not preserve investigation flag ${flag}`);
  }
}
const lowRoadCases = [
  {
    flags: ['saved-family', 'steady-axle'],
    expected: [/two children you rescued/i, /hangs above the flood/i],
    forbidden: [/trapping young Joren beneath the axle/i],
  },
  {
    flags: ['saved-family'],
    expected: [
      /two children you rescued/i,
      /trapping young Joren beneath the axle/i,
    ],
    forbidden: [],
  },
  {
    flags: ['steady-axle'],
    expected: [/second guard/i, /hangs above the flood/i],
    forbidden: [
      /children you rescued/i,
      /trapping young Joren beneath the axle/i,
    ],
  },
  {
    flags: [],
    expected: [/second guard/i, /trapping young Joren beneath the axle/i],
    forbidden: [/children you rescued/i],
  },
];
for (const testCase of lowRoadCases) {
  const body = renderedBody('low-crisis', {
    ...initialState,
    flags: testCase.flags,
  });
  for (const expected of testCase.expected) {
    if (!expected.test(body))
      failures.push(
        `Low road continuity is missing ${expected} for ${testCase.flags.join(',') || 'no flags'}`,
      );
  }
  for (const forbidden of testCase.forbidden) {
    if (forbidden.test(body))
      failures.push(
        `Low road continuity incorrectly includes ${forbidden} for ${testCase.flags.join(',') || 'no flags'}`,
      );
  }
}
const openingLessonText = nodes['gate-yard'].lesson?.body ?? '';
for (const requiredTerm of [
  /Health/i,
  /Resolve/i,
  /Command/i,
  /Health.*zero.*dies/i,
]) {
  if (!requiredTerm.test(openingLessonText)) {
    failures.push(
      `The Chapter One opening lesson does not plainly teach ${requiredTerm}`,
    );
  }
}
if (/Mara|Lysara|Trust|Attraction|score/i.test(openingLessonText)) {
  failures.push(
    'The Chapter One opening lesson exposes relationship people or numbers before their introductions',
  );
}
const openingBodyText = renderedBody('gate-yard', initialState);
if (/Brann, Joren, Nilo, Mara/i.test(openingBodyText)) {
  failures.push(
    'The Chapter One opening restores the retired list of character names',
  );
}
const horseCheck = nodes['gate-yard'].choices.find(
  (choice) => choice.id === 'check-horses',
);
const horseCheckResult = horseCheck?.result ?? '';
if (
  !/replace.*strap/i.test(horseCheckResult) ||
  !/clean.*oil/i.test(horseCheckResult)
) {
  failures.push(
    'The horse check must visibly prevent the harness failure credited in the recap',
  );
}
const horseCheckCallback = renderedBody('mara-returns', {
  ...initialState,
  flags: ['checked-horses'],
});
if (!/cleaned the strange oil/i.test(horseCheckCallback)) {
  failures.push(
    'The scene after the horse check forgets that Caelan cleaned the mare’s bit',
  );
}
const horseCheckConsequences = majorConsequences({
  ...initialState,
  flags: ['checked-horses'],
});
if (
  !horseCheckConsequences.some((consequence) =>
    /avoided a planned equipment failure/i.test(consequence),
  )
) {
  failures.push(
    'The horse check recap no longer records the prevention shown in the playable result',
  );
}
const familyBridgeChoices = nodes['low-crisis'].choices.filter((choice) =>
  isChoiceVisible(choice, {
    ...initialState,
    flags: ['saved-family'],
  }),
);
if (familyBridgeChoices.length !== 3) {
  failures.push(
    `The rescued family bridge branch exposes ${familyBridgeChoices.length} choices instead of three`,
  );
}
for (const choice of familyBridgeChoices) {
  const choiceText = `${choice.detail} ${choice.result}`;
  if (!/both children/i.test(choiceText)) {
    failures.push(
      `Bridge choice ${choice.id} hides the rescued children’s fate`,
    );
  }
  if (/someone cries your name/i.test(choiceText)) {
    failures.push(
      `Bridge choice ${choice.id} replaces the rescued children with an unnamed cry`,
    );
  }
}
const noFamilyBridgeChoices = nodes['low-crisis'].choices.filter((choice) =>
  isChoiceVisible(choice, {
    ...initialState,
    flags: [],
  }),
);
if (noFamilyBridgeChoices.length !== 3) {
  failures.push(
    `The bridge branch without the rescued family exposes ${noFamilyBridgeChoices.length} choices instead of three`,
  );
}
for (const choice of noFamilyBridgeChoices) {
  if (
    !/Joren/i.test(`${choice.detail} ${choice.result}`) ||
    !/second guard/i.test(choice.result)
  ) {
    failures.push(
      `Bridge choice ${choice.id} does not resolve Joren and the second guard`,
    );
  }
}
for (const nodeId of ['low-crisis', 'ridge-crisis', 'inspection-crisis']) {
  const crisisText = renderedBody(nodeId, initialState);
  if (
    !/Joren.*side/i.test(crisisText) ||
    !/Nilo.*lower leg/i.test(crisisText) ||
    !/three guards/i.test(crisisText) ||
    !/horse.*leg/i.test(crisisText)
  ) {
    failures.push(
      `Chapter One crisis ${nodeId} does not establish every injury reported in the aftermath`,
    );
  }
}
const progressionLessonText = nodes['folded-road'].lesson?.body ?? '';
if (
  !/Finishing a chapter unlocks the next one/i.test(progressionLessonText) ||
  !/No currency is needed/i.test(progressionLessonText) ||
  /Wayfire/i.test(progressionLessonText)
) {
  failures.push(
    'The Chapter One lesson must explain free chapter progression without retired currency',
  );
}
const sealedCaseTruths = knownTruths({
  ...initialState,
  nodeId: 'sealed-case',
  chapterChoices: 4,
});
if (
  sealedCaseTruths.some((truth) => /prepared road|someone altered/i.test(truth))
) {
  failures.push(
    'The sealed case journal reveals the conspiracy before Caelan proves it',
  );
}
if (
  !sealedCaseTruths.some((truth) =>
    /does not match|although I remember/i.test(truth),
  )
) {
  failures.push(
    'The sealed case journal does not record the observed route mismatch',
  );
}
const provenAmbushTruths = knownTruths({
  ...initialState,
  nodeId: 'retreat',
  flags: ['confirmed-advance-orders'],
});
if (!provenAmbushTruths.some((truth) => /every possible route/i.test(truth))) {
  failures.push(
    'The journal does not record advance route proof after it is discovered',
  );
}
if (
  sealedCaseTruths.some((truth) => /\bCaelan\b|\bhe\b|\bhis\b/i.test(truth))
) {
  failures.push(
    'The Chapter One journal steps outside Caelan’s first person perspective',
  );
}
const maraAheadConversation = renderedBody('road-conversation', {
  ...initialState,
  flags: ['mara-ahead'],
});
if (!/Mara appears between two alder trees/i.test(maraAheadConversation)) {
  failures.push(
    'The Chapter One road conversation offers Mara dialogue while she remains absent',
  );
}
const oathEndingBody = renderedBody('ending-oath', initialState);
if (/wearing your red cloak/i.test(oathEndingBody)) {
  failures.push(
    'The Chapter One Oath ending restores the retired false Caelan image',
  );
}
const lowHighConsequences = majorConsequences({
  ...initialState,
  nodeId: 'ending-height',
  flags: ['low-route', 'chose-high-ground'],
});
if (
  lowHighConsequences.some((consequence) =>
    /followed|found the hidden silver route/i.test(consequence),
  )
) {
  failures.push(
    'The low road and high ground recap invents a silver road choice',
  );
}
if (
  !lowHighConsequences.some((consequence) =>
    /defensible camp/i.test(consequence),
  )
) {
  failures.push('The high ground ending is missing from the recap');
}
for (const evidenceChoice of nodes.evidence.choices) {
  if (!evidenceChoice.addFlags?.includes('confirmed-advance-orders')) {
    failures.push(
      `Evidence choice ${evidenceChoice.id} does not answer the chapter mystery`,
    );
  }
}
const routeProofChecks = [
  ['c2-chose-testimony', /Garran|Jory/i],
  ['c2-chose-pin', /fragment/i],
  ['c2-oath-expose-crown', /Oath/i],
];
for (const [flag, expected] of routeProofChecks) {
  const entrance = renderedBody('c3-arrival', {
    ...chapterThreeBase,
    flags: [flag],
  });
  if (!expected.test(entrance))
    failures.push(`Harrowfen entrance does not pay off ${flag}`);
}
const chapterThreeImportedProofs = [
  { flag: 'c2-chose-testimony', expected: /Garran|Jory’s warning/i },
  { flag: 'c2-chose-pin', expected: /unwrap the iron fragment/i },
  { flag: 'c2-oath-expose-crown', expected: /repeat your Bellweather Oath/i },
];
const chapterThreeImportedTreaties = [
  { flag: 'treaty-safe', expected: /treaty chest remains sealed/i },
  { flag: 'treaty-damaged', expected: /damaged treaty pages/i },
];
for (const proof of chapterThreeImportedProofs) {
  for (const treaty of chapterThreeImportedTreaties) {
    for (const treated of [false, true]) {
      for (const resources of ['low', 'high']) {
        const flags = [proof.flag, treaty.flag];
        if (treated) flags.push('c2-saved-attacker');
        const stats =
          resources === 'low'
            ? {
                ...chapterThreeBase.stats,
                health: 1,
                resolve: 0,
                command: 0,
                oathfire: 0,
              }
            : {
                ...chapterThreeBase.stats,
                health: 9,
                resolve: 9,
                command: 9,
                oathfire: 9,
              };
        const state = { ...chapterThreeBase, flags, stats };
        const arrival = renderedBody('c3-arrival', state);
        const gate = renderedBody('c3-gate', state);
        if (!proof.expected.test(arrival))
          failures.push(`Chapter Three import loses ${proof.flag}`);
        if (!treaty.expected.test(gate))
          failures.push(`Chapter Three import loses ${treaty.flag}`);
        if (
          !nodes['c3-arrival'].choices.some((choice) =>
            canChoose(choice, state),
          )
        ) {
          failures.push(
            `Chapter Three arrival has no option for ${resources} resources`,
          );
        }
      }
    }
  }
}
const lowTrustState = {
  ...chapterThreeBase,
  relationships: {
    ...chapterThreeBase.relationships,
    mara: { ...chapterThreeBase.relationships.mara, trust: 0 },
    lysara: { ...chapterThreeBase.relationships.lysara, trust: 0 },
  },
};
const highTrustState = {
  ...chapterThreeBase,
  relationships: {
    ...chapterThreeBase.relationships,
    mara: { ...chapterThreeBase.relationships.mara, trust: 7 },
    lysara: { ...chapterThreeBase.relationships.lysara, trust: 7 },
  },
};
for (const [nodeId, choiceId] of [
  ['c3-gate', 'c3-let-mara-search-you'],
  ['c3-archive', 'c3-ask-lysara-what-she-sees'],
  ['c3-pin-test', 'c3-send-real-mara'],
]) {
  const choice = nodes[nodeId].choices.find(
    (candidate) => candidate.id === choiceId,
  );
  if (
    !choice ||
    canChoose(choice, lowTrustState) ||
    !canChoose(choice, highTrustState)
  ) {
    failures.push(
      `${choiceId} does not enforce the trust availability stated to the player`,
    );
  }
}
const healerChoiceText = nodes['c3-healer'].choices
  .flatMap((choice) => [choice.label, choice.detail, choice.result])
  .join(' ');
if (/\bSenna\b|both canal bridges/i.test(healerChoiceText)) {
  failures.push(
    'The Chapter Three healing house still contains choices from the retired plot',
  );
}
const healerSceneChoices = new Map(
  nodes['c3-healer'].choices.map((choice) => [choice.id, choice]),
);
if (
  !/Iven.*children/i.test(
    healerSceneChoices.get('c3-hold-healer-door')?.label ?? '',
  )
) {
  failures.push(
    'The healing house Health choice does not answer Iven’s immediate crisis',
  );
}
if (
  !/back door.*children’s room/i.test(
    healerSceneChoices.get('c3-command-canal-line')?.label ?? '',
  )
) {
  failures.push(
    'The healing house Command choice does not defend both threatened rooms',
  );
}
const healerRoutePayoffs = [
  {
    flag: 'c3-sable-identified-guard',
    treated: /identified both attackers.*other escaped/i,
    untreated: /identify the prisoner.*second attacker escaped unnamed/i,
  },
  {
    flag: 'c3-secured-healer',
    treated: /every patient safe.*identified them.*before they fled/i,
    untreated: /every patient safe.*identified one attacker.*both men fled/i,
  },
  {
    flag: 'c3-canal-defence',
    treated: /one guard in chains.*identified both attackers/i,
    untreated:
      /one guard in chains.*identified him.*second attacker escap(?:es|ed) unnamed/i,
  },
];
for (const fixture of healerRoutePayoffs) {
  for (const treated of [false, true]) {
    const flags = ['c3-route-healer', fixture.flag];
    if (treated) flags.push('c2-saved-attacker');
    const bridgeArrival = renderedBody('c3-bill', {
      ...chapterThreeBase,
      flags,
    });
    const expected = treated ? fixture.treated : fixture.untreated;
    if (!expected.test(bridgeArrival)) {
      failures.push(
        `Healing house payoff ${fixture.flag} is wrong when Garran is ${treated ? 'treated' : 'untreated'}`,
      );
    }
  }
}
const investigationMenuText = [
  nodes['c3-triage'].lesson?.title ?? '',
  nodes['c3-triage'].lesson?.body ?? '',
  ...nodes['c3-triage'].body(chapterThreeBase),
  ...nodes['c3-triage'].choices.flatMap((choice) => [
    choice.label,
    choice.detail,
    choice.result,
  ]),
].join(' ');
if (/false escort|safe road out|old watch house/i.test(investigationMenuText)) {
  failures.push(
    'The Chapter Three investigation menu still describes the retired mystery',
  );
}
const confessionChoice = nodes['c3-bill'].choices.find(
  (choice) => choice.id === 'c3-let-iron-point',
);
const lanternRouteProofs = [
  [
    'c3-route-archive',
    'c3-caught-clerk',
    /reads Ordan’s signed route request and royal payment figures aloud/i,
  ],
  ['c3-route-healer', /Garran names Ordan as the man who paid/i],
  [
    'c3-route-broker',
    'c3-varris-map',
    /repeats the bridge opening word and shows the signed threat/i,
  ],
];
for (const [
  flag,
  subchoiceOrExpected,
  possibleExpected,
] of lanternRouteProofs) {
  const subchoice =
    typeof subchoiceOrExpected === 'string' ? subchoiceOrExpected : null;
  const expected = possibleExpected ?? subchoiceOrExpected;
  const routeFlags = [flag];
  if (subchoice) routeFlags.push(subchoice);
  if (flag === 'c3-route-healer') routeFlags.push('c3-secured-healer');
  const routeBody = renderedBody('c3-bill', {
    ...chapterThreeBase,
    flags: routeFlags,
  });
  if (!expected.test(routeBody))
    failures.push(`Lantern Bridge does not use the evidence earned on ${flag}`);
  if (
    !/I forged the Harrowfen papers/i.test(routeBody) ||
    !/came from above my office/i.test(routeBody)
  ) {
    failures.push(
      `Lantern Bridge does not isolate Ordan’s one new admission on ${flag}`,
    );
  }
}

const chapterThreeInvestigationFixtures = [
  {
    name: 'archive capture',
    flags: ['c3-route-archive', 'c3-caught-clerk'],
    required: [
      /signed route request/i,
      /payment page/i,
      /masked soldier/i,
      /brass bridge key/i,
    ],
    forbidden: [/true brass map/i, /murder order/i],
  },
  {
    name: 'archive copy',
    flags: ['c3-route-archive', 'c3-bridge-record'],
    required: [/Lysara’s copy/i, /royal payment line/i, /soldier escaped/i],
    forbidden: [/prisoner/i, /murder order/i],
  },
  {
    name: 'archive living ink',
    flags: ['c3-route-archive', 'c3-lysara-read-ink'],
    required: [/signed request/i, /payment figures/i, /soldier escaped/i],
    forbidden: [/prisoner/i, /true brass map/i],
  },
  {
    name: 'healer shield',
    flags: ['c3-route-healer', 'c3-sable-identified-guard'],
    required: [
      /one guard in chains/i,
      /Garran/i,
      /second attacker escaped unnamed/i,
    ],
    forbidden: [/true brass map/i, /murder order/i],
  },
  {
    name: 'healer doorway',
    flags: ['c3-route-healer', 'c3-secured-healer'],
    required: [/every patient safe/i, /Iven/i, /both men fled/i],
    forbidden: [/prisoner/i, /true brass map/i],
  },
  {
    name: 'healer divided line',
    flags: ['c3-route-healer', 'c3-canal-defence'],
    required: [
      /one guard in chains/i,
      /second attacker escap(?:es|ed) unnamed/i,
    ],
    forbidden: [/true brass map/i, /murder order/i],
  },
  {
    name: 'broker map',
    flags: ['c3-route-broker', 'c3-tested-door'],
    required: [/true brass map/i, /plans to enter the Mileless Bridge/i],
    forbidden: [/murder order/i, /prisoner/i],
  },
  {
    name: 'broker exchange',
    flags: ['c3-route-broker', 'c3-varris-map'],
    required: [/bridge opening word/i, /signed threat/i, /attacker escaped/i],
    forbidden: [/true brass map/i, /prisoner/i],
  },
  {
    name: 'broker capture',
    flags: ['c3-route-broker', 'c3-unmasked-varris'],
    required: [
      /written murder order/i,
      /killer you disarmed/i,
      /brass bridge key/i,
    ],
    forbidden: [/true brass map/i],
  },
];
for (const fixture of chapterThreeInvestigationFixtures) {
  const text = renderedBody('c3-bill', {
    ...chapterThreeBase,
    flags: fixture.flags,
  });
  for (const expected of fixture.required) {
    if (!expected.test(text))
      failures.push(`Chapter Three ${fixture.name} loses evidence it earned`);
  }
  for (const forbiddenClaim of fixture.forbidden) {
    if (forbiddenClaim.test(text))
      failures.push(`Chapter Three ${fixture.name} invents unearned evidence`);
  }
}

const watchHouseTransitionFixtures = [
  {
    choiceId: 'c3-save-grave-record',
    flag: 'c3-saved-courier-boy',
    result: [/boy and his satchel/i, /burning beam/i],
    next: [/narrow records stair/i, /free the trapped residents/i],
  },
  {
    choiceId: 'c3-rush-burning-house',
    flag: 'c3-reached-house-first',
    result: [
      /vault the beam/i,
      /courier boy and the trapped residents/i,
      /upper window/i,
    ],
    next: [
      /upper window/i,
      /Mara stays below/i,
      /courier boy and the trapped residents/i,
    ],
  },
  {
    choiceId: 'c3-order-streets-closed',
    flag: 'c3-closed-roads',
    result: [/courier boy/i, /Mara lifts the beam/i, /Mileless Bridge/i],
    next: [
      /guards drag the courier boy clear/i,
      /Mara lifts the beam/i,
      /side window/i,
    ],
  },
];
for (const fixture of watchHouseTransitionFixtures) {
  const choice = nodes['c3-evidence'].choices.find(
    (candidate) => candidate.id === fixture.choiceId,
  );
  const body = renderedBody('c3-watch-house', {
    ...chapterThreeBase,
    flags: [fixture.flag],
  });
  for (const expected of fixture.result) {
    if (!expected.test(choice?.result ?? ''))
      failures.push(`${fixture.choiceId} leaves the fire rescue unresolved`);
  }
  for (const expected of fixture.next) {
    if (!expected.test(body))
      failures.push(
        `${fixture.choiceId} does not connect physically to Ordan’s safe room`,
      );
  }
}

function prematureKnowledgeProblems(truths, forbiddenNames) {
  return forbiddenNames.filter((name) =>
    truths.some((truth) => new RegExp(`\\b${name}\\b`, 'i').test(truth)),
  );
}
const deliberatePrematureKnowledge = prematureKnowledgeProblems(
  ['Captain Renn paid for the attack.'],
  ['Renn'],
);
if (!deliberatePrematureKnowledge.includes('Renn')) {
  failures.push(
    'Knowledge timing validator does not reject a deliberate premature name',
  );
}
for (const nodeId of [
  'c3-arrival',
  'c3-gate',
  'c3-triage',
  'c3-archive',
  'c3-healer',
  'c3-broker',
  'c3-bill',
  'c3-evidence',
]) {
  const text = visibleNodeText(nodes[nodeId], chapterThreeBase);
  if (/Captain Renn|\bRenn\b/.test(text))
    failures.push(
      `Chapter Three names Renn before his safe room order is discovered in ${nodeId}`,
    );
  const truths = knownTruths({ ...chapterThreeBase, nodeId });
  if (prematureKnowledgeProblems(truths, ['Renn']).length) {
    failures.push(`Chapter Three journal names Renn too early in ${nodeId}`);
  }
}
const activeRennRevealTruths = knownTruths({
  ...chapterThreeBase,
  nodeId: 'c3-watch-house',
});
if (
  activeRennRevealTruths.some((truth) => /Captain Renn|\bRenn\b/.test(truth))
) {
  failures.push(
    'The journal answers the Renn reveal while the safe room scene is still active',
  );
}
const postRennRevealTruths = knownTruths({
  ...chapterThreeBase,
  nodeId: 'c3-divided-loyalty',
});
if (!postRennRevealTruths.some((truth) => /Captain Renn/i.test(truth))) {
  failures.push(
    'The journal does not record Renn after the safe room reveal is complete',
  );
}
const paidRennTruths = knownTruths({
  ...chapterThreeBase,
  nodeId: 'c3-divided-loyalty',
  flags: ['c3-kept-courier-list'],
});
if (!paidRennTruths.some((truth) => /payment to him/i.test(truth))) {
  failures.push(
    'The journal does not reserve Renn’s payment detail for the recovered soldier list',
  );
}

const platonicMaraState = {
  ...chapterThreeBase,
  relationships: {
    ...chapterThreeBase.relationships,
    mara: {
      ...chapterThreeBase.relationships.mara,
      attraction: 9,
      intent: 'platonic',
    },
  },
};
const platonicRoof = renderedBody('c3-divided-loyalty', platonicMaraState);
if (
  !/old friend|You chose what this is/i.test(platonicRoof) ||
  /one night where neither of us/i.test(platonicRoof)
) {
  failures.push(
    'Chapter Three ignores Mara’s explicit friendship intent when attraction remains high',
  );
}

const fragmentTransferText = renderedBody('c3-courier', chapterThreeBase);
if (
  !/beneath Mara’s shield/i.test(fragmentTransferText) ||
  !/releases it rather than crush him/i.test(fragmentTransferText) ||
  !/flies into Ordan’s silver glove/i.test(fragmentTransferText) ||
  !/fine wire.*goes with it/i.test(fragmentTransferText)
) {
  failures.push(
    'Chapter Three does not show how Ordan takes the secured fragment or preserve Rook’s planted wire',
  );
}

const pursuitTimingFixtures = [
  {
    flag: 'c3-pursuit-mara',
    expected: [
      /before the hidden soldiers can form a rank/i,
      /no guide rope marks a safe return/i,
    ],
  },
  {
    flag: 'c3-pursuit-lysara',
    expected: [
      /brings Mara, Brann, and three town guards across safely/i,
      /first rank.*already moving/i,
    ],
  },
  {
    flag: 'c3-oath-trail',
    expected: [
      /follow without delay/i,
      /before the hidden soldiers can form a rank/i,
    ],
  },
];
for (const fixture of pursuitTimingFixtures) {
  const text = renderedBody('c3-world-nail', {
    ...chapterThreeBase,
    flags: [fixture.flag],
  });
  for (const expected of fixture.expected) {
    if (!expected.test(text))
      failures.push(
        `Chapter Three pursuit payoff is inaccurate for ${fixture.flag}`,
      );
  }
}
if (
  /why Ordan needed you and Lysara/i.test(confessionChoice?.label ?? '') ||
  !confessionChoice?.addFlags?.includes('c3-stripped-ordan-command')
) {
  failures.push('Lantern Bridge asks for an answer Ordan has already given');
}
const rennPlanChoice = nodes['c3-duplicate'].choices.find(
  (choice) => choice.id === 'c3-ask-future-warning',
);
if (
  !rennPlanChoice?.addFlags?.includes('c3-routed-ordan-plan') ||
  rennPlanChoice.addFlags.includes('c3-bridge-warning')
) {
  failures.push(
    'Renn’s bridge plan is still confused with knowledge about the thief',
  );
}
const rennFightBody = renderedBody('c3-duplicate', {
  ...chapterThreeBase,
  flags: ['c3-mara-flanked-double'],
});
if (
  !/Renn steps across the road to the well/i.test(rennFightBody) ||
  /warrant false/i.test(rennFightBody)
) {
  failures.push(
    'The Renn confrontation clears Caelan before the player finishes the fight',
  );
}
const postRennBody = renderedBody('c3-courier', {
  ...chapterThreeBase,
  flags: ['c3-routed-ordan-plan'],
});
if (
  !/Only after Renn is defeated/i.test(postRennBody) ||
  !/reopens the west service gate/i.test(postRennBody) ||
  !/exactly where Ordan means to join/i.test(postRennBody)
) {
  failures.push(
    'The scene after Renn does not complete the fight, gate logistics, and plan payoff in order',
  );
}
const rookMarketBody = renderedBody('c3-market-memory', chapterThreeBase);
const rescueIndex = rookMarketBody.indexOf('catches a falling child');
const keyIndex = rookMarketBody.indexOf('lift a silver key');
const wireIndex = rookMarketBody.indexOf('hook a fine wire');
if (rescueIndex < 0 || keyIndex <= rescueIndex || wireIndex <= keyIndex) {
  failures.push(
    'Rook’s market setup is not presented as three clear actions in physical order',
  );
}
const worldNailBody = renderedBody('c3-world-nail', chapterThreeBase);
if (
  !/Asterra’s crowned shields fill the opening/i.test(worldNailBody) ||
  !/foreign border fort/i.test(worldNailBody) ||
  !/First rank forward/i.test(worldNailBody)
) {
  failures.push(
    'The World Nail climax does not explain the army road’s origin and destination',
  );
}
const pursueOrdanChoice = nodes['c3-world-nail'].choices.find(
  (choice) => choice.id === 'c3-end-catch-courier',
);
if (
  !/hidden soldiers/i.test(pursueOrdanChoice?.label ?? '') ||
  /hide the fragment/i.test(pursueOrdanChoice?.label ?? '')
) {
  failures.push(
    'The final Ordan choice still implies he possesses the stolen fragment',
  );
}
const returnEnding = renderedBody('c3-ending-return', chapterThreeBase);
if (
  /did not see him plant/i.test(returnEnding) ||
  !/already carries the fragment/i.test(returnEnding)
) {
  failures.push('The return ending repeats or forgets Rook’s visible theft');
}
const chapterThreeHandoffFixtures = [
  {
    endingId: 'c3-ending-courier',
    flags: ['c3-target-ordan', 'c3-pursuit-mara'],
  },
  {
    endingId: 'c3-ending-thief',
    flags: ['c3-target-thief', 'c3-pursuit-lysara'],
  },
  {
    endingId: 'c3-ending-return',
    flags: ['c3-secured-return', 'c3-oath-trail'],
  },
];
for (const fixture of chapterThreeHandoffFixtures) {
  const ending = renderedBody(fixture.endingId, {
    ...chapterThreeBase,
    flags: fixture.flags,
  });
  const opening = renderedBody('c4-bridge-start', {
    ...chapterFourBase,
    flags: fixture.flags,
  });
  const joined = `${ending} ${opening}`;
  for (const companion of ['Mara', 'Lysara', 'Brann']) {
    if (!new RegExp(`\\b${companion}\\b`).test(ending)) {
      failures.push(
        `${fixture.endingId} does not place ${companion} on the Mileless Bridge before Chapter Four`,
      );
    }
    if (!new RegExp(`\\b${companion}\\b`).test(opening)) {
      failures.push(
        `Chapter Four opening loses ${companion} after ${fixture.endingId}`,
      );
    }
  }
  if (
    !/thief.*(?:has|carries|with) the fragment|fragment.*(?:beneath|between) his/i.test(
      joined,
    )
  ) {
    failures.push(
      `${fixture.endingId} does not hand the fragment to Rook continuously`,
    );
  }
  if (
    fixture.flags.includes('c3-target-ordan') &&
    /drops between you and takes it first/i.test(opening)
  ) {
    failures.push('Chapter Four repeats Rook’s theft after the courier ending');
  }
}

function handoffStateProblems(endingState, openingState) {
  const problems = [];
  if (endingState.fragmentHolder !== openingState.fragmentHolder)
    problems.push('fragment holder changed');
  for (const person of endingState.present) {
    if (!openingState.present.includes(person))
      problems.push(`${person} disappeared`);
  }
  if (endingState.theftComplete && openingState.replaysTheft)
    problems.push('completed theft replayed');
  return problems;
}
const deliberateBrokenHandoff = handoffStateProblems(
  {
    fragmentHolder: 'Rook',
    present: ['Mara', 'Lysara', 'Brann'],
    theftComplete: true,
  },
  { fragmentHolder: 'Ordan', present: ['Mara'], replaysTheft: true },
);
if (deliberateBrokenHandoff.length < 3) {
  failures.push(
    'Chapter handoff validator does not reject a deliberately contradictory transition',
  );
}
const debatePayoffs = [
  ['c3-challenged-crown-control', /seize the bridge winch/i],
  ['c3-centred-harrowfen-victims', /residents block the royal soldiers/i],
  ['c3-stripped-ordan-command', /strips him of authority/i],
];
for (const [flag, expected] of debatePayoffs) {
  const aftermath = renderedBody('c3-evidence', {
    ...chapterThreeBase,
    flags: [flag],
  });
  if (!expected.test(aftermath)) {
    failures.push(`Lantern Bridge choice ${flag} has no immediate callback`);
  }
}
const costlyPayoffChecks = [
  ['guarding-wagon', 'ambush-warning', /breaks against your raised shield/i],
  [
    'shielded-opening',
    'low-crisis',
    /every wounded traveller remains behind cover/i,
  ],
  ['c2-faced-creature', 'c2-threshold', /drew it away from every stretcher/i],
  ['c2-carried-nilo', 'c2-triage', /stopped the deepest bleeding early/i],
  ['c2-shielded-descent', 'c2-descend', /without losing anyone/i],
  [
    'c3-reached-house-first',
    'c3-watch-house',
    /before the last route order burned/i,
  ],
  ['c3-saved-market-children', 'c3-pin-test', /boat passage beside the well/i],
  ['c3-double-disarmed', 'c3-courier', /only two bridge guards/i],
  ['c3-cut-silver-glove', 'c3-collapse', /can no longer close it behind him/i],
  ['c3-broke-escape-road', 'c3-collapse', /follow one at a time/i],
  ['c3-oath-trail', 'c3-world-nail', /without delay/i],
];
for (const [flag, nodeId, expected] of costlyPayoffChecks) {
  const sampleState = nodeId.startsWith('c2-')
    ? chapterTwoBase
    : nodeId.startsWith('c3-')
      ? chapterThreeBase
      : initialState;
  const payoff = renderedBody(nodeId, { ...sampleState, flags: [flag] });
  if (!expected.test(payoff))
    failures.push(`Stored advantage ${flag} has no payoff in ${nodeId}`);
}

const chapterFourNailExplanation = [
  nodes['c4-nine-marks'].lesson?.body ?? '',
  ...nodes['c4-nine-marks'].body(chapterFourBase),
].join(' ');
if (
  !/fragment belongs to the Nail of Distance/i.test(
    chapterFourNailExplanation,
  ) ||
  !/There are nine World Nails/i.test(chapterFourNailExplanation) ||
  !/Bellweather and the Mileless Bridge used broken pieces/i.test(
    chapterFourNailExplanation,
  ) ||
  !/Dragonspine guards another Nail/i.test(chapterFourNailExplanation) ||
  /Bellweather was only one of nine Nails/i.test(chapterFourNailExplanation)
) {
  failures.push(
    'Chapter Four does not clearly distinguish the Nail of Distance, its broken pieces, and the other World Nails',
  );
}
const chapterFourCollapse = renderedBody('c4-collapse', chapterFourBase);
if (!/ignore Ordan’s order to take everyone alive/i.test(chapterFourCollapse)) {
  failures.push(
    'The Bell Arch collapse does not explicitly show Crown soldiers disobeying Ordan',
  );
}
const openingCollapsePayoffs = [
  ['c4-group-secured', /guide rope you secured keeps the group together/i],
  ['c4-fast-pursuit', /early leap placed you beside the final anchor rope/i],
  [
    'c4-harrowfen-held',
    /road you anchored to Harrowfen stays behind the group/i,
  ],
];
for (const [flag, expected] of openingCollapsePayoffs) {
  const payoff = renderedBody('c4-collapse', {
    ...chapterFourBase,
    flags: [flag],
  });
  if (!expected.test(payoff))
    failures.push(`Chapter Four opening choice ${flag} has no later callback`);
}

function unresolvedDanger(result, people) {
  return people.filter((pattern) => !pattern.test(result));
}
const deliberateUnresolvedDanger = unresolvedDanger('Brann reaches stone.', [
  /\bBrann\b/i,
  /\bMara\b/i,
  /guards?/i,
]);
if (deliberateUnresolvedDanger.length !== 2) {
  failures.push(
    'Danger outcome validator does not reject a result that abandons known people',
  );
}
const collapseChoiceIds = [
  'c4-save-brann',
  'c4-save-brann-fast',
  'c4-save-guards',
  'c4-hold-collapse',
  'c4-use-hanging-banner',
];
for (const choiceId of collapseChoiceIds) {
  const choice = nodes['c4-collapse'].choices.find(
    (candidate) => candidate.id === choiceId,
  );
  if (
    !choice ||
    unresolvedDanger(choice.result, [/\bBrann\b/i, /\bMara\b/i, /guards?/i])
      .length
  ) {
    failures.push(
      `${choiceId} does not state the outcome for Brann, Mara, and both Harrowfen guards`,
    );
  }
}
const fastCollapseState = { ...chapterFourBase, flags: ['c4-fast-pursuit'] };
const normalSaveBrann = nodes['c4-collapse'].choices.find(
  (choice) => choice.id === 'c4-save-brann',
);
const fastSaveBrann = nodes['c4-collapse'].choices.find(
  (choice) => choice.id === 'c4-save-brann-fast',
);
if (
  isChoiceVisible(normalSaveBrann, fastCollapseState) ||
  !isChoiceVisible(fastSaveBrann, fastCollapseState) ||
  fastSaveBrann?.changes?.health !== -1
) {
  failures.push(
    'The early leap does not reduce the Bell Arch rescue cost as promised',
  );
}
for (const flag of ['c4-group-secured', 'c4-harrowfen-held']) {
  const collapse = renderedBody('c4-collapse', {
    ...chapterFourBase,
    flags: [flag],
  });
  if (
    !/both Harrowfen guards.*(?:before they reach the edge|stable stone)/i.test(
      collapse,
    )
  ) {
    failures.push(
      `${flag} does not materially protect both guards during the Bell Arch collapse`,
    );
  }
}

const chapterFourMaterialPayoffs = [
  ['c4-saw-mirror-trick', 'c4-chase'],
  ['c4-carried-brann', 'c4-wounded'],
  ['c4-mara-absence-cost', 'c4-wounded'],
  ['c4-broke-snow-line', 'c4-snow-span'],
  ['c4-warmed-blue-fire', 'c4-snow-span'],
  ['c4-anchored-storm-crossing', 'c4-storm-span'],
  ['c4-storm-rope-held', 'c4-storm-span'],
  ['c4-commanded-gears', 'c4-brass-span'],
  ['c4-jammed-gears', 'c4-brass-span'],
  ['c4-backed-rook-performance', 'c4-stage-turn'],
  ['c4-broke-crown-line', 'c4-soldiers'],
  ['c4-pinned-crown-lines', 'c4-soldiers'],
  ['c4-staged-arrest', 'c4-theatre-plan'],
  ['c4-staged-ordan', 'c4-theatre-plan'],
  ['c4-oath-held-final-road', 'c4-anchor'],
  ['c4-held-anchor-by-strength', 'c4-anchor'],
  ['c4-shared-anchor', 'c4-anchor'],
];
for (const [flag, owner] of chapterFourMaterialPayoffs) {
  if (!flagChangesLaterPlay(flag, owner, chapterFourBase)) {
    failures.push(
      `Chapter Four paid preparation ${flag} has no material later payoff`,
    );
  }
}

const woundedChoices = nodes['c4-wounded'].choices;
for (const choice of woundedChoices) {
  if (!choice.addFlags?.includes('c4-found-dispatch')) {
    failures.push(
      `Chapter Four wounded choice ${choice.id} loses Ordan’s satchel`,
    );
  }
}
const earlyDispatchChoices = woundedChoices.filter((choice) =>
  choice.addFlags?.includes('c4-read-dispatch-early'),
);
if (
  earlyDispatchChoices.length !== 1 ||
  earlyDispatchChoices[0].id !== 'c4-let-rook-splint-brann'
) {
  failures.push(
    'Chapter Four no longer keeps early access to Ordan’s dispatch unique to Rook’s splint route',
  );
}
const earlyDispatchOpening = renderedBody('c4-duty', {
  ...chapterFourBase,
  flags: ['c4-read-dispatch-early'],
});
if (
  !/began reading while Rook treated Brann.*carry the Distance fragment north to a mountain stronghold/is.test(
    earlyDispatchOpening,
  )
) {
  failures.push(
    'Chapter Four does not remember that Caelan read Ordan’s dispatch early',
  );
}
for (const choice of nodes['c4-ordan'].choices) {
  if (
    choice.addFlags?.includes('c4-found-dispatch') ||
    !/satchel (?:is already|remains)/i.test(choice.result)
  ) {
    failures.push(
      `${choice.id} recovers Ordan’s satchel a second time or loses its established location`,
    );
  }
}
const earlyReadChoice = woundedChoices.find(
  (choice) => choice.id === 'c4-let-rook-splint-brann',
);
if (
  !/first line orders the Distance fragment carried north to a mountain stronghold/i.test(
    earlyReadChoice?.result ?? '',
  )
) {
  failures.push(
    'The early dispatch flag does not provide concrete information when it is earned',
  );
}
const searchedFragmentHandoff = renderedBody('c4-nine-marks', {
  ...chapterFourBase,
  flags: ['c4-searched-rook'],
});
const bargainedFragmentHandoff = renderedBody('c4-nine-marks', {
  ...chapterFourBase,
  flags: ['c4-route-bargain'],
});
const heardFragmentHandoff = renderedBody('c4-nine-marks', {
  ...chapterFourBase,
  flags: ['c4-heard-rook-out'],
});
if (
  !/take the iron into your own hand/i.test(searchedFragmentHandoff) ||
  !/places it on the stone/i.test(bargainedFragmentHandoff) ||
  !/Then he lets go/i.test(heardFragmentHandoff)
) {
  failures.push(
    'Chapter Four does not explicitly return the real fragment on every Rook route',
  );
}
const bridgeRoutePayoffs = [
  ['c4-broke-snow-line', /upper squad.*last crossbow team/i],
  [
    'c4-warmed-blue-fire',
    /kept frost from the wounded.*soldiers behind.*bright path/i,
  ],
  [
    'c4-anchored-storm-crossing',
    /group reaches the Crown Span before the cliff squad/i,
  ],
  ['c4-storm-rope-held', /soaked the Crown crossbows.*strings will need time/i],
  ['c4-commanded-gears', /brass wheels close behind.*find another way around/i],
  ['c4-jammed-gears', /brass wheels close behind.*find another way around/i],
];
for (const [flag, expected] of bridgeRoutePayoffs) {
  const payoff = renderedBody('c4-stage-turn', {
    ...chapterFourBase,
    flags: [flag],
  });
  if (!expected.test(payoff))
    failures.push(`Chapter Four route ${flag} has no later pursuit payoff`);
}
const brassMachineText = [
  ...nodes['c4-brass-span'].body(chapterFourBase),
  ...nodes['c4-brass-span'].choices.flatMap((choice) => [
    choice.label,
    choice.detail,
    choice.advantage ?? '',
    choice.result,
  ]),
].join(' ');
if (
  !/gears close six times/i.test(brassMachineText) ||
  !/remain open for a few seconds/i.test(brassMachineText) ||
  !/step onto it during the pause.*get off before the teeth close/is.test(
    brassMachineText,
  ) ||
  !/count(?:ing)? (?:each of|all) (?:the )?six closures.*safe seconds/is.test(
    brassMachineText,
  ) ||
  /Count to seven|missing beat|read their rhythm|make a road out of timing/i.test(
    brassMachineText,
  )
) {
  failures.push(
    'Chapter Four brass machine does not explain its danger and safe crossing in physical order',
  );
}
const rookShortcutPayoff = renderedBody('c4-soldiers', {
  ...chapterFourBase,
  flags: ['c4-rook-shortcut-left-pursuit'],
});
if (
  !/Saving your strength has made this fight larger/i.test(rookShortcutPayoff)
) {
  failures.push(
    'Rook’s stat free environmental shortcuts do not create a later drawback',
  );
}
const bannerChoice = nodes['c4-collapse'].choices.find(
  (choice) => choice.id === 'c4-use-hanging-banner',
);
const splintChoice = nodes['c4-wounded'].choices.find(
  (choice) => choice.id === 'c4-let-rook-splint-brann',
);
if (
  !bannerChoice?.addFlags?.includes('c4-rook-lost-long-wire') ||
  !/wire snaps/i.test(bannerChoice?.result ?? '')
) {
  failures.push(
    'Rook’s banner rescue still solves the collapse without consuming a useful tool',
  );
}
if (
  !splintChoice?.addFlags?.includes('c4-rook-tore-coat-lining') ||
  !/disguise visibly incomplete/i.test(splintChoice?.result ?? '')
) {
  failures.push(
    'Rook’s treatment of Brann still provides two benefits without weakening a later trick',
  );
}
const damagedDisguise = renderedBody('c4-stage-turn', {
  ...chapterFourBase,
  flags: ['c4-snow-route', 'c4-rook-tore-coat-lining'],
});
if (
  !/disguise will work only at a distance/i.test(damagedDisguise) ||
  !/(?:You recognise|Your hand makes) the western recall/i.test(damagedDisguise)
) {
  failures.push(
    'Rook’s first performance does not remember his cost or depend on Caelan’s military knowledge',
  );
}
const theatreExplanation = renderedBody('c4-theatre-plan', chapterFourBase);
if (
  !/one small mirrored curtain/i.test(theatreExplanation) ||
  !/single voice reed/i.test(theatreExplanation) ||
  !/stage one clear lie/i.test(theatreExplanation) ||
  !/repeat that same scene in three places/i.test(theatreExplanation) ||
  /voice reeds/i.test(theatreExplanation)
) {
  failures.push(
    'Rook’s travelling theatre still creates three captains without a visible bridge mechanism',
  );
}
const retreatRisk = `${nodes['c4-stage-turn'].choices.find((choice) => choice.id === 'c4-use-signal-bell')?.result} ${renderedBody('c4-theatre-plan', { ...chapterFourBase, flags: ['c4-rook-rang-retreat'] })} ${renderedBody('c4-soldiers', { ...chapterFourBase, flags: ['c4-crown-orders-confused'] })}`;
if (
  !/officers no longer trust voices or bells/i.test(retreatRisk) ||
  !/wounds a Harrowfen guard/i.test(retreatRisk)
) {
  failures.push('Rook’s free retreat does not create its promised later risk');
}
const falseFragmentChoice = nodes['c4-soldiers'].choices.find(
  (choice) => choice.id === 'c4-feign-surrender',
);
const falseFragmentRisk = renderedBody('c4-theatre-plan', {
  ...chapterFourBase,
  flags: ['c4-false-fragment-alerted-anchor'],
});
if (
  !/warning whistle.*alerting the final anchor guard/i.test(
    falseFragmentChoice?.result ?? '',
  ) ||
  !/crossbowman waits above it/i.test(falseFragmentRisk)
) {
  failures.push(
    'Rook’s free false fragment tactic does not alert the final anchor as promised',
  );
}
const flashChoice = nodes['c4-theatre-plan'].choices.find(
  (choice) => choice.id === 'c4-flash-salt-curtain',
);
const flashState = { ...chapterFourBase, flags: ['c4-flash-blinded-guards'] };
const relayChoice = nodes['c4-anchor'].choices.find(
  (choice) => choice.id === 'c4-command-anchor-relay',
);
if (
  !/Two rear guards.*lose their sight/i.test(flashChoice?.result ?? '') ||
  isChoiceVisible(relayChoice, flashState) ||
  !/cannot take a turn holding the anchor/i.test(
    renderedBody('c4-anchor', flashState),
  )
) {
  failures.push(
    'Rook’s free flash salt escape does not remove the blinded guards from the anchor relay',
  );
}
const quietArchChoiceIds = new Set(
  nodes['c4-mara'].choices.map((choice) => choice.id),
);
if (
  !quietArchChoiceIds.has('c4-hear-lysara-private-risk') ||
  !quietArchChoiceIds.has('c4-name-lysara-personal') ||
  !quietArchChoiceIds.has('c4-keep-quiet-arch-platonic') ||
  !quietArchChoiceIds.has('c4-return-to-duty')
) {
  failures.push(
    'The Chapter Four quiet arch still forces a private Mara scene',
  );
}
const lysaraTruthChoice = nodes['c4-mara'].choices.find(
  (choice) => choice.id === 'c4-hear-lysara-private-risk',
);
const lysaraInterestChoice = nodes['c4-mara'].choices.find(
  (choice) => choice.id === 'c4-name-lysara-personal',
);
const lysaraTruthEffects = relationshipChanges(lysaraTruthChoice);
const lysaraInterestEffects = relationshipChanges(lysaraInterestChoice);
if (
  !/promise not to ask her to soften the truth/i.test(
    lysaraTruthChoice?.label ?? '',
  ) ||
  (lysaraTruthEffects.lysara?.attraction ?? 0) !== 0 ||
  lysaraTruthEffects.lysara?.intent
) {
  failures.push(
    'Lysara’s private truth choice still grants unchosen attraction or an unselected promise',
  );
}
if (
  (lysaraInterestEffects.lysara?.attraction ?? 0) <= 0 ||
  lysaraInterestEffects.lysara?.intent !== 'exploring'
) {
  failures.push(
    'Chapter Four has no explicit player choice for personal interest in Lysara',
  );
}
const chapterFourRomanceChoices = [
  ['c4-kiss-mara-bridge', 'mara'],
  ['c4-name-lysara-personal', 'lysara'],
];
for (const [choiceId, person] of chapterFourRomanceChoices) {
  const choice = nodes['c4-mara'].choices.find(
    (candidate) => candidate.id === choiceId,
  );
  for (const intent of ['unresolved', 'exploring', 'committed']) {
    const state = {
      ...chapterFourBase,
      relationships: {
        ...chapterFourBase.relationships,
        [person]: {
          ...chapterFourBase.relationships[person],
          trust: 20,
          attraction: 20,
          intent,
        },
      },
    };
    if (!canChoose(choice, state))
      failures.push(`${choiceId} is unavailable for valid ${intent} intent`);
  }
  for (const intent of ['platonic', 'ended']) {
    const state = {
      ...chapterFourBase,
      relationships: {
        ...chapterFourBase.relationships,
        [person]: {
          ...chapterFourBase.relationships[person],
          trust: 20,
          attraction: 20,
          intent,
        },
      },
    };
    if (isChoiceVisible(choice, state))
      failures.push(
        `${choiceId} remains visible after ${person} intent becomes ${intent}`,
      );
  }
}
for (const intent of ['platonic', 'ended']) {
  const state = {
    ...chapterFourBase,
    relationships: {
      ...chapterFourBase.relationships,
      mara: { ...chapterFourBase.relationships.mara, attraction: 20, intent },
    },
  };
  const routeProse = `${renderedBody('c4-snow-span', state)} ${renderedBody('c4-storm-span', state)}`;
  if (
    /warmth reaches you.*hard to ignore|breath touches your throat/i.test(
      routeProse,
    ) ||
    !/focus of an experienced guard|locks across your armour|locks her shoulder/i.test(
      routeProse,
    )
  ) {
    failures.push(`Chapter Four route prose ignores Mara’s ${intent} intent`);
  }
}

for (const node of Object.values(nodes)) {
  for (const choice of node.choices) {
    const effects = relationshipChanges(choice);
    for (const [person, changes] of Object.entries(effects)) {
      const romanceCoded =
        (changes.attraction ?? 0) > 0 ||
        ['interested', 'exploring', 'committed'].includes(changes.intent);
      if (!romanceCoded) continue;
      for (const intent of ['platonic', 'ended']) {
        const chapter =
          implementedChapterContracts.find((contract) =>
            nodeIsInChapter(node.id, contract.chapter),
          )?.chapter ?? 1;
        const state = highResourceState(chapterBaseStates[chapter]);
        state.relationships[person].intent = intent;
        if (isChoiceVisible(choice, state)) {
          failures.push(
            `Romance coded choice ${choice.id} remains visible after ${person} intent becomes ${intent}`,
          );
        }
      }
    }
  }
}
for (const node of Object.values(nodes)) {
  for (const choice of node.choices) {
    const attractionPeople = Object.entries(relationshipChanges(choice))
      .filter(([, changes]) => (changes?.attraction ?? 0) > 0)
      .map(([person]) => person);
    if (attractionPeople.length === 0) continue;
    const current = initialState.relationships;
    const notes = relationshipChangeNotes(choice, current);
    const next = nextRelationships(current, choice);
    for (const person of attractionPeople) {
      const name = person[0].toUpperCase() + person.slice(1);
      const personNote = (
        notes.find((note) =>
          note.toLowerCase().startsWith(`${name.toLowerCase()}:`),
        ) ?? ''
      ).toLowerCase();
      if (!personNote.includes('attraction +')) {
        failures.push(
          `Romance-coded choice ${choice.id} hides ${name} attraction`,
        );
      }
      if (
        current[person].intent === next[person].intent &&
        (personNote.includes('interest acknowledged') ||
          personNote.includes('relationship being explored') ||
          personNote.includes('commitment chosen'))
      ) {
        failures.push(
          `Choice ${choice.id} claims a ${name} intent change that did not occur`,
        );
      }
    }
  }
}
const maraPresentOnBridge =
  /Mara sets one hand|Mara presses close|Mara stares at Rook|Mara fits tightly|Mara braces between|Mara presses your hand|Mara locks her shoulder/i;
const brannPresentOnBridge = /Brann leans across|Brann misses the rope/i;
const maraReturnOpening =
  /Just before the rear span closes, Mara follows Lysara’s guide rope back from Harrowfen and reaches the shelter\. “Brann is safe in Harrowfen,” she says\. “I left him there and came straight back\.”/s;
const maraStayOpening =
  /Mara checks the road behind you while Lysara wraps the nine-mark map in living thread\. Both women carry rain on their coats and questions they have not asked in front of the others\./;
const sendMaraChoice = nodes['c4-wounded'].choices.find(
  (choice) => choice.id === 'c4-send-mara-with-brann',
);
const keepBrannChoice = nodes['c4-wounded'].choices.find(
  (choice) => choice.id === 'c4-carry-brann',
);
if (
  JSON.stringify(sendMaraChoice?.addFlags) !==
    JSON.stringify([
      'c4-mara-escorted-brann',
      'c4-mara-absence-cost',
      'c4-found-dispatch',
    ]) ||
  sendMaraChoice?.next !== 'c4-three-spans' ||
  sendMaraChoice?.changes ||
  JSON.stringify(relationshipChanges(sendMaraChoice)) !==
    JSON.stringify({ mara: { trust: 1, attraction: 0 } })
) {
  failures.push(
    'Sending Mara with Brann changed its departure flags, destination, or costs',
  );
}
const afterSendMara = applyChoice(
  { ...highResourceState(chapterFourBase), nodeId: 'c4-wounded' },
  sendMaraChoice,
);
if (
  ![
    'c4-mara-escorted-brann',
    'c4-mara-absence-cost',
    'c4-found-dispatch',
  ].every((flag) => afterSendMara.flags.includes(flag))
) {
  failures.push(
    'Selecting c4-send-mara-with-brann does not set the existing departure flags',
  );
}
const escortRouteSteps = [
  ['c4-choose-snow', 'c4-snow-follow-rook'],
  ['c4-choose-storm', 'c4-storm-use-rook-coins'],
  ['c4-choose-brass', 'c4-brass-take-rook-shortcut'],
];
const maraPresentActorFailure = (label, text) => {
  if (maraPresentOnBridge.test(text) || brannPresentOnBridge.test(text)) {
    failures.push(
      `Chapter Four places Mara or Brann back on the bridge ${label}`,
    );
  }
};
maraPresentActorFailure(
  'at the three-span junction after the escort',
  renderedBody('c4-three-spans', afterSendMara),
);
if (
  !/Lysara tightens the green thread/i.test(
    renderedBody('c4-three-spans', afterSendMara),
  )
) {
  failures.push(
    'Chapter Four no longer marks Mara as escorting Brann at the three-span junction',
  );
}
for (const [routeChoiceId, crossingChoiceId] of escortRouteSteps) {
  const afterJunction = applyChoice(
    { ...afterSendMara, nodeId: 'c4-three-spans' },
    nodes['c4-three-spans'].choices.find((choice) => choice.id === routeChoiceId),
  );
  maraPresentActorFailure(
    `on ${afterJunction.nodeId} after the escort`,
    renderedBody(afterJunction.nodeId, afterJunction),
  );
  if (
    (routeChoiceId === 'c4-choose-snow' &&
      !/One Harrowfen guard misses the rope/i.test(
        renderedBody(afterJunction.nodeId, afterJunction),
      )) ||
    (routeChoiceId === 'c4-choose-storm' &&
      !/remembering she is protecting Brann/i.test(
        renderedBody(afterJunction.nodeId, afterJunction),
      )) ||
    (routeChoiceId === 'c4-choose-brass' &&
      !/She is protecting Brann now/i.test(
        renderedBody(afterJunction.nodeId, afterJunction),
      ))
  ) {
    failures.push(
      `${afterJunction.nodeId} no longer treats Mara as absent on the escort route`,
    );
  }
  const afterCrossing = applyChoice(afterJunction, nodes[afterJunction.nodeId].choices.find((choice) => choice.id === crossingChoiceId));
  maraPresentActorFailure(
    'during the first disguise after the escort',
    renderedBody('c4-stage-turn', afterCrossing),
  );
  const afterDisguise = applyChoice(
    afterCrossing,
    nodes['c4-stage-turn'].choices.find(
      (choice) => choice.id === 'c4-limit-rook-trick',
    ),
  );
  maraPresentActorFailure(
    'on Ordan’s chain after the escort',
    renderedBody('c4-ordan', afterDisguise),
  );
  const afterOrdan = applyChoice(
    afterDisguise,
    nodes['c4-ordan'].choices.find(
      (choice) => choice.id === 'c4-drop-ordan-to-ledge',
    ),
  );
  maraPresentActorFailure(
    'at the map arch before Mara’s return',
    renderedBody('c4-nine-marks', afterOrdan),
  );
  const atQuietArch = applyChoice(
    afterOrdan,
    nodes['c4-nine-marks'].choices.find(
      (choice) => choice.id === 'c4-allow-rook-copy',
    ),
  );
  const quietOpening = nodes['c4-mara'].body(atQuietArch)[0];
  const quietBody = renderedBody('c4-mara', atQuietArch);
  if (
    atQuietArch.nodeId !== 'c4-mara' ||
    !maraReturnOpening.test(quietOpening) ||
    !/guide rope back from Harrowfen/i.test(quietOpening) ||
    !/rear span closes/i.test(quietOpening) ||
    !/Brann is safe in Harrowfen/i.test(quietOpening) ||
    !/I left him there and came straight back/i.test(quietOpening)
  ) {
    failures.push(
      `One Honest Minute does not clearly return Mara from Harrowfen after ${routeChoiceId}`,
    );
  }
  if (maraStayOpening.test(quietBody)) {
    failures.push(
      `The escort return at One Honest Minute still uses the stay-with-group opening after ${routeChoiceId}`,
    );
  }
  const rookQuestionIndex = nodes['c4-mara']
    .body(atQuietArch)
    .findIndex((paragraph) => /The law says arrest Rook/i.test(paragraph));
  if (rookQuestionIndex < 1) {
    failures.push(
      'Mara’s Rook question is offered before the escort return is established',
    );
  }
  const afterQuiet = applyChoice(
    atQuietArch,
    nodes['c4-mara'].choices.find((choice) => choice.id === 'c4-return-to-duty'),
  );
  const crownFight = renderedBody('c4-soldiers', afterQuiet);
  if (
    !/Mara sets her shield/i.test(crownFight) ||
    !/Mara has returned, but the guard who covered her place cannot lift his wounded shield arm/i.test(
      crownFight,
    )
  ) {
    failures.push(
      `The Crown fight after ${routeChoiceId} loses Mara’s return or the wounded-guard cost`,
    );
  }
}
const afterKeepBrann = applyChoice(
  { ...highResourceState(chapterFourBase), nodeId: 'c4-wounded' },
  keepBrannChoice,
);
const stayQuietOpening = nodes['c4-mara'].body({
  ...afterKeepBrann,
  nodeId: 'c4-mara',
})[0];
if (!maraStayOpening.test(stayQuietOpening) || maraReturnOpening.test(stayQuietOpening)) {
  failures.push(
    'The non-escort opening of One Honest Minute changed or gained a Harrowfen return',
  );
}
const maraQuietChoiceIds = nodes['c4-mara'].choices.map((choice) => [
  choice.id,
  choice.next,
  JSON.stringify(choice.changes ?? null),
  JSON.stringify(choice.addFlags ?? null),
  JSON.stringify(relationshipChanges(choice)),
]);
if (
  JSON.stringify(maraQuietChoiceIds) !==
  JSON.stringify([
    ['c4-tell-mara-law-bends', 'c4-soldiers', 'null', 'null', JSON.stringify({ mara: { trust: 1, respect: 1 } })],
    [
      'c4-promise-mara-truth',
      'c4-soldiers',
      JSON.stringify({ oathfire: -1 }),
      JSON.stringify(['c4-oath-honest-with-mara']),
      JSON.stringify({ mara: { trust: 2, respect: 1 } }),
    ],
    [
      'c4-kiss-mara-bridge',
      'c4-soldiers',
      'null',
      JSON.stringify(['c4-kissed-mara']),
      JSON.stringify({ mara: { trust: 1, attraction: 2, intent: 'exploring' } }),
    ],
    [
      'c4-hear-lysara-private-risk',
      'c4-soldiers',
      'null',
      JSON.stringify(['c4-lysara-private-truth']),
      JSON.stringify({ lysara: { trust: 2, respect: 1 } }),
    ],
    [
      'c4-name-lysara-personal',
      'c4-soldiers',
      'null',
      'null',
      JSON.stringify({
        lysara: { trust: 1, attraction: 2, respect: 1, intent: 'exploring' },
      }),
    ],
    [
      'c4-keep-quiet-arch-platonic',
      'c4-soldiers',
      'null',
      'null',
      JSON.stringify({
        mara: { trust: 1, respect: 1, intent: 'platonic' },
        lysara: { respect: 1, intent: 'platonic' },
      }),
    ],
    ['c4-return-to-duty', 'c4-soldiers', 'null', 'null', '{}'],
  ])
) {
  failures.push(
    'One Honest Minute changed a choice ID, transition, cost, flag, or relationship effect',
  );
}
const capturedOrdanFight = renderedBody('c4-soldiers', {
  ...chapterFourBase,
  flags: ['c4-captured-ordan'],
});
const absentOrdanFight = renderedBody('c4-soldiers', {
  ...chapterFourBase,
  flags: ['c4-ordan-lower-road'],
});
if (
  !/bound Ordan/i.test(capturedOrdanFight) ||
  /bound Ordan/i.test(absentOrdanFight) ||
  !/every witness/i.test(absentOrdanFight)
) {
  failures.push(
    'Chapter Four Crown fight does not remember whether Ordan is a prisoner',
  );
}
const chapterFourEndIds = [
  'c4-ending-arrest',
  'c4-ending-bargain',
  'c4-ending-trust',
];
for (const endingId of chapterFourEndIds) {
  const limitedCopyEnding = renderedBody(endingId, {
    ...chapterFourBase,
    flags: ['c4-denied-rook-copy'],
  });
  const fullCopyEnding = renderedBody(endingId, {
    ...chapterFourBase,
    flags: ['c4-rook-full-copy'],
  });
  if (
    !/only the northern mark and two blurred roads/i.test(limitedCopyEnding)
  ) {
    failures.push(
      `${endingId} forgets that Caelan denied Rook a complete map copy`,
    );
  }
  if (!/complete nine mark wax copy/i.test(fullCopyEnding)) {
    failures.push(
      `${endingId} forgets that Caelan permitted Rook’s complete map copy`,
    );
  }
}
const arrestEnding = renderedBody('c4-ending-arrest', {
  ...chapterFourBase,
  flags: ['c4-rook-full-copy'],
});
if (
  !/cuff that held his wrist locked around a bridge chain/i.test(
    arrestEnding,
  ) ||
  !/His wrist is bare/i.test(arrestEnding) ||
  !/Underways/i.test(arrestEnding) ||
  /around your wrist|like a bracelet/i.test(arrestEnding)
) {
  failures.push(
    'The Chapter Four arrest ending places the cuff incorrectly or erases the arrest choice',
  );
}
const capturedOrdanTrustEnding = renderedBody('c4-ending-trust', {
  ...chapterFourBase,
  flags: ['c4-captured-ordan', 'c4-rook-trusted'],
});
const lostOrdanTrustEnding = renderedBody('c4-ending-trust', {
  ...chapterFourBase,
  flags: ['c4-ordan-lower-road', 'c4-rook-trusted'],
});
if (
  !/bound Ordan/i.test(capturedOrdanTrustEnding) ||
  /bound Ordan|the prisoner/i.test(lostOrdanTrustEnding) ||
  !/Ordan is gone on the lower road/i.test(lostOrdanTrustEnding)
) {
  failures.push(
    'The Chapter Four trust ending does not remember Ordan’s route',
  );
}
const rookBargainChoice = nodes['c4-duty'].choices.find(
  (choice) => choice.id === 'c4-bargain-with-rook',
);
if (
  !/one honest warning/i.test(rookBargainChoice?.advantage ?? '') ||
  !/one honest warning/i.test(rookBargainChoice?.result ?? '') ||
  /per day|daily warning/i.test(
    `${rookBargainChoice?.advantage ?? ''} ${rookBargainChoice?.result ?? ''}`,
  )
) {
  failures.push(
    'Rook’s Chapter Four bargain still promises more than one honest warning',
  );
}
if (/paid Ordan|payment below/i.test(chapterFourSource + chapterFiveSource)) {
  failures.push(
    'Chapter Four or Five still claims Rook’s buyer financed Ordan without evidence',
  );
}

const thiefEndingLanding = renderedBody('c3-ending-thief', {
  ...chapterThreeBase,
  flags: ['c3-target-thief', 'c3-pursuit-lysara'],
});
const thiefOpeningLanding = renderedBody('c4-bridge-start', {
  ...chapterFourBase,
  flags: ['c3-target-thief', 'c3-pursuit-lysara'],
});
if (
  !/silver wire catches a bronze brace.*both of you swing toward the next arch/is.test(
    thiefEndingLanding,
  ) ||
  !/boots hit the next arch beside the thief.*wire that saved you still loops your forearm/is.test(
    thiefOpeningLanding,
  ) ||
  (thiefEndingLanding + thiefOpeningLanding).match(/catches a bronze brace/gi)
    ?.length !== 1 ||
  /follow him out of Harrowfen/i.test(thiefOpeningLanding)
) {
  failures.push(
    'The thief pursuit handoff does not show Caelan and Rook surviving the breaking arch exactly once',
  );
}

const rookEndingContracts = [
  {
    flag: 'c4-rook-arrested',
    ending: 'c4-ending-arrest',
    object: /mirrored coin.*safe turn.*patrol marks.*square seal/is,
    shelter:
      /mirrored coin Rook abandoned.*four short marks and a square seal/is,
    decodeChoice: 'c5-decode-parting-clue',
  },
  {
    flag: 'c4-rook-bargain',
    ending: 'c4-ending-bargain',
    object:
      /warning required by your bargain.*mirrored coin.*patrol marks.*seal press/is,
    shelter: /Rook’s marked coin.*patrol lines and square seal/is,
    decodeChoice: 'c5-decode-parting-clue',
  },
  {
    flag: 'c4-rook-trusted',
    ending: 'c4-ending-trust',
    object: /silver wire tied around a sliver of black wax.*hidden entrance/is,
    shelter: /silver knot Rook left.*black wax.*hidden camp entrance/is,
    decodeChoice: 'c5-decode-trust-knot',
  },
];
for (const contract of rookEndingContracts) {
  const endingState = {
    ...chapterFourBase,
    flags: [contract.flag, 'c4-denied-rook-copy'],
  };
  const openingState = {
    ...chapterFiveBase,
    flags: [contract.flag, 'c4-denied-rook-copy'],
  };
  const ending = renderedBody(contract.ending, endingState);
  const opening = renderedBody('c5-north-road', openingState);
  const shelter = renderedBody('c5-glass-shelter', openingState);
  const visibleDecodeChoices = nodes['c5-glass-shelter'].choices
    .filter((choice) => isChoiceVisible(choice, openingState))
    .map((choice) => choice.id);
  if (
    !contract.object.test(ending) ||
    !contract.shelter.test(shelter) ||
    !visibleDecodeChoices.includes(contract.decodeChoice) ||
    visibleDecodeChoices.filter((id) => id.startsWith('c5-decode-')).length !==
      1 ||
    !/thin wax scrap.*northern mark and two blurred roads/i.test(opening)
  ) {
    failures.push(
      `Rook parting object or partial map continuity failed for ${contract.flag}`,
    );
  }
}
const fullMapChapterFive = renderedBody('c5-north-road', {
  ...chapterFiveBase,
  flags: ['c4-rook-bargain', 'c4-rook-full-copy'],
});
if (
  !/complete nine mark copy.*real fragment remains in your pack/i.test(
    fullMapChapterFive,
  )
) {
  failures.push(
    'Chapter Five does not distinguish Rook’s full map from the real fragment',
  );
}

for (const ordanFlag of ['c4-captured-ordan', 'c4-ordan-lower-road']) {
  for (const contract of rookEndingContracts) {
    const flags = [
      ordanFlag,
      contract.flag,
      'c4-denied-rook-copy',
      'c4-found-dispatch',
    ];
    const ending = renderedBody(contract.ending, { ...chapterFourBase, flags });
    const opening = renderedBody('c5-north-road', {
      ...chapterFiveBase,
      flags,
    });
    if (ordanFlag === 'c4-captured-ordan') {
      if (
        !/Mara and one guard take bound Ordan.*Elene receives him/is.test(
          ending,
        ) ||
        !/returned him to Elene.*You kept the royal dispatch/is.test(opening)
      ) {
        failures.push(
          `${contract.ending} does not return captured Ordan to Elene before Chapter Five`,
        );
      }
    } else if (
      !/Ordan is gone on the lower road/i.test(ending) ||
      !/Ordan escaped onto a lower road.*dispatch taken from him led you here/is.test(
        opening,
      )
    ) {
      failures.push(
        `${contract.ending} does not preserve Ordan’s lower road outcome into Chapter Five`,
      );
    }
  }
}

const chapterFourObjectLedger = [
  {
    object: 'Distance fragment',
    checks: [
      /real fragment.*beneath Rook’s coat/i.test(
        renderedBody('c4-wounded', {
          ...chapterFourBase,
          flags: ['c4-saw-mirror-trick'],
        }),
      ),
      /take the iron/i.test(
        renderedBody('c4-nine-marks', {
          ...chapterFourBase,
          flags: ['c4-saw-mirror-trick'],
        }),
      ),
      /real fragment remains in your pack/i.test(fullMapChapterFive),
    ],
  },
  {
    object: 'Ordan satchel and dispatch',
    checks: [
      woundedChoices.every((choice) =>
        choice.addFlags?.includes('c4-found-dispatch'),
      ),
      nodes['c4-ordan'].choices.every(
        (choice) => !choice.addFlags?.includes('c4-found-dispatch'),
      ),
      /royal dispatch/i.test(
        renderedBody('c4-duty', {
          ...chapterFourBase,
          flags: ['c4-found-dispatch'],
        }),
      ),
    ],
  },
  {
    object: 'arrest cuff',
    checks: [
      /cuff that held his wrist locked around a bridge chain/i.test(
        renderedBody('c4-ending-arrest', chapterFourBase),
      ),
      /empty place at your belt/i.test(
        renderedBody('c5-north-road', {
          ...chapterFiveBase,
          flags: ['c4-rook-arrested'],
        }),
      ),
    ],
  },
  {
    object: 'mirrored coin',
    checks: [
      /mirrored coin/i.test(renderedBody('c4-ending-arrest', chapterFourBase)),
      /mirrored coin/i.test(renderedBody('c4-ending-bargain', chapterFourBase)),
      !/mirrored coin/i.test(renderedBody('c4-ending-trust', chapterFourBase)),
    ],
  },
  {
    object: 'map wax and silver knot',
    checks: [
      /silver wire tied around a sliver of black wax/i.test(
        renderedBody('c4-ending-trust', chapterFourBase),
      ),
      /black wax inside still carries the hidden camp entrance/i.test(
        renderedBody('c5-glass-shelter', {
          ...chapterFiveBase,
          flags: ['c4-rook-trusted'],
        }),
      ),
      isChoiceVisible(
        nodes['c5-heart-memory'].choices.find(
          (choice) => choice.id === 'c5-copy-proof-into-map-wax',
        ),
        { ...chapterFiveBase, flags: ['c4-rook-trusted'] },
      ),
    ],
  },
  {
    object: 'guide rope',
    checks: [
      /guide rope/i.test(renderedBody('c3-ending-return', chapterThreeBase)),
      /thread.*Harowfen|thread.*Harrowfen/i.test(
        renderedBody('c4-bridge-start', {
          ...chapterFourBase,
          flags: ['c3-secured-return'],
        }),
      ),
      /follows Lysara’s guide rope back from Harrowfen/i.test(
        renderedBody('c4-mara', {
          ...chapterFourBase,
          flags: ['c4-mara-escorted-brann'],
        }),
      ),
    ],
  },
];
for (const fixture of chapterFourObjectLedger) {
  if (fixture.checks.some((passed) => !passed))
    failures.push(`Object ledger continuity failed for ${fixture.object}`);
}
function objectLedgerProblems(state) {
  return state.laterPossessed && !state.acquired && !state.transferredIn
    ? ['object appears without acquisition or transfer']
    : [];
}
const deliberateBrokenObjectLedger = objectLedgerProblems({
  acquired: false,
  transferredIn: false,
  laterPossessed: true,
});
if (
  !deliberateBrokenObjectLedger.includes(
    'object appears without acquisition or transfer',
  )
) {
  failures.push(
    'Object ledger validator does not reject a deliberate unshown transfer',
  );
}

const chapterFiveRookImports = [
  ['c4-rook-arrested', /escaped your cuff.*Underways.*mirrored coin/i],
  ['c4-rook-bargain', /Underways.*spoke the warning.*marked coin/is],
  ['c4-rook-trusted', /chose the Underways.*silver knot.*black wax/is],
];
for (const [flag, expected] of chapterFiveRookImports) {
  const arrival = renderedBody('c5-north-road', {
    ...chapterFiveBase,
    flags: [flag],
  });
  if (!expected.test(arrival))
    failures.push(`Chapter Five forgets Rook import ${flag}`);
}
const chapterFiveShelterRookImports = [
  ['c4-rook-arrested', /mirrored coin Rook abandoned/i],
  ['c4-rook-bargain', /Rook’s marked coin/i],
  ['c4-rook-trusted', /silver knot Rook left/i],
];
for (const [flag, expected] of chapterFiveShelterRookImports) {
  const shelter = renderedBody('c5-glass-shelter', {
    ...chapterFiveBase,
    flags: [flag],
  });
  if (!expected.test(shelter))
    failures.push(
      `The Chapter Five shelter does not preserve Rook’s parting legacy for ${flag}`,
    );
}
const capturedOrdanArrival = renderedBody('c5-north-road', {
  ...chapterFiveBase,
  flags: ['c4-rook-bargain', 'c4-captured-ordan'],
});
if (
  !/returned him to Elene.*You kept the royal dispatch/is.test(
    capturedOrdanArrival,
  )
) {
  failures.push(
    'Chapter Five does not account for captured Ordan before the climb',
  );
}
const chapterFiveRouteImports = [
  [
    'c4-snow-route',
    /flames that burned in stone bowls on the bridge’s mountain road/i,
  ],
  ['c4-storm-route', /miss the storm span/i],
  ['c4-brass-route', /measured turning of the bridge’s brass chamber/i],
];
for (const [flag, expected] of chapterFiveRouteImports) {
  const arrival = renderedBody('c5-north-road', {
    ...chapterFiveBase,
    flags: ['c4-rook-bargain', flag],
  });
  if (!expected.test(arrival))
    failures.push(`Chapter Five forgets bridge route ${flag}`);
}
const preparedBurnCare = renderedBody('c5-mara-burns', {
  ...chapterFiveBase,
  flags: ['c5-let-mara-check-burns'],
});
if (!/made you promise to show her the next burn/i.test(preparedBurnCare)) {
  failures.push('Mara’s burn treatment forgets the earlier inspection choice');
}
const respectfulVaorMeeting = renderedBody('c5-vaor-wakes', {
  ...chapterFiveBase,
  flags: ['c5-asked-memory-permission'],
});
if (!/asked before touching what was mine/i.test(respectfulVaorMeeting)) {
  failures.push(
    'Vaor forgets that Caelan asked permission before touching a memory',
  );
}
const extractionOrderAssault = renderedBody('c5-crown-assault', {
  ...chapterFiveBase,
  flags: ['c5-has-extraction-order'],
});
if (!/line permitting Vaor’s death/i.test(extractionOrderAssault)) {
  failures.push(
    'The Crown assault does not pay off the recovered extraction order',
  );
}
for (const [id, node] of Object.entries(nodes)) {
  if (!id.startsWith('c5-')) continue;
  for (const choice of node.choices) {
    if ((choice.changes?.health ?? 0) > 0) {
      failures.push(
        `Chapter Five restores Health inside cold fire: ${choice.id}`,
      );
    }
  }
}
const memoryGlassExplanation = [
  nodes['c5-memory-wall'].lesson?.body ?? '',
  ...nodes['c5-memory-wall'].body(chapterFiveBase),
].join(' ');
if (
  !/small scene moves without sound/i.test(memoryGlassExplanation) ||
  !/(?:Vaor’s own memories.*bars of his prison|memories have become his cage)/i.test(
    memoryGlassExplanation,
  )
) {
  failures.push(
    'Chapter Five does not plainly distinguish memory glass from alternate timelines',
  );
}
const chapterFiveOpening = [
  nodes['c5-north-road'].objective,
  ...nodes['c5-north-road'].body(chapterFiveBase),
].join(' ');
const coldCrossing = nodes['c5-north-road'].choices.find(
  (choice) => choice.id === 'c5-cross-in-shadow',
);
if (
  /extract its ember/i.test(nodes['c5-north-road'].objective) ||
  !/black glass.*steals enough heat/i.test(chapterFiveOpening) ||
  !/shallow cold burn.*not a loss of Health/i.test(chapterFiveOpening) ||
  !/glass chilled cloth/i.test(coldCrossing?.label ?? '')
) {
  failures.push(
    'Chapter Five either names the ember too early or lets darkness hide body heat from cold fire',
  );
}
const sorinRescue = renderedBody('c5-coldfire-rescue', chapterFiveBase);
const sorinShelter = renderedBody('c5-glass-shelter', chapterFiveBase);
if (
  /Vaor|survey force|soldiers died|survivors carried/i.test(sorinRescue) ||
  !/Once he can breathe without shaking.*Vaor is an ancient dragon/i.test(
    sorinShelter,
  )
) {
  failures.push(
    'Sorin still delivers the Dragonspine history dump while trapped beneath the glass',
  );
}
const royalCamp = renderedBody('c5-royal-camp', chapterFiveBase);
const decodedRoyalCamp = renderedBody('c5-royal-camp', {
  ...chapterFiveBase,
  flags: ['c5-decoded-parting-clue'],
});
if (
  !/living ember, a piece of Vaor’s own fire/i.test(royalCamp) ||
  /buyer knew this camp/i.test(royalCamp) ||
  !/buyer knew this camp.*moved east/i.test(decodedRoyalCamp)
) {
  failures.push(
    'The royal camp does not introduce the ember plainly or continue the buyer thread',
  );
}
const ashTunnel = renderedBody('c5-ash-tunnel', chapterFiveBase);
if (!/four sharp notes.*old keeper signal for a collapse/i.test(ashTunnel)) {
  failures.push(
    'Sorin’s keeper collapse signal is not demonstrated before the ash tunnel choice',
  );
}
const vaorMeeting = renderedBody('c5-vaor-wakes', chapterFiveBase);
if (
  !/broken cage is the fire Nail/i.test(vaorMeeting) ||
  !/warm light inside Vaor is his living ember/i.test(vaorMeeting) ||
  !/fragment came from the Nail of Distance/i.test(vaorMeeting) ||
  !/not part of the fire Nail/i.test(vaorMeeting) ||
  !/all nine Nails use the same kind of lock/i.test(vaorMeeting) ||
  /belongs to its outer ring/i.test(vaorMeeting)
) {
  failures.push(
    'Vaor’s meeting does not distinguish the Distance fragment, fire Nail, and living ember',
  );
}
const mirrorLockChoice = nodes['c5-vaor-wakes'].choices.find(
  (choice) => choice.id === 'c5-test-lock-with-mirror',
);
if (
  !/mirrored coin/i.test(mirrorLockChoice?.result ?? '') ||
  !/snaps the coin in half/i.test(mirrorLockChoice?.result ?? '') ||
  /missing boot/i.test(chapterFiveSource)
) {
  failures.push(
    'The parting mirror does not visibly reveal the lock and get consumed',
  );
}
const sealChoice = nodes['c5-royal-camp'].choices.find(
  (choice) => choice.id === 'c5-use-command-seal',
);
const falseEmberRouteChoice = nodes['c5-crown-assault'].choices.find(
  (choice) => choice.id === 'c5-stage-reflected-ember',
);
const mapWaxChoice = nodes['c5-heart-memory'].choices.find(
  (choice) => choice.id === 'c5-copy-proof-into-map-wax',
);
const vaorClawChoice = nodes['c5-crown-assault'].choices.find(
  (choice) => choice.id === 'c5-free-claw-against-crown',
);
if (
  isChoiceVisible(sealChoice, chapterFiveBase) ||
  !isChoiceVisible(sealChoice, {
    ...chapterFiveBase,
    flags: ['c5-decoded-parting-clue'],
  })
) {
  failures.push(
    'The commander seal appears without decoding Rook’s parting clue',
  );
}
if (
  isChoiceVisible(mirrorLockChoice, {
    ...chapterFiveBase,
    flags: ['c4-rook-trusted'],
  }) ||
  !isChoiceVisible(mirrorLockChoice, {
    ...chapterFiveBase,
    flags: ['c4-rook-arrested'],
  }) ||
  !isChoiceVisible(mirrorLockChoice, {
    ...chapterFiveBase,
    flags: ['c4-rook-bargain'],
  })
) {
  failures.push(
    'Vaor’s lock does not preserve which Chapter Four routes carry a mirrored coin',
  );
}
if (
  isChoiceVisible(falseEmberRouteChoice, chapterFiveBase) ||
  !isChoiceVisible(falseEmberRouteChoice, {
    ...chapterFiveBase,
    flags: ['c5-spent-parting-coin'],
  })
) {
  failures.push('The false ember appears before the mirrored coin breaks');
}
if (
  isChoiceVisible(mapWaxChoice, {
    ...chapterFiveBase,
    flags: ['c4-rook-bargain'],
  }) ||
  !isChoiceVisible(mapWaxChoice, {
    ...chapterFiveBase,
    flags: ['c4-rook-trusted'],
  })
) {
  failures.push(
    'The Orivane memory copy does not preserve the trust route’s map wax',
  );
}
if (
  isChoiceVisible(vaorClawChoice, chapterFiveBase) ||
  !isChoiceVisible(vaorClawChoice, {
    ...chapterFiveBase,
    flags: ['c5-freed-vaor-claw'],
  })
) {
  failures.push('Vaor can strike through a claw the player did not free');
}
if (
  /Romance is not assumed|without entering a romance scene|chosen companion|six convincing thieves/i.test(
    chapterFiveSource,
  )
) {
  failures.push(
    'Chapter Five still exposes design language or a stale Rook reference to the player',
  );
}
const vaorQuestion = renderedBody('c5-vaor-test', chapterFiveBase);
if (
  !/people of those who chained me/i.test(vaorQuestion) ||
  !/A century ago.*Two nights ago/is.test(vaorQuestion) ||
  /world that buried its price/i.test(vaorQuestion)
) {
  failures.push('Vaor asks about the Concord’s hidden price before showing it');
}
const haleAssault = renderedBody('c5-crown-assault', chapterFiveBase);
if (
  !/cold fire leaves these mountains.*next winter kills three provinces/i.test(
    haleAssault,
  ) ||
  !/world survive long enough to condemn me/i.test(haleAssault) ||
  !/Stopping the drill comes first/i.test(haleAssault)
) {
  failures.push(
    'Commander Hale still lacks a distinct motive or a direct response from Caelan',
  );
}
const haleArrivalCases = [
  [['c5-crown-lost-trail'], /only six enter behind him/i],
  [['c5-crown-saw-flare'], /flare showed him exactly which grave door/i],
  [
    ['c5-diverted-patrol-with-seal'],
    /false order sent the returning patrol downhill/i,
  ],
  [['c5-silenced-archers'], /denied Hale a warning/i],
  [
    ['c5-trapped-drill-crew'],
    /smaller cutting frame.*Ash grinds inside its gears/i,
  ],
  [['c5-sorin-revealed-to-crown'], /keeper warning told Hale which tunnel/i],
  [
    ['c5-slow-shadow-crossing'],
    /slow first crossing gave the returning patrol time/i,
  ],
];
for (const [flags, expected] of haleArrivalCases) {
  const arrival = renderedBody('c5-crown-assault', {
    ...chapterFiveBase,
    flags,
  });
  if (!expected.test(arrival))
    failures.push(
      `Hale’s arrival forgets Chapter Five route ${flags.join(', ')}`,
    );
}
const haleOrderChoice = nodes['c5-crown-assault'].choices.find(
  (choice) => choice.id === 'c5-turn-hale-soldiers',
);
const falseEmberChoice = nodes['c5-crown-assault'].choices.find(
  (choice) => choice.id === 'c5-stage-reflected-ember',
);
if (
  /read what he ordered/i.test(haleOrderChoice?.label ?? '') ||
  !/written order, the abandoned dead, or the killing drill/i.test(
    haleOrderChoice?.detail ?? '',
  ) ||
  !/false ember/i.test(falseEmberChoice?.label ?? '')
) {
  failures.push(
    'The Hale assault choices still assume evidence the player may not have or hide the reflected decoy',
  );
}
const assaultResolutions = [
  ['c5-break-royal-drill', /drill tears itself apart.*Hale retreats/i],
  ['c5-turn-hale-soldiers', /drill stops.*Hale retreats/i],
  ['c5-stage-reflected-ember', /stopping the drill.*forcing Hale behind/i],
  [
    'c5-free-claw-against-crown',
    /crushes the drill.*Hale throws himself behind/i,
  ],
];
for (const [choiceId, expected] of assaultResolutions) {
  const choice = nodes['c5-crown-assault'].choices.find(
    (candidate) => candidate.id === choiceId,
  );
  if (!expected.test(choice?.result ?? '')) {
    failures.push(
      `The battle does not reach a temporary resolution before Vaor’s memory after ${choiceId}`,
    );
  }
}
const heartMemory = renderedBody('c5-heart-memory', chapterFiveBase);
if (
  !/drill stopped and Hale forced behind/i.test(heartMemory) ||
  !/two living versions of the same village/i.test(heartMemory) ||
  !/families are awake/i.test(heartMemory) ||
  !/rulers knew both villages already held living people/i.test(heartMemory) ||
  /Children who might have been born|Towns that might have grown/i.test(
    heartMemory,
  )
) {
  failures.push(
    'Orivane’s memory remains abstract or begins before the assault is contained',
  );
}
const graveCollapse = renderedBody('c5-grave-collapse', chapterFiveBase);
if (!/points to a red release beside the oldest shelf/i.test(graveCollapse)) {
  failures.push(
    'Sorin does not visibly establish the emergency gallery release before the collapse choice',
  );
}
const maraAfterBridgeKiss = renderedBody('c5-mara-burns', {
  ...chapterFiveBase,
  flags: ['c4-kissed-mara'],
});
if (
  !/bridge returns in a flash.*her mouth on yours/i.test(maraAfterBridgeKiss)
) {
  failures.push('Mara’s Chapter Five scene forgets the Chapter Four kiss');
}
const graveEntryChoice = nodes['c5-grave-mouth'].choices[0];
const memoryChoice = nodes['c5-memory-wall'].choices[0];
const lysaraCareState = { ...chapterFiveBase, flags: ['c5-chose-lysara-care'] };
const maraCareState = { ...chapterFiveBase, flags: ['c5-chose-mara-care'] };
const professionalCareState = {
  ...chapterFiveBase,
  flags: ['c5-chose-sorin-care'],
};
if (
  resolveNext(graveEntryChoice, lysaraCareState) !== 'c5-memory-wall' ||
  resolveNext(memoryChoice, lysaraCareState) !== 'c5-lysara-burns' ||
  resolveNext(memoryChoice, maraCareState) !== 'c5-mara-burns' ||
  resolveNext(memoryChoice, professionalCareState) !== 'c5-sorin-care'
) {
  failures.push(
    'Chapter Five does not honour the player’s visible choice of caregiver',
  );
}
for (const choice of nodes['c5-memory-wall'].choices) {
  const next = resolveNext(choice, maraCareState);
  if (next !== 'c5-mara-burns')
    failures.push(
      `${choice.id} skips the caregiver selected in Sorin’s refuge`,
    );
}
for (const choice of nodes['c5-mara-burns'].choices) {
  if (resolveNext(choice, maraCareState) !== 'c5-vaor-wakes') {
    failures.push(
      `${choice.id} returns to a memory gallery scene the player already crossed`,
    );
  }
}
const approachPayoffs = [
  ['c5-stair-formation', /every rope and climbing hook intact/i],
  ['c5-silenced-archers', /No warning horn follows from the stair/i],
  ['c5-stair-scorched-thread', /Three burned strands hang from Lysara’s seed/i],
  [
    'c5-river-oath-path',
    /sealed keeper door.*opens directly beside the grave/i,
  ],
  ['c5-river-dark-crossing', /No royal scout follows/i],
  [
    'c5-seed-scorched-river',
    /seed is scorched.*not enough to hide the whole group/i,
  ],
  ['c5-held-ash-beam', /Every companion and evidence pack made it through/i],
  ['c5-trapped-drill-crew', /buried drill is silent/i],
  ['c5-sorin-revealed-to-crown', /Hale heard Sorin’s keeper warning/i],
];
for (const [flag, expected] of approachPayoffs) {
  const payoff = renderedBody('c5-grave-mouth', {
    ...chapterFiveBase,
    flags: [flag],
  });
  if (!expected.test(payoff))
    failures.push(`Chapter Five mountain route ${flag} has no later callback`);
}
const fullGuidePayoff = renderedBody('c5-three-climbs', {
  ...chapterFiveBase,
  flags: ['c5-sorin-full-guide'],
});
if (
  !/undamaged map case shows the archers.*keeper hatch.*weak beam/i.test(
    fullGuidePayoff,
  )
) {
  failures.push(
    'Saving Sorin with his full map no longer improves the route briefing',
  );
}
const chapterTwoFriendship = nodes['c2-night-watch'].choices.find(
  (choice) => choice.id === 'c2-choose-mara-friendship',
);
const friendshipState = nextRelationships(
  initialState.relationships,
  chapterTwoFriendship,
);
if (
  friendshipState.mara.intent !== 'platonic' ||
  friendshipState.mara.respect <= initialState.relationships.mara.respect
) {
  failures.push(
    'The Chapter Two friendship choice is not a complete, strengthening relationship path',
  );
}
for (const choiceId of ['c3-stand-with-mara', 'c3-stand-with-lysara']) {
  const choice = Object.values(nodes)
    .flatMap((node) => node.choices)
    .find((candidate) => candidate.id === choiceId);
  const effects = Object.values(relationshipChanges(choice)).flatMap(
    (change) => [change?.attraction ?? 0],
  );
  if (effects.some((value) => value !== 0)) {
    failures.push(
      `Tactical agreement still awards romantic attraction: ${choiceId}`,
    );
  }
}
const lysaraKissChoice = nodes['c5-lysara-burns'].choices.find(
  (choice) => choice.id === 'c5-kiss-lysara-after-truth',
);
const maraCommitChoice = nodes['c5-mara-burns'].choices.find(
  (choice) => choice.id === 'c5-admit-future-with-mara',
);
const maraFriendChoice = nodes['c5-mara-burns'].choices.find(
  (choice) => choice.id === 'c5-choose-mara-friendship',
);
const lysaraCommitChoice = nodes['c5-lysara-burns'].choices.find(
  (choice) => choice.id === 'c5-admit-future-with-lysara',
);
const lysaraFriendChoice = nodes['c5-lysara-burns'].choices.find(
  (choice) => choice.id === 'c5-choose-lysara-friendship',
);
const bothFriendChoice = nodes['c5-sorin-care'].choices.find(
  (choice) => choice.id === 'c5-choose-both-friendship',
);
const openMaraBondState = {
  ...chapterFiveBase,
  relationships: {
    mara: {
      ...initialState.relationships.mara,
      trust: 6,
      attraction: 5,
      intent: 'exploring',
    },
    lysara: {
      ...initialState.relationships.lysara,
      trust: 6,
      attraction: 5,
      intent: 'interested',
    },
  },
};
const resolvedMaraBondState = {
  ...openMaraBondState,
  relationships: {
    ...openMaraBondState.relationships,
    mara: { ...openMaraBondState.relationships.mara, intent: 'platonic' },
  },
};
if (
  canChoose(lysaraKissChoice, openMaraBondState) ||
  !canChoose(lysaraKissChoice, resolvedMaraBondState)
) {
  failures.push(
    'Chapter Five allows a new commitment before an existing romance is honestly resolved',
  );
}
for (const intent of ['platonic', 'ended']) {
  const maraResolved = {
    ...highResourceState(chapterFiveBase),
    relationships: {
      ...highResourceState(chapterFiveBase).relationships,
      mara: {
        ...highResourceState(chapterFiveBase).relationships.mara,
        intent,
      },
    },
  };
  const lysaraResolved = {
    ...highResourceState(chapterFiveBase),
    relationships: {
      ...highResourceState(chapterFiveBase).relationships,
      lysara: {
        ...highResourceState(chapterFiveBase).relationships.lysara,
        intent,
      },
    },
  };
  if (
    isChoiceVisible(maraCommitChoice, maraResolved) ||
    isChoiceVisible(lysaraCommitChoice, lysaraResolved)
  ) {
    failures.push(
      `Chapter Five reopens an ordinary romance after ${intent} intent`,
    );
  }
}
for (const intent of ['exploring', 'committed']) {
  const maraActive = {
    ...highResourceState(chapterFiveBase),
    relationships: {
      ...highResourceState(chapterFiveBase).relationships,
      mara: {
        ...highResourceState(chapterFiveBase).relationships.mara,
        intent,
      },
    },
  };
  const lysaraActive = {
    ...highResourceState(chapterFiveBase),
    relationships: {
      ...highResourceState(chapterFiveBase).relationships,
      lysara: {
        ...highResourceState(chapterFiveBase).relationships.lysara,
        intent,
      },
    },
  };
  if (
    isChoiceVisible(maraFriendChoice, maraActive) ||
    isChoiceVisible(lysaraFriendChoice, lysaraActive) ||
    isChoiceVisible(bothFriendChoice, maraActive) ||
    isChoiceVisible(bothFriendChoice, lysaraActive)
  ) {
    failures.push(
      `Chapter Five silently converts an ${intent} romance into friendship`,
    );
  }
}
const lysaraCollapse = renderedBody('c5-grave-collapse', lysaraCareState);
const sorinCollapse = renderedBody('c5-grave-collapse', professionalCareState);
const lysaraPactEnding = renderedBody('c5-ending-pact', {
  ...lysaraCareState,
  flags: [...lysaraCareState.flags, 'c5-kissed-lysara'],
});
if (
  !/first step is toward Lysara/i.test(lysaraCollapse) ||
  !/first step is toward Sorin/i.test(sorinCollapse) ||
  !/Lysara asks you to repeat the last promise/i.test(lysaraPactEnding)
) {
  failures.push(
    'Chapter Five returns the emotional camera to Mara after another caregiver was chosen',
  );
}
const pactChoice = nodes['c5-ember-choice'].choices.find(
  (choice) => choice.id === 'c5-pact-with-vaor',
);
const repairedPactChoice = nodes['c5-ember-choice'].choices.find(
  (choice) => choice.id === 'c5-pact-with-vaor-after-repair',
);
const pactEnding = renderedBody('c5-ending-pact', chapterFiveBase);
const pactContractPattern =
  /protect living people.*expose what the Concord erased.*Either of us may refuse.*ends when the gate is safe.*both of us say.*duty is complete/is;
if (
  !pactContractPattern.test(pactChoice?.result ?? '') ||
  !pactContractPattern.test(repairedPactChoice?.result ?? '') ||
  !/protective glass shell he can break/i.test(pactChoice?.result ?? '') ||
  !/no longer chained.*break free when he is ready/i.test(pactEnding)
) {
  failures.push('The pact ending leaves Vaor’s physical captivity unresolved');
}
const freedomChoice = nodes['c5-ember-choice'].choices.find(
  (choice) => choice.id === 'c5-free-vaor',
);
if (
  !/controls when it answers.*frightened kingdoms will know you released him/i.test(
    freedomChoice?.advantage ?? '',
  )
) {
  failures.push(
    'Freeing Vaor remains a dominant ending without a clear future risk',
  );
}
const savedCompanionChoice = nodes['c5-grave-collapse'].choices.find(
  (choice) => choice.id === 'c5-guard-mara-collapse',
);
if (
  savedCompanionChoice?.addFlags?.includes('c5-saved-mara-from-glass') ||
  !savedCompanionChoice?.addFlags?.includes('c5-saved-chosen-companion') ||
  /chosen companion/i.test(savedCompanionChoice?.label ?? '')
) {
  failures.push(
    'The grave collapse still records Mara when another caregiver may be trapped',
  );
}
const emberChoiceBody = renderedBody('c5-ember-choice', chapterFiveBase);
if (/No option protects every claim/i.test(emberChoiceBody)) {
  failures.push(
    'The ember choice still tells the player how to judge its balance',
  );
}
const respectfulVaorFinal = renderedBody('c5-ember-choice', {
  ...chapterFiveBase,
  flags: [
    'c5-asked-memory-permission',
    'c5-vaor-heard-first',
    'c5-defended-living-world',
  ],
});
const abusiveVaorFinal = renderedBody('c5-ember-choice', {
  ...chapterFiveBase,
  flags: ['c5-broke-memory-slab'],
});
const repairedVaorFinal = renderedBody('c5-ember-choice', {
  ...chapterFiveBase,
  flags: [
    'c5-broke-memory-slab',
    'c5-vaor-trusted-memory',
    'c5-knows-orivane-renewal-wish',
  ],
});
const normalFreedom = nodes['c5-ember-choice'].choices.find(
  (choice) => choice.id === 'c5-free-vaor',
);
const repairedFreedom = nodes['c5-ember-choice'].choices.find(
  (choice) => choice.id === 'c5-free-vaor-after-repair',
);
if (
  respectfulVaorFinal === abusiveVaorFinal ||
  abusiveVaorFinal === repairedVaorFinal ||
  !/asked before entering.*lowered steel/is.test(respectfulVaorFinal) ||
  !/willing answer now requires repair/i.test(abusiveVaorFinal) ||
  !/does not restore the day.*ask forgiveness/is.test(repairedVaorFinal) ||
  !isChoiceVisible(normalFreedom, { ...chapterFiveBase, flags: [] }) ||
  isChoiceVisible(normalFreedom, {
    ...chapterFiveBase,
    flags: ['c5-broke-memory-slab'],
  }) ||
  !isChoiceVisible(repairedFreedom, {
    ...chapterFiveBase,
    flags: ['c5-broke-memory-slab'],
  })
) {
  failures.push(
    'Vaor does not distinguish respectful, abusive, and reparative histories at the final choice',
  );
}
const riverResolveChoice = nodes['c5-frozen-river'].choices.find(
  (choice) => choice.id === 'c5-river-hold-panic',
);
if (
  !/cold cloth|cloth cooled/i.test(
    `${riverResolveChoice?.detail} ${riverResolveChoice?.result}`,
  ) ||
  !/breath/i.test(
    `${riverResolveChoice?.detail} ${riverResolveChoice?.result}`,
  ) ||
  !/darkness hides.*royal scouts/i.test(riverResolveChoice?.advantage ?? '')
) {
  failures.push(
    'The frozen river still treats darkness as protection from heat seeking cold fire',
  );
}
const treatedLysaraCare = nodes['c5-glass-shelter'].choices.filter(
  (choice) =>
    choice.id.startsWith('c5-ask-lysara-read-nail') &&
    isChoiceVisible(choice, { ...chapterFiveBase, flags: ['c2-saved-lysara'] }),
);
const untreatedLysaraCare = nodes['c5-glass-shelter'].choices.filter(
  (choice) =>
    choice.id.startsWith('c5-ask-lysara-read-nail') &&
    isChoiceVisible(choice, { ...chapterFiveBase, flags: [] }),
);
if (
  treatedLysaraCare.length !== 1 ||
  treatedLysaraCare[0].id !== 'c5-ask-lysara-read-nail' ||
  untreatedLysaraCare.length !== 1 ||
  untreatedLysaraCare[0].id !== 'c5-ask-lysara-read-nail-strained' ||
  !/injured hand never fully recovered.*binds her wrist/is.test(
    renderedBody('c5-memory-wall', chapterFiveBase),
  )
) {
  failures.push(
    'Chapter Five precision seed work does not honour Lysara’s Bellweather treatment state',
  );
}
for (const flag of [
  'c5-knows-orivane-renewal-wish',
  'c5-memorised-founder-seals',
]) {
  const withoutFlag = renderedBody('c6-first-duty', chapterSixBase);
  const withFlag = renderedBody('c6-first-duty', {
    ...chapterSixBase,
    flags: [flag],
  });
  if (withoutFlag === withFlag)
    failures.push(
      `Paid Orivane choice ${flag} has no Chapter Six proof callback`,
    );
}
for (const endingId of [
  'c5-ending-free',
  'c5-ending-force',
  'c5-ending-pact',
]) {
  const ending = [
    sceneObjectiveText(nodes[endingId], chapterFiveBase),
    ...nodes[endingId].body(chapterFiveBase),
  ].join(' ');
  if (!/moving orc town/i.test(ending) || /Black Gate/.test(ending)) {
    failures.push(
      `${endingId} does not define Kharad Vey simply before withholding the Gate’s proper name`,
    );
  }
  if (
    !/separate from the damaged Nail left in the mountain/i.test(ending) ||
    /part of the fire Nail/i.test(ending)
  ) {
    failures.push(
      `${endingId} confuses Vaor’s living ember with the fire Nail`,
    );
  }
}
for (const endingId of [
  'c5-ending-free',
  'c5-ending-force',
  'c5-ending-pact',
]) {
  if (nodes[endingId].nextChapter !== 'c6-steppe-road') {
    failures.push(`${endingId} does not continue into Chapter Six`);
  }
}
const chapterSixArrivalGiven = renderedBody('c6-steppe-road', {
  ...chapterSixBase,
  flags: ['c5-freed-vaor'],
});
const chapterSixArrivalTaken = renderedBody('c6-steppe-road', {
  ...chapterSixBase,
  flags: ['c5-took-ember-by-force'],
});
const chapterSixArrivalPact = renderedBody('c6-steppe-road', {
  ...chapterSixBase,
  flags: ['c5-vaor-pact'],
});
if (
  !/promised to meet you here, not to obey/i.test(chapterSixArrivalGiven) ||
  !/ember you tore from Vaor/i.test(chapterSixArrivalTaken) ||
  !/Vaor moves inside your thoughts/i.test(chapterSixArrivalPact)
) {
  failures.push(
    'Chapter Six does not preserve all three Vaor outcomes at arrival',
  );
}
for (const endingFlag of chapterFiveContinuityContract.vaorOutcomes) {
  for (const evidenceFlag of chapterFiveContinuityContract.evidenceHandoffs) {
    const arrival = renderedBody('c6-steppe-road', {
      ...chapterSixBase,
      flags: [endingFlag, evidenceFlag],
    });
    if (
      !/Mara, Lysara, and Sorin escaped Dragonspine beside you/i.test(arrival)
    ) {
      failures.push(
        `${endingFlag} does not place the full Dragonspine party at the Chapter Six opening`,
      );
    }
    const evidencePatterns = {
      'c5-has-extraction-order':
        /Malrec’s extraction order.*came out with you/i,
      'c5-royal-witnesses-turned': /two royal witnesses.*came out with you/i,
      'c5-memory-copied-to-map-wax':
        /Orivane’s memory in black wax.*came out with you/i,
      'c5-saved-memory-witnesses': /three memory plates.*came out with you/i,
      'c5-oath-held-memory-grave': /six memory plates.*came out with you/i,
      'c5-lost-royal-camp-proof':
        /loose drill logs and copied camp records were lost.*carried items survived/i,
    };
    if (!evidencePatterns[evidenceFlag].test(arrival)) {
      failures.push(
        `Chapter Six opening forgets ${evidenceFlag} after ${endingFlag}`,
      );
    }
  }
}
const witnessCollapse = renderedBody('c5-ember-choice', {
  ...chapterFiveBase,
  flags: ['c5-royal-witnesses-turned', 'c5-saved-memory-witnesses'],
});
const witnessChapterSix = renderedBody('c6-steppe-road', {
  ...chapterSixBase,
  flags: ['c5-freed-vaor', 'c5-royal-witnesses-turned'],
});
if (
  !/Six soldiers lowered.*Four stay.*Two leave/is.test(witnessCollapse) ||
  !/two royal witnesses.*came out with you/i.test(witnessChapterSix)
) {
  failures.push(
    'The six soldiers who lowered crossbows are not reconciled with the two travelling witnesses',
  );
}
const maraFriendshipArrival = renderedBody('c6-steppe-road', {
  ...chapterSixBase,
  flags: ['c5-freed-vaor', 'c5-mara-friendship'],
});
const lysaraFriendshipArrival = renderedBody('c6-steppe-road', {
  ...chapterSixBase,
  flags: ['c5-freed-vaor', 'c5-lysara-friendship'],
});
if (
  /friendship|unanswered promise|Underways|Rook chose|Rook is following|escaped your arrest/i.test(
    maraFriendshipArrival,
  ) ||
  /friendship|unanswered promise|Underways|Rook chose|Rook is following|escaped your arrest/i.test(
    lysaraFriendshipArrival,
  )
) {
  failures.push(
    'Chapter Six opening recaps absent companions or relationship history before the moving-city danger',
  );
}
if (
  nodes['c6-steppe-road'].introducesStoryTerms?.includes('Black Gate') ||
  !nodes['c6-first-duty'].introducesStoryTerms?.includes('Black Gate')
) {
  failures.push(
    'Chapter Six names the Black Gate before Korran explains the name',
  );
}
const chapterSixOpening = renderedBody('c6-steppe-road', chapterSixBase);
if (
  !/red grass.*wheel tracks/is.test(chapterSixOpening) ||
  !/twelve wooden platforms.*wheels are taller than a gatehouse/is.test(
    chapterSixOpening,
  ) ||
  !/Ancestor storm.*honoured dead/is.test(chapterSixOpening) ||
  /six days|fourth night|Crown riders|Black Gate/i.test(chapterSixOpening)
) {
  failures.push(
    'Chapter Six opening does not stay focused on the steppe, the moving town, and the immediate storm',
  );
}
const chapterSixMootJournal = knownTruths({
  ...chapterSixBase,
  nodeId: 'c6-first-duty',
}).join(' ');
const chapterSixDutyJournal = knownTruths({
  ...chapterSixBase,
  nodeId: 'c6-herd-duty',
}).join(' ');
const chapterSixTermsJournal = knownTruths({
  ...chapterSixBase,
  nodeId: 'c6-korran-terms',
}).join(' ');
const chapterSixAfterTermsJournal = knownTruths({
  ...chapterSixBase,
  nodeId: 'c6-ilyra-entry',
}).join(' ');
const chapterSixRevealJournal = knownTruths({
  ...chapterSixBase,
  nodeId: 'c6-impossible-memory',
}).join(' ');
const chapterSixAfterRevealJournal = knownTruths({
  ...chapterSixBase,
  nodeId: 'c6-red-moot',
}).join(' ');
if (
  /Black Gate|nearest watch forts/i.test(chapterSixMootJournal) ||
  !/black stone.*Black Gate/is.test(chapterSixDutyJournal) ||
  /watch forts|gone dark/i.test(chapterSixTermsJournal) ||
  !/Black Gate.*watch forts/is.test(chapterSixAfterTermsJournal) ||
  /Unsea|new knowledge/i.test(chapterSixRevealJournal) ||
  !/Unsea.*did not prove/is.test(chapterSixAfterRevealJournal)
) {
  failures.push(
    'Chapter Six journal confirms the Gate or Unsea before the playable scene proves it',
  );
}
const emberOriginChoices = nodes['c6-ancestor-warning'].choices.filter(
  (choice) => choice.addFlags?.includes('c6-declared-ember-origin'),
);
const emberOriginCases = [
  [
    'c5-freed-vaor',
    'c6-declare-given-ember',
    /Vaor gave the ember and kept his freedom/i,
  ],
  [
    'c5-took-ember-by-force',
    'c6-confess-stolen-ember',
    /admit the theft.*Korran does not forgive/is,
  ],
  ['c5-vaor-pact', 'c6-declare-pact-ember', /two living wills chose the bond/i],
];
for (const [routeFlag, expectedId, expectedResult] of emberOriginCases) {
  const state = { ...chapterSixBase, flags: [routeFlag] };
  const visible = emberOriginChoices.filter((choice) =>
    isChoiceVisible(choice, state),
  );
  if (
    visible.length !== 1 ||
    visible[0].id !== expectedId ||
    !expectedResult.test(visible[0].result)
  ) {
    failures.push(
      `Chapter Six does not give ${routeFlag} a distinct public ember account`,
    );
  }
}
const stormPactArrival = renderedBody('c6-ancestor-warning', {
  ...chapterSixBase,
  flags: ['c5-vaor-pact'],
});
if (
  /became afraid/i.test(stormPactArrival) ||
  !/Something else is speaking with them/i.test(stormPactArrival)
) {
  failures.push(
    'Vaor concludes that the storm feels fear before the player performs the test',
  );
}
const stormTrace = renderedBody('c6-storm-trace', chapterSixBase);
if (
  !/left by Dragonspine last week.*mother died two winters ago/is.test(
    stormTrace,
  )
) {
  failures.push(
    'The new scar test does not give the player an understandable chronology',
  );
}
const vaorFearChoice = nodes['c6-storm-trace'].choices.find(
  (choice) => choice.id === 'c6-ask-vaor-hear-fear',
);
if (
  isChoiceVisible(vaorFearChoice, {
    ...chapterSixBase,
    flags: ['c5-freed-vaor'],
  }) ||
  isChoiceVisible(vaorFearChoice, {
    ...chapterSixBase,
    flags: ['c5-took-ember-by-force'],
  }) ||
  !isChoiceVisible(vaorFearChoice, {
    ...chapterSixBase,
    flags: ['c5-vaor-pact'],
  })
) {
  failures.push(
    'The direct Vaor storm test appears when Vaor is not sharing Caelan’s thoughts',
  );
}
const unseaSourceFinding = renderedBody('c6-impossible-memory', {
  ...chapterSixBase,
  flags: ['c6-unsea-thread-found'],
});
const unseaMemoryFinding = renderedBody('c6-impossible-memory', {
  ...chapterSixBase,
  flags: ['c6-korran-memory-test'],
});
const unseaFearFinding = renderedBody('c6-impossible-memory', {
  ...chapterSixBase,
  flags: ['c6-tested-storm-fear'],
});
const unseaRecordFinding = renderedBody('c6-impossible-memory', {
  ...chapterSixBase,
  flags: ['c6-voice-knew-new-events'],
});
if (
  !/hidden source.*does not tell you whether/is.test(unseaSourceFinding) ||
  !/perfect copy.*proves depth, not identity/is.test(unseaMemoryFinding) ||
  !/reaction looks like fear.*cannot prove/is.test(unseaFearFinding) ||
  !/feeding the storm new knowledge now/i.test(unseaRecordFinding) ||
  !/do not know whether its faces are truly the dead or only copies/i.test(
    nodes['c6-impossible-memory'].lesson?.body ?? '',
  )
) {
  failures.push(
    'Chapter Six grants the same Unsea conclusion regardless of the selected test',
  );
}
const ilyraInterestChoice = nodes['c6-ilyra-entry'].choices.find(
  (choice) => choice.id === 'c6-accept-ilyra-interest',
);
const openMaraChapterSix = {
  ...chapterSixBase,
  relationships: {
    ...chapterSixBase.relationships,
    mara: { ...chapterSixBase.relationships.mara, intent: 'committed' },
  },
};
const unattachedChapterSix = {
  ...chapterSixBase,
  relationships: {
    ...chapterSixBase.relationships,
    mara: { ...chapterSixBase.relationships.mara, intent: 'platonic' },
    lysara: { ...chapterSixBase.relationships.lysara, intent: 'platonic' },
  },
};
if (
  canChoose(ilyraInterestChoice, openMaraChapterSix) ||
  !canChoose(ilyraInterestChoice, unattachedChapterSix)
) {
  failures.push(
    'Ilyra attraction does not respect Caelan’s existing relationship commitments',
  );
}
const ilyraInterestState = nextRelationships(
  unattachedChapterSix.relationships,
  ilyraInterestChoice,
);
if (
  ilyraInterestState.ilyra.intent !== 'interested' ||
  ilyraInterestState.ilyra.attraction <=
    unattachedChapterSix.relationships.ilyra.attraction
) {
  failures.push(
    'Chapter Six does not record the player’s explicit interest in Ilyra',
  );
}
const unattachedIlyraEntry = renderedBody(
  'c6-ilyra-entry',
  unattachedChapterSix,
);
if (
  /Attraction reaches you|The interest is real|delayed permission/i.test(
    unattachedIlyraEntry,
  ) ||
  !/What you feel about it remains yours to decide/i.test(
    unattachedIlyraEntry,
  ) ||
  !/badge says duty.*people say protection.*reaction says/is.test(
    unattachedIlyraEntry,
  )
) {
  failures.push(
    'Ilyra’s entrance asserts attraction or treats Threadread as exact mind reading',
  );
}
const finalWarChoice = nodes['c6-final-alliance'].choices.find(
  (choice) => choice.id === 'c6-ask-red-war',
);
const finalAllianceChoice = nodes['c6-final-alliance'].choices.find(
  (choice) => choice.id === 'c6-ask-guarded-alliance',
);
const strongMootState = {
  ...chapterSixBase,
  flags: [
    'c5-freed-vaor',
    'c6-whole-herd-saved',
    'c6-korran-respect',
    'c6-declared-ember-origin',
  ],
};
const mixedMootState = {
  ...chapterSixBase,
  flags: ['c5-freed-vaor', 'c6-declared-ember-origin'],
};
const concealedTheftState = {
  ...chapterSixBase,
  flags: [
    'c5-took-ember-by-force',
    'c6-trial-won-moot',
    'c6-refused-ember-disclosure',
    'c6-concealed-ember-theft',
  ],
};
const admittedTheftState = {
  ...chapterSixBase,
  flags: [
    'c5-took-ember-by-force',
    'c6-admitted-ember-theft',
    'c6-declared-ember-origin',
    'c6-trial-won-moot',
  ],
};
if (
  !isChoiceVisible(finalWarChoice, strongMootState) ||
  isChoiceVisible(finalWarChoice, mixedMootState) ||
  !isChoiceVisible(finalAllianceChoice, mixedMootState) ||
  isChoiceVisible(finalAllianceChoice, concealedTheftState) ||
  !isChoiceVisible(finalAllianceChoice, admittedTheftState)
) {
  failures.push(
    'Chapter Six support requests ignore the trust and ember honesty earned before the Moot',
  );
}
const warInterestEnding = renderedBody('c6-ending-war', {
  ...chapterSixBase,
  flags: ['c6-ilyra-interest-acknowledged'],
});
const warBoundaryEnding = renderedBody('c6-ending-war', {
  ...chapterSixBase,
  flags: ['c6-refused-ilyra-pressure'],
});
if (
  !/kept politics and desire separate/i.test(warInterestEnding) ||
  !/Evidence without theatre/i.test(warBoundaryEnding) ||
  /curiosity/i.test(warBoundaryEnding)
) {
  failures.push(
    'The Chapter Six war ending forgets how the player answered Ilyra',
  );
}
const chapterSixEndingFlags = {
  'c6-ending-war': 'c6-red-moot-war',
  'c6-ending-alliance': 'c6-red-moot-alliance',
  'c6-ending-neutral': 'c6-red-moot-neutral',
};
for (const [endingId, flag] of Object.entries(chapterSixEndingFlags)) {
  const finalChoice = nodes['c6-final-alliance'].choices.find(
    (choice) => choice.next === endingId,
  );
  if (
    !finalChoice?.addFlags?.includes(flag) ||
    'wayfire' in (finalChoice.changes ?? {})
  ) {
    failures.push(
      `${endingId} must record its Moot outcome without retired currency`,
    );
  }
}
for (const endingId of Object.keys(chapterSixEndingFlags)) {
  if (nodes[endingId].nextChapter !== 'c7-red-horizon') {
    failures.push(`${endingId} does not continue into Chapter Seven`);
  }
}

const urgentAncestorResponses = [
  'c6-admit-rulers-lied',
  'c6-demand-storm-name-source',
  'c6-order-party-defensive-ring',
];
const delayedDisclosureByVaor = {
  'c5-freed-vaor': ['c6-disclose-gift-after-crisis', 'c6-refuse-ember-account'],
  'c5-took-ember-by-force': [
    'c6-disclose-theft-after-crisis',
    'c6-conceal-ember-theft',
  ],
  'c5-vaor-pact': ['c6-disclose-pact-after-crisis', 'c6-refuse-ember-account'],
};
for (const [vaorFlag, expectedChoiceIds] of Object.entries(
  delayedDisclosureByVaor,
)) {
  for (const responseId of urgentAncestorResponses) {
    const response = nodes['c6-ancestor-warning'].choices.find(
      (choice) => choice.id === responseId,
    );
    const pendingFlags = [...(response?.addFlags ?? []), vaorFlag];
    const pendingState = { ...chapterSixBase, flags: pendingFlags };
    for (const expectedChoiceId of expectedChoiceIds) {
      const expectedChoice = nodes['c6-korran-terms'].choices.find(
        (choice) => choice.id === expectedChoiceId,
      );
      if (
        !response?.addFlags?.includes('c6-ember-disclosure-pending') ||
        !isChoiceVisible(expectedChoice, pendingState)
      ) {
        failures.push(
          `${responseId} does not preserve the later ${vaorFlag} disclosure decision`,
        );
      }
    }
  }
}
for (const [vaorFlag, directChoiceId] of [
  ['c5-freed-vaor', 'c6-declare-given-ember'],
  ['c5-took-ember-by-force', 'c6-confess-stolen-ember'],
  ['c5-vaor-pact', 'c6-declare-pact-ember'],
]) {
  const choice = nodes['c6-ancestor-warning'].choices.find(
    (candidate) => candidate.id === directChoiceId,
  );
  if (
    !isChoiceVisible(choice, { ...chapterSixBase, flags: [vaorFlag] }) ||
    !choice.addFlags?.includes(
      chapterSixContinuityContract.disclosureStates.voluntary,
    )
  ) {
    failures.push(
      `${directChoiceId} does not record a voluntary ember disclosure`,
    );
  }
}

const vaorUseFixtures = [
  [
    'c6-running-gate',
    [
      'c6-ember-burn-anchor',
      'c6-force-stolen-ember-anchor',
      'c6-share-pact-ember-anchor',
    ],
  ],
  [
    'c6-herd-duty',
    [
      'c6-ember-wall-herd',
      'c6-force-stolen-ember-herd',
      'c6-share-pact-ember-herd',
    ],
  ],
  [
    'c6-forge-duty',
    [
      'c6-feed-ember-to-brake',
      'c6-force-stolen-ember-brake',
      'c6-share-pact-ember-brake',
    ],
  ],
  [
    'c6-storm-trace',
    [
      'c6-let-ilyra-thread-ember',
      'c6-force-stolen-ember-thread',
      'c6-share-pact-ember-thread',
    ],
  ],
  [
    'c6-ancestor-coup',
    [
      'c6-cut-command-with-ember',
      'c6-force-stolen-ember-command',
      'c6-share-pact-ember-command',
    ],
  ],
  [
    'c7-ilyra-command-thread',
    [
      'c7-open-vaor-ember-thread',
      'c7-force-stolen-ember-thread',
      'c7-share-pact-ember-thread',
    ],
  ],
  [
    'c8-chain-plan',
    [
      'c8-burn-vaor-ember-chain',
      'c8-force-stolen-ember-chain',
      'c8-share-pact-ember-chain',
    ],
  ],
  [
    'c8-compact-route',
    [
      'c8-ember-collateral',
      'c8-force-stolen-ember-collateral',
      'c8-share-pact-ember-collateral',
    ],
  ],
];
for (const [nodeId, choiceIds] of vaorUseFixtures) {
  chapterSixContinuityContract.vaorOutcomes.forEach(
    (vaorFlag, outcomeIndex) => {
      const state = {
        ...(nodeId.startsWith('c6-')
          ? chapterSixBase
          : nodeId.startsWith('c7-')
            ? chapterSevenBase
            : chapterEightBase),
        flags: [vaorFlag],
      };
      choiceIds.forEach((choiceId, choiceIndex) => {
        const choice = nodes[nodeId].choices.find(
          (candidate) => candidate.id === choiceId,
        );
        if (isChoiceVisible(choice, state) !== (outcomeIndex === choiceIndex)) {
          failures.push(
            `${String(nodeId)} does not distinguish Vaor gift, theft, and pact permission`,
          );
        }
      });
    },
  );
}

for (const oathFlag of chapterSixContinuityContract.exactOaths) {
  const oathStateSeven = {
    ...chapterSevenBase,
    flags: ['c5-freed-vaor', 'c6-red-moot-alliance', oathFlag],
  };
  const oathStateEight = {
    ...chapterEightBase,
    flags: ['c5-freed-vaor', 'c6-red-moot-alliance', oathFlag],
  };
  if (
    renderedBody('c7-red-horizon', oathStateSeven) ===
      renderedBody('c7-red-horizon', {
        ...chapterSevenBase,
        flags: ['c5-freed-vaor', 'c6-red-moot-alliance'],
      }) ||
    renderedBody('c8-oath-ledger', oathStateEight) ===
      renderedBody('c8-oath-ledger', chapterEightBase)
  ) {
    failures.push(
      `${oathFlag} does not remain visible in Chapters Seven and Eight`,
    );
  }
}
const fullArmyChoice = nodes['c7-army-future'].choices.find(
  (choice) => choice.id === 'c7-take-full-army',
);
if (
  isChoiceVisible(fullArmyChoice, {
    ...chapterSevenBase,
    flags: ['c6-oath-honest-limit'],
  })
) {
  failures.push(
    'The limited personal steppe Oath does not constrain Chapter Seven command',
  );
}
const restitutionChoice = nodes['c7-marshal-parley'].choices.find(
  (choice) => choice.id === 'c7-invoke-crown-restitution-oath',
);
if (
  !isChoiceVisible(restitutionChoice, {
    ...chapterSevenBase,
    flags: ['c6-oath-crown-restitution'],
  })
) {
  failures.push(
    'The Crown restitution Oath receives no public judgment option in Chapter Seven',
  );
}

for (const proofFlag of [
  ...chapterFiveContinuityContract.evidenceHandoffs,
  'c5-knows-orivane-renewal-wish',
  'c5-memorised-founder-seals',
]) {
  const withoutProof = renderedBody('c6-red-moot', chapterSixBase);
  const withProof = renderedBody('c6-red-moot', {
    ...chapterSixBase,
    flags: [proofFlag],
  });
  if (withoutProof === withProof && proofFlag !== 'c5-lost-royal-camp-proof') {
    failures.push(
      `${proofFlag} does not change the evidence available at the Red Moot`,
    );
  }
}

for (const seedFlag of chapterSixContinuityContract.seedDamage.slice(0, 4)) {
  const damagedStateSix = { ...chapterSixBase, flags: [seedFlag] };
  const damagedHorn = nodes['c6-storm-breach'].choices.find(
    (choice) => choice.id === 'c6-carry-living-horn-damaged',
  );
  const healthyHorn = nodes['c6-storm-breach'].choices.find(
    (choice) => choice.id === 'c6-carry-living-horn',
  );
  const damagedStateEight = { ...chapterEightBase, flags: [seedFlag] };
  const damagedPell = nodes['c8-first-knock'].choices.find(
    (choice) => choice.id === 'c8-help-damaged-seed-save-pell',
  );
  const healthyPell = nodes['c8-first-knock'].choices.find(
    (choice) => choice.id === 'c8-let-lysara-seed-pell',
  );
  if (
    !/scorched seed|damaged seed|green threads/i.test(
      renderedBody('c6-storm-breach', damagedStateSix),
    ) ||
    !isChoiceVisible(damagedHorn, damagedStateSix) ||
    isChoiceVisible(healthyHorn, damagedStateSix) ||
    !isChoiceVisible(damagedPell, damagedStateEight) ||
    isChoiceVisible(healthyPell, damagedStateEight)
  ) {
    failures.push(`${seedFlag} does not persist through both later seed uses`);
  }
}

const craneFour = renderedBody('c6-running-gate', {
  ...chapterSixBase,
  flags: ['c6-spent-climbing-line-entry'],
});
const craneSix = renderedBody('c6-running-gate', {
  ...chapterSixBase,
  flags: ['c6-spent-climbing-line-entry', 'c5-royal-witnesses-turned'],
});
if (
  !/four travellers: you, Mara, Lysara, and Sorin/i.test(craneFour) ||
  !/six travellers: you, Mara, Lysara, Sorin, and the two royal witnesses/i.test(
    craneSix,
  )
) {
  failures.push(
    'The Chapter Six crane does not preserve the four or six person party count',
  );
}

for (const ancestorFlag of chapterSixContinuityContract.ancestorCommandOutcomes) {
  const ancestorState = { ...chapterSixBase, flags: [ancestorFlag] };
  if (
    renderedBody('c7-red-horizon', {
      ...chapterSevenBase,
      flags: ['c6-red-moot-alliance', ancestorFlag],
    }) ===
      renderedBody('c7-red-horizon', {
        ...chapterSevenBase,
        flags: ['c6-red-moot-alliance'],
      }) ||
    !knownTruths({ ...ancestorState, nodeId: 'c6-ending-alliance' }).length
  ) {
    failures.push(
      `${ancestorFlag} does not produce a distinct ending and journal state`,
    );
  }
}

const ilyraBoundaryPatterns = {
  'c6-named-ilyra-manipulation':
    /named her public pressure|named Ilyra’s public pressure/i,
  'c6-ilyra-interest-acknowledged':
    /attraction.*acknowledged|politics and desire separate/is,
  'c6-refused-ilyra-pressure':
    /distance you (?:asked for|requested)|without flirtation used as pressure/i,
  'c6-ilyra-professional-alliance': /professional and under local authority/i,
};
for (const boundaryFlag of chapterSixContinuityContract.relationshipBoundaries) {
  for (const endingId of Object.keys(chapterSixEndingFlags)) {
    const ending = renderedBody(endingId, {
      ...chapterSixBase,
      flags: [boundaryFlag],
    });
    const arrival = renderedBody('c7-ilyra-command-thread', {
      ...chapterSevenBase,
      flags: ['c6-red-moot-alliance', boundaryFlag],
    });
    if (
      !/Ilyra travels/i.test(ending) ||
      !/Ilyra rides/i.test(arrival) ||
      !ilyraBoundaryPatterns[boundaryFlag].test(`${ending} ${arrival}`)
    ) {
      failures.push(
        `${boundaryFlag} does not preserve Ilyra's presence across ${endingId}`,
      );
    }
  }
}
for (const [endingId, authorityPattern] of [
  [
    'c6-ending-war',
    /Korran keeps seasonal command.*Dema holds the western steering rope/is,
  ],
  [
    'c6-ending-alliance',
    /Red Moot gives Dema the seasonal steering cords.*commands the town/is,
  ],
  [
    'c6-ending-neutral',
    /Red Moot gives Dema the seasonal steering cords.*commands the town/is,
  ],
]) {
  if (!authorityPattern.test(renderedBody(endingId, chapterSixBase))) {
    failures.push(
      `${endingId} does not establish Kharad Vey's lawful command handoff`,
    );
  }
}
if (
  /refus(?:e|ed) war/i.test(renderedBody('c6-ending-neutral', chapterSixBase))
) {
  failures.push(
    'The voluntary neutral request is described as a rejected war request',
  );
}
const chapterSevenWarState = {
  ...chapterSevenBase,
  flags: ['c5-freed-vaor', 'c6-red-moot-war', 'c6-learned-wheel-signals'],
};
const chapterSevenAllianceState = {
  ...chapterSevenBase,
  flags: ['c5-freed-vaor', 'c6-red-moot-alliance'],
};
const chapterSevenNeutralState = {
  ...chapterSevenBase,
  flags: ['c5-freed-vaor', 'c6-red-moot-neutral'],
};
const supportArrivalCases = [
  [
    chapterSevenWarState,
    /All twelve platforms of Kharad Vey are turning east/i,
    /inner decks/i,
  ],
  [
    chapterSevenAllianceState,
    /Kharad Vey moves on a safer southern line/i,
    /shield engines/i,
  ],
  [
    chapterSevenNeutralState,
    /keeps the neutral road you requested/i,
    /split Black Ridge/i,
  ],
];
for (const [state, expectedBody, expectedChoice] of supportArrivalCases) {
  const body = renderedBody('c7-red-horizon', state);
  const visibleLabels = nodes['c7-red-horizon'].choices
    .filter((choice) => isChoiceVisible(choice, state))
    .map((choice) => choice.label)
    .join(' ');
  if (!expectedBody.test(body) || !expectedChoice.test(visibleLabels)) {
    failures.push(
      'Chapter Seven does not preserve the physical battlefield created by a Chapter Six support outcome',
    );
  }
}
const wheelFeint = nodes['c7-break-town-line'].choices.find(
  (choice) => choice.id === 'c7-command-wheel-feint',
);
const shieldFeint = nodes['c7-break-town-line'].choices.find(
  (choice) => choice.id === 'c7-command-shield-engine-feint',
);
const ridgeFeint = nodes['c7-break-town-line'].choices.find(
  (choice) => choice.id === 'c7-command-ridge-feint',
);
if (
  !isChoiceVisible(wheelFeint, chapterSevenWarState) ||
  isChoiceVisible(wheelFeint, chapterSevenAllianceState) ||
  !isChoiceVisible(shieldFeint, chapterSevenAllianceState) ||
  isChoiceVisible(shieldFeint, chapterSevenNeutralState) ||
  !isChoiceVisible(ridgeFeint, chapterSevenNeutralState)
) {
  failures.push(
    'Chapter Seven offers wheel town actions on routes where Kharad Vey is absent',
  );
}
const lioStates = {
  prisoner: { ...chapterSevenBase, flags: ['c7-lio-prisoner'] },
  returned: { ...chapterSevenBase, flags: ['c7-lio-returned'] },
  joined: { ...chapterSevenBase, flags: ['c7-lio-joined'] },
  guarded: {
    ...chapterSevenBase,
    flags: ['c7-lio-under-guard'],
  },
};
const orderStatusCases = [
  [lioStates.prisoner, /hands bound.*has not joined/is],
  [lioStates.returned, /before riding back.*absence costs you a witness/is],
  [lioStates.joined, /turned coat.*named a deserter/is],
  [lioStates.guarded, /under guard.*evidence, not allegiance/is],
];
for (const [state, expected] of orderStatusCases) {
  if (!expected.test(renderedBody('c7-captured-soldier', state))) {
    failures.push('Chapter Seven loses Lio’s chosen status at the order case');
  }
}

const chapterSevenChoiceById = (nodeId, choiceId) =>
  nodes[nodeId].choices.find((choice) => choice.id === choiceId);
const rapidLearningChoice = chapterSevenChoiceById(
  'c6-storm-trace',
  'c6-compare-living-records',
);
const chapterSevenAuthenticationText = [
  renderedBody('c7-first-riders', chapterSevenBase),
  renderedBody('c7-captured-soldier', chapterSevenBase),
].join(' ');
if (
  !/detail you spoke in the garden minutes ago/i.test(
    rapidLearningChoice.result,
  ) ||
  !/steal spoken facts after a short delay/i.test(
    chapterSevenAuthenticationText,
  ) ||
  !/cannot join a new call and answer before that answer exists/i.test(
    chapterSevenAuthenticationText,
  )
) {
  failures.push(
    'Chapter Seven authentication no longer preserves Chapter Six rapid learning while requiring a fresh living exchange',
  );
}

const orderExposureLioActions = {
  'c7-guard-lio-through-lines': ['joined', 'carries'],
  'c7-lio-delivers-orders': ['joined', 'carries'],
  'c7-lio-spreads-proof-from-within': ['returned', 'insideCopies'],
  'c7-use-lio-witness-statement': ['witness'],
  'c7-call-returned-lio-without-copies': ['returnedOnly'],
};
const orderExposureStates = {
  joined: {
    ...chapterSevenBase,
    flags: ['c7-lio-joined', 'c7-lio-carries-orders'],
  },
  returned: {
    ...chapterSevenBase,
    flags: ['c7-lio-returned', 'c7-lio-spreads-orders-inside-army'],
  },
  prisoner: {
    ...chapterSevenBase,
    flags: ['c7-lio-prisoner', 'c7-lio-prisoner-testimony'],
  },
  guarded: {
    ...chapterSevenBase,
    flags: ['c7-lio-under-guard', 'c7-lio-guarded-witness'],
  },
  returnedOnly: { ...chapterSevenBase, flags: ['c7-lio-returned'] },
};
for (const [choiceId, allowed] of Object.entries(orderExposureLioActions)) {
  const choice = chapterSevenChoiceById('c7-order-exposure', choiceId);
  for (const [stateName, state] of Object.entries(orderExposureStates)) {
    const expected =
      allowed.includes(stateName) ||
      (allowed.includes('witness') &&
        ['prisoner', 'guarded'].includes(stateName));
    if (isChoiceVisible(choice, state) !== expected) {
      failures.push(
        `${choiceId} does not respect Lio's ${stateName} location and evidence state`,
      );
    }
  }
}

const proofExposureCases = [
  [['c7-orders-on-banners'], /copies.*rise on banners/i],
  [['c7-proof-rider-relay'], /rider copies.*separate companies/i],
  [['c7-signal-tube-paper-rain'], /ordinary copies.*Crown ranks/i],
  [['c7-lio-spreads-orders-inside-army'], /signed copies inside the army/i],
  [[], /Only the original sealed order/i],
];
for (const [flags, expected] of proofExposureCases) {
  if (
    !expected.test(
      renderedBody('c7-order-exposure', { ...chapterSevenBase, flags }),
    )
  ) {
    failures.push(
      `Chapter Seven order exposure loses the exact proof state ${flags.join(', ') || 'original only'}`,
    );
  }
}
const burnWithoutCopies = chapterSevenChoiceById(
  'c7-many-or-one',
  'c7-burn-proof-for-both',
);
const burnWithCopies = chapterSevenChoiceById(
  'c7-many-or-one',
  'c7-burn-original-keep-public-proof',
);
if (
  !isChoiceVisible(burnWithoutCopies, chapterSevenBase) ||
  isChoiceVisible(burnWithCopies, chapterSevenBase) ||
  isChoiceVisible(burnWithoutCopies, {
    ...chapterSevenBase,
    flags: ['c7-orders-on-banners'],
  }) ||
  !isChoiceVisible(burnWithCopies, {
    ...chapterSevenBase,
    flags: ['c7-orders-on-banners'],
  })
) {
  failures.push(
    'Chapter Seven does not distinguish burning the only original from burning it after authenticated copies exist',
  );
}

const vaorChoiceFixtures = [
  ['c7-red-horizon', 'c7-turn-neutral-town-away', 'c5-freed-vaor'],
  ['c7-red-horizon', 'c7-force-stolen-ember-pursuit', 'c5-took-ember-by-force'],
  ['c7-red-horizon', 'c7-share-pact-ember-pursuit', 'c5-vaor-pact'],
  ['c7-break-town-line', 'c7-ember-frighten-horses', 'c5-freed-vaor'],
  [
    'c7-break-town-line',
    'c7-force-stolen-ember-horses',
    'c5-took-ember-by-force',
  ],
  ['c7-break-town-line', 'c7-share-pact-ember-horses', 'c5-vaor-pact'],
  ['c7-ilyra-command-thread', 'c7-open-vaor-ember-thread', 'c5-freed-vaor'],
  [
    'c7-ilyra-command-thread',
    'c7-force-stolen-ember-thread',
    'c5-took-ember-by-force',
  ],
  ['c7-ilyra-command-thread', 'c7-share-pact-ember-thread', 'c5-vaor-pact'],
];
for (const [nodeId, choiceId, vaorFlag] of vaorChoiceFixtures) {
  const choice = chapterSevenChoiceById(nodeId, choiceId);
  for (const outcomeFlag of chapterFiveContinuityContract.vaorOutcomes) {
    const visible = isChoiceVisible(choice, {
      ...chapterSevenBase,
      flags: [outcomeFlag],
    });
    if (visible !== (outcomeFlag === vaorFlag))
      failures.push(`${choiceId} ignores Vaor outcome ${outcomeFlag}`);
  }
}

const earnedFullArmyChoice = chapterSevenChoiceById(
  'c7-army-future',
  'c7-take-full-army',
);
for (const [flags, expected] of [
  [[], false],
  [['c7-earned-full-army-offer'], true],
  [['c7-earned-full-army-offer', 'c6-oath-honest-limit'], false],
  [['c7-earned-full-army-offer', 'c7-teren-won-formally'], false],
  [['c7-earned-full-army-offer', 'c7-lost-army-command-trust'], false],
]) {
  if (
    isChoiceVisible(earnedFullArmyChoice, { ...chapterSevenBase, flags }) !==
    expected
  ) {
    failures.push(
      `Chapter Seven full army eligibility is wrong for ${flags.join(', ') || 'unearned history'}`,
    );
  }
}

const hiddenSenderHandoffs = [
  [
    chapterSevenContinuityContract.hiddenSenderExposures[0],
    'c8-counter-private-command-bait',
  ],
  [
    chapterSevenContinuityContract.hiddenSenderExposures[2],
    'c8-shield-known-ember-bearer',
  ],
  [
    chapterSevenContinuityContract.hiddenSenderExposures[3],
    'c8-use-lio-living-countercall',
  ],
  [
    chapterSevenContinuityContract.hiddenSenderExposures[5],
    'c8-follow-ilyra-countermark',
  ],
];
for (const [exposureFlag, chapterEightChoiceId] of hiddenSenderHandoffs) {
  const choice = chapterSevenChoiceById(
    'c8-inherited-countermeasure',
    chapterEightChoiceId,
  );
  if (
    !isChoiceVisible(choice, { ...chapterEightBase, flags: [exposureFlag] }) ||
    isChoiceVisible(choice, chapterEightBase)
  ) {
    failures.push(
      `${exposureFlag} does not create its distinct Chapter Eight defence`,
    );
  }
}
const funeralChoiceIds = new Set([
  'c7-lio-calls-ghost-funeral',
  'c7-mara-calls-evren-funeral',
  'c7-signal-lio-inside-army',
]);
const expectedFuneralChoice = {
  prisoner: 'c7-mara-calls-evren-funeral',
  returned: 'c7-signal-lio-inside-army',
  joined: 'c7-lio-calls-ghost-funeral',
  guarded: 'c7-mara-calls-evren-funeral',
};
for (const [status, state] of Object.entries(lioStates)) {
  const visible = nodes['c7-dead-horn'].choices.filter(
    (choice) =>
      funeralChoiceIds.has(choice.id) && isChoiceVisible(choice, state),
  );
  if (visible.length !== 1 || visible[0].id !== expectedFuneralChoice[status]) {
    failures.push(
      `Chapter Seven gives ${status} Lio an impossible funeral action`,
    );
  }
}
const lioRescueChoice = nodes['c7-many-or-one'].choices.find(
  (choice) => choice.id === 'c7-lio-crosses-for-one',
);
const terenRescueChoice = nodes['c7-many-or-one'].choices.find(
  (choice) => choice.id === 'c7-teren-sends-engineers',
);
if (
  !isChoiceVisible(lioRescueChoice, lioStates.joined) ||
  isChoiceVisible(lioRescueChoice, lioStates.prisoner) ||
  isChoiceVisible(lioRescueChoice, lioStates.returned) ||
  isChoiceVisible(lioRescueChoice, lioStates.guarded)
) {
  failures.push('Lio can cross the final signal frame without joining Caelan');
}
if (
  isChoiceVisible(terenRescueChoice, lioStates.joined) ||
  !isChoiceVisible(terenRescueChoice, lioStates.prisoner) ||
  !isChoiceVisible(terenRescueChoice, lioStates.returned) ||
  !isChoiceVisible(terenRescueChoice, lioStates.guarded)
) {
  failures.push(
    'Teren’s rescue does not remain an honest fallback for routes where Lio did not join',
  );
}
const woundedRidgeMaraState = {
  ...chapterSevenBase,
  flags: ['c7-wounded-on-ridge'],
  relationships: {
    ...chapterSevenBase.relationships,
    mara: { ...chapterSevenBase.relationships.mara, intent: 'committed' },
  },
};
const ridgeFinalCrisis = renderedBody('c7-many-or-one', woundedRidgeMaraState);
if (
  !/Mara and the wounded remain safe on the ridge/i.test(ridgeFinalCrisis) ||
  /Mara is trapped beneath/i.test(ridgeFinalCrisis)
) {
  failures.push(
    'Chapter Seven places Mara back in the basin after the player sent her to the wounded ridge',
  );
}
const preparedSignalChoice = nodes['c7-salt-trap'].choices.find(
  (choice) => choice.id === 'c7-living-signal-block',
);
const unpreparedSignalFallback = nodes['c7-salt-trap'].choices.find(
  (choice) => choice.id === 'c7-sacrifice-supply-wagon-block',
);
if (
  isChoiceVisible(preparedSignalChoice, chapterSevenBase) ||
  !isChoiceVisible(preparedSignalChoice, {
    ...chapterSevenBase,
    flags: ['c7-living-signal-post-ready'],
  }) ||
  !isChoiceVisible(unpreparedSignalFallback, chapterSevenBase) ||
  isChoiceVisible(unpreparedSignalFallback, {
    ...chapterSevenBase,
    flags: ['c7-living-signal-post-ready'],
  })
) {
  failures.push(
    'The Chapter Seven signal post preparation does not unlock its later payoff',
  );
}
const evrenAttack = renderedBody('c7-dead-marshal-rises', chapterSevenBase);
if (
  !/Caelan Vey means to open the eastern Gate.*loyal replacements secure the forts/is.test(
    evrenAttack,
  ) ||
  /until the eastern gate opens/i.test(evrenAttack)
) {
  failures.push(
    'Evren openly reveals the hidden plan instead of giving soldiers a plausible false order',
  );
}
const chapterSevenEvidence = renderedBody(
  'c7-captured-soldier',
  chapterSevenBase,
);
if (
  !/Hale was alive.*never found a body/is.test(chapterSevenEvidence) ||
  !/claim of murder.*not proof/is.test(chapterSevenEvidence) ||
  !/date answers Malrec’s lie/i.test(chapterSevenEvidence) ||
  !/Evren’s commands need a different test/i.test(chapterSevenEvidence) ||
  !/fresh call and answer.*learns the reply/is.test(chapterSevenEvidence)
) {
  failures.push(
    'Chapter Seven does not separate Hale’s uncertain fate, Malrec’s dated order, and Evren’s password test',
  );
}
const chapterSevenOpening = [
  nodes['c7-red-horizon'].lesson?.body ?? '',
  ...nodes['c7-red-horizon'].body(chapterSevenBase),
].join(' ');
const chapterSevenLioIntroduction = renderedBody(
  'c7-first-riders',
  chapterSevenBase,
);
if (
  /Marshal Evren|Marshal Teren/i.test(chapterSevenOpening) ||
  !/Marshal Evren has been dead for nineteen years/i.test(
    chapterSevenLioIntroduction,
  ) ||
  !/living army marshal, Teren Voss/i.test(chapterSevenLioIntroduction) ||
  !/call that a dead command/i.test(chapterSevenLioIntroduction)
) {
  failures.push(
    'Chapter Seven introduces its army leaders before Lio can explain them in plain language',
  );
}
const chapterSevenOpeningJournal = knownTruths(chapterSevenBase).join(' ');
if (/Marshal Evren|Teren Voss|dead command/i.test(chapterSevenOpeningJournal)) {
  failures.push(
    'The Chapter Seven journal names army leaders or dead command before Lio introduces them',
  );
}
const chapterSevenParley = renderedBody('c7-marshal-parley', chapterSevenBase);
const chapterSevenDuel = renderedBody('c7-steppe-duel', chapterSevenBase);
if (
  !/Captain Vey/i.test(chapterSevenParley) ||
  /Captain Vale/i.test(chapterSevenParley) ||
  !/accept that law while we stand on this ground/i.test(chapterSevenParley) ||
  !/No magic forces obedience/i.test(chapterSevenDuel)
) {
  failures.push(
    'The Chapter Seven parley misnames Caelan or fails to establish the duel rule and its limit',
  );
}
for (const endingId of [
  'c7-ending-army',
  'c7-ending-company',
  'c7-ending-outlaw',
]) {
  const ending = renderedBody(endingId, chapterSevenBase);
  if (
    !/Four forts were emptied by Malrec.*Three more signal fires.*smoke rises from Fourth Fort/is.test(
      ending,
    ) ||
    /next seven signal fires|eight cold signal fires/i.test(ending)
  ) {
    failures.push(
      `${endingId} contradicts Chapter Eight’s occupied Fourth Fort`,
    );
  }
}
if (
  !/remaining army east under his own command/i.test(
    nodes['c7-army-future'].choices.find(
      (choice) => choice.id === 'c7-take-chosen-company',
    )?.result ?? '',
  ) ||
  !/Teren chooses the Gate himself.*army turns east/is.test(
    nodes['c7-army-future'].choices.find(
      (choice) => choice.id === 'c7-take-no-formal-allies',
    )?.result ?? '',
  )
) {
  failures.push(
    'The smaller Chapter Seven force outcomes still leave the Black Gate undefended',
  );
}
const injuredTerenArrivals = [
  [
    ['c7-gained-full-army', 'c7-teren-lasting-injury'],
    /Teren rides in the leading rank with his injured shoulder/i,
  ],
  [
    ['c7-gained-chosen-company', 'c7-teren-lasting-injury'],
    /Teren’s injured shoulder has slowed the separate army behind you/i,
  ],
  [
    ['c7-gained-dangerous-reputation', 'c7-teren-lasting-injury'],
    /Teren’s injured shoulder is one reason his army remains a day behind/i,
  ],
];
for (const [flags, expected] of injuredTerenArrivals) {
  const arrival = renderedBody('c8-force-deployment', {
    ...chapterEightBase,
    flags,
  });
  if (!expected.test(arrival)) {
    failures.push(
      `Chapter Eight loses Teren’s position or injury after ${flags[0]}`,
    );
  }
}
const chapterSevenReaderText = Object.entries(nodes)
  .filter(([id]) => id.startsWith('c7-'))
  .flatMap(([, node]) => [
    sceneObjectiveText(node, chapterSevenBase),
    ...node.body(chapterSevenBase),
    ...node.choices.flatMap((choice) => [
      choice.label,
      choice.detail,
      choice.advantage ?? '',
      choice.result,
    ]),
  ])
  .join(' ');
if (
  /\|\s*(?:One quiet minute|The decisive choice|Execute the chosen plan|Path recorded|Final choice)/i.test(
    chapterSevenReaderText,
  ) ||
  /\b(?:countersign|watchword|private answer|field packet|noncombatants|manoeuvre|Crown glass)\b/i.test(
    chapterSevenReaderText,
  )
) {
  failures.push(
    'Chapter Seven still exposes stage directions or inconsistent military terms',
  );
}
const chapterSevenEndingFlags = {
  'c7-ending-army': 'c7-gained-full-army',
  'c7-ending-company': 'c7-gained-chosen-company',
  'c7-ending-outlaw': 'c7-gained-dangerous-reputation',
};
const chapterSevenRescueSummaries = [
  [
    ['c7-saved-many', 'c7-ally-lasting-injury'],
    /survived the last red wall.*injury will travel/i,
  ],
  [['c7-company-storm-losses'], /lost soldiers/i],
  [['c7-saved-both-burned-proof'], /original orders did not/i],
  [
    ['c7-saved-many-with-southern-escort', 'c7-lost-fast-horses'],
    /returning escorts saved/i,
  ],
  [['c7-saved-many-under-shield-oath'], /broad shield Oath protected/i],
  [
    ['c7-saved-many-with-lio', 'c7-lio-stranded-after-rescue'],
    /Lio saved the trapped companion/i,
  ],
  [
    ['c7-saved-many-with-teren', 'c7-teren-lasting-injury'],
    /Teren and his engineers saved/i,
  ],
];
for (const [rescueFlags, expected] of chapterSevenRescueSummaries) {
  const ending = renderedBody('c7-ending-company', {
    ...chapterSevenBase,
    flags: ['c7-gained-chosen-company', ...rescueFlags],
  });
  if (!expected.test(ending)) {
    failures.push(
      `Chapter Seven ending loses the final rescue outcome ${rescueFlags.join(', ')}`,
    );
  }
  if (
    !rescueFlags.includes('c7-saved-many-with-lio') &&
    /Lio saved the trapped companion/i.test(ending)
  ) {
    failures.push(
      `Chapter Seven credits Lio with a rescue on ${rescueFlags.join(', ')}`,
    );
  }
}
for (const [endingId, flag] of Object.entries(chapterSevenEndingFlags)) {
  const finalChoice = nodes['c7-army-future'].choices.find(
    (choice) => choice.next === endingId,
  );
  if (
    !finalChoice?.addFlags?.includes(flag) ||
    'wayfire' in (finalChoice.changes ?? {})
  ) {
    failures.push(
      `${endingId} must record its army outcome without retired currency`,
    );
  }
}
for (const endingId of Object.keys(chapterSevenEndingFlags)) {
  if (nodes[endingId].nextChapter !== 'c8-gate-ring') {
    failures.push(`${endingId} does not continue into Chapter Eight`);
  }
}
const chapterEightEndingFlags = {
  'c8-ending-embassy': 'c8-vexa-entered-publicly',
  'c8-ending-threshold': 'c8-vexa-held-at-threshold',
  'c8-ending-witness': 'c8-ansel-spoke-first',
};
const chapterEightForceStates = [
  { ...chapterEightBase, flags: ['c7-gained-full-army'] },
  { ...chapterEightBase, flags: ['c7-gained-chosen-company'] },
  { ...chapterEightBase, flags: ['c7-gained-dangerous-reputation'] },
];
const deploymentChoiceIds = new Set([
  'c8-deploy-all-forts',
  'c8-deploy-strongpoints',
  'c8-deploy-mobile-force',
]);
const deploymentFlags = [
  'c8-deployed-all-forts',
  'c8-deployed-strongpoints',
  'c8-deployed-mobile-force',
];
for (const state of chapterEightForceStates) {
  const visibleDeployments = nodes['c8-force-deployment'].choices.filter(
    (choice) =>
      deploymentChoiceIds.has(choice.id) && isChoiceVisible(choice, state),
  );
  if (
    visibleDeployments.length !== 3 ||
    visibleDeployments.some((choice) => !canChoose(choice, state))
  ) {
    failures.push(
      'Chapter Eight turns the inherited army size into a one-option deployment screen',
    );
  }
}
if (
  nodes['c8-inherited-countermeasure'].choices.some((choice) =>
    (choice.addFlags ?? []).some((flag) => deploymentFlags.includes(flag)),
  )
) {
  failures.push(
    'A Chapter Eight countermeasure silently assigns a force deployment',
  );
}
const deploymentPayoffs = [
  [
    ['c7-gained-full-army', 'c8-deployed-all-forts'],
    /Crown March occupies all eight outer yards/i,
  ],
  [
    ['c7-gained-chosen-company', 'c8-deployed-all-forts'],
    /volunteers hold all eight outer yards in thin groups/i,
  ],
  [
    ['c7-gained-dangerous-reputation', 'c8-deployed-all-forts'],
    /small force watches all eight forts in pairs/i,
  ],
  [
    ['c7-gained-full-army', 'c8-deployed-strongpoints'],
    /Crown March holds three strong forts/i,
  ],
  [
    ['c7-gained-chosen-company', 'c8-deployed-strongpoints'],
    /Volunteers hold the three strongest approaches/i,
  ],
  [
    ['c7-gained-dangerous-reputation', 'c8-deployed-strongpoints'],
    /small force holds two strong forts/i,
  ],
];
for (const [flags, expected] of deploymentPayoffs) {
  if (
    !expected.test(
      renderedBody('c8-inherited-countermeasure', {
        ...chapterEightBase,
        flags,
      }),
    )
  ) {
    failures.push(
      `Chapter Eight deployment does not remember force and plan for ${flags.join(', ')}`,
    );
  }
}
const forcePressureCases = [
  [
    ['c7-gained-full-army'],
    /Teren can place soldiers at every fire.*remaining loyalist/is,
    /last saboteur/is,
  ],
  [
    ['c7-gained-chosen-company'],
    /volunteers can hold three fires.*Futureless.*other five/is,
    /six wardens.*burned hands/is,
  ],
  [
    ['c7-gained-dangerous-reputation'],
    /small force can hold two fires.*wounded wardens.*other six/is,
    /infirmary fills with burns/is,
  ],
];
for (const [
  flags,
  openingExpected,
  mortalOutcomeExpected,
] of forcePressureCases) {
  const state = { ...chapterEightBase, flags };
  if (
    !openingExpected.test(renderedBody('c8-opening', state)) ||
    !mortalOutcomeExpected.test(
      renderedBody('c8-collector-crossing', {
        ...state,
        flags: [...flags, 'c8-united-wardens'],
      }),
    )
  ) {
    failures.push(
      `Chapter Eight does not carry the Chapter Seven force cost into the defence for ${flags[0]}`,
    );
  }
}
const hiddenRecord = renderedBody('c8-hidden-record', chapterEightBase);
if (
  !/seventeen years.*closed three failing garrisons/is.test(hiddenRecord) ||
  !/three weeks ago.*Malrec pulled the field army (?:away )?from four more forts/is.test(
    hiddenRecord,
  ) ||
  !/only Fourth Fort occupied tonight/i.test(hiddenRecord) ||
  !/sealed packet.*complete duplicate.*First Fort/is.test(hiddenRecord)
) {
  failures.push(
    'Chapter Eight does not join the seventeen-year cover-up to Malrec’s recent withdrawal',
  );
}
const firstKnockJournal = knownTruths({
  ...chapterEightBase,
  nodeId: 'c8-first-knock',
}).join(' ');
const afterFirstKnockJournal = knownTruths({
  ...chapterEightBase,
  nodeId: 'c8-force-deployment',
}).join(' ');
if (
  /Futureless|sold one specific promise/i.test(firstKnockJournal) ||
  !/Futureless.*sold one specific promise/is.test(afterFirstKnockJournal)
) {
  failures.push(
    'Chapter Eight journal defines the Futureless before Pell introduces them',
  );
}
const defenceRouteCases = [
  [
    'c8-united-wardens',
    /eight mortal signal fires/i,
    /refused our fire and held the Gate with mortal hands/i,
    /Ash Compact’s white fire holds the gap/i,
  ],
  [
    'c8-accepted-ash-compact',
    /Ash Compact’s white fire holds the gap/i,
    /granted one peaceful embassy permission/i,
    /stored beneath the fallen First Fort/i,
  ],
  [
    'c8-sacrificed-first-fort',
    /stored beneath the fallen First Fort/i,
    /broke one of your own forts/i,
    /Ash Compact’s white fire holds the gap/i,
  ],
];
for (const [
  flag,
  collectorExpected,
  greetingExpected,
  collectorForbidden,
] of defenceRouteCases) {
  const state = { ...chapterEightBase, flags: [flag] };
  const collector = renderedBody('c8-collector-crossing', state);
  const greeting = renderedBody('c8-embassy-terms', state);
  if (
    !collectorExpected.test(collector) ||
    collectorForbidden.test(collector) ||
    !greetingExpected.test(greeting)
  ) {
    failures.push(`Chapter Eight forgets the chosen defence route for ${flag}`);
  }
}
const contractHall = renderedBody('c8-futureless-reveal', chapterEightBase);
const anselContractChoice = nodes['c8-collector-crossing'].choices.find(
  (choice) => choice.id === 'c8-let-ansel-refuse-collection',
);
if (
  !/One named promise\. Nothing more/i.test(contractHall) ||
  !/act and meaning.*changes the words/is.test(contractHall) ||
  !/One named promise\. Nothing more/i.test(anselContractChoice?.result ?? '')
) {
  failures.push(
    'Ansel uses the one-payment contract limit before the player learns it',
  );
}
const choiceById = (nodeId, choiceId) =>
  nodes[nodeId].choices.find((choice) => choice.id === choiceId);
const earnedAnselChoices = [
  ['c8-breach', 'c8-trust-futureless-yard', ['c8-futureless-choice-proven']],
  ['c8-chain-plan', 'c8-use-ansel-furnace-route', ['c8-ansel-chose-entry']],
  [
    'c8-wardens-route',
    'c8-let-ansel-name-keepers',
    ['c8-complete-futureless-ledger'],
  ],
  [
    'c8-collector-crossing',
    'c8-let-ansel-refuse-collection',
    ['c8-futureless-choice-proven'],
  ],
];
for (const [nodeId, choiceId, earnedFlags] of earnedAnselChoices) {
  const choice = choiceById(nodeId, choiceId);
  if (
    !choice ||
    isChoiceVisible(choice, chapterEightBase) ||
    !isChoiceVisible(choice, { ...chapterEightBase, flags: earnedFlags })
  ) {
    failures.push(
      `Chapter Eight exposes the free Ansel payoff ${String(choiceId)} without earning it`,
    );
  }
}
const firstFortSetup = `${renderedBody('c8-occupied-fort', {
  ...chapterEightBase,
  flags: ['c8-deployed-mobile-force'],
})} ${renderedBody('c8-hidden-record', chapterEightBase)}`;
const firstFortCrisis = renderedBody('c8-sacrifice-route', chapterEightBase);
if (
  !/First Fort.*aid station/is.test(firstFortSetup) ||
  !/dry lower room/is.test(firstFortSetup) ||
  !/temporary aid station.*complete copy/is.test(firstFortCrisis)
) {
  failures.push(
    'Chapter Eight uses First Fort people or evidence before placing them there',
  );
}
const pellOath = choiceById('c8-first-knock', 'c8-oath-hold-pell');
const pellOathEnding = renderedBody('c8-embassy-terms', {
  ...chapterEightBase,
  flags: [
    'c8-oath-pell-sees-opening-contained',
    'c8-severed-collector-hand',
  ],
});
if (
  !/invasion stopped/i.test(pellOath?.label ?? '') ||
  /Gate close tonight/i.test(`${pellOath?.label} ${pellOath?.detail}`) ||
  !/Pell watches.*hostile hand withdraw.*Oath/is.test(pellOathEnding)
) {
  failures.push(
    'Chapter Eight gives Pell an impossible promise or fails to resolve it',
  );
}
const normalSeedChoice = choiceById('c8-chain-plan', 'c8-root-lift-chain');
const weakenedSeedChoice = choiceById(
  'c8-chain-plan',
  'c8-spend-weakened-seed-on-chain',
);
const weakenedSeedState = {
  ...chapterEightBase,
  flags: ['c8-seed-weakened-saving-pell'],
};
if (
  !normalSeedChoice ||
  !weakenedSeedChoice ||
  isChoiceVisible(normalSeedChoice, weakenedSeedState) ||
  !isChoiceVisible(weakenedSeedChoice, weakenedSeedState) ||
  !/dormant/i.test(`${weakenedSeedChoice.detail} ${weakenedSeedChoice.result}`)
) {
  failures.push(
    'Chapter Eight forgets that saving Pell weakens Lysara’s living seed',
  );
}
const relationshipState = (person, intent) => ({
  ...chapterEightBase,
  relationships: {
    ...chapterEightBase.relationships,
    [person]: { ...chapterEightBase.relationships[person], intent },
  },
});
const oathShareChoiceIds = new Set([
  'c8-share-oath-mara',
  'c8-share-oath-lysara',
  'c8-share-oath-korran',
]);
const oathShareCases = [
  [relationshipState('mara', 'committed'), 'c8-share-oath-mara'],
  [relationshipState('lysara', 'exploring'), 'c8-share-oath-lysara'],
  [chapterEightBase, 'c8-share-oath-korran'],
];
for (const [state, expectedId] of oathShareCases) {
  const visible = nodes['c8-oath-ledger'].choices.filter(
    (choice) =>
      oathShareChoiceIds.has(choice.id) && isChoiceVisible(choice, state),
  );
  if (
    visible.length !== 1 ||
    visible[0].id !== expectedId ||
    !new RegExp(expectedId.split('-').at(-1), 'i').test(
      `${visible[0].label} ${visible[0].result}`,
    )
  ) {
    failures.push(
      `Chapter Eight does not name the willing Oath bearer for ${expectedId}`,
    );
  }
}
const oathLedgerText = [
  nodes['c8-oath-ledger'].lesson?.body ?? '',
  ...nodes['c8-oath-ledger'].body(chapterEightBase),
  ...nodes['c8-oath-ledger'].choices.flatMap((choice) => [
    choice.label,
    choice.detail,
    choice.result,
  ]),
].join(' ');
const chapterEightOpening = renderedBody('c8-gate-ring', chapterEightBase);
if (
  /key to your father’s roadside inn|old Warden whistle/i.test(
    chapterEightOpening,
  ) ||
  !/father’s old inn key/i.test(oathLedgerText) ||
  !/cracked Crown badge/i.test(oathLedgerText) ||
  !/Warden whistle/i.test(oathLedgerText)
) {
  failures.push(
    'The Chapter Eight Oath prices are not attached to visible, previously introduced objects',
  );
}
const chapterEightReaderText = Object.entries(nodes)
  .filter(([id]) => id.startsWith('c8-'))
  .flatMap(([, node]) => [
    sceneObjectiveText(node, chapterEightBase),
    node.lesson?.body ?? '',
    ...node.body(chapterEightBase),
    ...node.choices.flatMap((choice) => [
      choice.label,
      choice.detail,
      choice.advantage ?? '',
      choice.result,
    ]),
  ])
  .join(' ');
if (
  /\|\s*(?:The next knock|Do not pretend|Keep the defence|Final choice|Path recorded)/i.test(
    chapterEightReaderText,
  ) ||
  /\b(?:surety|collateral|safe conduct|unspoken clause|second price)\b/i.test(
    chapterEightReaderText,
  ) ||
  /each path can hold the Gate tonight/i.test(chapterEightReaderText)
) {
  failures.push(
    'Chapter Eight still exposes stage directions, contract jargon, or narrator scoring',
  );
}
if (
  !/more than an hour before the yearly opening/i.test(
    renderedBody('c8-breach', chapterEightBase),
  ) ||
  !/Gate opens at sunset/i.test(renderedBody('c8-opening', chapterEightBase))
) {
  failures.push(
    'Chapter Eight does not distinguish the early pressure breath from the sunset opening',
  );
}
if (
  /buying his future|bought Captain Vey|learn who bought Caelan/i.test(
    chapterEightReaderText,
  ) ||
  !/owns nothing yet/i.test(renderedBody('c8-embassy-terms', chapterEightBase))
) {
  failures.push(
    'Chapter Eight confuses the prepared claim on Caelan with a completed bargain',
  );
}
const compactEmbassyState = {
  ...chapterEightBase,
  flags: ['c8-accepted-ash-compact'],
};
const nonCompactEmbassyState = {
  ...chapterEightBase,
  flags: ['c8-united-wardens'],
};
const visibleEmbassyChoices = (state) =>
  nodes['c8-embassy-terms'].choices
    .filter((choice) => isChoiceVisible(choice, state))
    .map((choice) => choice.id);
const compactEmbassyChoices = visibleEmbassyChoices(compactEmbassyState);
const nonCompactEmbassyChoices = visibleEmbassyChoices(nonCompactEmbassyState);
if (
  compactEmbassyChoices.includes('c8-hear-vexa-at-threshold') ||
  compactEmbassyChoices.includes('c8-give-ansel-first-question') ||
  !compactEmbassyChoices.includes('c8-receive-vexa-outer-fort') ||
  !compactEmbassyChoices.includes('c8-give-ansel-first-question-after-entry') ||
  nonCompactEmbassyChoices.includes('c8-receive-vexa-outer-fort') ||
  nonCompactEmbassyChoices.includes(
    'c8-give-ansel-first-question-after-entry',
  ) ||
  !nonCompactEmbassyChoices.includes('c8-hear-vexa-at-threshold')
) {
  failures.push(
    'Chapter Eight allows the player to violate or invent the Ash Compact entry agreement',
  );
}
const outerFortEnding = renderedBody('c8-ending-threshold', {
  ...compactEmbassyState,
  flags: [...compactEmbassyState.flags, 'c8-vexa-received-outer-fort'],
});
const outsideWitnessEnding = renderedBody('c8-ending-witness', {
  ...nonCompactEmbassyState,
  flags: [...nonCompactEmbassyState.flags, 'c8-ansel-spoke-first'],
});
const enteredWitnessEnding = renderedBody('c8-ending-witness', {
  ...compactEmbassyState,
  flags: [
    ...compactEmbassyState.flags,
    'c8-ansel-spoke-first',
    'c8-ansel-spoke-first-after-entry',
  ],
});
if (
  !/cross into the empty Second Fort yard/i.test(outerFortEnding) ||
  !/remains on the far side/i.test(outsideWitnessEnding) ||
  !/embassy crosses under its public agreement/i.test(enteredWitnessEnding)
) {
  failures.push(
    'Chapter Eight endings do not state whether Vexa entered or remained outside',
  );
}
for (const [endingId, flag] of Object.entries(chapterEightEndingFlags)) {
  const finalChoice = nodes['c8-embassy-terms'].choices.find(
    (choice) => choice.next === endingId,
  );
  if (
    !finalChoice?.addFlags?.includes(flag) ||
    'wayfire' in (finalChoice.changes ?? {})
  ) {
    failures.push(
      `${endingId} must record its embassy outcome without retired currency`,
    );
  }
}
const chapterEightEvidenceCases = [
  {
    name: 'original Gate ledgers and evacuated duplicate',
    flags: ['c8-preserved-original-ledgers', 'c8-first-fort-fully-evacuated'],
    required: [
      /seventeen original Gate ledgers/i,
      /sealed duplicate also survives/i,
    ],
    forbidden: [
      /Crown originals burned|no Crown paper survived|hidden Crown ledgers burned/i,
    ],
  },
  {
    name: 'living bark after both paper sets burn',
    flags: ['c8-living-copy-of-openings', 'c8-lost-duplicate-records'],
    required: [
      /living bark; the Crown originals burned/i,
      /sealed duplicate burned/i,
    ],
    forbidden: [/original Gate ledgers sealed|duplicate also survives/i],
  },
  {
    name: 'witness testimony after duplicate loss',
    flags: ['c8-many-witnessed-openings', 'c8-lost-duplicate-records'],
    required: [/no Crown paper survived/i, /sealed duplicate burned/i],
    forbidden: [/original Gate ledgers sealed|living bark/i],
  },
  {
    name: 'no surviving mortal Gate record',
    flags: ['c8-lost-duplicate-records'],
    required: [/without a surviving copy/i, /sealed duplicate burned/i],
    forbidden: [
      /original Gate ledgers sealed|living bark|officers can repeat/i,
    ],
  },
  {
    name: 'Malrec original joined to the Gate record',
    flags: ['c8-linked-malrec-to-gate-record', 'c7-original-orders-safe'],
    required: [/Malrec’s sealed original order/i],
    forbidden: [
      /authenticated copy of Malrec’s order|sealed original is gone/i,
    ],
  },
  {
    name: 'authenticated Malrec copy after original loss',
    flags: [
      'c8-linked-malrec-to-gate-record',
      'c7-saved-both-burned-proof',
      'c7-orders-on-banners',
    ],
    required: [
      /authenticated copy of Malrec’s order/i,
      /sealed original is gone/i,
    ],
    forbidden: [/Malrec’s sealed original order/i],
  },
];
const chapterEightEndingLocations = {
  'c8-ending-embassy': ['c8-vexa-entered-publicly'],
  'c8-ending-threshold': ['c8-vexa-held-at-threshold'],
  'c8-ending-witness': ['c8-ansel-spoke-first'],
};
for (const [endingId, locationFlags] of Object.entries(
  chapterEightEndingLocations,
)) {
  for (const evidenceCase of chapterEightEvidenceCases) {
    const ending = renderedBody(endingId, {
      ...chapterEightBase,
      flags: [...locationFlags, ...evidenceCase.flags],
    });
    for (const expected of evidenceCase.required) {
      if (!expected.test(ending))
        failures.push(`${endingId} loses ${evidenceCase.name}`);
    }
    for (const forbidden of evidenceCase.forbidden) {
      if (forbidden.test(ending))
        failures.push(`${endingId} invents evidence in ${evidenceCase.name}`);
    }
    if (
      !/Vexa’s devil contracts remain a separate foreign source/i.test(
        ending,
      ) ||
      !/separate (?:foreign source|from the surviving Crown evidence|draft)/i.test(
        ending,
      )
    ) {
      failures.push(
        `${endingId} merges Vexa's contracts into mortal Crown evidence`,
      );
    }
  }
}

const personalPromiseFlags = [
  'c8-mara-knows-home-desire',
  'c8-mara-western-commander',
  'c8-mara-knows-fear',
  'c8-lysara-knows-road-desire',
  'c8-lysara-equal-lockkeeper',
  'c8-lysara-knows-loyalty-fear',
  'c8-named-home-desire',
  'c8-named-chosen-duty',
  'c8-named-truth-desire',
];
const oathLedgerPromises =
  nodes['c8-oath-ledger'].activeConsequences?.reactions ?? [];
const plainOathLedger = renderedBody('c8-oath-ledger', chapterEightBase);
for (const promiseFlag of personalPromiseFlags) {
  const reacted = renderedBody('c8-oath-ledger', {
    ...chapterEightBase,
    flags: [promiseFlag],
  });
  if (
    !oathLedgerPromises.includes(promiseFlag) ||
    reacted === plainOathLedger
  ) {
    failures.push(`${promiseFlag} receives no later Gate reaction`);
  }
}

const inheritedLossCases = [
  ['c7-ally-lasting-injury', /lasting bone injury/i],
  ['c7-company-storm-losses', /empty saddles/i],
  ['c7-alliance-shields-protected-wounded', /shield engines were damaged/i],
  ['c7-neutral-wounded-in-ridge', /wounded remain at Black Ridge/i],
  ['c7-lost-gate-supplies', /less food and fewer arrows/i],
  ['c7-spent-supplies-on-decoys', /spare shields and blankets/i],
  ['c7-lost-fast-horses', /fastest horses/i],
  ['c7-korran-spent-signal-trust', /second sign before trusting/i],
];
const normalMortalDefence = choiceById(
  'c8-opening',
  'c8-choose-united-wardens',
);
const depletedMortalDefence = choiceById(
  'c8-opening',
  'c8-choose-depleted-wardens',
);
for (const [lossFlag, expected] of inheritedLossCases) {
  const state = { ...chapterEightBase, flags: [lossFlag] };
  if (
    !expected.test(renderedBody('c8-force-deployment', state)) ||
    isChoiceVisible(normalMortalDefence, state) ||
    !isChoiceVisible(depletedMortalDefence, state)
  ) {
    failures.push(
      `${lossFlag} does not change a Chapter Eight complication and defence result`,
    );
  }
}

function resourceRichChapterEightState(flags, relationshipIntents = {}) {
  return {
    ...chapterEightBase,
    nodeId: 'c8-gate-ring',
    chapterChoices: 0,
    flags: [...flags],
    stats: Object.fromEntries(
      Object.keys(chapterEightBase.stats).map((key) => [key, 20]),
    ),
    relationships: Object.fromEntries(
      Object.entries(chapterEightBase.relationships).map(([person, score]) => [
        person,
        {
          ...score,
          trust: 20,
          attraction: 20,
          respect: 20,
          friction: 0,
          intent: relationshipIntents[person] ?? 'unresolved',
        },
      ]),
    ),
    history: [],
    defeat: false,
  };
}

function walkChapterEight(fixture) {
  let state = resourceRichChapterEightState(
    fixture.flags,
    fixture.relationshipIntents,
  );
  const visitedNodes = [];
  for (const choiceId of fixture.choiceIds) {
    const node = nodes[state.nodeId];
    visitedNodes.push(node.id);
    const choice = node.choices.find((candidate) => candidate.id === choiceId);
    if (
      !choice ||
      !isChoiceVisible(choice, state) ||
      !canChoose(choice, state)
    ) {
      failures.push(`${fixture.name} cannot choose ${choiceId} at ${node.id}`);
      return { ...fixture, state, visitedNodes };
    }
    state = applyChoice(state, choice);
  }
  const ending = nodes[state.nodeId];
  if (!ending?.final || state.chapterChoices !== 16) {
    failures.push(
      `${fixture.name} does not complete Chapter Eight in sixteen decisions`,
    );
  }
  if (
    deploymentFlags.filter((flag) => state.flags.includes(flag)).length !== 1
  ) {
    failures.push(
      `${fixture.name} finishes without exactly one deployment plan`,
    );
  }
  return { ...fixture, state, visitedNodes: [...visitedNodes, state.nodeId] };
}

const chapterEightWalkthroughs = [
  {
    name: 'full army / mortal wardens / willing Vaor / original ledgers / Mara',
    flags: [
      'c5-freed-vaor',
      'c6-red-moot-alliance',
      'c7-gained-full-army',
      'c7-original-orders-safe',
    ],
    relationshipIntents: { mara: 'committed' },
    choiceIds: [
      'c8-command-runner-turn',
      'c8-oath-hold-pell',
      'c8-deploy-all-forts',
      'c8-use-paired-living-check',
      'c8-enter-without-command',
      'c8-list-every-sold-promise',
      'c8-carry-opening-ledgers',
      'c8-command-two-rescues',
      'c8-refuse-until-mortal-plan',
      'c8-mara-share-command',
      'c8-burn-vaor-ember-chain',
      'c8-choose-united-wardens',
      'c8-command-eight-captains',
      'c8-cut-collector-hand',
      'c8-release-crown-oath',
      'c8-receive-vexa-publicly',
    ],
  },
  {
    name: 'chosen company / Ash Compact / Vaor pact / living bark / Lysara',
    flags: ['c5-vaor-pact', 'c6-red-moot-alliance', 'c7-gained-chosen-company'],
    relationshipIntents: { mara: 'platonic', lysara: 'committed' },
    choiceIds: [
      'c8-ride-for-runner',
      'c8-medicine-for-pell',
      'c8-deploy-strongpoints',
      'c8-use-paired-living-check',
      'c8-enter-without-command',
      'c8-test-contract-with-oathfire',
      'c8-lysara-copies-opening-proof',
      'c8-stop-wagon-health',
      'c8-hear-ash-terms-publicly',
      'c8-lysara-share-lock-authority',
      'c8-share-pact-ember-chain',
      'c8-choose-ash-compact',
      'c8-public-compact-no-names',
      'c8-cut-collector-source',
      'c8-surrender-homecoming',
      'c8-receive-vexa-outer-fort',
    ],
  },
  {
    name: 'reputation / sacrificed fort / resisted Vaor / witnesses / quiet watch',
    flags: [
      'c5-took-ember-by-force',
      'c6-red-moot-neutral',
      'c7-gained-dangerous-reputation',
    ],
    relationshipIntents: {
      mara: 'platonic',
      lysara: 'platonic',
      ilyra: 'ended',
    },
    choiceIds: [
      'c8-send-korran-hook',
      'c8-take-pell-last-map',
      'c8-deploy-mobile-force',
      'c8-use-paired-living-check',
      'c8-enter-by-pell-map',
      'c8-give-ansel-choice-test',
      'c8-call-witnesses-to-record-room',
      'c8-trust-futureless-yard',
      'c8-refuse-until-mortal-plan',
      'c8-want-chosen-duty',
      'c8-force-stolen-ember-chain',
      'c8-choose-sacrificed-fort',
      'c8-save-people-abandon-proof',
      'c8-let-ansel-refuse-collection',
      'c8-burn-lesser-oath',
      'c8-give-ansel-first-question',
    ],
  },
].map(walkChapterEight);

function walkChapterNine(route) {
  let state = {
    ...chapterNineBase,
    nodeId: 'c9-embassy-watch',
    chapterChoices: 0,
    flags: [...route.flags],
    stats: {
      ...chapterNineBase.stats,
      health: route.health ?? 8,
      resolve: 8,
      command: 8,
      oathfire: 8,
    },
    relationships: Object.fromEntries(
      Object.entries(chapterNineBase.relationships).map(([person, score]) => [
        person,
        {
          ...score,
          intent: route.relationshipIntents?.[person] ?? 'unresolved',
        },
      ]),
    ),
    contentPreference:
      route.contentPreference ?? chapterNineBase.contentPreference,
  };
  const visitedNodes = [];
  for (const choiceId of route.choiceIds) {
    const node = nodes[state.nodeId];
    visitedNodes.push(node.id);
    const choice = node.choices.find((candidate) => candidate.id === choiceId);
    if (!choice) {
      failures.push(`${route.name} cannot find ${choiceId} in ${node.id}`);
      break;
    }
    if (!canChoose(choice, state)) {
      failures.push(`${route.name} cannot choose ${choiceId} in ${node.id}`);
      break;
    }
    state = applyChoice(state, choice);
  }
  if (!nodes[state.nodeId]?.final) {
    failures.push(`${route.name} does not reach a Chapter Nine ending`);
  }
  if (!state.flags.includes('c9-malrec-cinder-alliance-proved')) {
    failures.push(`${route.name} does not prove Malrec's Cinder Deep alliance`);
  }
  return { ...route, state, visitedNodes };
}

const chapterNineWalkthroughs = [
  {
    name: 'public embassy / united wardens / bargain / gift / intimacy',
    flags: [
      'c5-freed-vaor',
      'c6-oath-recognised-red-moot',
      'c7-gained-full-army',
      'c8-united-wardens',
      'c8-preserved-original-ledgers',
      'c8-captured-collector-glove',
      'c8-surrendered-homecoming',
      'c8-vexa-entered-publicly',
      'c8-pell-survived',
      'c8-complete-lock-map',
    ],
    choiceIds: [
      'c9-move-public-embassy',
      'c9-let-futureless-record-first',
      'c9-test-name-with-own-bead',
      'c9-wardens-lock-public-door',
      'c9-choose-bargain-route',
      'c9-shield-ansel-with-locked-door',
      'c9-protect-vexa-from-chains',
      'c9-match-original-ledger-cuts',
      'c9-join-collector-glove-chain',
      'c9-vaor-gift-guards-proof',
      'c9-keep-bargain-clause',
      'c9-name-attraction',
      'c9-share-private-night',
      'c9-complete-bargain',
      'c9-take-crown-volunteers',
      'c9-cross-with-no-mortal-partner',
    ],
  },
  {
    name: 'threshold embassy / Ash Compact / theft / pact / committed Mara',
    flags: [
      'c5-vaor-pact',
      'c6-oath-defends-refusal',
      'c7-gained-chosen-company',
      'c8-accepted-ash-compact',
      'c8-living-copy-of-openings',
      'c8-severed-collector-hand',
      'c8-shared-oath-mara',
      'c8-vexa-held-at-threshold',
    ],
    relationshipIntents: { mara: 'committed' },
    choiceIds: [
      'c9-admit-threshold-embassy',
      'c9-split-speaking-bell',
      'c9-have-ansel-test-name-bead',
      'c9-compact-seals-gate-wall',
      'c9-choose-theft-route',
      'c9-shield-ansel-and-witnesses',
      'c9-break-sableglass-breach',
      'c9-test-target-strip-on-living-bark',
      'c9-match-severed-ring',
      'c9-vaor-pact-carries-proof',
      'c9-refusal-keeps-every-oath',
      'c9-name-adversarial-respect',
      'c9-talk-with-vexa-only',
      'c9-take-fragment-during-attack',
      'c9-take-mixed-warden-company',
      'c9-cross-with-mara',
    ],
  },
  {
    name: 'isolated embassy / sacrificed fort / exposure / stolen ember / low health',
    flags: [
      'c5-took-ember-by-force',
      'c6-oath-crown-restitution',
      'c7-gained-dangerous-reputation',
      'c8-sacrificed-first-fort',
      'c8-many-witnessed-openings',
      'c8-cut-collector-source-line',
      'c8-burned-lesser-oath',
      'c8-vexa-received-outer-fort',
      'c8-ember-held-as-collateral',
    ],
    health: 3,
    choiceIds: [
      'c9-keep-isolated-embassy',
      'c9-split-speaking-bell',
      'c9-break-name-bead-after-test',
      'c9-first-fort-survivors-hold-passage',
      'c9-choose-exposure-route',
      'c9-shield-ansel-and-witnesses',
      'c9-protect-vexa-from-chains',
      'c9-witnesses-identify-mortal-route',
      'c9-match-cracked-source-seal',
      'c9-break-forced-collateral',
      'c9-refusal-keeps-every-oath',
      'c9-name-permanent-hostility',
      'c9-leave-vexa-private',
      'c9-compel-sableglass-surrender',
      'c9-take-mixed-warden-company',
      'c9-cross-with-no-mortal-partner',
    ],
  },
].map(walkChapterNine);

const chapterNineEndingsByRoute = new Set(
  chapterNineWalkthroughs.map((walkthrough) => walkthrough.state.nodeId),
);
if (chapterNineEndingsByRoute.size !== 3) {
  failures.push(
    'Representative Chapter Nine routes do not reach three distinct endings',
  );
}

function walkChapterTen(route) {
  let state = {
    ...chapterTenBase,
    nodeId: 'c10-ash-road',
    chapterChoices: 0,
    flags: [...route.flags],
    stats: { ...chapterTenBase.stats, ...route.stats },
    relationships: {
      ...chapterTenBase.relationships,
      mara: {
        ...chapterTenBase.relationships.mara,
        intent: route.maraIntent ?? 'platonic',
      },
      lysara: {
        ...chapterTenBase.relationships.lysara,
        intent: route.lysaraIntent ?? 'platonic',
      },
      vexa: {
        ...chapterTenBase.relationships.vexa,
        intent: route.vexaIntent ?? 'platonic',
      },
    },
    contentPreference:
      route.contentPreference ?? chapterTenBase.contentPreference,
  };
  for (const choiceId of route.choiceIds) {
    const node = nodes[state.nodeId];
    const choice = node?.choices.find((candidate) => candidate.id === choiceId);
    if (!choice || !canChoose(choice, state)) {
      failures.push(
        `${route.name} cannot choose ${choiceId} in ${state.nodeId}`,
      );
      return state;
    }
    state = applyChoice(state, choice);
  }
  if (!nodes[state.nodeId]?.final)
    failures.push(`${route.name} does not reach a Chapter Ten ending`);
  if (!state.flags.includes('c10-reached-vathis'))
    failures.push(`${route.name} does not reach Vathis`);
  const rosters = [
    'c9-roster-futureless',
    'c9-roster-pell',
    'c9-roster-wardens',
    'c9-roster-crown',
  ];
  if (rosters.filter((flag) => state.flags.includes(flag)).length !== 1)
    failures.push(
      `${route.name} does not preserve one exact expedition roster`,
    );
  if (Math.min(...Object.values(state.stats)) < 0)
    failures.push(`${route.name} creates a negative resource`);
  return state;
}

const sharedTail = [
  'c10-use-prepared-pause',
  'c10-refuse-water-test',
  'c10-record-clean-refusal',
  'c10-use-bargain-custody',
  'c10-futureless-record-impossible-price',
  'c10-speak-surviving-oath-limits',
  'c10-let-vexa-speak-offer-first',
  'c10-choose-shared-offers',
  'c10-share-terms-not-reasons',
  'c10-shared-ledger-breaks-copy',
  'c10-use-roster-crossing-drill',
  'c10-test-free-ledger-with-shared-record',
  'c10-respect-mutual-limits',
  'c10-share-shelter-conversation',
  'c10-accept-free-ledger-guide',
];
const chapterTenFixtures = [
  {
    name: 'bargain clause kept / Futureless / shared offers',
    flags: [...chapterTenBase.flags],
    choiceIds: ['c10-futureless-front-record', ...sharedTail],
  },
  {
    name: 'admitted theft / hostile Vexa / mixed private offers',
    flags: chapterTenBase.flags
      .filter(
        (flag) =>
          !flag.startsWith('c9-route-') &&
          !flag.startsWith('c9-roster-') &&
          !flag.startsWith('c9-vexa-'),
      )
      .concat(
        'c9-route-theft',
        'c9-theft-publicly-named',
        'c9-fragment-recovered-theft',
        'c9-roster-wardens',
        'c9-vexa-permanent-hostility',
        'c9-no-mortal-partner-crossed',
      ),
    vexaIntent: 'hostile',
    choiceIds: [
      'c10-mixed-company-call-answer',
      'c10-vexa-demonstrates-silence',
      'c10-accept-water-test',
      'c10-return-empty-cup',
      'c10-name-theft-at-toll',
      'c10-mixed-fighters-answer-individually',
      'c10-keep-oaths-private',
      'c10-hold-public-truce-line',
      'c10-choose-private-offers',
      'c10-let-private-groups-return-slowly',
      'c10-private-status-check',
      'c10-use-roster-crossing-drill',
      'c10-test-free-ledger-with-private-seals',
      'c10-keep-limits-to-command',
      'c10-rest-apart',
      'c10-refuse-free-ledger-guide',
    ],
  },
  {
    name: 'public exposure / strong proof / Pell / consensual burden Oath',
    flags: chapterTenBase.flags
      .filter(
        (flag) =>
          !flag.startsWith('c9-route-') && !flag.startsWith('c9-roster-'),
      )
      .concat(
        'c9-route-exposure',
        'c9-fragment-recovered-exposure',
        'c9-sableglass-publicly-exposed',
        'c8-preserved-original-ledgers',
        'c9-roster-pell',
      ),
    choiceIds: [
      'c10-pell-maps-offer-bridges',
      'c10-use-prepared-pause',
      'c10-refuse-water-test',
      'c10-record-clean-refusal',
      'c10-use-public-exposure-custody',
      'c10-pell-maps-offer-exit',
      'c10-speak-surviving-oath-limits',
      'c10-record-vexa-boundary-publicly',
      'c10-propose-burden-oath',
      'c10-bind-consenting-offers',
      'c10-spend-oathfire-on-carried-offers',
      'c10-use-contained-oath-crossing',
      'c10-test-free-ledger-with-oath-exit',
      'c10-keep-limits-to-command',
      'c10-rest-apart',
      'c10-accept-free-ledger-guide',
    ],
  },
];
const chapterTenWalkthroughs = chapterTenFixtures.map(walkChapterTen);
if (new Set(chapterTenWalkthroughs.map((state) => state.nodeId)).size !== 3)
  failures.push(
    'Representative Chapter Ten routes do not reach three distinct endings',
  );

for (const destroyed of [
  'c9-destroyed-red-moot-authority-oath',
  'c9-destroyed-crown-restitution-oath',
  'c9-destroyed-clan-refusal-oath',
  'c9-destroyed-honest-command-limit-oath',
  'c9-destroyed-unsea-investigation-oath',
]) {
  const text = renderedBody('c10-old-oath-price', {
    ...chapterTenBase,
    flags: [...chapterTenBase.flags, destroyed],
  });
  if (!/lost|gone|destroyed|no longer/i.test(text))
    failures.push(`${destroyed} has no active Chapter Ten loss`);
  walkChapterTen({
    ...chapterTenFixtures[0],
    name: `bargain with ${destroyed}`,
    flags: chapterTenFixtures[0].flags
      .filter((flag) => flag !== 'c9-kept-true-name-clause')
      .concat('c9-cut-true-name-clause', destroyed),
    choiceIds: chapterTenFixtures[0].choiceIds.map((id) =>
      id === 'c10-speak-surviving-oath-limits'
        ? 'c10-name-destroyed-oath-loss'
        : id,
    ),
  });
}

walkChapterTen({
  ...chapterTenFixtures[1],
  name: 'admitted theft / adversarial cooperative Vexa',
  flags: chapterTenFixtures[1].flags
    .filter((flag) => flag !== 'c9-vexa-permanent-hostility')
    .concat('c9-vexa-adversarial-respect'),
  vexaIntent: 'platonic',
  choiceIds: chapterTenFixtures[1].choiceIds.map((id) =>
    id === 'c10-hold-public-truce-line' ? 'c10-let-vexa-speak-offer-first' : id,
  ),
});

walkChapterTen({
  ...chapterTenFixtures[1],
  name: 'Teren volunteers / low resources / complete route',
  flags: chapterTenFixtures[1].flags
    .filter((flag) => flag !== 'c9-roster-wardens')
    .concat('c9-roster-crown', 'c7-lost-gate-supplies'),
  stats: { health: 1, resolve: 0, command: 0, oathfire: 0, medicine: 0 },
  choiceIds: chapterTenFixtures[1].choiceIds
    .map((id) =>
      id === 'c10-mixed-company-call-answer' ? 'c10-crown-volunteer-pairs' : id,
    )
    .map((id) =>
      id === 'c10-mixed-fighters-answer-individually'
        ? 'c10-crown-volunteers-refuse-safe-return'
        : id,
    ),
});

const fadeRomance = walkChapterTen({
  ...chapterTenFixtures[0],
  name: 'committed Mara with legacy unconfirmed preference',
  flags: chapterTenFixtures[0].flags
    .filter((flag) => flag !== 'c9-no-mortal-partner-crossed')
    .concat('c9-mara-crossed-black-gate'),
  maraIntent: 'committed',
  contentPreference: { intimacy: 'fade', adultConfirmed: false },
  choiceIds: chapterTenFixtures[0].choiceIds.map((id) =>
    id === 'c10-share-shelter-conversation' ? 'c10-rest-with-mara' : id,
  ),
});
const detailedRomance = walkChapterTen({
  ...chapterTenFixtures[0],
  name: 'committed Mara with legacy confirmed preference',
  flags: chapterTenFixtures[0].flags
    .filter((flag) => flag !== 'c9-no-mortal-partner-crossed')
    .concat('c9-mara-crossed-black-gate'),
  maraIntent: 'committed',
  contentPreference: { intimacy: 'detailed', adultConfirmed: true },
  choiceIds: chapterTenFixtures[0].choiceIds.map((id) =>
    id === 'c10-share-shelter-conversation' ? 'c10-rest-with-mara' : id,
  ),
});
if (
  JSON.stringify(fadeRomance.flags) !== JSON.stringify(detailedRomance.flags) ||
  JSON.stringify(fadeRomance.relationships) !==
    JSON.stringify(detailedRomance.relationships) ||
  JSON.stringify(fadeRomance.stats) !== JSON.stringify(detailedRomance.stats)
)
  failures.push('Legacy content fields change Chapter Ten story outcomes');
const detailedText = renderedBody('c10-guide-bargain', detailedRomance);
const fadeText = renderedBody('c10-guide-bargain', fadeRomance);
if (
  detailedText !== fadeText ||
  !/unfasten travel leathers/i.test(detailedText)
)
  failures.push(
    'Chapter Ten must render the same authored intimacy passage regardless of legacy content fields',
  );
if (/\bElian\b/i.test(chapterTenSource))
  failures.push('Chapter Ten reveals Elian before Chapter Eleven');
for (const flag of [
  'c8-united-wardens',
  'c8-accepted-ash-compact',
  'c8-sacrificed-first-fort',
]) {
  const text = renderedBody('c10-road-danger', {
    ...chapterTenBase,
    flags: [...chapterTenBase.flags, flag],
  });
  if (
    !new RegExp(
      flag === 'c8-sacrificed-first-fort'
        ? 'First Fort is gone'
        : flag === 'c8-accepted-ash-compact'
          ? 'burns white'
          : 'united wardens',
      'i',
    ).test(text)
  )
    failures.push(`${flag} does not change the Chapter Ten road danger`);
}
for (const [flag, pattern] of [
  ['c9-vaor-gift-proof-guard', /willing ember/i],
  ['c9-vaor-pact-proof-carried', /ask through the pact/i],
  ['c9-stolen-ember-not-used', /stolen ember stays sheathed/i],
  ['c9-vaor-collateral-released', /restored outer flame/i],
  ['c9-forced-collateral-broken', /Vaor refuses road service/i],
]) {
  if (
    !pattern.test(
      renderedBody('c10-oath-consent', {
        ...chapterTenBase,
        flags: [...chapterTenBase.flags, flag],
      }),
    )
  )
    failures.push(`${flag} has no active Chapter Ten Vaor consequence`);
}
for (const [flag, pattern] of [
  ['c8-preserved-original-ledgers', /Original Gate ledgers/i],
  ['c8-living-copy-of-openings', /living bark/i],
  ['c8-many-witnessed-openings', /crossing witnesses/i],
  ['c8-gate-forgery-exposed', /forgery pattern/i],
  ['c8-lost-duplicate-records', /destroyed records cannot return/i],
]) {
  const flags = chapterTenBase.flags
    .filter(
      (value) =>
        ![
          'c8-preserved-original-ledgers',
          'c8-living-copy-of-openings',
          'c8-many-witnessed-openings',
          'c8-gate-forgery-exposed',
          'c8-lost-duplicate-records',
        ].includes(value),
    )
    .concat(flag);
  if (
    !pattern.test(renderedBody('c10-free-ledger', { ...chapterTenBase, flags }))
  )
    failures.push(`${flag} has no active Chapter Ten proof consequence`);
}
for (const [flag, pattern] of [
  ['c9-sableglass-proved-by-glove', /checkpoint clerk/i],
  ['c9-sableglass-proved-by-source', /checkpoint clerk/i],
  ['c9-sableglass-proved-by-ring', /no living collector/i],
  ['c9-sableglass-proved-by-broken-chain', /no living collector/i],
  ['c9-sableglass-proved-by-refusal', /test the clerk’s identity/i],
  ['c9-sableglass-proved-by-freed-names', /test the clerk’s identity/i],
  ['c9-sableglass-proved-by-attack-chain', /collector unnamed/i],
]) {
  const text = renderedBody('c10-free-ledger', {
    ...chapterTenBase,
    flags: [...chapterTenBase.flags, flag],
  });
  if (!pattern.test(text))
    failures.push(
      `${flag} does not change the Chapter Ten Sableglass proof route`,
    );
}
if (
  !/completedChapters\.includes\(9\)/.test(saveSource) ||
  !/c9-mara-crossed-black-gate/.test(saveSource)
)
  failures.push(
    'Older Chapter Nine saves lack backward-compatible partner roster migration',
  );

const chapterNineEntryCases = [
  [
    ['c8-vexa-entered-publicly'],
    'c9-move-public-embassy',
    /inside Fourth Fort under public guard/i,
  ],
  [
    ['c8-vexa-held-at-threshold'],
    'c9-admit-threshold-embassy',
    /remains outside the fortress ring/i,
  ],
  [
    ['c8-vexa-received-outer-fort'],
    'c9-keep-isolated-embassy',
    /inside isolated Second Fort/i,
  ],
  [
    ['c8-ansel-spoke-first'],
    'c9-ansel-controls-threshold',
    /no new entry permission exists/i,
  ],
  [
    ['c8-ansel-spoke-first', 'c8-ansel-spoke-first-after-entry'],
    'c9-keep-isolated-embassy',
    /already stands inside Second Fort|remains inside isolated Second Fort/i,
  ],
];
for (const [flags, choiceId, expectedBody] of chapterNineEntryCases) {
  const state = { ...chapterNineBase, flags };
  const visibleIds = nodes['c9-embassy-watch'].choices
    .filter((choice) => isChoiceVisible(choice, state))
    .map((choice) => choice.id);
  if (
    !visibleIds.includes(choiceId) ||
    !expectedBody.test(renderedBody('c9-embassy-watch', state)) ||
    !expectedBody.test(knownTruths(state).join(' '))
  ) {
    failures.push(
      `Chapter Nine scene or journal loses the physical Vexa entry state for ${flags.join(', ')}`,
    );
  }
}

const chapterNineEvidenceCases = [
  ['c8-preserved-original-ledgers', 'c9-match-original-ledger-cuts'],
  ['c8-saved-pell-packet', 'c9-authenticate-pell-packet'],
  ['c8-linked-malrec-to-gate-record', 'c9-test-joined-malrec-record'],
  ['c8-living-copy-of-openings', 'c9-test-target-strip-on-living-bark'],
  ['c8-many-witnessed-openings', 'c9-witnesses-identify-mortal-route'],
  ['c8-gate-forgery-exposed', 'c9-use-forgery-against-seal'],
  ['c8-lost-duplicate-records', 'c9-rebuild-proof-from-assassin-kit'],
];
for (const [flag, choiceId] of chapterNineEvidenceCases) {
  const state = { ...chapterNineBase, flags: [flag] };
  if (!isChoiceVisible(choiceById('c9-mortal-proof', choiceId), state)) {
    failures.push(
      `${flag} does not unlock its exact Chapter Nine evidence route`,
    );
  }
}
if (
  isChoiceVisible(
    choiceById('c9-mortal-proof', 'c9-match-original-ledger-cuts'),
    { ...chapterNineBase, flags: ['c8-lost-duplicate-records'] },
  )
) {
  failures.push(
    'Destroyed Gate records reappear as original evidence in Chapter Nine',
  );
}

const oathPriceExpectations = [
  ['c8-surrendered-homecoming', /father’s key is gone/i],
  ['c8-released-crown-oath', /released service Oath/i],
  ['c8-burned-lesser-oath', /Warden whistle is ash/i],
  ['c8-shared-oath-mara', /mark remains in Mara’s palm/i],
  ['c8-shared-oath-lysara', /mark remains in Lysara’s palm/i],
  ['c8-shared-oath-korran', /mark remains in Korran’s palm/i],
];
const oathPriceFlagsForAudit = oathPriceExpectations.map(([flag]) => flag);
const chapterNineOathCuts = [
  ['c6-oath-recognised-red-moot', 'c9-cut-clause-destroy-red-moot-authority'],
  ['c6-oath-crown-restitution', 'c9-cut-clause-destroy-crown-restitution'],
  ['c6-oath-defends-refusal', 'c9-cut-clause-destroy-clan-refusal'],
  ['c6-oath-honest-limit', 'c9-cut-clause-destroy-honest-limit'],
  ['c6-oath-investigate-unsea', 'c9-cut-clause-destroy-unsea-investigation'],
];
for (const [oathFlag, choiceId] of chapterNineOathCuts) {
  const state = {
    ...chapterNineBase,
    flags: ['c9-route-bargain', oathFlag],
    stats: { ...chapterNineBase.stats, oathfire: 1 },
  };
  if (!canChoose(choiceById('c9-oath-clause', choiceId), state)) {
    failures.push(
      `${oathFlag} does not expose its exact Chapter Nine clause cut`,
    );
  }
}
for (const destroyedFlag of [
  'c9-destroyed-red-moot-authority-oath',
  'c9-destroyed-clan-refusal-oath',
  'c9-destroyed-honest-command-limit-oath',
]) {
  const mixedCompanyChoice = choiceById(
    'c9-crossing-roster',
    'c9-take-mixed-warden-company',
  );
  if (
    isChoiceVisible(mixedCompanyChoice, {
      ...chapterNineBase,
      flags: ['c7-gained-chosen-company', destroyedFlag],
    })
  ) {
    failures.push(
      `${destroyedFlag} does not withdraw the promised Moot roster`,
    );
  }
}
for (const [flag, expected] of oathPriceExpectations) {
  if (
    !expected.test(
      renderedBody('c9-oath-clause', { ...chapterNineBase, flags: [flag] }),
    )
  ) {
    failures.push(
      `${flag} does not materially preserve its exact Chapter Eight Oath price`,
    );
  }
}

const eligibleVexaState = {
  ...chapterNineBase,
  flags: ['c9-attacks-stopped', 'c9-vexa-attraction-acknowledged'],
  relationships: {
    ...chapterNineBase.relationships,
    vexa: {
      ...chapterNineBase.relationships.vexa,
      trust: 2,
      attraction: 3,
      intent: 'interested',
    },
  },
};
const intimacyChoice = choiceById(
  'c9-private-choice',
  'c9-share-private-night',
);
if (
  !isChoiceVisible(intimacyChoice, eligibleVexaState) ||
  !canChoose(intimacyChoice, eligibleVexaState)
) {
  failures.push(
    'Eligible unattached adults cannot reach the optional Vexa intimacy scene',
  );
}
for (const person of ['mara', 'lysara', 'ilyra']) {
  const committed = {
    ...eligibleVexaState,
    relationships: {
      ...eligibleVexaState.relationships,
      [person]: {
        ...eligibleVexaState.relationships[person],
        intent: 'committed',
      },
    },
  };
  if (
    isChoiceVisible(intimacyChoice, committed) ||
    canChoose(intimacyChoice, committed)
  ) {
    failures.push(`Vexa intimacy ignores the existing ${person} commitment`);
  }
}
if (
  relationshipSummary({
    trust: 0,
    attraction: 0,
    respect: 3,
    friction: 4,
    intent: 'hostile',
  }) !== 'Permanent hostility, respect still forming, serious tension'
) {
  failures.push(
    'Vexa permanent hostility lacks a stable qualitative relationship summary',
  );
}

const disclosedNameProducers = Object.values(nodes)
  .flatMap((node) => node.choices)
  .filter((choice) =>
    choice.addFlags?.includes('c9-true-name-freely-disclosed'),
  );
if (
  disclosedNameProducers.length !== 1 ||
  disclosedNameProducers[0].id !== 'c9-complete-bargain'
) {
  failures.push(
    'True-name disclosure can be inferred outside the explicit bargain consent choice',
  );
}

const releasedCrownOathState = {
  ...chapterNineBase,
  flags: [
    'c9-route-bargain',
    'c6-oath-crown-restitution',
    'c8-released-crown-oath',
  ],
};
if (
  isChoiceVisible(
    choiceById('c9-oath-clause', 'c9-cut-clause-destroy-crown-restitution'),
    releasedCrownOathState,
  )
) {
  failures.push(
    'Chapter Nine resurrects the released Crown Oath as clause payment',
  );
}
if (
  nodes['c9-oath-clause'].choices.some((choice) =>
    /Warden promise|patrol whistle/i.test(`${choice.label} ${choice.detail}`),
  )
) {
  failures.push(
    'Chapter Nine resurrects the burned Warden promise as clause payment',
  );
}

const lowResourceStolenState = {
  ...chapterNineBase,
  nodeId: 'c9-joined-crisis',
  flags: ['c5-took-ember-by-force', 'c9-sableglass-proved-by-broken-chain'],
  stats: {
    ...chapterNineBase.stats,
    health: 1,
    resolve: 0,
    command: 0,
    oathfire: 0,
  },
};
if (
  !canChoose(
    choiceById('c9-joined-crisis', 'c9-stolen-ember-kept-sheathed'),
    lowResourceStolenState,
  )
) {
  failures.push(
    'Low-resource stolen-ember route cannot preserve the Malrec revelation',
  );
}

for (const [destroyedFlag, swornFlag] of [
  ['c9-destroyed-red-moot-authority-oath', 'c6-oath-recognised-red-moot'],
  ['c9-destroyed-crown-restitution-oath', 'c6-oath-crown-restitution'],
  ['c9-destroyed-clan-refusal-oath', 'c6-oath-defends-refusal'],
  ['c9-destroyed-honest-command-limit-oath', 'c6-oath-honest-limit'],
  ['c9-destroyed-unsea-investigation-oath', 'c6-oath-investigate-unsea'],
]) {
  const remaining = promiseRecords.activePromises({
    ...initialState,
    chapter: 12,
    flags: [swornFlag, destroyedFlag],
  });
  if (remaining.length)
    failures.push(`${destroyedFlag} can return in the active Oath journal`);
}

const fadePrivateState = applyChoice(
  {
    ...eligibleVexaState,
    nodeId: 'c9-private-choice',
    contentPreference: { intimacy: 'fade', adultConfirmed: false },
  },
  intimacyChoice,
);
const detailedPrivateState = applyChoice(
  {
    ...eligibleVexaState,
    nodeId: 'c9-private-choice',
    contentPreference: { intimacy: 'detailed', adultConfirmed: true },
  },
  intimacyChoice,
);
const fadeState = {
  ...fadePrivateState,
  contentPreference: { intimacy: 'fade', adultConfirmed: false },
};
const detailedState = {
  ...detailedPrivateState,
  contentPreference: { intimacy: 'detailed', adultConfirmed: true },
};
const fadeOutcome = {
  flags: fadeState.flags,
  relationships: fadeState.relationships,
  nodeId: fadeState.nodeId,
};
const detailedOutcome = {
  flags: detailedState.flags,
  relationships: detailedState.relationships,
  nodeId: detailedState.nodeId,
};
if (JSON.stringify(fadeOutcome) !== JSON.stringify(detailedOutcome)) {
  failures.push('Legacy content fields change Chapter Nine story outcomes');
}
if (
  renderedBody('c9-recover-fragment', fadeState) !==
    renderedBody('c9-recover-fragment', detailedState) ||
  !/unfasten each other’s armor/i.test(
    renderedBody('c9-recover-fragment', fadeState),
  )
) {
  failures.push(
    'Chapter Nine must render the same authored intimacy passage regardless of legacy content fields',
  );
}
for (const walkthrough of chapterNineWalkthroughs) {
  const carriedDefence = walkthrough.flags.some((flag) =>
    [
      'c8-united-wardens',
      'c8-accepted-ash-compact',
      'c8-sacrificed-first-fort',
    ].includes(flag),
  );
  const carriedOathPrice = walkthrough.flags.some((flag) =>
    oathPriceFlagsForAudit.includes(flag),
  );
  const carriedRoster = walkthrough.state.flags.some((flag) =>
    [
      'c9-roster-futureless',
      'c9-roster-pell',
      'c9-roster-wardens',
      'c9-roster-crown',
    ].includes(flag),
  );
  const carriedVexaRelationship =
    walkthrough.state.relationships.vexa.intent !== 'unresolved';
  if (
    !carriedDefence ||
    !carriedOathPrice ||
    !carriedRoster ||
    !carriedVexaRelationship
  ) {
    failures.push(
      `${walkthrough.name} drops defence, Oath price, Vexa relationship, or ally roster before Chapter Ten`,
    );
  }
}
const migratedOldRelationships = normaliseRelationships({
  mara: { trust: 7, intent: 'committed' },
});
if (
  migratedOldRelationships.mara.trust !== 7 ||
  !migratedOldRelationships.vexa ||
  migratedOldRelationships.vexa.intent !== 'unresolved' ||
  !pageSource.includes("known.push('vexa')") ||
  !source.includes("vexa: 'Vexa'")
) {
  failures.push(
    'Old saves do not safely gain a persistent visible Vexa relationship',
  );
}

const stack = [
  { state: initialState, knownTerms: [], knownStoryTerms: [] },
  {
    state: {
      ...chapterTwoBase,
      flags: ['chose-silver-road', 'captured-attacker'],
    },
    knownTerms: chapterTwoKnownTerms,
    knownStoryTerms: chapterTwoKnownStoryTerms,
  },
  {
    state: { ...chapterTwoBase, flags: ['chose-high-ground'] },
    knownTerms: chapterTwoKnownTerms,
    knownStoryTerms: chapterTwoKnownStoryTerms,
  },
  {
    state: {
      ...chapterTwoBase,
      flags: ['oath-bring-them-home'],
      stats: {
        ...chapterTwoBase.stats,
        health: 1,
        resolve: 0,
        command: 0,
        oathfire: 0,
      },
    },
    knownTerms: chapterTwoKnownTerms,
    knownStoryTerms: chapterTwoKnownStoryTerms,
  },
  {
    state: {
      ...chapterThreeBase,
      flags: ['c2-saved-attacker', 'c2-saved-nilo', 'c2-oath-expose-crown'],
    },
    knownTerms: chapterThreeKnownTerms,
    knownStoryTerms: chapterThreeKnownStoryTerms,
  },
  {
    state: {
      ...chapterThreeBase,
      flags: ['c2-pin-broken'],
      stats: {
        ...chapterThreeBase.stats,
        health: 1,
        resolve: 0,
        command: 0,
        oathfire: 0,
      },
    },
    knownTerms: chapterThreeKnownTerms,
    knownStoryTerms: chapterThreeKnownStoryTerms,
  },
  ...['c3-target-ordan', 'c3-target-thief', 'c3-secured-return'].map(
    (flag) => ({
      state: { ...chapterFourBase, flags: [flag] },
      knownTerms: chapterFourKnownTerms,
      knownStoryTerms: chapterFourKnownStoryTerms,
    }),
  ),
  {
    state: {
      ...chapterFourBase,
      flags: ['c3-target-thief'],
      stats: {
        ...chapterFourBase.stats,
        health: 2,
        resolve: 0,
        command: 0,
        oathfire: 0,
      },
    },
    knownTerms: chapterFourKnownTerms,
    knownStoryTerms: chapterFourKnownStoryTerms,
  },
  ...['c4-rook-arrested', 'c4-rook-bargain', 'c4-rook-trusted'].map((flag) => ({
    state: { ...chapterFiveBase, flags: [flag] },
    knownTerms: chapterFiveKnownTerms,
    knownStoryTerms: chapterFiveKnownStoryTerms,
  })),
  {
    state: {
      ...chapterFiveBase,
      flags: ['c4-rook-bargain', 'c4-captured-ordan'],
      relationships: {
        ...chapterFiveBase.relationships,
        mara: { trust: 6, attraction: 5 },
      },
    },
    knownTerms: chapterFiveKnownTerms,
    knownStoryTerms: chapterFiveKnownStoryTerms,
  },
  {
    state: {
      ...chapterFiveBase,
      flags: ['c4-rook-trusted'],
      relationships: {
        mara: { trust: 2, attraction: 1 },
        lysara: { trust: 6, attraction: 5 },
        ilyra: { ...initialState.relationships.ilyra },
      },
    },
    knownTerms: chapterFiveKnownTerms,
    knownStoryTerms: chapterFiveKnownStoryTerms,
  },
  {
    state: {
      ...chapterFiveBase,
      flags: ['c4-rook-trusted'],
      stats: {
        ...chapterFiveBase.stats,
        health: 2,
        resolve: 0,
        command: 0,
        oathfire: 0,
      },
    },
    knownTerms: chapterFiveKnownTerms,
    knownStoryTerms: chapterFiveKnownStoryTerms,
  },
  ...['c5-freed-vaor', 'c5-took-ember-by-force', 'c5-vaor-pact'].map(
    (flag) => ({
      state: { ...chapterSixBase, flags: [flag] },
      knownTerms: chapterSixKnownTerms,
      knownStoryTerms: chapterSixKnownStoryTerms,
    }),
  ),
  {
    state: {
      ...chapterSixBase,
      flags: ['c5-vaor-pact'],
      stats: {
        ...chapterSixBase.stats,
        health: 2,
        resolve: 0,
        command: 0,
        oathfire: 0,
      },
    },
    knownTerms: chapterSixKnownTerms,
    knownStoryTerms: chapterSixKnownStoryTerms,
  },
  ...['c6-red-moot-war', 'c6-red-moot-alliance', 'c6-red-moot-neutral'].map(
    (flag) => ({
      state: { ...chapterSevenBase, flags: ['c5-freed-vaor', flag] },
      knownTerms: chapterSevenKnownTerms,
      knownStoryTerms: chapterSevenKnownStoryTerms,
    }),
  ),
  {
    state: {
      ...chapterSevenBase,
      relationships: {
        ...chapterSevenBase.relationships,
        mara: { ...chapterSevenBase.relationships.mara, intent: 'committed' },
      },
    },
    knownTerms: chapterSevenKnownTerms,
    knownStoryTerms: chapterSevenKnownStoryTerms,
  },
  {
    state: {
      ...chapterSevenBase,
      relationships: {
        ...chapterSevenBase.relationships,
        mara: { ...chapterSevenBase.relationships.mara, intent: 'platonic' },
        lysara: {
          ...chapterSevenBase.relationships.lysara,
          intent: 'committed',
        },
      },
    },
    knownTerms: chapterSevenKnownTerms,
    knownStoryTerms: chapterSevenKnownStoryTerms,
  },
  {
    state: {
      ...chapterSevenBase,
      relationships: {
        mara: { ...chapterSevenBase.relationships.mara, intent: 'platonic' },
        lysara: {
          ...chapterSevenBase.relationships.lysara,
          intent: 'platonic',
        },
        ilyra: {
          trust: 2,
          attraction: 2,
          respect: 2,
          friction: 0,
          intent: 'interested',
        },
      },
    },
    knownTerms: chapterSevenKnownTerms,
    knownStoryTerms: chapterSevenKnownStoryTerms,
  },
  {
    state: {
      ...chapterSevenBase,
      stats: {
        ...chapterSevenBase.stats,
        health: 1,
        resolve: 0,
        command: 0,
        oathfire: 0,
      },
    },
    knownTerms: chapterSevenKnownTerms,
    knownStoryTerms: chapterSevenKnownStoryTerms,
  },
  ...[
    'c7-gained-full-army',
    'c7-gained-chosen-company',
    'c7-gained-dangerous-reputation',
  ].map((flag) => ({
    state: {
      ...chapterEightBase,
      flags: ['c5-freed-vaor', 'c6-red-moot-alliance', flag],
    },
    knownTerms: chapterEightKnownTerms,
    knownStoryTerms: chapterEightKnownStoryTerms,
  })),
  {
    state: {
      ...chapterEightBase,
      relationships: {
        ...chapterEightBase.relationships,
        mara: { ...chapterEightBase.relationships.mara, intent: 'committed' },
      },
    },
    knownTerms: chapterEightKnownTerms,
    knownStoryTerms: chapterEightKnownStoryTerms,
  },
  {
    state: {
      ...chapterEightBase,
      relationships: {
        ...chapterEightBase.relationships,
        mara: { ...chapterEightBase.relationships.mara, intent: 'platonic' },
        lysara: {
          ...chapterEightBase.relationships.lysara,
          intent: 'committed',
        },
      },
    },
    knownTerms: chapterEightKnownTerms,
    knownStoryTerms: chapterEightKnownStoryTerms,
  },
  {
    state: {
      ...chapterEightBase,
      stats: {
        ...chapterEightBase.stats,
        health: 1,
        resolve: 0,
        command: 0,
        oathfire: 0,
        medicine: 0,
      },
    },
    knownTerms: chapterEightKnownTerms,
    knownStoryTerms: chapterEightKnownStoryTerms,
  },
  {
    state: chapterNineBase,
    knownTerms: chapterNineKnownTerms,
    knownStoryTerms: chapterNineKnownStoryTerms,
  },
  {
    state: {
      ...chapterNineBase,
      flags: [
        'c5-vaor-pact',
        'c6-oath-defends-refusal',
        'c7-gained-chosen-company',
        'c8-accepted-ash-compact',
        'c8-living-copy-of-openings',
        'c8-captured-collector-glove',
        'c8-shared-oath-mara',
        'c8-vexa-held-at-threshold',
        'c8-pell-died-for-map',
      ],
    },
    knownTerms: chapterNineKnownTerms,
    knownStoryTerms: chapterNineKnownStoryTerms,
  },
  {
    state: {
      ...chapterNineBase,
      flags: [
        'c5-took-ember-by-force',
        'c6-oath-crown-restitution',
        'c7-gained-dangerous-reputation',
        'c8-sacrificed-first-fort',
        'c8-many-witnessed-openings',
        'c8-cut-collector-source-line',
        'c8-burned-lesser-oath',
        'c8-vexa-received-outer-fort',
        'c8-ember-held-as-collateral',
      ],
      stats: { ...chapterNineBase.stats, health: 2 },
    },
    knownTerms: chapterNineKnownTerms,
    knownStoryTerms: chapterNineKnownStoryTerms,
  },
  {
    state: chapterTenBase,
    knownTerms: chapterTenKnownTerms,
    knownStoryTerms: chapterTenKnownStoryTerms,
  },
  ...[
    ['c9-roster-pell', 'c9-mara-crossed-black-gate'],
    ['c9-roster-wardens', 'c9-lysara-crossed-black-gate'],
    ['c9-roster-crown', 'c9-no-mortal-partner-crossed'],
  ].map(([roster, partner]) => ({
    state: {
      ...chapterTenBase,
      flags: chapterTenBase.flags
        .filter(
          (flag) =>
            !flag.startsWith('c9-roster-') && !flag.includes('mortal-partner'),
        )
        .concat(roster, partner),
      relationships: {
        ...chapterTenBase.relationships,
        mara: {
          ...chapterTenBase.relationships.mara,
          intent: partner.includes('mara') ? 'committed' : 'platonic',
        },
        lysara: {
          ...chapterTenBase.relationships.lysara,
          intent: partner.includes('lysara') ? 'committed' : 'platonic',
        },
      },
    },
    knownTerms: chapterTenKnownTerms,
    knownStoryTerms: chapterTenKnownStoryTerms,
  })),
  {
    state: {
      ...chapterTenBase,
      stats: { ...chapterTenBase.stats, health: 1, command: 0, oathfire: 0 },
    },
    knownTerms: chapterTenKnownTerms,
    knownStoryTerms: chapterTenKnownStoryTerms,
  },
  {
    state: chapterElevenBase,
    knownTerms: chapterElevenKnownTerms,
    knownStoryTerms: chapterElevenKnownStoryTerms,
  },
  {
    state: {
      ...chapterElevenBase,
      stats: {
        ...chapterElevenBase.stats,
        health: 1,
        resolve: 0,
        command: 0,
        oathfire: 0,
        medicine: 0,
      },
    },
    knownTerms: chapterElevenKnownTerms,
    knownStoryTerms: chapterElevenKnownStoryTerms,
  },
  {
    state: {
      ...chapterElevenBase,
      flags: chapterElevenBase.flags
        .filter(
          (flag) =>
            !flag.startsWith('c9-route-') &&
            !flag.startsWith('c9-roster-') &&
            !flag.startsWith('c10-offer-method-') &&
            !flag.startsWith('c10-free-ledger-guide-') &&
            flag !== 'c10-free-ledger-petition-owed' &&
            flag !== 'c9-return-promise-owned' &&
            flag !== 'c9-true-name-freely-disclosed' &&
            flag !== 'c9-kept-true-name-clause' &&
            flag !== 'c9-vexa-guarded-trust',
        )
        .concat(
          'c9-route-theft',
          'c9-theft-publicly-named',
          'c9-roster-pell',
          'c9-vexa-permanent-hostility',
          'c10-offer-method-private',
          'c10-private-seals-kept',
          'c10-free-ledger-guide-refused',
        ),
      relationships: {
        ...chapterElevenBase.relationships,
        vexa: {
          ...chapterElevenBase.relationships.vexa,
          intent: 'hostile',
          friction: 4,
        },
      },
    },
    knownTerms: chapterElevenKnownTerms,
    knownStoryTerms: chapterElevenKnownStoryTerms,
  },
  {
    state: {
      ...chapterElevenBase,
      flags: chapterElevenBase.flags
        .filter(
          (flag) =>
            !flag.startsWith('c9-route-') &&
            !flag.startsWith('c9-roster-') &&
            !flag.startsWith('c10-offer-method-'),
        )
        .concat(
          'c9-route-exposure',
          'c9-sableglass-publicly-exposed',
          'c9-roster-wardens',
          'c10-offer-method-oath',
          'c10-burden-oath-active',
          'c10-burden-oath-explicit-consent',
          'c10-oath-traveller-withdrew',
        ),
    },
    knownTerms: chapterElevenKnownTerms,
    knownStoryTerms: chapterElevenKnownStoryTerms,
  },
  {
    state: chapterTwelveBase,
    knownTerms: chapterTwelveKnownTerms,
    knownStoryTerms: chapterTwelveKnownStoryTerms,
  },
  {
    state: {
      ...chapterTwelveBase,
      stats: {
        ...chapterTwelveBase.stats,
        health: 1,
        resolve: 0,
        command: 0,
        oathfire: 0,
        medicine: 0,
      },
    },
    knownTerms: chapterTwelveKnownTerms,
    knownStoryTerms: chapterTwelveKnownStoryTerms,
  },
];

function chapterElevenFixtureState({
  add = [],
  remove = [],
  relationships,
} = {}) {
  const removed = new Set(remove);
  return {
    ...chapterElevenBase,
    nodeId: 'c11-vathis-gate',
    chapterChoices: 0,
    history: [],
    defeat: false,
    stats: {
      ...chapterElevenBase.stats,
      health: 8,
      resolve: 6,
      command: 5,
      oathfire: 5,
      medicine: 3,
    },
    flags: [
      ...new Set(
        chapterElevenBase.flags
          .filter((flag) => !removed.has(flag))
          .concat(add),
      ),
    ],
    relationships: relationships ?? chapterElevenBase.relationships,
  };
}

function walkChapterEleven(label, openingState, choiceIds, expectedEnding) {
  let state = openingState;
  for (const choiceId of choiceIds) {
    const node = nodes[state.nodeId];
    const choice = node?.choices.find((candidate) => candidate.id === choiceId);
    if (!choice) {
      failures.push(`${label} cannot find ${choiceId} at ${state.nodeId}`);
      return;
    }
    if (!canChoose(choice, state)) {
      failures.push(`${label} cannot choose ${choiceId} at ${state.nodeId}`);
      return;
    }
    state = applyChoice(state, choice);
    if (Object.values(state.stats).some((value) => value < 0)) {
      failures.push(`${label} makes a resource negative at ${choiceId}`);
      return;
    }
  }
  if (state.nodeId !== expectedEnding)
    failures.push(
      `${label} ends at ${state.nodeId}, expected ${expectedEnding}`,
    );
  if (!state.flags.includes('c11-elian-voice-heard'))
    failures.push(
      `${label} reaches its ending without the earned engine warning`,
    );
}

const chapterElevenWalkthroughs = [
  {
    label: 'shared bargain Futureless revolt',
    state: chapterElevenFixtureState({ add: ['oath-bring-them-home'] }),
    ending: 'c11-ending-revolt',
    choices: [
      'c11-use-promised-ledger-checkpoint',
      'c11-hear-petition-with-shared-ledger',
      'c11-record-engine-lease-with-guide',
      'c11-cross-by-shared-price-check',
      'c11-align-fragment-under-limited-precision',
      'c11-test-mythic-shelter-transfer',
      'c11-register-shared-terms-not-people',
      'c11-state-plain-illusion-refusal',
      'c11-inventory-free-ledger-hearing-credit',
      'c11-start-debt-bound-revolt',
      'c11-record-collar-fraud-before-refusal',
      'c11-build-individual-refusal-line',
      'c11-secure-revolt-tunnel-first',
      'c11-let-refusers-speak-engine-phrase',
      'c11-ask-engine-voice-identity',
      'c11-record-elian-bounded-claims',
      'c11-hold-revolt-witness-circle',
    ],
  },
  {
    label: 'private admitted theft hostile Vexa Pell force',
    state: chapterElevenFixtureState({
      remove: chapterElevenBase.flags.filter((flag) =>
        /c9-route-|c9-roster-|c10-offer-method-|c10-free-ledger-guide-/.test(
          flag,
        ),
      ),
      add: [
        'c9-route-theft',
        'c9-theft-publicly-named',
        'c9-roster-pell',
        'c9-vexa-permanent-hostility',
        'c10-offer-method-private',
        'c10-private-seals-kept',
        'c10-clean-refusal-recorded',
        'c10-free-ledger-guide-refused',
      ],
    }),
    ending: 'c11-ending-force',
    choices: [
      'c11-take-slower-public-entry',
      'c11-use-recorded-clean-refusal',
      'c11-read-public-lease-chain',
      'c11-cross-by-private-owner-signals',
      'c11-open-door-with-admitted-theft',
      'c11-refuse-owned-weather',
      'c11-register-private-seal-edges',
      'c11-state-plain-illusion-refusal',
      'c11-inventory-roster-witness-bond',
      'c11-march-to-engine-by-force',
      'c11-force-pell-service-route',
      'c11-use-mapped-force-retreat',
      'c11-force-burn-relay-with-stolen-fragment',
      'c11-send-relay-phrase-with-expedition-witness',
      'c11-ask-engine-voice-for-verifiable-limit',
      'c11-protect-elian-channel-from-ownership',
      'c11-hold-force-engine-corridor',
    ],
  },
  {
    label: 'burden Oath exposure mixed auction',
    state: chapterElevenFixtureState({
      remove: chapterElevenBase.flags.filter((flag) =>
        /c9-route-|c9-roster-|c10-offer-method-/.test(flag),
      ),
      add: [
        'c9-route-exposure',
        'c9-sableglass-publicly-exposed',
        'c9-roster-wardens',
        'c10-offer-method-oath',
        'c10-burden-oath-active',
        'c10-burden-oath-explicit-consent',
      ],
    }),
    ending: 'c11-ending-auction',
    choices: [
      'c11-use-promised-ledger-checkpoint',
      'c11-give-burden-accounts-before-hearing',
      'c11-match-public-evidence-to-lease',
      'c11-cross-by-ended-burden-record',
      'c11-open-door-with-public-custody',
      'c11-accept-ordinary-weather-shelter',
      'c11-complete-burden-private-accounting',
      'c11-state-plain-illusion-refusal',
      'c11-inventory-sableglass-damages-claim',
      'c11-enter-invasion-auction',
      'c11-bid-sableglass-damages-claim',
      'c11-use-method-proof-at-auction',
      'c11-free-seat-holds-invasion-right',
      'c11-let-free-seat-invoke-audit',
      'c11-ask-engine-voice-opposition',
      'c11-ask-elian-to-repeat-opposition-publicly',
      'c11-lock-auction-deed-to-gate-limit',
    ],
  },
  {
    label: 'Crown volunteers low resource force',
    state: {
      ...chapterElevenFixtureState({
        remove: chapterElevenBase.flags.filter((flag) =>
          flag.startsWith('c9-roster-'),
        ),
        add: ['c9-roster-crown'],
      }),
      stats: {
        ...chapterElevenBase.stats,
        health: 1,
        resolve: 0,
        command: 0,
        oathfire: 0,
        medicine: 0,
      },
    },
    ending: 'c11-ending-force',
    choices: [
      'c11-use-promised-ledger-checkpoint',
      'c11-hear-petition-with-shared-ledger',
      'c11-record-engine-lease-with-guide',
      'c11-cross-by-shared-price-check',
      'c11-align-fragment-under-limited-precision',
      'c11-refuse-owned-weather',
      'c11-register-shared-terms-not-people',
      'c11-state-plain-illusion-refusal',
      'c11-inventory-free-ledger-hearing-credit',
      'c11-march-to-engine-by-force',
      'c11-force-seven-volunteer-marks',
      'c11-break-sidewall-for-retreat',
      'c11-force-align-bargained-fragment',
      'c11-send-relay-phrase-with-expedition-witness',
      'c11-ask-engine-voice-identity',
      'c11-record-elian-bounded-claims',
      'c11-hold-force-engine-corridor',
    ],
  },
];
for (const route of chapterElevenWalkthroughs)
  walkChapterEleven(route.label, route.state, route.choices, route.ending);

const destroyedOathVisibility = [
  [
    'c9-destroyed-red-moot-authority-oath',
    'c11-revolt-oathfire',
    'c11-mythic-red-moot-refusal-square',
  ],
  [
    'c9-destroyed-crown-restitution-oath',
    'c11-auction-counterbid',
    'c11-mythic-crown-victims-claim',
  ],
  [
    'c9-destroyed-clan-refusal-oath',
    'c11-force-oathfire',
    'c11-mythic-clan-refusal-retreat',
  ],
  ['c9-destroyed-honest-command-limit-oath', 'c11-revolt-oathfire', null],
  ['c9-destroyed-unsea-investigation-oath', 'c11-auction-counterbid', null],
];
for (const [flag, nodeId, mythicChoice] of destroyedOathVisibility) {
  const state = chapterElevenFixtureState({ add: [flag] });
  if (!/gone/i.test(renderedBody(nodeId, state)))
    failures.push(`Chapter Eleven does not show the loss recorded by ${flag}`);
  if (mythicChoice) {
    const choice = nodes[nodeId].choices.find(
      (candidate) => candidate.id === mythicChoice,
    );
    if (choice && isChoiceVisible(choice, state))
      failures.push(`${mythicChoice} returns after ${flag}`);
  }
}

const maraIllusion = renderedBody(
  'c11-illusion-street',
  chapterElevenFixtureState({
    add: ['c9-mara-remained-at-gate'],
    relationships: {
      ...chapterElevenBase.relationships,
      mara: { ...chapterElevenBase.relationships.mara, intent: 'committed' },
    },
  }),
);
const lysaraIllusion = renderedBody(
  'c11-illusion-street',
  chapterElevenFixtureState({
    add: ['c9-lysara-remained-at-gate'],
    relationships: {
      ...chapterElevenBase.relationships,
      lysara: {
        ...chapterElevenBase.relationships.lysara,
        intent: 'committed',
      },
    },
  }),
);
const nonRomanticIllusion = renderedBody(
  'c11-illusion-street',
  chapterElevenFixtureState({
    remove: [
      'c9-mara-crossed-black-gate',
      'c9-mara-remained-at-gate',
      'c9-lysara-crossed-black-gate',
      'c9-lysara-remained-at-gate',
      'c9-shared-private-night',
      'c9-vexa-attraction-acknowledged',
    ],
    relationships: Object.fromEntries(
      Object.entries(chapterElevenBase.relationships).map(([key, value]) => [
        key,
        { ...value, intent: 'platonic' },
      ]),
    ),
  }),
);
if (!/Mara’s face/i.test(maraIllusion))
  failures.push('Mara commitment does not select the Mara illusion');
if (!/Lysara’s face/i.test(lysaraIllusion))
  failures.push('Lysara commitment does not select the Lysara illusion');
if (!/father’s inn/i.test(nonRomanticIllusion))
  failures.push('No-romance state lacks a complete non-romantic illusion');
if (
  !/cannot speak here|cannot answer here|no new .*consent/i.test(
    `${maraIllusion} ${lysaraIllusion}`,
  )
)
  failures.push(
    'An absent partner illusion is not clearly separated from the real person’s consent',
  );

const platonicRelationships = Object.fromEntries(
  Object.entries(chapterElevenBase.relationships).map(([key, value]) => [
    key,
    { ...value, intent: 'platonic' },
  ]),
);
const vexaIllusionState = chapterElevenFixtureState({
  add: ['c9-vexa-attraction-acknowledged'],
  remove: [
    'c9-mara-crossed-black-gate',
    'c9-mara-remained-at-gate',
    'c9-lysara-crossed-black-gate',
    'c9-lysara-remained-at-gate',
    'c9-refused-private-connection',
    'c9-vexa-permanent-hostility',
  ],
  relationships: platonicRelationships,
});
if (
  !/Vexa’s face/i.test(renderedBody('c11-illusion-street', vexaIllusionState))
)
  failures.push('Eligible Vexa history does not select the Vexa illusion');
const refusedVexaIllusion = renderedBody('c11-illusion-street', {
  ...vexaIllusionState,
  flags: [...vexaIllusionState.flags, 'c9-refused-private-connection'],
});
if (/Vexa’s face/i.test(refusedVexaIllusion))
  failures.push('A refused Vexa connection still creates a romantic illusion');
for (const [flag, expected] of [
  ['c9-vexa-guarded-trust', /patrol map/i],
  ['c9-vexa-adversarial-respect', /Adversarial respect/i],
  ['c9-vexa-permanent-hostility', /armed public truce/i],
]) {
  const state = chapterElevenFixtureState({
    add: [flag],
    remove: [
      'c9-vexa-guarded-trust',
      'c9-vexa-adversarial-respect',
      'c9-vexa-permanent-hostility',
      'c9-refused-private-connection',
      'c9-shared-private-night',
      'c9-vexa-attraction-acknowledged',
    ].filter((candidate) => candidate !== flag),
  });
  if (!expected.test(renderedBody('c11-defining-route', state)))
    failures.push(`Chapter Eleven does not actively render Vexa state ${flag}`);
}

function chapterTwelveFixtureState({
  add = [],
  remove = [],
  relationships,
  stats,
} = {}) {
  const removed = new Set(remove);
  return {
    ...chapterTwelveBase,
    nodeId: 'c12-inner-gate',
    chapterChoices: 0,
    history: [],
    defeat: false,
    stats: { ...chapterTwelveBase.stats, ...stats },
    flags: [
      ...new Set(
        chapterTwelveBase.flags
          .filter((flag) => !removed.has(flag))
          .concat(add),
      ),
    ],
    relationships: relationships ?? chapterTwelveBase.relationships,
  };
}

function walkChapterTwelve(route) {
  let state = route.state;
  let elianRecords = 0;
  for (const choiceId of route.choices) {
    const node = nodes[state.nodeId];
    const choice = node?.choices.find((candidate) => candidate.id === choiceId);
    if (!choice) {
      failures.push(
        `Chapter Twelve ${route.label} cannot find ${choiceId} at ${state.nodeId}`,
      );
      return;
    }
    if (!canChoose(choice, state)) {
      failures.push(
        `Chapter Twelve ${route.label} cannot choose ${choiceId} at ${state.nodeId}`,
      );
      return;
    }
    if (state.nodeId === 'c12-elian-conduit') elianRecords += 1;
    state = applyChoice(state, choice);
    if (Object.values(state.stats).some((value) => value < 0)) {
      failures.push(
        `Chapter Twelve ${route.label} makes a resource negative at ${choiceId}`,
      );
      return;
    }
  }
  if (state.nodeId !== route.ending)
    failures.push(
      `Chapter Twelve ${route.label} ends at ${state.nodeId}, expected ${route.ending}`,
    );
  if (elianRecords !== 1)
    failures.push(
      `Chapter Twelve ${route.label} earns ${elianRecords} bounded Elian records instead of one`,
    );
  for (const flag of route.expectedFlags) {
    if (!state.flags.includes(flag))
      failures.push(`Chapter Twelve ${route.label} drops expected ${flag}`);
  }
  if (!state.flags.includes('c12-series-complete'))
    failures.push(`Chapter Twelve ${route.label} lacks series completion`);
  const finale = caelanFinaleExport(state);
  for (const field of [
    'gate',
    'destination',
    'relationship',
    'devilWorld',
    'storedPromises',
    'fragmentCustody',
    'caelan',
    'sunrise',
    'rookApproach',
    'promises',
  ]) {
    if (!finale[field])
      failures.push(
        `Chapter Twelve ${route.label} leaves finale export ${field} empty`,
      );
  }
  const layers = [
    state.flags.filter((flag) =>
      [
        'c12-gate-sealed',
        'c12-gate-consent-passage',
        'c12-gate-broken',
        'c12-gatekeeper',
      ].includes(flag),
    ).length,
    state.flags.filter((flag) => flag.startsWith('c12-destination-')).length,
    state.flags.filter((flag) =>
      [
        'c12-relationship-together',
        'c12-relationship-distance',
        'c12-relationship-friendship',
        'c12-relationship-closed',
        'c12-relationship-political-truce',
        'c12-relationship-single',
      ].includes(flag),
    ).length,
  ];
  if (layers.some((count) => count !== 1))
    failures.push(
      `Chapter Twelve ${route.label} does not preserve exactly one world, personal, and relationship layer`,
    );
}

const chapterTwelveWalkthroughs = [
  {
    label: 'revolt Futureless bargain seal weak Oathfire',
    state: chapterTwelveFixtureState({
      stats: { health: 2, resolve: 0, command: 0, oathfire: 0, medicine: 0 },
    }),
    ending: 'c12-ending-sealed',
    expectedFlags: [
      'c12-free-ledger-renewal-held',
      'c12-fragment-return-fulfilled',
      'c12-sunrise-barred',
      'rook-luminous-approach-sealed',
    ],
    choices: [
      'c12-open-refuser-witness-circle',
      'c12-shield-inner-wounded',
      'c12-name-malrec-coercion',
      'c12-align-neutral-fragment',
      'c12-record-elian-warning-publicly',
      'c12-hold-free-ledger-renewal',
      'c12-hear-voluntary-victim-map',
      'c12-confirm-no-price-review',
      'c12-record-no-compact-passage',
      'c12-give-limited-defensive-order',
      'c12-move-wounded-through-open-lane',
      'c12-build-law-from-present-consent',
      'c12-choose-sealed-gate',
      'c12-carry-law-to-custody',
      'c12-fulfil-neutral-fragment-return',
      'c12-choose-road-destination',
      'c12-choose-fulfilled-single-life',
      'c12-face-barred-dawn',
    ],
  },
  {
    label: 'auction Pell review and hearing consent passage',
    state: chapterTwelveFixtureState({
      remove: chapterTwelveBase.flags.filter((flag) =>
        /c11-route-|c11-alliance-|c9-roster-/.test(flag),
      ),
      add: [
        'c11-route-auction',
        'c11-alliance-price-court-dissent',
        'c11-price-court-review-owed',
        'c11-freedom-hearing-restricted',
        'c9-roster-pell',
      ],
    }),
    ending: 'c12-ending-consent-passage',
    expectedFlags: [
      'c12-freedom-hearing-returned',
      'c12-price-freedom-returned',
      'c12-fragment-custody-amended',
      'c12-sunrise-mutual-road',
      'rook-luminous-approach-mutual',
    ],
    choices: [
      'c12-enforce-registered-force-delay',
      'c12-split-first-collision',
      'c12-demand-engine-test',
      'c12-align-neutral-fragment',
      'c12-protect-elian-warning-channel',
      'c12-record-no-renewal-debt',
      'c12-complete-hidden-victims-hearing',
      'c12-complete-price-court-review',
      'c12-record-no-compact-passage',
      'c12-give-limited-defensive-order',
      'c12-move-wounded-through-open-lane',
      'c12-build-law-from-present-consent',
      'c12-choose-consent-passage',
      'c12-carry-law-to-custody',
      'c12-amend-neutral-fragment-custody',
      'c12-choose-fortress-destination',
      'c12-choose-enduring-friendship',
      'c12-face-mutual-dawn',
    ],
  },
  {
    label: 'force mixed theft command and door restrictions break',
    state: chapterTwelveFixtureState({
      remove: chapterTwelveBase.flags.filter((flag) =>
        /c11-route-|c11-alliance-|c9-route-|c9-roster-/.test(flag),
      ),
      add: [
        'c11-route-force',
        'c11-alliance-ash-compact-passage',
        'c11-vathis-civic-damage',
        'c11-freedom-command-restricted',
        'c11-freedom-door-order-restricted',
        'c9-route-theft',
        'c9-theft-publicly-named',
        'c9-roster-wardens',
        'c8-sacrificed-first-fort',
        'c5-took-ember-by-force',
        'c9-vexa-permanent-hostility',
      ],
      relationships: {
        ...chapterTwelveBase.relationships,
        vexa: {
          ...chapterTwelveBase.relationships.vexa,
          intent: 'hostile',
          friction: 4,
        },
      },
    }),
    ending: 'c12-ending-broken',
    expectedFlags: [
      'c12-compact-passage-honoured',
      'c12-command-restriction-fulfilled',
      'c12-door-freedom-returned',
      'c12-theft-restitution-submitted',
      'c12-sunrise-unstable-road',
      'rook-luminous-approach-unstable',
    ],
    choices: [
      'c12-set-compact-witness-line',
      'c12-shield-mortal-line',
      'c12-name-malrec-coercion',
      'c12-seat-admitted-stolen-fragment',
      'c12-record-elian-warning-publicly',
      'c12-record-no-renewal-debt',
      'c12-hear-voluntary-victim-map',
      'c12-confirm-no-price-review',
      'c12-honour-one-compact-passage',
      'c12-ask-units-to-hold-within-limits',
      'c12-let-expedition-cross-safe-line-first',
      'c12-build-law-from-present-consent',
      'c12-choose-broken-gate',
      'c12-carry-law-to-custody',
      'c12-submit-stolen-fragment-restitution',
      'c12-choose-road-destination',
      'c12-choose-fulfilled-single-life',
      'c12-face-unstable-dawn',
    ],
  },
  {
    label: 'force Crown exposure gatekeeper with Mara',
    state: chapterTwelveFixtureState({
      remove: chapterTwelveBase.flags.filter((flag) =>
        /c11-route-|c11-alliance-|c9-route-|c9-roster-|c9-no-mortal-partner/.test(
          flag,
        ),
      ),
      add: [
        'c11-route-force',
        'c11-alliance-ash-compact-passage',
        'c9-route-exposure',
        'c9-sableglass-publicly-exposed',
        'c9-roster-crown',
        'c9-mara-crossed-black-gate',
        'c5-vaor-pact',
      ],
      relationships: {
        ...chapterTwelveBase.relationships,
        mara: {
          ...chapterTwelveBase.relationships.mara,
          intent: 'committed',
        },
      },
    }),
    ending: 'c12-ending-gatekeeper',
    expectedFlags: [
      'c12-exposure-joint-custody',
      'c12-caelan-transformed',
      'c12-relationship-mara',
      'c12-sunrise-witnessed-identity',
      'rook-luminous-approach-carried-voices',
    ],
    choices: [
      'c12-set-compact-witness-line',
      'c12-shield-inner-wounded',
      'c12-offer-malrec-witnessed-stop',
      'c12-seat-public-evidence-fragment',
      'c12-test-elian-warning-against-scars',
      'c12-record-no-renewal-debt',
      'c12-hear-voluntary-victim-map',
      'c12-confirm-no-price-review',
      'c12-honour-one-compact-passage',
      'c12-give-limited-defensive-order',
      'c12-move-wounded-through-open-lane',
      'c12-build-law-from-present-consent',
      'c12-choose-mortal-gatekeeper',
      'c12-carry-law-to-custody',
      'c12-place-exposed-fragment-in-joint-custody',
      'c12-choose-threshold-destination',
      'c12-continue-with-mara',
      'c12-face-witnessed-dawn',
    ],
  },
  {
    label: 'older save legacy fragment and missing finale fields',
    state: chapterTwelveFixtureState({
      remove: chapterTwelveBase.flags.filter((flag) =>
        /c11-route-|c11-alliance-|c9-route-|c9-return-promise|c9-roster-/.test(
          flag,
        ),
      ),
      add: ['c9-roster-futureless'],
      stats: { health: 1, resolve: 0, command: 0, oathfire: 0, medicine: 0 },
    }),
    ending: 'c12-ending-consent-passage',
    expectedFlags: [
      'c12-legacy-fragment-public-custody',
      'c12-relationship-single',
    ],
    choices: [
      'c12-build-unallied-contact-line',
      'c12-shield-inner-wounded',
      'c12-demand-engine-test',
      'c12-seat-legacy-fragment-publicly',
      'c12-test-elian-warning-against-scars',
      'c12-record-no-renewal-debt',
      'c12-hear-voluntary-victim-map',
      'c12-confirm-no-price-review',
      'c12-record-no-compact-passage',
      'c12-give-limited-defensive-order',
      'c12-move-wounded-through-open-lane',
      'c12-build-law-from-present-consent',
      'c12-choose-consent-passage',
      'c12-carry-law-to-custody',
      'c12-place-legacy-fragment-in-public-custody',
      'c12-choose-cinder-deep-destination',
      'c12-choose-fulfilled-single-life',
      'c12-face-mutual-dawn',
    ],
  },
];
for (const route of chapterTwelveWalkthroughs) walkChapterTwelve(route);

for (const flag of [
  'c9-destroyed-red-moot-authority-oath',
  'c9-destroyed-crown-restitution-oath',
  'c9-destroyed-clan-refusal-oath',
  'c9-destroyed-honest-command-limit-oath',
  'c9-destroyed-unsea-investigation-oath',
]) {
  const state = chapterTwelveFixtureState({ add: [flag] });
  if (!/destroyed/i.test(renderedBody('c12-oath-hearing', state)))
    failures.push(`Chapter Twelve does not show destroyed Oath ${flag}`);
}

for (const [person, crossingFlag, choiceId] of [
  ['mara', 'c9-mara-remained-at-gate', 'c12-continue-with-mara'],
  ['lysara', 'c9-lysara-crossed-black-gate', 'c12-continue-with-lysara'],
  ['vexa', 'c9-vexa-attraction-acknowledged', 'c12-continue-with-vexa'],
]) {
  const state = chapterTwelveFixtureState({
    add: [crossingFlag],
    relationships: {
      ...chapterTwelveBase.relationships,
      [person]: {
        ...chapterTwelveBase.relationships[person],
        intent: 'committed',
      },
    },
  });
  const choice = nodes['c12-relationship-ending'].choices.find(
    (candidate) => candidate.id === choiceId,
  );
  if (!choice || !isChoiceVisible(choice, state))
    failures.push(`Chapter Twelve hides valid ${person} relationship ending`);
}
const hostileVexaFinale = chapterTwelveFixtureState({
  add: ['c9-vexa-permanent-hostility'],
  relationships: {
    ...chapterTwelveBase.relationships,
    vexa: { ...chapterTwelveBase.relationships.vexa, intent: 'hostile' },
  },
});
const vexaPartnerChoice = nodes['c12-relationship-ending'].choices.find(
  (choice) => choice.id === 'c12-continue-with-vexa',
);
if (vexaPartnerChoice && isChoiceVisible(vexaPartnerChoice, hostileVexaFinale))
  failures.push('Hostile Vexa receives an invalid romantic finale choice');

const sealedInnerMara = chapterTwelveFixtureState({
  add: [
    'c12-gate-sealed',
    'c12-destination-cinder-deep',
    'c9-mara-crossed-black-gate',
  ],
  relationships: {
    ...chapterTwelveBase.relationships,
    mara: {
      ...chapterTwelveBase.relationships.mara,
      intent: 'committed',
    },
  },
});
const genericMaraContinuation = nodes['c12-relationship-ending'].choices.find(
  (choice) => choice.id === 'c12-continue-with-mara',
);
const sealedInnerMaraContinuation = nodes[
  'c12-relationship-ending'
].choices.find((choice) => choice.id === 'c12-continue-with-mara-inside-seal');
if (
  !genericMaraContinuation ||
  isChoiceVisible(genericMaraContinuation, sealedInnerMara) ||
  !sealedInnerMaraContinuation ||
  !isChoiceVisible(sealedInnerMaraContinuation, sealedInnerMara)
)
  failures.push(
    'The sealed relationship ending does not preserve Mara’s physical side',
  );

const sealedOuterLysara = chapterTwelveFixtureState({
  add: [
    'c12-gate-sealed',
    'c12-destination-fortress',
    'c9-lysara-remained-at-gate',
  ],
  relationships: {
    ...chapterTwelveBase.relationships,
    lysara: {
      ...chapterTwelveBase.relationships.lysara,
      intent: 'committed',
    },
  },
});
const sealedOuterLysaraContinuation = nodes[
  'c12-relationship-ending'
].choices.find(
  (choice) => choice.id === 'c12-continue-with-lysara-outside-seal',
);
if (
  !sealedOuterLysaraContinuation ||
  !isChoiceVisible(sealedOuterLysaraContinuation, sealedOuterLysara)
)
  failures.push(
    'The sealed relationship ending does not preserve Lysara’s mortal side',
  );

const gatekeeperDestinationState = chapterTwelveFixtureState({
  add: ['c12-gatekeeper'],
});
const genericDeepDestination = nodes['c12-personal-destination'].choices.find(
  (choice) => choice.id === 'c12-choose-cinder-deep-destination',
);
const keeperInnerRoadDestination = nodes[
  'c12-personal-destination'
].choices.find((choice) => choice.id === 'c12-choose-living-gate-inner-road');
if (
  !genericDeepDestination ||
  isChoiceVisible(genericDeepDestination, gatekeeperDestinationState) ||
  !keeperInnerRoadDestination ||
  !isChoiceVisible(keeperInnerRoadDestination, gatekeeperDestinationState)
)
  failures.push(
    'The Gatekeeper ending does not replace disappearance with the compatible inner boundary road',
  );

const finalLawChoices = nodes['c12-four-laws'].choices;
if (finalLawChoices.length !== 4)
  failures.push(
    `Chapter Twelve offers ${finalLawChoices.length} Gate laws instead of four`,
  );
for (const choice of finalLawChoices) {
  const terms = `${choice.detail} ${choice.advantage}`;
  if (
    !/(cross|passage)/i.test(terms) ||
    !/(refus|withdraw|no person|no central authority)/i.test(terms) ||
    !/(lasts|until|year|permanent|death)/i.test(terms) ||
    !/(stored promise|promises)/i.test(terms) ||
    !/Caelan|your|you /i.test(terms)
  )
    failures.push(`Gate law ${choice.id} hides a required law term`);
  if (choice.requires || choice.requiresFlags)
    failures.push(
      `Gate law ${choice.id} is gated by hidden state or resources`,
    );
}
if (
  finalLawChoices.some((choice) =>
    /relationship|romance|Mara|Lysara|Vexa/i.test(
      `${choice.label} ${choice.detail} ${choice.advantage}`,
    ),
  )
)
  failures.push('A relationship state influences the political Gate choice');
if (!/Caelan’s complete adventure has ended/.test(pageSource))
  failures.push('The Chapter Twelve terminal interface is missing');
if (/Continue to Rook|startRook|nextChapter:\s*['"]rook/i.test(pageSource))
  failures.push('Chapter Twelve creates an unimplemented Rook continuation');

if (
  /multiple equally real Elians|Elian (?:is|was) dead|trapped inside the engine/i.test(
    chapterTwelveSource,
  )
)
  failures.push('Chapter Twelve reveals protected later Elian truth');
if (
  !/c12-inner-gate/.test(pageSource) ||
  !/chapter-twelve\.v1\.start/.test(saveSource)
)
  failures.push('Chapter Twelve start snapshot or canonical entry is missing');

if (
  saveExports.CURRENT_SAVE_KEY !== 'veilfall.saga.v19.save' ||
  !saveExports.LEGACY_SAVE_KEYS.includes('veilfall.saga.v16.save')
)
  failures.push(
    'Chapter Twelve save migration does not accept the prior version',
  );

const visited = new Set();
const reachableNodes = new Set();
const endings = new Set();
const chapterOneEndings = new Set();
const chapterTwoEndings = new Set();
const chapterThreeEndings = new Set();
const chapterFourEndings = new Set();
const chapterFiveEndings = new Set();
const chapterSixEndings = new Set();
const chapterSevenEndings = new Set();
const chapterEightEndings = new Set();
const chapterNineEndings = new Set();
const chapterTenEndings = new Set();
const chapterElevenEndings = new Set();
const chapterTwelveEndings = new Set();
const deathChapters = new Set();
const endingDepths = [];
let exploredChoices = 0;

const maxGraphStates = 500000;
while (stack.length && visited.size < maxGraphStates) {
  const current = stack.pop();
  const state = current.state;
  const knownTerms = Array.from(
    new Set([
      ...current.knownTerms,
      ...(nodes[state.nodeId]?.introduces ?? []),
    ]),
  );
  const knownStoryTerms = Array.from(
    new Set([
      ...current.knownStoryTerms,
      ...(nodes[state.nodeId]?.introducesStoryTerms ?? []),
    ]),
  );
  const key = `${stateKey(state)}|known:${knownTerms
    .slice()
    .sort((a, b) => a.localeCompare(b))
    .join(',')}|story:${knownStoryTerms
    .slice()
    .sort((a, b) => a.localeCompare(b))
    .join(',')}`;
  if (visited.has(key)) continue;
  visited.add(key);

  const node = nodes[state.nodeId];
  if (!node) {
    failures.push(`Reached missing node: ${state.nodeId}`);
    continue;
  }

  reachableNodes.add(node.id);
  if (state.defeat || state.stats.health <= 0) {
    deathChapters.add(state.chapter);
    continue;
  }
  const available = node.choices.filter((choice) => canChoose(choice, state));

  const spokenReplyChoices = node.choices.filter((choice) =>
    isSpokenReplyLabel(choice.label),
  );
  if (spokenReplyChoices.length) {
    const lastParagraph = node.body(state).at(-1) ?? '';
    if (!lastParagraphSupportsReply(lastParagraph)) {
      failures.push(
        `Spoken reply choices in ${node.id} need a spoken line in the last paragraph (${spokenReplyChoices.map((choice) => choice.id).join(', ')})`,
      );
    }
  }

  for (const choice of node.choices) {
    const choiceText = `${choice.label} ${choice.detail}`;
    for (const [term, label] of Object.entries(statLabels)) {
      if (
        new RegExp(`\\b${label}\\b`, 'i').test(choiceText) &&
        !knownTerms.includes(term)
      ) {
        failures.push(
          `Choice ${choice.id} uses ${label} before it is introduced`,
        );
      }
    }
  }

  const activeStoryText = [
    node.kicker,
    node.title,
    node.location,
    sceneObjectiveText(node, state),
    node.lesson?.title,
    node.lesson?.body,
    ...node.body(state),
    ...knownTruths(state),
    ...majorConsequences(state),
    ...node.choices.flatMap((choice) => [
      choice.label,
      choice.detail,
      choice.advantage ?? '',
      choice.result,
    ]),
  ]
    .filter(Boolean)
    .join(' ');
  for (const [term, rule] of Object.entries(storyTermRules)) {
    if (rule.use.test(activeStoryText) && !knownStoryTerms.includes(term)) {
      failures.push(
        `Node ${node.id} uses ${term} before it is introduced on this route`,
      );
    }
  }

  if (node.final) {
    endings.add(node.id);
    if (node.id.startsWith('c12-')) chapterTwelveEndings.add(node.id);
    else if (node.id.startsWith('c11-')) chapterElevenEndings.add(node.id);
    else if (node.id.startsWith('c10-')) chapterTenEndings.add(node.id);
    else if (node.id.startsWith('c9-')) chapterNineEndings.add(node.id);
    else if (node.id.startsWith('c8-')) chapterEightEndings.add(node.id);
    else if (node.id.startsWith('c7-')) chapterSevenEndings.add(node.id);
    else if (node.id.startsWith('c6-')) chapterSixEndings.add(node.id);
    else if (node.id.startsWith('c5-')) chapterFiveEndings.add(node.id);
    else if (node.id.startsWith('c4-')) chapterFourEndings.add(node.id);
    else if (node.id.startsWith('c3-')) chapterThreeEndings.add(node.id);
    else if (node.id.startsWith('c2-')) chapterTwoEndings.add(node.id);
    else chapterOneEndings.add(node.id);
    endingDepths.push(state.history.length);
    const expectedChapterChoices = node.id.startsWith('c12-')
      ? 18
      : node.id.startsWith('c11-')
        ? 17
        : /^(?:c8|c9|c10)-/.test(node.id)
          ? 16
          : 15;
    if (state.chapterChoices !== expectedChapterChoices) {
      failures.push(
        `${node.id} reached after ${state.chapterChoices} decisions instead of ${expectedChapterChoices}`,
      );
    }
    if (node.id.startsWith('c8-')) {
      const selectedDeployments = deploymentFlags.filter((flag) =>
        state.flags.includes(flag),
      );
      if (selectedDeployments.length !== 1) {
        failures.push(
          `${node.id} reached with ${selectedDeployments.length} explicit deployment plans`,
        );
      }
    }
    if (node.choices.length)
      failures.push(`Final node has choices: ${node.id}`);
    continue;
  }

  if (!available.length) {
    failures.push(`Reachable state has no available choice: ${node.id}`);
    continue;
  }

  for (const choice of available) {
    exploredChoices += 1;
    const next = applyChoice(state, choice);
    if (!nodes[next.nodeId]) {
      failures.push(`Choice ${choice.id} reaches missing node: ${next.nodeId}`);
      continue;
    }
    stack.push({ state: next, knownTerms, knownStoryTerms });
  }
}

for (const id of nodeIds) {
  if (!reachableNodes.has(id)) failures.push(`Unreachable node: ${id}`);
}

if (visited.size >= maxGraphStates)
  failures.push('State exploration exceeded its safety limit');
if (!endings.size) failures.push('No ending is reachable');
if (chapterOneEndings.size !== 3)
  failures.push(
    `Expected 3 Chapter One endings, found ${chapterOneEndings.size}`,
  );
if (chapterTwoEndings.size !== 3)
  failures.push(
    `Expected 3 Chapter Two endings, found ${chapterTwoEndings.size}`,
  );
if (chapterThreeEndings.size !== 3)
  failures.push(
    `Expected 3 Chapter Three endings, found ${chapterThreeEndings.size}`,
  );
if (chapterFourEndings.size !== 3)
  failures.push(
    `Expected 3 Chapter Four endings, found ${chapterFourEndings.size}`,
  );
if (chapterFiveEndings.size !== 3)
  failures.push(
    `Expected 3 Chapter Five endings, found ${chapterFiveEndings.size}`,
  );
if (chapterSixEndings.size !== 3)
  failures.push(
    `Expected 3 Chapter Six endings, found ${chapterSixEndings.size}`,
  );
if (chapterSevenEndings.size !== 3)
  failures.push(
    `Expected 3 Chapter Seven endings, found ${chapterSevenEndings.size}`,
  );
if (chapterEightEndings.size !== 3)
  failures.push(
    `Expected 3 Chapter Eight endings, found ${chapterEightEndings.size}`,
  );
if (chapterNineEndings.size !== 3)
  failures.push(
    `Expected 3 Chapter Nine endings, found ${chapterNineEndings.size}`,
  );
if (chapterTenEndings.size !== 3)
  failures.push(
    `Expected 3 Chapter Ten endings, found ${chapterTenEndings.size}`,
  );
if (chapterElevenEndings.size !== 3)
  failures.push(
    `Expected 3 Chapter Eleven endings, found ${chapterElevenEndings.size}`,
  );
if (chapterTwelveEndings.size !== 4)
  failures.push(
    `Expected 4 Chapter Twelve endings, found ${chapterTwelveEndings.size}`,
  );
for (const chapter of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
  if (!deathChapters.has(chapter))
    failures.push(`Chapter ${chapter} has no reachable lethal choice`);
}


function countWords(text) {
  return (text.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g) ?? []).length;
}
const openingWords = countWords(nodes['gate-yard'].body(initialState).join(' '));
const lessonWords = countWords(nodes['gate-yard'].lesson?.body ?? '');
if (openingWords > 140)
  failures.push(`gate-yard body has ${openingWords} words; maximum is 140`);
if (lessonWords > 45)
  failures.push(`gate-yard lesson has ${lessonWords} words; maximum is 45`);
if (!/Health reaches zero|reaches zero, Caelan dies/i.test(nodes['gate-yard'].lesson?.body ?? ''))
  failures.push('gate-yard lesson no longer states that Health reaching zero kills Caelan');
if (!pageSource.includes('Chapter ${chapterDefinitions[game.chapter - 1].roman} of XII'))
  failures.push('Honest chapter progress label is missing');
if (/Caelan \{currentChapter\.roman\} of/.test(pageSource))
  failures.push('Top bar still uses the player name as a chapter progress label');
if (!pageSource.includes('className="medicine-stock"'))
  failures.push('Medicine stock is not shown beside medicine-spending menus');
if (!pageSource.includes('className="mobile-status-strip"'))
  failures.push('Mobile resource strip is missing');

const noDebtIds = AUTOMATIC_ACKNOWLEDGMENT_IDS;
for (const id of noDebtIds) {
  const node = Object.values(nodes).find((item) =>
    item.choices.some((choice) => choice.id === id),
  );
  const choice = node.choices.find((item) => item.id === id);
  const changes = Object.values(choice.changes ?? {}).some((value) => (value ?? 0) !== 0);
  const flags = (choice.addFlags ?? []).length > 0;
  if (changes || flags)
    failures.push(`${id} is no longer a zero-effect acknowledgment`);
}
const absentDutyState = {
  ...initialState,
  chapter: 12,
  nodeId: 'c12-renewal-hearing',
  flags: [],
};
const manualNoDebt = applyChoice(
  absentDutyState,
  nodes['c12-renewal-hearing'].choices.find(
    (choice) => choice.id === 'c12-record-no-renewal-debt',
  ),
);
const drainedNoDebt = drainAutomaticAcknowledgments(absentDutyState);
if (!statesEquivalent(manualNoDebt, drainedNoDebt))
  failures.push('Automatic no-renewal acknowledgment diverges from the manual transition');
if (applyPlayerChoice(absentDutyState, nodes['c12-renewal-hearing'].choices.find((choice) => choice.id === 'c12-record-no-renewal-debt')).nodeId === 'c12-renewal-hearing')
  failures.push('Player choice drain left a no-debt acknowledgment unapplied');

const owedRenewal = {
  ...absentDutyState,
  flags: ['c11-alliance-free-ledger-refusers'],
};
if (drainAutomaticAcknowledgments(owedRenewal).nodeId !== 'c12-renewal-hearing')
  failures.push('Owed Free Ledger hearing was auto-advanced');

const lowHealth = {
  ...initialState,
  stats: { ...initialState.stats, health: 2 },
  nodeId: 'gate-yard',
};
const fatalChoice = {
  ...nodes['gate-yard'].choices.find((choice) => choice.id === 'check-horses'),
  changes: { health: -2 },
};
if (!wouldBeFatal(fatalChoice, lowHealth))
  failures.push('Health 2 / cost 2 is not treated as fatal');
const dead = applyChoice(lowHealth, fatalChoice);
if (!dead.defeat || dead.stats.health !== 0)
  failures.push('Fatal Health 2 / cost 2 did not produce a death state');
const restored = cloneGameState(lowHealth);
if (!statesEquivalent(restored, lowHealth))
  failures.push('Retry snapshot clone is not byte-equivalent to the pre-death state');
if ((restored.stats.health ?? 0) !== 2)
  failures.push('Retry restoration changed Health');

const mismatchedRetry = saveExports.validateStoredSave(
  saveExports.createStoredSave(
    dead,
    {},
    'default',
    {
      before: initialState,
      choiceId: 'check-horses',
      healthBefore: 8,
      healthCost: -2,
    },
    {
      choiceId: 'check-horses',
      label: 'Check the horses and harness yourself.',
      healthBefore: 2,
      healthCost: -2,
    },
  ),
);
if (!mismatchedRetry.ok)
  failures.push(`Valid dead save with mismatched retry was rejected: ${mismatchedRetry.error}`);
else if (mismatchedRetry.document.retry)
  failures.push('Mismatched retry snapshot was kept for recovery');
else if (!mismatchedRetry.warnings.some((warning) => /retry/i.test(warning)))
  failures.push('Discarded retry snapshot produced no warning');

const liveFatalBefore = {
  ...initialState,
  stats: { ...initialState.stats, health: 2 },
  nodeId: 'low-road',
};
const liveFatalChoice = nodes['low-road'].choices.find(
  (choice) => choice.id === 'rescue-family',
);
if (!liveFatalChoice)
  failures.push('rescue-family is missing from the drowned mile');
const liveDead = applyChoice(liveFatalBefore, liveFatalChoice);
const liveRetry = captureFatalRetry(liveFatalBefore, liveFatalChoice);
const liveCause = captureDeathCause(liveFatalBefore, liveFatalChoice);
if (liveRetry.healthCost !== 2)
  failures.push('Live retry metadata did not store Health cost as a magnitude');
if (
  !/Health cost: -2/.test(
    deathCauseText({
      actionLabel: liveCause.label,
      healthBefore: liveCause.healthBefore,
      healthCost: liveCause.healthCost,
    }),
  )
)
  failures.push('Death cause text did not keep a negative Health-cost display');
const liveDocument = saveExports.createStoredSave(
  liveDead,
  {},
  'default',
  liveRetry,
  liveCause,
);
const liveReloaded = saveExports.validateStoredSave(
  JSON.parse(JSON.stringify(liveDocument)),
);
if (!liveReloaded.ok)
  failures.push(`Live-format dead save failed reload: ${liveReloaded.error}`);
else if (!liveReloaded.document.retry)
  failures.push('Live-format dead save discarded retry availability');
else if (liveReloaded.document.retry.healthCost !== 2)
  failures.push('Loaded retry did not keep the live Health-cost magnitude');
else if (liveReloaded.document.deathCause?.healthCost !== 2)
  failures.push('Loaded death cause lost the numerical Health cost');
else if (liveReloaded.document.retry.before.stats.health !== 2)
  failures.push('Loaded retry snapshot is not the pre-death Health');
else if (
  !/Health cost: -2/.test(
    deathCauseText({
      actionLabel: liveReloaded.document.deathCause.label,
      healthBefore: liveReloaded.document.deathCause.healthBefore,
      healthCost: liveReloaded.document.deathCause.healthCost,
    }),
  )
)
  failures.push('Reloaded death cause lost the signed Health-cost display');
const signedCostDocument = saveExports.createStoredSave(
  liveDead,
  {},
  'default',
  { ...liveRetry, healthCost: -2 },
  { ...liveCause, healthCost: -2 },
);
const signedCostLoaded = saveExports.validateStoredSave(signedCostDocument);
if (!signedCostLoaded.ok || !signedCostLoaded.document.retry)
  failures.push('Negative Health-cost retry metadata was rejected');
else if (signedCostLoaded.document.retry.healthCost !== 2)
  failures.push('Accepted negative Health-cost retry was not normalised');
const livePortable = saveExports.createPortableSave(
  liveReloaded.document ?? liveDocument,
);
const liveImported = saveExports.parsePortableSave(JSON.stringify(livePortable));
if (!liveImported.ok)
  failures.push(`Live-format portable dead save failed import: ${liveImported.error}`);
else if (!liveImported.document.retry)
  failures.push('Portable dead-save import dropped retry availability');
else if (liveImported.document.deathCause?.healthCost !== 2)
  failures.push('Portable dead-save import dropped numerical death cause');
const restoredLive = cloneGameState(
  liveReloaded.document?.retry.before ?? liveFatalBefore,
);
const secondDeath = applyChoice(restoredLive, liveFatalChoice);
const secondRetry = captureFatalRetry(restoredLive, liveFatalChoice);
if (secondDeath.flags.length !== liveDead.flags.length)
  failures.push('Repeat fatal retry accumulated flags');
if (secondRetry.healthBefore !== 2 || secondRetry.healthCost !== 2)
  failures.push('Repeat fatal retry did not recapture the same Health values');

const horsesBefore = {
  ...initialState,
  stats: { ...initialState.stats, health: 1 },
};
const horsesChoice = nodes['gate-yard'].choices.find(
  (choice) => choice.id === 'check-horses',
);
const horsesDead = applyChoice(horsesBefore, horsesChoice);
const horsesLoaded = saveExports.validateStoredSave(
  saveExports.createStoredSave(
    horsesDead,
    {},
    'default',
    captureFatalRetry(horsesBefore, horsesChoice),
    captureDeathCause(horsesBefore, horsesChoice),
  ),
);
if (!horsesLoaded.ok || horsesLoaded.document.retry?.healthCost !== 1)
  failures.push('Authored Health 1 / cost 1 retry did not round-trip');

const handoffLow = chapterRecoveryDisplay(
  { ...initialState, stats: { ...initialState.stats, health: 1, resolve: 1, command: 0, medicine: 0, oathfire: 0 } },
  2,
);
if (!handoffLow.deltas.includes('Health +2') || !handoffLow.deltas.includes('Resolve +1'))
  failures.push(`Chapter II recovery display is wrong at low values: ${handoffLow.deltas.join(', ')}`);
const handoffCapped = chapterRecoveryDisplay(
  { ...initialState, stats: { ...initialState.stats, health: 8, resolve: 8, command: 6, medicine: 2, oathfire: 3 } },
  2,
);
if (handoffCapped.deltas.some((delta) => /Health|Resolve/.test(delta) && !/ 0/.test(delta) && /\+/.test(delta) && !handoffCapped.next.stats))
  failures.push('Chapter II recovery display invented a capped gain');
if (handoffCapped.next.stats.health !== 8)
  failures.push('Chapter II handoff did not keep the Health cap');
if (handoffCapped.deltas.includes('Health +2'))
  failures.push('Chapter II recovery advertised a Health gain the cap prevented');
if (handoffCapped.next.stats.medicine !== 1)
  failures.push('Chapter II medicine reset is missing from recovery');
if (!handoffCapped.deltas.includes('Medicine -1'))
  failures.push('Chapter II recovery hid the actual Medicine cap change');

const lawReview = story.load('app/gate-law-review.ts');
const requiredLawGroups = [
  'Crossing',
  'Stored promises',
  'Allies and ordinary people',
  'Caelan’s price',
  'Duration and replacement',
  'Sunrise',
];
const requiredLawTerms = {
  'c12-choose-sealed-gate': [
    /final free choice of side/i,
    /cannot be spent/i,
    /stranded/i,
    /loses the right to cross/i,
    /delegates of both realms/i,
    /barred dawn/i,
  ],
  'c12-choose-consent-passage': [
    /named willing traveller/i,
    /withdraw before crossing/i,
    /original living owners/i,
    /allies need permission/i,
    /one year of public service/i,
    /yearly renewal/i,
    /witnessed narrow dawn/i,
  ],
  'c12-choose-broken-gate': [
    /no central Gate owner/i,
    /living makers or Worldroot/i,
    /weaker defence suffers more/i,
    /invading armies can cross/i,
    /loses central control of invasion/i,
    /unstable dawn/i,
  ],
  'c12-choose-mortal-gatekeeper': [
    /publicly witnessed identity/i,
    /cannot spend, erase, or silence/i,
    /every traveller may refuse/i,
    /cannot live wholly in either realm/i,
    /death or a freely accepted replacement/i,
    /light bends around witnessed identity/i,
  ],
};
for (const [id, patterns] of Object.entries(requiredLawTerms)) {
  const review = lawReview.GATE_LAW_REVIEWS[id];
  if (!review) {
    failures.push(`Gate-law review missing for ${id}`);
    continue;
  }
  const labels = review.groups.map((group) => group.label);
  if (requiredLawGroups.some((label) => !labels.includes(label)))
    failures.push(`${id} review is missing a required term group`);
  const text = review.groups.map((group) => group.body).join(' ');
  for (const pattern of patterns) {
    if (!pattern.test(text))
      failures.push(`${id} review omits required term ${pattern}`);
  }
}
if (!pageSource.includes('confirmLawChoice') || !pageSource.includes('cancelLawChoice'))
  failures.push('Gate-law review confirm/cancel handlers are missing');
if (!pageSource.includes('Swear this law') || !/Back/.test(pageSource))
  failures.push('Gate-law review confirm/cancel labels are missing');

const destroyedJournal = promiseRecords.activePromises({
  ...initialState,
  chapter: 12,
  flags: ['c6-oath-crown-restitution', 'c9-destroyed-crown-restitution-oath'],
});
if (destroyedJournal.some((entry) => /hidden victims/.test(entry)))
  failures.push('Destroyed Crown restitution oath remains a current journal duty');

const pellActive = promiseRecords.derivePromiseRecords({
  ...initialState,
  chapter: 8,
  flags: ['c8-oath-pell-sees-opening-contained'],
});
if (
  !pellActive.some(
    (entry) =>
      entry.id === 'c8-oath-pell-sees-opening-contained' &&
      entry.current &&
      entry.status === 'sworn',
  )
)
  failures.push('Pell’s vow is missing while it is still binding');
const pellFulfilled = promiseRecords.promiseRecordById(
  {
    ...initialState,
    chapter: 8,
    flags: [
      'c8-oath-pell-sees-opening-contained',
      'c8-severed-collector-hand',
    ],
  },
  'c8-oath-pell-sees-opening-contained',
);
if (!pellFulfilled || pellFulfilled.current || pellFulfilled.status !== 'fulfilled')
  failures.push('Pell’s vow is not fulfilled after the collector is driven back');
const pellFinale = memoryExports.majorConsequences({
  ...initialState,
  chapter: 8,
  flags: [
    'c8-oath-pell-sees-opening-contained',
    'c8-severed-collector-hand',
  ],
});
if (!pellFinale.some((line) => /Oath returned/i.test(line)))
  failures.push('Journal consequences do not use the shared Pell fulfillment');
const pellExport = memoryExports.caelanFinaleExport({
  ...initialState,
  chapter: 8,
  flags: [
    'c8-oath-pell-sees-opening-contained',
    'c8-severed-collector-hand',
  ],
});
if (
  !pellExport.promises?.some(
    (entry) =>
      entry.id === 'c8-oath-pell-sees-opening-contained' &&
      entry.status === 'fulfilled',
  )
)
  failures.push('Finale export does not share the fulfilled Pell vow');
if (
  !/Pell’s Oath that he would see the invasion stopped is fulfilled/.test(
    promiseRecords.finalePromiseNotes({
      ...initialState,
      chapter: 8,
      flags: [
        'c8-oath-pell-sees-opening-contained',
        'c8-severed-collector-hand',
      ],
    }),
  )
)
  failures.push('Finale notes do not share the fulfilled Pell vow');

const homecomingRenewal = promiseRecords.derivePromiseRecords({
  ...initialState,
  chapter: 11,
  flags: ['oath-bring-them-home', 'c11-shelter-all-crossed-dry'],
});
if (
  !homecomingRenewal.some(
    (entry) =>
      entry.id === 'oath-bring-them-home' &&
      entry.current &&
      /renewed/i.test(entry.promise),
  )
)
  failures.push('Chapter XI homecoming renewal is not labeled as renewed');
if (
  !homecomingRenewal.some(
    (entry) =>
      entry.id === 'c11-homecoming-rain-renewal' &&
      !entry.current &&
      entry.status === 'fulfilled',
  )
)
  failures.push('Chapter XI rain renewal is not recorded as fulfilled');
if (
  !/Bring Them Home was renewed for the owned-rain crossing/.test(
    promiseRecords.finalePromiseNotes({
      ...initialState,
      chapter: 11,
      flags: ['oath-bring-them-home', 'c11-shelter-all-crossed-dry'],
    }),
  )
)
  failures.push('Finale notes do not share the Chapter XI rain renewal');

const unrestrictedCommandState = {
  ...initialState,
  chapter: 12,
  flags: [],
};
const unrestrictedCommand = [
  sceneObjectiveText(nodes['c12-command-restriction'], unrestrictedCommandState),
  ...nodes['c12-command-restriction'].body(unrestrictedCommandState),
].join(' ');
if (
  /Obey or breach/i.test(unrestrictedCommand) ||
  /violate the named limit/i.test(unrestrictedCommand)
)
  failures.push(
    'Unrestricted command route still describes breaching a named limit',
  );
const restrictedCommandState = {
  ...initialState,
  chapter: 12,
  flags: ['c11-freedom-command-restricted'],
};
const restrictedCommand = [
  sceneObjectiveText(nodes['c12-command-restriction'], restrictedCommandState),
  ...nodes['c12-command-restriction'].body(restrictedCommandState),
].join(' ');
if (
  !/Obey or breach the exact mythic command restriction/.test(
    restrictedCommand,
  ) ||
  !/violate the named limit/i.test(restrictedCommand)
)
  failures.push('Restricted command route lost its authored breach warning');
const unrestrictedDoorState = {
  ...initialState,
  chapter: 12,
  flags: [],
};
const unrestrictedDoor = [
  sceneObjectiveText(nodes['c12-door-order'], unrestrictedDoorState),
  ...nodes['c12-door-order'].body(unrestrictedDoorState),
].join(' ');
if (
  /still binds you/.test(unrestrictedDoor) ||
  /Obey or breach/i.test(unrestrictedDoor) ||
  /violate the named limit/i.test(unrestrictedDoor)
)
  failures.push(
    'Unrestricted door-order route still treats an absent restriction as present',
  );
const restrictedDoorState = {
  ...initialState,
  chapter: 12,
  flags: ['c11-freedom-door-order-restricted'],
};
if (
  !/while it still binds you/.test(
    sceneObjectiveText(nodes['c12-door-order'], restrictedDoorState),
  )
)
  failures.push('Restricted door-order objective lost its binding warning');

if (!pageSource.includes('reviewRequired: true'))
  failures.push('choose_veilfall_action can still commit a Gate law without review');
if (!pageSource.includes('chooseRef.current(choice)'))
  failures.push('choose_veilfall_action does not share the visible choice path');
if (!pageSource.includes('captureFatalRetry'))
  failures.push('Live fatal retry is not captured from the shared producer');

if (!pageSource.includes('c12-inner-gate') && !story.sources.get('app/game-transition.ts').includes('c12-inner-gate'))
  failures.push('Chapter Twelve canonical entry is missing from the transition implementation');


if (failures.length) {
  console.error('Game graph check failed:');
  for (const failure of new Set(failures)) console.error(`  ${failure}`);
  process.exit(1);
}

if (process.argv.includes('--print-chapter-three-routes')) {
  const routePrints = chapterThreeInvestigationFixtures.map((fixture) => ({
    route: fixture.name,
    lanternBridge: nodes['c3-bill'].body({
      ...chapterThreeBase,
      flags: fixture.flags,
    }),
  }));
  const endingPrints = chapterThreeHandoffFixtures.map((fixture) => ({
    ending: fixture.endingId,
    chapterThree: nodes[fixture.endingId].body({
      ...chapterThreeBase,
      flags: fixture.flags,
    }),
    chapterFourOpening: nodes['c4-bridge-start'].body({
      ...chapterFourBase,
      flags: fixture.flags,
    }),
  }));
  console.log(JSON.stringify({ routePrints, endingPrints }, null, 2));
}

if (process.argv.includes('--print-chapter-four-routes')) {
  const environmentPrints = [
    { name: 'snow', flags: ['c4-snow-route', 'c4-broke-snow-line'] },
    { name: 'storm', flags: ['c4-storm-route', 'c4-storm-rope-held'] },
    { name: 'brass', flags: ['c4-brass-route', 'c4-jammed-gears'] },
  ].map((fixture) => ({
    route: fixture.name,
    crossing: nodes[`c4-${fixture.name}-span`].body({
      ...chapterFourBase,
      flags: fixture.flags,
    }),
    laterPayoff: nodes['c4-stage-turn'].body({
      ...chapterFourBase,
      flags: fixture.flags,
    }),
  }));
  const ordanPrints = [
    {
      name: 'rescued personally',
      flags: ['c4-captured-ordan', 'c4-ordan-owes-life'],
    },
    {
      name: 'rescued by guards',
      flags: ['c4-captured-ordan', 'c4-ordan-secured-by-guards'],
    },
    { name: 'sent to lower road', flags: ['c4-ordan-lower-road'] },
  ].map((fixture) => ({
    outcome: fixture.name,
    crownFight: nodes['c4-soldiers'].body({
      ...chapterFourBase,
      flags: fixture.flags,
    }),
    endingTransfer: nodes['c4-ending-arrest'].body({
      ...chapterFourBase,
      flags: fixture.flags,
    }),
  }));
  const relationshipPrints = [
    'unresolved',
    'exploring',
    'committed',
    'platonic',
    'ended',
  ].map((intent) => {
    const state = {
      ...chapterFourBase,
      relationships: {
        ...chapterFourBase.relationships,
        mara: { trust: 9, attraction: 9, respect: 9, friction: 0, intent },
        lysara: { trust: 9, attraction: 9, respect: 9, friction: 0, intent },
      },
    };
    return {
      intent,
      body: nodes['c4-mara'].body(state),
      visibleChoices: nodes['c4-mara'].choices
        .filter((choice) => isChoiceVisible(choice, state))
        .map((choice) => choice.id),
    };
  });
  const endingPrints = [
    ['c4-ending-arrest', 'c4-rook-arrested'],
    ['c4-ending-bargain', 'c4-rook-bargain'],
    ['c4-ending-trust', 'c4-rook-trusted'],
  ].map(([endingId, flag]) => ({
    ending: endingId,
    chapterFour: nodes[endingId].body({
      ...chapterFourBase,
      flags: [flag, 'c4-captured-ordan', 'c4-denied-rook-copy'],
    }),
    chapterFive: nodes['c5-north-road'].body({
      ...chapterFiveBase,
      flags: [flag, 'c4-captured-ordan', 'c4-denied-rook-copy'],
    }),
  }));
  console.log(
    JSON.stringify(
      { environmentPrints, ordanPrints, relationshipPrints, endingPrints },
      null,
      2,
    ),
  );
}

if (process.argv.includes('--print-chapter-six-routes')) {
  const dutyPrints = [
    ['herd', 'c6-herd-duty', ['c6-herd-route', 'c6-whole-herd-saved']],
    [
      'forge',
      'c6-forge-duty',
      ['c6-forge-route', 'c6-forge-service-complete', 'c6-forge-families-safe'],
    ],
    [
      'shrine',
      'c6-shrine-duty',
      [
        'c6-shrine-route',
        'c6-shrine-service-complete',
        'c6-children-chose-living',
      ],
    ],
  ].map(([name, nodeId, flags]) => ({
    duty: name,
    scene: nodes[nodeId].body({ ...chapterSixBase, flags }),
    mootRecord: nodes['c6-final-alliance'].body({
      ...chapterSixBase,
      flags: [
        ...(Array.isArray(flags) ? flags : []),
        'c6-korran-respect',
        'c6-declared-ember-origin',
        'c6-sender-heard-living-leaders',
      ],
    }),
  }));
  const disclosurePrints = Object.entries(delayedDisclosureByVaor).map(
    ([vaorFlag, choiceIds]) => ({
      vaorOutcome: vaorFlag,
      terms: nodes['c6-korran-terms'].body({
        ...chapterSixBase,
        flags: [vaorFlag, 'c6-ember-disclosure-pending'],
      }),
      visibleChoices: choiceIds.filter((choiceId) =>
        isChoiceVisible(
          nodes['c6-korran-terms'].choices.find(
            (choice) => choice.id === choiceId,
          ),
          {
            ...chapterSixBase,
            flags: [vaorFlag, 'c6-ember-disclosure-pending'],
          },
        ),
      ),
    }),
  );
  const endingPrints = Object.entries(chapterSixEndingFlags).map(
    ([endingId, flag]) => ({
      ending: endingId,
      chapterSix: nodes[endingId].body({
        ...chapterSixBase,
        flags: [
          flag,
          'c6-ilyra-professional-alliance',
          'c6-sender-heard-living-leaders',
        ],
      }),
      chapterSevenOpening: nodes['c7-red-horizon'].body({
        ...chapterSevenBase,
        flags: [
          flag,
          'c6-ilyra-professional-alliance',
          'c6-sender-heard-living-leaders',
          'c5-vaor-pact',
        ],
      }),
    }),
  );
  const oathPrints = chapterSixContinuityContract.exactOaths.map((flag) => ({
    oath: flag,
    chapterSeven: nodes['c7-red-horizon'].body({
      ...chapterSevenBase,
      flags: ['c6-red-moot-alliance', 'c5-vaor-pact', flag],
    }),
    chapterEight: nodes['c8-oath-ledger'].body({
      ...chapterEightBase,
      flags: ['c6-red-moot-alliance', 'c5-vaor-pact', flag],
    }),
  }));
  console.log(
    JSON.stringify(
      { dutyPrints, disclosurePrints, endingPrints, oathPrints },
      null,
      2,
    ),
  );
}

if (process.argv.includes('--print-chapter-seven-routes')) {
  const lioPrints = Object.entries(orderExposureStates).map(
    ([status, state]) => ({
      status,
      orderCase: nodes['c7-captured-soldier'].body(state),
      exposureChoices: nodes['c7-order-exposure'].choices
        .filter((choice) => isChoiceVisible(choice, state))
        .map((choice) => choice.id),
    }),
  );
  const planPrints = [
    ['salt', 'c7-salt-trap', ['c7-safe-salt-lanes-marked']],
    [
      'orders',
      'c7-order-exposure',
      [
        'c7-orders-on-banners',
        'c7-lio-returned',
        'c7-lio-spreads-orders-inside-army',
      ],
    ],
    ['duel', 'c7-steppe-duel', ['c7-teren-saw-gate-order']],
  ].map(([plan, nodeId, flags]) => ({
    plan,
    scene: nodes[nodeId].body({ ...chapterSevenBase, flags }),
    visibleChoices: nodes[nodeId].choices
      .filter((choice) =>
        isChoiceVisible(choice, { ...chapterSevenBase, flags }),
      )
      .map((choice) => choice.id),
  }));
  const endingPrints = Object.entries(chapterSevenEndingFlags).map(
    ([endingId, flag]) => ({
      ending: endingId,
      chapterSeven: nodes[endingId].body({
        ...chapterSevenBase,
        flags: [
          flag,
          'c7-original-orders-safe',
          'c7-lio-returned',
          'c7-saved-many-with-southern-escort',
          'c7-lost-fast-horses',
        ],
      }),
      chapterEight: nodes['c8-gate-ring'].body({
        ...chapterEightBase,
        flags: [
          flag,
          'c7-original-orders-safe',
          'c7-lio-returned',
          'c7-saved-many-with-southern-escort',
          'c7-lost-fast-horses',
        ],
      }),
    }),
  );
  const senderPrints = hiddenSenderHandoffs.map(
    ([exposureFlag, chapterEightChoiceId]) => ({
      exposureFlag,
      chapterEightChoiceId,
      arrival: nodes['c8-gate-ring'].body({
        ...chapterEightBase,
        flags: [exposureFlag],
      }),
    }),
  );
  console.log(
    JSON.stringify(
      { lioPrints, planPrints, endingPrints, senderPrints },
      null,
      2,
    ),
  );
}

if (process.argv.includes('--print-chapter-eight-routes')) {
  const routePrints = chapterEightWalkthroughs.map((walkthrough) => ({
    route: walkthrough.name,
    choices: walkthrough.choiceIds,
    visitedNodes: walkthrough.visitedNodes,
    ending: walkthrough.state.nodeId,
    deployment: deploymentFlags.find((flag) =>
      walkthrough.state.flags.includes(flag),
    ),
    finalEvidence: nodes[walkthrough.state.nodeId]
      .body(walkthrough.state)
      .find((paragraph) =>
        /Gate ledgers|living bark|Crown paper|opening dates/i.test(paragraph),
      ),
  }));
  console.log(JSON.stringify({ routePrints }, null, 2));
}

if (process.argv.includes('--print-chapter-nine-routes')) {
  const routePrints = chapterNineWalkthroughs.map((walkthrough) => ({
    route: walkthrough.name,
    choices: walkthrough.choiceIds,
    visitedNodes: walkthrough.visitedNodes,
    ending: walkthrough.state.nodeId,
    recovery: walkthrough.state.flags.find((flag) =>
      [
        'c9-fragment-recovered-by-bargain',
        'c9-fragment-recovered-by-theft',
        'c9-fragment-recovered-by-exposure',
      ].includes(flag),
    ),
    defence: walkthrough.state.flags.find((flag) =>
      [
        'c8-united-wardens',
        'c8-accepted-ash-compact',
        'c8-sacrificed-first-fort',
      ].includes(flag),
    ),
    oathPrice: walkthrough.state.flags.find((flag) =>
      oathPriceFlagsForAudit.includes(flag),
    ),
    vexaRelationship: relationshipSummary(walkthrough.state.relationships.vexa),
    roster: walkthrough.state.flags.filter((flag) =>
      flag.startsWith('c9-roster-'),
    ),
    malrecAllianceProved: walkthrough.state.flags.includes(
      'c9-malrec-cinder-alliance-proved',
    ),
  }));
  console.log(JSON.stringify({ routePrints }, null, 2));
}

const shortest = Math.min(...endingDepths);
const longest = Math.max(...endingDepths);
console.log(
  `Game graph check passed: ${reachableNodes.size} nodes, ${chapterOneEndings.size} Chapter One endings, ${chapterTwoEndings.size} Chapter Two endings, ${chapterThreeEndings.size} Chapter Three endings, ${chapterFourEndings.size} Chapter Four endings, ${chapterFiveEndings.size} Chapter Five endings, ${chapterSixEndings.size} Chapter Six endings, ${chapterSevenEndings.size} Chapter Seven endings, ${chapterEightEndings.size} Chapter Eight endings, ${chapterNineEndings.size} Chapter Nine endings, ${chapterTenEndings.size} Chapter Ten endings, ${chapterElevenEndings.size} Chapter Eleven endings, ${chapterTwelveEndings.size} Chapter Twelve endings, lethal routes in ${deathChapters.size} chapters, ${exploredChoices} reachable choices, ${shortest} to ${longest} decisions per chapter route.`,
);
