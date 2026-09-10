import { access, readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import {
  documentedSeriesRoutes,
  firstMeetingContracts,
  implementedChapterContracts,
  playableHeroes,
  protectedPlotTransitions,
} from './continuity-contract.mjs';

const compilerOptions = {
  module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.ES2022,
};

const adventureSource = await readFile('app/adventure-revision.ts', 'utf8');
const adventureCompiled = ts.transpileModule(adventureSource, {
  compilerOptions,
}).outputText;
const adventureExports = {};
vm.runInNewContext(adventureCompiled, {
  exports: adventureExports,
  module: { exports: adventureExports },
  console,
}, { filename: 'adventure-revision.js' });

const economySource = await readFile('app/choice-economy.ts', 'utf8');
const economyCompiled = ts.transpileModule(economySource, {
  compilerOptions,
}).outputText;
const economyExports = {};
vm.runInNewContext(economyCompiled, {
  exports: economyExports,
  module: { exports: economyExports },
  console,
}, { filename: 'choice-economy.js' });

const chapterFourSource = await readFile('app/chapter-four.ts', 'utf8');
const chapterFourCompiled = ts.transpileModule(chapterFourSource, {
  compilerOptions,
}).outputText;
const chapterFourExports = {};
vm.runInNewContext(chapterFourCompiled, {
  exports: chapterFourExports,
  module: { exports: chapterFourExports },
  console,
}, { filename: 'chapter-four.js' });

const chapterFiveSource = await readFile('app/chapter-five.ts', 'utf8');
const chapterFiveCompiled = ts.transpileModule(chapterFiveSource, {
  compilerOptions,
}).outputText;
const chapterFiveExports = {};
vm.runInNewContext(chapterFiveCompiled, {
  exports: chapterFiveExports,
  module: { exports: chapterFiveExports },
  console,
}, { filename: 'chapter-five.js' });

const chapterSixSource = await readFile('app/chapter-six.ts', 'utf8');
const chapterSixCompiled = ts.transpileModule(chapterSixSource, {
  compilerOptions,
}).outputText;
const chapterSixExports = {};
vm.runInNewContext(chapterSixCompiled, {
  exports: chapterSixExports,
  module: { exports: chapterSixExports },
  console,
}, { filename: 'chapter-six.js' });

const chapterSevenSource = await readFile('app/chapter-seven.ts', 'utf8');
const chapterSevenCompiled = ts.transpileModule(chapterSevenSource, {
  compilerOptions,
}).outputText;
const chapterSevenExports = {};
vm.runInNewContext(chapterSevenCompiled, {
  exports: chapterSevenExports,
  module: { exports: chapterSevenExports },
  console,
}, { filename: 'chapter-seven.js' });

const chapterEightSource = await readFile('app/chapter-eight.ts', 'utf8');
const chapterEightCompiled = ts.transpileModule(chapterEightSource, {
  compilerOptions,
}).outputText;
const chapterEightExports = {};
vm.runInNewContext(chapterEightCompiled, {
  exports: chapterEightExports,
  module: { exports: chapterEightExports },
  console,
}, { filename: 'chapter-eight.js' });

const memorySource = await readFile('app/story-memory.ts', 'utf8');
const memoryCompiled = ts.transpileModule(memorySource, {
  compilerOptions,
}).outputText;
const memoryExports = {};
vm.runInNewContext(memoryCompiled, {
  exports: memoryExports,
  module: { exports: memoryExports },
  console,
}, { filename: 'story-memory.js' });

const source = await readFile('app/game-data.ts', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    ...compilerOptions,
  },
}).outputText;

const exported = {};
const context = {
  exports: exported,
  module: { exports: exported },
  console,
  require: (specifier) => {
    if (specifier === './adventure-revision') return adventureExports;
    if (specifier === './choice-economy') return economyExports;
    if (specifier === './chapter-four') return chapterFourExports;
    if (specifier === './chapter-five') return chapterFiveExports;
    if (specifier === './chapter-six') return chapterSixExports;
    if (specifier === './chapter-seven') return chapterSevenExports;
    if (specifier === './chapter-eight') return chapterEightExports;
    throw new Error(`Unexpected module in game graph check: ${specifier}`);
  },
};
vm.runInNewContext(compiled, context, { filename: 'game-data.js' });

const {
  canChoose,
  isChoiceVisible,
  initialState,
  nodeOrder,
  nodes,
  nextRelationships,
  relationshipChanges,
  resolveNext,
  statLabels,
} = context.module.exports;
const { knownTruths, majorConsequences } = memoryExports;
const {
  adventureChoiceUpdates,
  adventureNodeUpdates,
  reviewedUnchangedChoiceIds,
} = adventureExports;

const failures = [];

const postBridgeSources = [chapterFiveSource, chapterSixSource, chapterSevenSource, chapterEightSource];
const activeRookAction = /\bRook (?:walks|waits|follows|looks|points|returns|offers|asks|says|carries|pulls|uses|takes|finds|helps|stands|runs|rides|scouts)\b/i;
for (const [index, chapterSource] of postBridgeSources.entries()) {
  if (activeRookAction.test(chapterSource)) {
    failures.push(`Chapter ${index + 5} places Rook physically on Caelan’s route after the Mileless Bridge exit`);
  }
}
if (/\bRook\b/i.test(chapterSevenSource)) {
  failures.push('Chapter Seven places Rook and Ilyra together before their planned Serekh meeting');
}
if (/\bRook\b/i.test(chapterEightSource)) {
  failures.push('Chapter Eight places Rook on Caelan’s route after his Underways exit');
}
const activeIlyraAction = /\bIlyra (?:arrives|appears|stands|walks|waits|follows|speaks|points|returns|offers|asks|says|carries|pulls|uses|takes|helps|rides)\b/i;
if (activeIlyraAction.test(chapterEightSource)
  || !/Ilyra left before dawn.*another road/is.test(chapterEightSource)) {
  failures.push('Chapter Eight does not explain Ilyra’s separate route without placing her physically at the Gate');
}
for (const node of Object.values(nodes)) {
  for (const choice of node.choices) {
    if (/^c[567].*rook/i.test(choice.id)) {
      failures.push(`Post bridge Caelan choice still assigns an active action to Rook: ${choice.id}`);
    }
  }
}
const nodeIds = Object.keys(nodes);
const ordered = new Set(nodeOrder);
const reviewedUnchangedChoices = new Set(reviewedUnchangedChoiceIds);

const chapterFourArtAssets = {
  mileless: 'public/art/mileless-bridge-chase.png',
  crossroads: 'public/art/mileless-three-spans.png',
  nails: 'public/art/nine-nails-revelation.png',
};
const chapterFiveArtAssets = {
  dragonspine: 'public/art/dragonspine-coldfire.png',
  vaor: 'public/art/vaor-memory-grave.png',
  ember: 'public/art/ember-bearer-vision.png',
};
const chapterSixArtAssets = {
  kharad: 'public/art/kharad-vey-wheel-city.png',
  storm: 'public/art/ancestor-storm-attack.png',
  moot: 'public/art/red-moot-ilyra.png',
};
const chapterSevenArtAssets = {
  redwind: 'public/art/red-wind-pursuit.png',
  saltbattle: 'public/art/salt-basin-battle.png',
  marshal: 'public/art/marshal-field-confrontation.png',
};
const chapterEightArtAssets = {
  blackgate: 'public/art/black-gate-fortress-ring.png',
  futureless: 'public/art/futureless-fort-breach.png',
  embassy: 'public/art/first-devil-embassy.png',
};
const earlierChapterArt = new Set(['departure', 'folded', 'inn', 'harrowfen']);
const chapterFourArtUsed = new Set();
for (const [id, node] of Object.entries(nodes)) {
  if (!id.startsWith('c4-')) continue;
  if (!node.art) failures.push(`Chapter Four node has no explicit art: ${id}`);
  if (earlierChapterArt.has(node.art)) {
    failures.push(`Chapter Four node reuses earlier chapter art: ${id} uses ${node.art}`);
  }
  if (node.art) chapterFourArtUsed.add(node.art);
}
for (const [art, asset] of Object.entries(chapterFourArtAssets)) {
  if (!chapterFourArtUsed.has(art)) failures.push(`Chapter Four never uses its ${art} artwork`);
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
  if (earlierChapterArt.has(node.art) || chapterFourArtAssets[node.art] || chapterFiveArtAssets[node.art]) {
    failures.push(`Chapter Six node reuses earlier chapter art: ${id} uses ${node.art}`);
  }
  if (node.art) chapterSixArtUsed.add(node.art);
}
for (const [art, asset] of Object.entries(chapterSixArtAssets)) {
  if (!chapterSixArtUsed.has(art)) failures.push(`Chapter Six never uses its ${art} artwork`);
  try {
    await access(asset);
  } catch {
    failures.push(`Missing Chapter Six art asset: ${asset}`);
  }
}
const earlierThanFiveArt = new Set([...earlierChapterArt, ...Object.keys(chapterFourArtAssets)]);
const chapterFiveArtUsed = new Set();
for (const [id, node] of Object.entries(nodes)) {
  if (!id.startsWith('c5-')) continue;
  if (!node.art) failures.push(`Chapter Five node has no explicit art: ${id}`);
  if (earlierThanFiveArt.has(node.art)) {
    failures.push(`Chapter Five node reuses earlier chapter art: ${id} uses ${node.art}`);
  }
  if (node.art) chapterFiveArtUsed.add(node.art);
}
for (const [art, asset] of Object.entries(chapterFiveArtAssets)) {
  if (!chapterFiveArtUsed.has(art)) failures.push(`Chapter Five never uses its ${art} artwork`);
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
    failures.push(`Chapter Seven node reuses earlier chapter art: ${id} uses ${node.art}`);
  }
  if (node.art) chapterSevenArtUsed.add(node.art);
}
for (const [art, asset] of Object.entries(chapterSevenArtAssets)) {
  if (!chapterSevenArtUsed.has(art)) failures.push(`Chapter Seven never uses its ${art} artwork`);
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
    failures.push(`Chapter Eight node reuses earlier chapter art: ${id} uses ${node.art}`);
  }
  if (node.art) chapterEightArtUsed.add(node.art);
}
for (const [art, asset] of Object.entries(chapterEightArtAssets)) {
  if (!chapterEightArtUsed.has(art)) failures.push(`Chapter Eight never uses its ${art} artwork`);
  try {
    await access(asset);
  } catch {
    failures.push(`Chapter Eight artwork is missing: ${asset}`);
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
    if (!adventureChoiceUpdates[choice.id] && !reviewedUnchangedChoices.has(choice.id)) {
      failures.push(`Revised node ${nodeId} inherits unaudited choice ${choice.id}`);
    }
  }
}
for (const choiceId of reviewedUnchangedChoices) {
  const owners = Object.values(nodes).filter((node) => node.choices.some((choice) => choice.id === choiceId));
  if (owners.length !== 1) failures.push(`Reviewed unchanged choice ${choiceId} has ${owners.length} owning nodes`);
  if (adventureChoiceUpdates[choiceId]) failures.push(`Choice ${choiceId} is both revised and marked unchanged`);
}

const statKeyByLabel = Object.fromEntries(
  Object.entries(statLabels).map(([key, label]) => [label.toLowerCase(), key]),
);
const visibleCostPattern = /(Spend|Gain) ([0-9]+) (Health|Resolve|Command|Oathfire|Medicine|Wayfire)/gi;
for (const node of Object.values(nodes)) {
  for (const choice of node.choices) {
    const resourceCosts = Object.entries(choice.changes ?? {})
      .filter(([, value]) => (value ?? 0) < 0);
    const relationshipCosts = Object.values(relationshipChanges(choice))
      .flatMap((changes) => Object.values(changes ?? {}))
      .filter((value) => (value ?? 0) < 0);
    const hasKnownCost = resourceCosts.length || relationshipCosts.length;
    if (hasKnownCost && !choice.advantage?.trim()) {
      failures.push(`Costly choice ${choice.id} has no player facing advantage`);
    }
    if (hasKnownCost && !(choice.addFlags?.length)) {
      failures.push(`Costly choice ${choice.id} stores no consequence flag`);
    }
    for (const match of choice.detail.matchAll(visibleCostPattern)) {
      const stat = statKeyByLabel[match[3].toLowerCase()];
      const direction = match[1].toLowerCase() === 'spend' ? -1 : 1;
      const visibleChange = direction * Number(match[2]);
      const actualChange = choice.changes?.[stat] ?? 0;
      if (actualChange !== visibleChange) {
        failures.push(
          `Choice ${choice.id} says ${match[0]} but changes ${stat} by ${actualChange}`,
        );
      }
    }
  }
}

for (const [id, node] of Object.entries(nodes)) {
  const spokenChoices = node.choices.filter((choice) => isSpokenReplyLabel(choice.label));
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
  if (/^Ask [\p{L}’']+ (what|who|how|why|whether|if)\b/iu.test(text)) return true;
  if (/^(Demand|Challenge)\b/i.test(text)) return true;
  if (/^Offer [A-Z\p{Lu}]/u.test(text)) return true;
  if (/^Make [\p{L}’']+ answer\b/iu.test(text)) return true;
  if (/^Accept .+\baccount\b/i.test(text)) return true;
  return false;
}

function lastParagraphSupportsReply(paragraph) {
  return /[“"]/.test(paragraph) || /\bwaits for (an honest )?answer\b/i.test(paragraph);
}

function applyChoice(state, choice) {
  const stats = { ...state.stats };
  for (const [key, value] of Object.entries(choice.changes ?? {})) {
    stats[key] = Math.max(0, stats[key] + (value ?? 0));
  }
  const relationships = nextRelationships(state.relationships, choice);
  return {
    nodeId: resolveNext(choice, state),
    chapter: state.chapter,
    chapterChoices: (state.chapterChoices ?? 0) + 1,
    completedChapters: state.completedChapters ?? [],
    stats,
    relationships,
    contentPreference: state.contentPreference,
    flags: Array.from(new Set([...state.flags, ...(choice.addFlags ?? [])])),
    history: [...state.history, choice.result],
    defeat: stats.health <= 0,
  };
}

function stateKey(state) {
  const navigationFlags = new Set([
    'low-route',
    'ridge-route',
    'inspection-route',
    'captured-attacker',
    'c2-kept-crown-orders',
    'c2-trusted-maelin',
    'c2-has-pin-key',
    'c2-saved-attacker',
    'c5-chose-mara-care',
    'c5-chose-lysara-care',
    'c5-chose-sorin-care',
    'c6-red-moot-war',
    'c6-red-moot-alliance',
    'c6-red-moot-neutral',
    'c7-lio-alive',
    'c7-copied-gate-diversion',
    'c7-teren-saw-gate-order',
  ]);
  const requirementCaps = {
    health: 2,
    resolve: 4,
    command: 2,
    oathfire: 2,
    medicine: 1,
    wayfire: 0,
  };
  const stats = Object.entries(state.stats)
    .map(([key, value]) => `${key}:${Math.min(value, requirementCaps[key] ?? value)}`)
    .join('|');
  const flags = state.flags.filter((flag) => navigationFlags.has(flag)).sort().join('|');
  const relationships = Object.entries(state.relationships)
    .map(([person, score]) => `${person}:${Math.min(score.trust, 4)}:${Math.min(score.attraction, 3)}:${Math.min(score.respect ?? 0, 4)}:${Math.min(score.friction ?? 0, 3)}:${score.intent ?? 'unresolved'}`)
    .join('|');
  return `${state.nodeId}|${stats}|${relationships}|${flags}`;
}

const chapterTwoKnownTerms = Object.keys(statLabels).filter((term) => term !== 'medicine');
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
    wayfire: 0,
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
    wayfire: 7,
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
    wayfire: 9,
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
    wayfire: 11,
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
    wayfire: 13,
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
    wayfire: 15,
  },
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
};

function nodeIsInChapter(nodeId, chapter) {
  if (chapter === 1) return !/^c[2-8]-/.test(nodeId);
  return nodeId.startsWith(`c${chapter}-`);
}

function visibleNodeText(node, state) {
  const body = typeof node.body === 'function' ? node.body(state) : node.body;
  return [
    node.kicker,
    node.title,
    node.location,
    node.objective,
    node.lesson?.title,
    node.lesson?.body,
    ...body,
    ...node.choices.flatMap((choice) => [choice.label, choice.detail, choice.advantage, choice.result]),
  ].filter(Boolean).join(' ');
}

const allStoryFlags = [...new Set(Object.values(nodes)
  .flatMap((node) => node.choices)
  .flatMap((choice) => choice.addFlags ?? []))];

for (const contract of implementedChapterContracts) {
  if (!nodes[contract.entryNode]) {
    failures.push(`Continuity contract has a missing Chapter ${contract.chapter} entry: ${contract.entryNode}`);
  }
  if ((nodes[contract.entryNode]?.introducesStoryTerms?.length ?? 0) > 3) {
    failures.push(`Chapter ${contract.chapter} opening introduces more than three story terms before the first decision`);
  }
  for (const endingId of contract.endingNodes) {
    const ending = nodes[endingId];
    if (!ending?.final) failures.push(`Continuity contract ending is missing or not final: ${endingId}`);
    if (contract.nextNode !== null && ending?.nextChapter !== contract.nextNode) {
      failures.push(`${endingId} no longer reaches the protected next plot node ${contract.nextNode}`);
    }
  }

  const baseState = chapterBaseStates[contract.chapter];
  const chapterNodes = nodeOrder.filter((nodeId) => nodeIsInChapter(nodeId, contract.chapter));
  const sampleStates = [
    baseState,
    ...allStoryFlags.map((flag) => ({ ...baseState, flags: [...baseState.flags, flag] })),
  ];
  const permitted = new Set([contract.series, ...contract.activeGuests, ...contract.legacyOnlyHeroes]);

  for (const nodeId of chapterNodes) {
    const node = nodes[nodeId];
    for (const state of sampleStates) {
      const text = visibleNodeText(node, state);
      for (const [hero, displayName] of Object.entries(playableHeroes)) {
        if (!permitted.has(hero) && new RegExp(`\\b${displayName}\\b`, 'i').test(text)) {
          failures.push(`${nodeId} introduces ${displayName} outside an approved crossover or legacy window`);
          break;
        }
      }
    }
  }

  for (const [hero, introductionNode] of Object.entries(contract.introductions ?? {})) {
    const introductionIndex = nodeOrder.indexOf(introductionNode);
    const displayName = playableHeroes[hero];
    for (const nodeId of chapterNodes) {
      if (nodeOrder.indexOf(nodeId) >= introductionIndex) continue;
      if (new RegExp(`\\b${displayName}\\b`, 'i').test(visibleNodeText(nodes[nodeId], baseState))) {
        failures.push(`${displayName} is named in ${nodeId} before the protected introduction at ${introductionNode}`);
      }
    }
  }
}

for (const transition of protectedPlotTransitions) {
  for (const endingId of transition.endingNodes) {
    const chapter = implementedChapterContracts.find((contract) => contract.endingNodes.includes(endingId))?.chapter ?? 1;
    const endingText = visibleNodeText(nodes[endingId], chapterBaseStates[chapter]);
    for (const term of transition.requiredTerms) {
      if (!endingText.toLocaleLowerCase().includes(term.toLocaleLowerCase())) {
        failures.push(`${endingId} dropped protected plot term ${term} from ${transition.id}`);
      }
    }
  }
}

const worldMapSource = await readFile('docs/WORLD_MAP.md', 'utf8');
for (const [hero, route] of Object.entries(documentedSeriesRoutes)) {
  const writtenRoute = route.join(' to ');
  if (!worldMapSource.includes(writtenRoute)) {
    failures.push(`WORLD_MAP.md no longer contains the protected ${hero} route: ${writtenRoute}`);
  }
}

const seriesBibleSource = await readFile('docs/CHARACTER_SERIES_BIBLE.md', 'utf8');
for (const meeting of firstMeetingContracts) {
  const heroNames = meeting.heroes.map((hero) => playableHeroes[hero]);
  if (!seriesBibleSource.includes(heroNames[0])
    || !seriesBibleSource.includes(heroNames[1])
    || !seriesBibleSource.includes(meeting.place)) {
    failures.push(`The documented first meeting for ${heroNames.join(' and ')} is missing its protected location ${meeting.place}`);
  }
}
const storyTermRules = {
  Oathwarden: {
    use: /\bOathwarden\b/i,
    introduction: /Caelan is an Oathwarden\. When he makes a serious promise aloud/i,
  },
  'glass seed': {
    use: /\bglass seed\b/i,
    introduction: /shows you a glass seed, a clear shell holding a curl of green light/i,
  },
  'mire hound': {
    use: /\bmire hound\b/i,
    introduction: /“Mire hound,” she says, giving the creature a name/i,
  },
  'road pin': {
    use: /\broad pin\b/i,
    introduction: /(?:words remain deep enough to read: road pin|stamped into the bracket: ROAD PIN|iron anchor beneath the inn.*called it a road pin)/is,
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
    introduction: /Dragonspine (?:is the northern mountain realm|guards another Nail)/i,
  },
  'Regent Malrec': {
    use: /\bRegent Malrec\b/i,
    introduction: /Regent Malrec Vale rules Asterra while the young Queen is ill/i,
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
    introduction: /Orivane (?:willingly )?(?:gave|gives) her living heart to create the Concord/i,
  },
  'Kharad Vey': {
    use: /\bKharad Vey\b/i,
    introduction: /Kharad Vey, the moving orc town|Kharad Vey rises.*(?:travelling orc town|town is built).*twelve wooden platforms|Kharad Vey moves across the red steppe.*travelling orc town/i,
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
    introduction: /black stone you saw.*call it the Black Gate|black stone you saw is the Black Gate/i,
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
    introduction: /Threadread shows connection|see emotional and magical connections/i,
  },
  Unsea: {
    use: /\bUnsea\b/i,
    introduction: /calls the hidden (?:current|place) beneath erased roads the Unsea/i,
  },
  'Crown March': {
    use: /\bCrown March\b/i,
    introduction: /(?:Crown March is an army of Asterra|force ahead is the Crown March, Asterra’s main field army)/i,
  },
  'dead command': {
    use: /\bdead command\b/i,
    introduction: /(?:Dead command means a voice inside the ancestor storm|storm is also copying dead officers’ voices.*called dead command|call that a dead command.*dead officer’s voice.*without a living messenger)/is,
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
};
for (const [id, node] of Object.entries(nodes)) {
  const sampleState = id.startsWith('c8-')
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
  ].filter(Boolean).join(' ');
  for (const term of node.introducesStoryTerms ?? []) {
    const rule = storyTermRules[term];
    if (!rule) {
      failures.push(`Story term ${term} introduced in ${id} is missing from the controlled term registry`);
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
    node.objective,
    node.lesson?.title,
    node.lesson?.body,
    ...node.body(sampleState),
    ...node.choices.flatMap((choice) => [choice.label, choice.detail, choice.result]),
  ].filter(Boolean).join(' ');
  for (const phrase of retiredPlotPhrases) {
    if (phrase.test(activeText)) failures.push(`Retired plot phrase ${phrase} remains active in ${id}`);
  }
}

const closePointOfViewPattern = /(?:\byou (?:feel|remember|notice|realise|recognise|want|know|think|expect|fear|wonder|suspect|believe|dislike|sort|search|reach|flinch|hesitate|refuse|taste|watch|count)|\byour (?:mind|instincts?|attention|conscience|training|memory|fear|guilt|nerves|thoughts?|captain’s mind|hands?|eyes?|breath|chest|body|legs?|shoulders?|stomach|pulse|jaw|feet|fingers?|tongue)|\bpart of you\b|\brelief (?:comes|should|tries)|\banger (?:comes|urges))/i;
for (const chapter of [1, 2, 3, 4, 5, 6, 7, 8]) {
  const chapterNodes = nodeOrder.filter((id) => chapter === 1
    ? !/^c[2345678]-/.test(id)
    : id.startsWith(`c${chapter}-`));
  const sampleState = chapter === 1
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
                : chapterEightBase;
  const closeNodes = chapterNodes.filter((id) => closePointOfViewPattern.test(nodes[id].body(sampleState).join(' ')));
  if (closeNodes.length / chapterNodes.length < 0.6) {
    failures.push(`Chapter ${chapter} close point of view coverage fell below 60 percent (${closeNodes.length} of ${chapterNodes.length} scenes)`);
  }
}

function renderedBody(nodeId, state) {
  return nodes[nodeId].body(state).join(' ');
}

const safeTreatyArrival = renderedBody('c2-arrival', {
  ...chapterTwoBase,
  flags: ['treaty-safe'],
});
if (!/sealed treaty chest/i.test(safeTreatyArrival) || /cracked treaty chest/i.test(safeTreatyArrival)) {
  failures.push('Chapter Two does not preserve the protected treaty chest');
}
const damagedTreatyArrival = renderedBody('c2-arrival', {
  ...chapterTwoBase,
  flags: ['treaty-damaged'],
});
if (!/cracked treaty chest/i.test(damagedTreatyArrival)) {
  failures.push('Chapter Two does not preserve the damaged treaty chest');
}
const knownPrisonerThreshold = renderedBody('c2-threshold', {
  ...chapterTwoBase,
  flags: ['captured-attacker'],
});
if (!/your wounded prisoner/i.test(knownPrisonerThreshold) || /Maelin found him/i.test(knownPrisonerThreshold)) {
  failures.push('Chapter Two does not preserve the captured attacker route');
}
const thresholdBeforeEntry = renderedBody('c2-threshold', {
  ...chapterTwoBase,
  flags: ['c2-ordered-entry'],
});
if (!/front step|threshold|door open/i.test(thresholdBeforeEntry) || /bars the door behind you/i.test(thresholdBeforeEntry)) {
  failures.push('Chapter Two threshold does not remain outside until the player chooses how to enter');
}
const maraEntryThreshold = renderedBody('c2-threshold', {
  ...chapterTwoBase,
  flags: ['c2-mara-led-entry'],
});
if (!/searches the wrong side of the yard/i.test(maraEntryThreshold)
  || !/buying Maelin time/i.test(maraEntryThreshold)
  || /Mara found firm stones|never came close enough/i.test(maraEntryThreshold)) {
  failures.push('Mara’s successful entry does not advance to a new threshold consequence');
}
const urgentLeads = renderedBody('c3-triage', chapterThreeBase);
if (!/Elene explains the third lead/i.test(urgentLeads)
  || !/watchm(?:a|e)n saw Ordan pay Varris/i.test(urgentLeads)) {
  failures.push('Caelan learns about Varris without an identified source at the Chapter Three leads');
}
if (!/service gate for the wounded wagons and six armed escorts/i.test(urgentLeads)
  || !/remaining Wardens form a shield line outside/i.test(urgentLeads)
  || !/drops the iron gate between them and Ordan’s charging riders/i.test(urgentLeads)) {
  failures.push('The Chapter Three gate transition does not account for the wounded, remaining Wardens, and Crown riders');
}
const gatePolitics = renderedBody('c3-gate', chapterThreeBase);
if (!/Asterra’s Crown, your own/i.test(gatePolitics)
  || !/Ordan’s private order/i.test(gatePolitics)
  || !/young Queen lies ill/i.test(gatePolitics)
  || !/Inside Harrowfen, even the Regent’s soldiers answer to her law/i.test(gatePolitics)) {
  failures.push('The Chapter Three gate does not plainly explain the Asterra force and Harrowfen command structure');
}
const roadPinDiscoveryChecks = [
  ['c2-ledger', /words remain deep enough to read: road pin/i],
  ['c2-cellar', /stamped into the bracket: ROAD PIN/i],
  ['c2-attacker', /iron anchor beneath the inn.*called it a road pin/is],
];
for (const [nodeId, expected] of roadPinDiscoveryChecks) {
  if (!expected.test(renderedBody(nodeId, chapterTwoBase))) {
    failures.push(`${nodeId} sets road pin knowledge without introducing the term`);
  }
}
const roadPinCallbackChecks = [
  ['c2-ledger-route', /named in Ordan’s midnight note/i],
  ['c2-cellar-route', /identified on the cellar bracket/i],
  ['c2-attacker-route', /Garran warned you about/i],
];
for (const [flag, expected] of roadPinCallbackChecks) {
  const chamber = renderedBody('c2-road-pin', { ...chapterTwoBase, flags: [flag] });
  if (!expected.test(chamber)) failures.push(`The road pin chamber forgets how ${flag} introduced the term`);
}
const cellarRouteBell = renderedBody('c2-bell', {
  ...chapterTwoBase,
  flags: ['c2-cellar-route'],
});
if (/Garran’s warning|Garran described/i.test(cellarRouteBell) || !/two sides of the attack/i.test(cellarRouteBell)) {
  failures.push('The bell scene invents a Garran warning on the cellar route');
}
const sableRouteBell = renderedBody('c2-bell', {
  ...chapterTwoBase,
  flags: ['c2-attacker-route'],
});
if (!/Garran’s warning/i.test(sableRouteBell)) {
  failures.push('The bell scene does not remember Garran’s warning on his investigation route');
}
const shieldLineCrisis = renderedBody('c2-common-room-crisis', {
  ...chapterTwoBase,
  flags: ['c2-rope-line'],
});
if (!/behind a disciplined shield line/i.test(shieldLineCrisis) || /wounded remain tied/i.test(shieldLineCrisis)) {
  failures.push('The common room crisis misremembers the shield line as tied patients');
}
const companionPayoffs = [
  ['c2-mara-below', /Mara finds two soldiers/i, /Maelin strikes the wall/i],
  ['c2-lysara-below', /Lysara ties green thread/i, /Maelin strikes the wall/i],
  ['c2-maelin-below', /Maelin strikes the wall/i, /Mara finds two soldiers|Lysara ties green thread/i],
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
if (/road pin|two kinds of authority|Ordan.*(?:brought|needed)/i.test(earlyRoadExplanation)) {
  failures.push('Chapter Two reveals the road pin or Ordan’s full plan before the investigation');
}
const investigateSetup = [
  ...nodes['c2-investigate'].body(chapterTwoBase),
  ...nodes['c2-investigate'].choices.flatMap((choice) => [choice.label, choice.detail, choice.advantage ?? '']),
].join(' ');
if (/road pin/i.test(investigateSetup)) {
  failures.push('The Chapter Two investigation menu names the road pin before the player can discover it');
}
const earlyChapterTwoTruths = knownTruths({
  ...chapterTwoBase,
  nodeId: 'c2-eleven-years',
});
if (earlyChapterTwoTruths.some((truth) => /unlock the road pin|Ordan lured/i.test(truth))) {
  failures.push('The Chapter Two journal reveals Ordan’s full plan too early');
}
const pinChamberTruths = knownTruths({
  ...chapterTwoBase,
  nodeId: 'c2-road-pin',
});
if (!pinChamberTruths.some((truth) => /Ordan lured|unlock the road pin/i.test(truth))) {
  failures.push('The Chapter Two journal does not record Ordan’s plan at the pin chamber');
}
if (pinChamberTruths.some((truth) => /\bCaelan(?:’s)?\b/i.test(truth))) {
  failures.push('The Chapter Two journal steps outside Caelan’s first person point of view');
}
if (!pinChamberTruths.some((truth) => /Lysara and me|my road authority/i.test(truth))) {
  failures.push('The Chapter Two journal does not phrase the pin reveal as Caelan’s own knowledge');
}
const repairedPinTruths = knownTruths({
  ...chapterTwoBase,
  nodeId: 'c2-last-testimony',
});
if (!repairedPinTruths.some((truth) => /I drove the road pin back into place/i.test(truth))) {
  failures.push('The Chapter Two journal does not update after Caelan repairs the road pin');
}
const roadPinLesson = nodes['c2-road-pin'].lesson?.body ?? '';
if (/Ordan|Caelan|Lysara|road authority|living magic|old locks/i.test(roadPinLesson)) {
  failures.push('The road pin lesson reveals the conspiracy before Caelan sees the two active locks');
}
const chapterTwoChoiceSummaryPattern = /\b(?:you (?:can|must|need to|have to) (?:choose|decide)|your choice|each method|the choice is)\b/i;
for (const nodeId of nodeOrder.filter((id) => id.startsWith('c2-'))) {
  const lastParagraph = nodes[nodeId].body(chapterTwoBase).at(-1) ?? '';
  if (chapterTwoChoiceSummaryPattern.test(lastParagraph)) {
    failures.push(`Chapter Two scene ${nodeId} ends with narrator choice coaching`);
  }
}
const expectedAdvantageLanguage = /\b(?:should|could|may|might|likely|chance|aim)\b/i;
for (const nodeId of nodeOrder.filter((id) => id.startsWith('c2-'))) {
  for (const choice of nodes[nodeId].choices) {
    const hasCost = Object.values(choice.changes ?? {}).some((value) => (value ?? 0) < 0);
    if (hasCost && choice.advantage && !expectedAdvantageLanguage.test(choice.advantage)) {
      failures.push(`Chapter Two choice ${choice.id} presents its expected advantage as a guaranteed outcome`);
    }
  }
}
const keyholeResult = nodes['c2-road-pin'].choices.find((choice) => choice.id === 'c2-study-keyhole')?.result ?? '';
if (!/back into its socket/i.test(keyholeResult) || /remove|pull (?:it|the pin) out/i.test(keyholeResult)) {
  failures.push('The keyhole choice still describes removing the road pin instead of reseating it');
}
for (const chapter of [3, 4]) {
  const chapterPrefix = `c${chapter}-`;
  const chapterState = chapter === 3 ? chapterThreeBase : chapterFourBase;
  for (const nodeId of nodeOrder.filter((id) => id.startsWith(chapterPrefix))) {
    const lastParagraph = nodes[nodeId].body(chapterState).at(-1) ?? '';
    if (chapterTwoChoiceSummaryPattern.test(lastParagraph)) {
      failures.push(`Chapter ${chapter} scene ${nodeId} ends with narrator choice coaching`);
    }
    for (const choice of nodes[nodeId].choices) {
      const hasCost = Object.values(choice.changes ?? {}).some((value) => (value ?? 0) < 0);
      if (hasCost && choice.advantage && !expectedAdvantageLanguage.test(choice.advantage)) {
        failures.push(`Chapter ${chapter} choice ${choice.id} presents its expected advantage as a guaranteed outcome`);
      }
    }
  }
}
const chapterThreeJournal = knownTruths({
  ...chapterThreeBase,
  nodeId: 'c3-world-nail',
});
if (chapterThreeJournal.some((truth) => /\bCaelan(?:’s)?\b/i.test(truth))) {
  failures.push('The Chapter Three journal steps outside Caelan’s first person point of view');
}
if (!chapterThreeJournal.some((truth) => /\bI\b|\bmy\b|\bme\b/i.test(truth))) {
  failures.push('The Chapter Three journal does not preserve Caelan’s first person voice');
}
const chapterFourJournal = knownTruths({
  ...chapterFourBase,
  nodeId: 'c4-duty',
});
if (chapterFourJournal.some((truth) => /\bCaelan(?:’s)?\b/i.test(truth))) {
  failures.push('The Chapter Four journal steps outside Caelan’s first person point of view');
}
if (!chapterFourJournal.some((truth) => /\bI\b|\bmy\b|\bme\b/i.test(truth))) {
  failures.push('The Chapter Four journal does not preserve Caelan’s first person voice');
}
const chapterFiveJournal = knownTruths({
  ...chapterFiveBase,
  nodeId: 'c5-ember-choice',
});
if (chapterFiveJournal.some((truth) => /\bCaelan(?:’s)?\b/i.test(truth))) {
  failures.push('The Chapter Five journal steps outside Caelan’s first person point of view');
}
if (!chapterFiveJournal.some((truth) => /\bI\b|\bmy\b|\bme\b/i.test(truth))) {
  failures.push('The Chapter Five journal does not preserve Caelan’s first person voice');
}
const shelterJournal = knownTruths({
  ...chapterFiveBase,
  nodeId: 'c5-glass-shelter',
});
if (shelterJournal.some((truth) => /\bVaor\b/i.test(truth))) {
  failures.push('The Chapter Five journal names Vaor before Sorin introduces him in the shelter scene');
}
const campJournal = knownTruths({
  ...chapterFiveBase,
  nodeId: 'c5-royal-camp',
});
if (!campJournal.some((truth) => /Vaor was imprisoned beneath memory glass a century ago/i.test(truth))) {
  failures.push('The Chapter Five journal does not record Sorin’s Vaor reveal after the shelter');
}
const heartMemoryJournal = knownTruths({
  ...chapterFiveBase,
  nodeId: 'c5-heart-memory',
});
if (heartMemoryJournal.some((truth) => /\bOrivane\b/i.test(truth))) {
  failures.push('The Chapter Five journal reveals Orivane before the player witnesses her memory');
}
const collapseJournal = knownTruths({
  ...chapterFiveBase,
  nodeId: 'c5-grave-collapse',
});
if (!collapseJournal.some((truth) => /Orivane willingly gave her living heart/i.test(truth))) {
  failures.push('The Chapter Five journal does not record Orivane after her memory ends');
}
for (const nodeId of nodeOrder.filter((id) => id.startsWith('c5-'))) {
  const lastParagraph = nodes[nodeId].body(chapterFiveBase).at(-1) ?? '';
  if (chapterTwoChoiceSummaryPattern.test(lastParagraph)) {
    failures.push(`Chapter 5 scene ${nodeId} ends with narrator choice coaching`);
  }
  const bodyText = nodes[nodeId].body(chapterFiveBase).join(' ');
  if (/\bYou (?:notice|understand|realise|must decide|need to choose|have to choose)\b/i.test(bodyText)) {
    failures.push(`Chapter 5 scene ${nodeId} labels Caelan’s interpretation instead of dramatising it`);
  }
  for (const choice of nodes[nodeId].choices) {
    const hasCost = Object.values(choice.changes ?? {}).some((value) => (value ?? 0) < 0);
    if (hasCost && choice.advantage && !expectedAdvantageLanguage.test(choice.advantage)) {
      failures.push(`Chapter 5 choice ${choice.id} presents its expected advantage as a guaranteed outcome`);
    }
  }
}
if (nodes['c5-glass-shelter'].lesson || nodes['c5-heart-memory'].lesson || nodes['c5-ember-choice'].lesson) {
  failures.push('Chapter Five still reveals a dramatic discovery in a lesson before the scene prose');
}
const worldNailLessonText = nodes['c3-world-nail'].lesson?.body ?? '';
if (/World Nail/i.test(worldNailLessonText)) {
  failures.push('The Chapter Three lesson names the World Nail before Lysara reveals it in the scene');
}
if (nodes['c4-nine-marks'].lesson) {
  failures.push('The Chapter Four lesson interrupts the nine Nails reveal before Lysara speaks');
}
const descentRoutePayoffs = [
  ['c2-cellar-route', /rope you found earlier/i, /Garran’s warning|listed among Ordan’s supplies/i],
  ['c2-ledger-route', /listed among Ordan’s supplies/i, /rope you found earlier|Garran’s warning/i],
  ['c2-attacker-route', /Garran’s warning/i, /rope you found earlier|listed among Ordan’s supplies/i],
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
    expected: [/two children you rescued/i, /trapping young Joren beneath the axle/i],
    forbidden: [],
  },
  {
    flags: ['steady-axle'],
    expected: [/second guard/i, /hangs above the flood/i],
    forbidden: [/children you rescued/i, /trapping young Joren beneath the axle/i],
  },
  {
    flags: [],
    expected: [/second guard/i, /trapping young Joren beneath the axle/i],
    forbidden: [/children you rescued/i],
  },
];
for (const testCase of lowRoadCases) {
  const body = renderedBody('low-crisis', { ...initialState, flags: testCase.flags });
  for (const expected of testCase.expected) {
    if (!expected.test(body)) failures.push(`Low road continuity is missing ${expected} for ${testCase.flags.join(',') || 'no flags'}`);
  }
  for (const forbidden of testCase.forbidden) {
    if (forbidden.test(body)) failures.push(`Low road continuity incorrectly includes ${forbidden} for ${testCase.flags.join(',') || 'no flags'}`);
  }
}
const openingLessonText = nodes['gate-yard'].lesson?.body ?? '';
for (const requiredTerm of [/Health/i, /Resolve/i, /Command/i, /Health.*zero.*dies/i]) {
  if (!requiredTerm.test(openingLessonText)) {
    failures.push(`The Chapter One opening lesson does not plainly teach ${requiredTerm}`);
  }
}
if (/Mara|Lysara|Trust|Attraction|score/i.test(openingLessonText)) {
  failures.push('The Chapter One opening lesson exposes relationship people or numbers before their introductions');
}
const openingBodyText = renderedBody('gate-yard', initialState);
if (/Brann, Joren, Nilo, Mara/i.test(openingBodyText)) {
  failures.push('The Chapter One opening restores the retired list of character names');
}
const horseCheck = nodes['gate-yard'].choices.find((choice) => choice.id === 'check-horses');
const horseCheckResult = horseCheck?.result ?? '';
if (!/replace.*strap/i.test(horseCheckResult) || !/clean.*oil/i.test(horseCheckResult)) {
  failures.push('The horse check must visibly prevent the harness failure credited in the recap');
}
const horseCheckCallback = renderedBody('mara-returns', {
  ...initialState,
  flags: ['checked-horses'],
});
if (!/cleaned the strange oil/i.test(horseCheckCallback)) {
  failures.push('The scene after the horse check forgets that Caelan cleaned the mare’s bit');
}
const horseCheckConsequences = majorConsequences({
  ...initialState,
  flags: ['checked-horses'],
});
if (!horseCheckConsequences.some((consequence) => /avoided a planned equipment failure/i.test(consequence))) {
  failures.push('The horse check recap no longer records the prevention shown in the playable result');
}
const familyBridgeChoices = nodes['low-crisis'].choices.filter((choice) => isChoiceVisible(choice, {
  ...initialState,
  flags: ['saved-family'],
}));
if (familyBridgeChoices.length !== 3) {
  failures.push(`The rescued family bridge branch exposes ${familyBridgeChoices.length} choices instead of three`);
}
for (const choice of familyBridgeChoices) {
  const choiceText = `${choice.detail} ${choice.result}`;
  if (!/both children/i.test(choiceText)) {
    failures.push(`Bridge choice ${choice.id} hides the rescued children’s fate`);
  }
  if (/someone cries your name/i.test(choiceText)) {
    failures.push(`Bridge choice ${choice.id} replaces the rescued children with an unnamed cry`);
  }
}
const noFamilyBridgeChoices = nodes['low-crisis'].choices.filter((choice) => isChoiceVisible(choice, {
  ...initialState,
  flags: [],
}));
if (noFamilyBridgeChoices.length !== 3) {
  failures.push(`The bridge branch without the rescued family exposes ${noFamilyBridgeChoices.length} choices instead of three`);
}
for (const choice of noFamilyBridgeChoices) {
  if (!/Joren/i.test(`${choice.detail} ${choice.result}`) || !/second guard/i.test(choice.result)) {
    failures.push(`Bridge choice ${choice.id} does not resolve Joren and the second guard`);
  }
}
for (const nodeId of ['low-crisis', 'ridge-crisis', 'inspection-crisis']) {
  const crisisText = renderedBody(nodeId, initialState);
  if (!/Joren.*side/i.test(crisisText)
    || !/Nilo.*lower leg/i.test(crisisText)
    || !/three guards/i.test(crisisText)
    || !/horse.*leg/i.test(crisisText)) {
    failures.push(`Chapter One crisis ${nodeId} does not establish every injury reported in the aftermath`);
  }
}
const wayfireLessonText = nodes['folded-road'].lesson?.body ?? '';
if (!/Finishing a chapter unlocks the next one/i.test(wayfireLessonText)
  || !/optional paths and scenes/i.test(wayfireLessonText)
  || /Wayfire.*unlock later chapters/i.test(wayfireLessonText)) {
  failures.push('The Chapter One Wayfire lesson contradicts current chapter progression');
}
const sealedCaseTruths = knownTruths({
  ...initialState,
  nodeId: 'sealed-case',
  chapterChoices: 4,
});
if (sealedCaseTruths.some((truth) => /prepared road|someone altered/i.test(truth))) {
  failures.push('The sealed case journal reveals the conspiracy before Caelan proves it');
}
if (!sealedCaseTruths.some((truth) => /does not match|although I remember/i.test(truth))) {
  failures.push('The sealed case journal does not record the observed route mismatch');
}
const provenAmbushTruths = knownTruths({
  ...initialState,
  nodeId: 'retreat',
  flags: ['confirmed-advance-orders'],
});
if (!provenAmbushTruths.some((truth) => /every possible route/i.test(truth))) {
  failures.push('The journal does not record advance route proof after it is discovered');
}
if (sealedCaseTruths.some((truth) => /\bCaelan\b|\bhe\b|\bhis\b/i.test(truth))) {
  failures.push('The Chapter One journal steps outside Caelan’s first person perspective');
}
const maraAheadConversation = renderedBody('road-conversation', {
  ...initialState,
  flags: ['mara-ahead'],
});
if (!/Mara appears between two alder trees/i.test(maraAheadConversation)) {
  failures.push('The Chapter One road conversation offers Mara dialogue while she remains absent');
}
const oathEndingBody = renderedBody('ending-oath', initialState);
if (/wearing your red cloak/i.test(oathEndingBody)) {
  failures.push('The Chapter One Oath ending restores the retired false Caelan image');
}
const lowHighConsequences = majorConsequences({
  ...initialState,
  nodeId: 'ending-height',
  flags: ['low-route', 'chose-high-ground'],
});
if (lowHighConsequences.some((consequence) => /followed|found the hidden silver route/i.test(consequence))) {
  failures.push('The low road and high ground recap invents a silver road choice');
}
if (!lowHighConsequences.some((consequence) => /defensible camp/i.test(consequence))) {
  failures.push('The high ground ending is missing from the recap');
}
for (const evidenceChoice of nodes.evidence.choices) {
  if (!evidenceChoice.addFlags?.includes('confirmed-advance-orders')) {
    failures.push(`Evidence choice ${evidenceChoice.id} does not answer the chapter mystery`);
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
  if (!expected.test(entrance)) failures.push(`Harrowfen entrance does not pay off ${flag}`);
}
const healerChoiceText = nodes['c3-healer'].choices
  .flatMap((choice) => [choice.label, choice.detail, choice.result])
  .join(' ');
if (/\bSenna\b|both canal bridges/i.test(healerChoiceText)) {
  failures.push('The Chapter Three healing house still contains choices from the retired plot');
}
const healerSceneChoices = new Map(nodes['c3-healer'].choices.map((choice) => [choice.id, choice]));
if (!/Iven.*children/i.test(healerSceneChoices.get('c3-hold-healer-door')?.label ?? '')) {
  failures.push('The healing house Health choice does not answer Iven’s immediate crisis');
}
if (!/back door.*children’s room/i.test(healerSceneChoices.get('c3-command-canal-line')?.label ?? '')) {
  failures.push('The healing house Command choice does not defend both threatened rooms');
}
const healerRoutePayoffs = [
  ['c3-sable-identified-guard', /Garran’s identification/i],
  ['c3-secured-healer', /every patient alive/i],
  ['c3-canal-defence', /divided guard line trapped one intruder/i],
];
for (const [flag, expected] of healerRoutePayoffs) {
  const bridgeArrival = renderedBody('c3-bill', {
    ...chapterThreeBase,
    flags: ['c3-route-healer', flag],
  });
  if (!expected.test(bridgeArrival)) {
    failures.push(`The healing house choice ${flag} has no accurate Lantern Bridge payoff`);
  }
}
const investigationMenuText = [
  nodes['c3-triage'].lesson?.title ?? '',
  nodes['c3-triage'].lesson?.body ?? '',
  ...nodes['c3-triage'].body(chapterThreeBase),
  ...nodes['c3-triage'].choices.flatMap((choice) => [choice.label, choice.detail, choice.result]),
].join(' ');
if (/false escort|safe road out|old watch house/i.test(investigationMenuText)) {
  failures.push('The Chapter Three investigation menu still describes the retired mystery');
}
const confessionChoice = nodes['c3-bill'].choices.find((choice) => choice.id === 'c3-let-iron-point');
const lanternRouteProofs = [
  ['c3-route-archive', /signed route requests and royal payments aloud/i],
  ['c3-route-healer', /Garran names Ordan as the man who paid/i],
  ['c3-route-broker', /Varris holds up the brass bridge map and Ordan’s murder order/i],
];
for (const [flag, expected] of lanternRouteProofs) {
  const routeBody = renderedBody('c3-bill', { ...chapterThreeBase, flags: [flag] });
  if (!expected.test(routeBody)) failures.push(`Lantern Bridge does not use the evidence earned on ${flag}`);
  if (!/Only one part remains outside the evidence/i.test(routeBody)
    || !/came from above my office/i.test(routeBody)) {
    failures.push(`Lantern Bridge does not isolate Ordan’s one new admission on ${flag}`);
  }
}
if (/why Ordan needed you and Lysara/i.test(confessionChoice?.label ?? '')
  || !confessionChoice?.addFlags?.includes('c3-stripped-ordan-command')) {
  failures.push('Lantern Bridge asks for an answer Ordan has already given');
}
const rennPlanChoice = nodes['c3-duplicate'].choices.find((choice) => choice.id === 'c3-ask-future-warning');
if (!rennPlanChoice?.addFlags?.includes('c3-routed-ordan-plan')
  || rennPlanChoice.addFlags.includes('c3-bridge-warning')) {
  failures.push('Renn’s bridge plan is still confused with knowledge about the thief');
}
const rennFightBody = renderedBody('c3-duplicate', {
  ...chapterThreeBase,
  flags: ['c3-mara-flanked-double'],
});
if (!/Renn steps across the road to the well/i.test(rennFightBody) || /warrant false/i.test(rennFightBody)) {
  failures.push('The Renn confrontation clears Caelan before the player finishes the fight');
}
const postRennBody = renderedBody('c3-courier', {
  ...chapterThreeBase,
  flags: ['c3-routed-ordan-plan'],
});
if (!/Only after Renn is defeated/i.test(postRennBody)
  || !/reopens the west service gate/i.test(postRennBody)
  || !/exactly where Ordan means to join/i.test(postRennBody)) {
  failures.push('The scene after Renn does not complete the fight, gate logistics, and plan payoff in order');
}
const rookMarketBody = renderedBody('c3-market-memory', chapterThreeBase);
const rescueIndex = rookMarketBody.indexOf('catches a falling child');
const keyIndex = rookMarketBody.indexOf('lift a silver key');
const wireIndex = rookMarketBody.indexOf('hook a fine wire');
if (rescueIndex < 0 || keyIndex <= rescueIndex || wireIndex <= keyIndex) {
  failures.push('Rook’s market setup is not presented as three clear actions in physical order');
}
const worldNailBody = renderedBody('c3-world-nail', chapterThreeBase);
if (!/Asterra’s crowned shields fill the opening/i.test(worldNailBody)
  || !/foreign border fort/i.test(worldNailBody)
  || !/First rank forward/i.test(worldNailBody)) {
  failures.push('The World Nail climax does not explain the army road’s origin and destination');
}
const pursueOrdanChoice = nodes['c3-world-nail'].choices.find((choice) => choice.id === 'c3-end-catch-courier');
if (!/hidden soldiers/i.test(pursueOrdanChoice?.label ?? '')
  || /hide the fragment/i.test(pursueOrdanChoice?.label ?? '')) {
  failures.push('The final Ordan choice still implies he possesses the stolen fragment');
}
const returnEnding = renderedBody('c3-ending-return', chapterThreeBase);
if (/did not see him plant/i.test(returnEnding)
  || !/already carries the fragment/i.test(returnEnding)) {
  failures.push('The return ending repeats or forgets Rook’s visible theft');
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
  ['shielded-opening', 'low-crisis', /every wounded traveller remains behind cover/i],
  ['c2-faced-creature', 'c2-threshold', /drew it away from every stretcher/i],
  ['c2-carried-nilo', 'c2-triage', /stopped the deepest bleeding early/i],
  ['c2-shielded-descent', 'c2-descend', /without losing anyone/i],
  ['c3-reached-house-first', 'c3-watch-house', /before the last route order burned/i],
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
  if (!expected.test(payoff)) failures.push(`Stored advantage ${flag} has no payoff in ${nodeId}`);
}

const chapterFourNailExplanation = [
  nodes['c4-nine-marks'].lesson?.body ?? '',
  ...nodes['c4-nine-marks'].body(chapterFourBase),
].join(' ');
if (!/fragment belongs to the Nail of Distance/i.test(chapterFourNailExplanation)
  || !/There are nine World Nails/i.test(chapterFourNailExplanation)
  || !/Bellweather and the Mileless Bridge used broken pieces/i.test(chapterFourNailExplanation)
  || !/Dragonspine guards another Nail/i.test(chapterFourNailExplanation)
  || /Bellweather was only one of nine Nails/i.test(chapterFourNailExplanation)) {
  failures.push('Chapter Four does not clearly distinguish the Nail of Distance, its broken pieces, and the other World Nails');
}
const chapterFourCollapse = renderedBody('c4-collapse', chapterFourBase);
if (!/ignore Ordan’s order to take everyone alive/i.test(chapterFourCollapse)) {
  failures.push('The Bell Arch collapse does not explicitly show Crown soldiers disobeying Ordan');
}
const openingCollapsePayoffs = [
  ['c4-group-secured', /guide rope you secured keeps the group together/i],
  ['c4-fast-pursuit', /early leap placed you close to the Bell Arch/i],
  ['c4-harrowfen-held', /road you anchored to Harrowfen stays behind the group/i],
];
for (const [flag, expected] of openingCollapsePayoffs) {
  const payoff = renderedBody('c4-collapse', { ...chapterFourBase, flags: [flag] });
  if (!expected.test(payoff)) failures.push(`Chapter Four opening choice ${flag} has no later callback`);
}
const woundedChoices = nodes['c4-wounded'].choices;
for (const choice of woundedChoices) {
  if (!choice.addFlags?.includes('c4-found-dispatch')) {
    failures.push(`Chapter Four wounded choice ${choice.id} loses Ordan’s satchel`);
  }
}
const earlyDispatchChoices = woundedChoices.filter((choice) => choice.addFlags?.includes('c4-read-dispatch-early'));
if (earlyDispatchChoices.length !== 1 || earlyDispatchChoices[0].id !== 'c4-let-rook-splint-brann') {
  failures.push('Chapter Four no longer keeps early access to Ordan’s dispatch unique to Rook’s splint route');
}
const earlyDispatchOpening = renderedBody('c4-duty', { ...chapterFourBase, flags: ['c4-read-dispatch-early'] });
if (!/reopen the royal dispatch you recovered while Rook treated Brann/i.test(earlyDispatchOpening)) {
  failures.push('Chapter Four does not remember that Caelan read Ordan’s dispatch early');
}
for (const choice of nodes['c4-nine-marks'].choices) {
  if (!choice.addFlags?.includes('c4-fragment-recovered')) {
    failures.push(`Chapter Four map choice ${choice.id} does not record recovery of the real fragment`);
  }
}
const searchedFragmentHandoff = renderedBody('c4-nine-marks', { ...chapterFourBase, flags: ['c4-searched-rook'] });
const bargainedFragmentHandoff = renderedBody('c4-nine-marks', { ...chapterFourBase, flags: ['c4-route-bargain'] });
const heardFragmentHandoff = renderedBody('c4-nine-marks', { ...chapterFourBase, flags: ['c4-heard-rook-out'] });
if (!/take the iron into your own hand/i.test(searchedFragmentHandoff)
  || !/places it on the stone/i.test(bargainedFragmentHandoff)
  || !/Then he lets go/i.test(heardFragmentHandoff)) {
  failures.push('Chapter Four does not explicitly return the real fragment on every Rook route');
}
const bridgeRoutePayoffs = [
  ['c4-snow-route', /upper squad.*last crossbow team/i],
  ['c4-storm-route', /soaked the Crown crossbows.*strings will need time/i],
  ['c4-brass-route', /brass wheels close behind.*find another way around/i],
];
for (const [flag, expected] of bridgeRoutePayoffs) {
  const payoff = renderedBody('c4-stage-turn', { ...chapterFourBase, flags: [flag] });
  if (!expected.test(payoff)) failures.push(`Chapter Four route ${flag} has no later pursuit payoff`);
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
if (!/gears close six times/i.test(brassMachineText)
  || !/remain open for a few seconds/i.test(brassMachineText)
  || !/step onto it during the pause.*get off before the teeth close/is.test(brassMachineText)
  || !/counting each of the six closures.*safe seconds/is.test(brassMachineText)
  || /Count to seven|missing beat|read their rhythm|make a road out of timing/i.test(brassMachineText)) {
  failures.push('Chapter Four brass machine does not explain its danger and safe crossing in physical order');
}
const rookShortcutPayoff = renderedBody('c4-soldiers', {
  ...chapterFourBase,
  flags: ['c4-rook-shortcut-left-pursuit'],
});
if (!/Saving your strength has made this fight larger/i.test(rookShortcutPayoff)) {
  failures.push('Rook’s stat free environmental shortcuts do not create a later drawback');
}
const bannerChoice = nodes['c4-collapse'].choices.find((choice) => choice.id === 'c4-use-hanging-banner');
const splintChoice = nodes['c4-wounded'].choices.find((choice) => choice.id === 'c4-let-rook-splint-brann');
if (!bannerChoice?.addFlags?.includes('c4-rook-lost-long-wire')
  || !/wire snaps/i.test(bannerChoice?.result ?? '')) {
  failures.push('Rook’s banner rescue still solves the collapse without consuming a useful tool');
}
if (!splintChoice?.addFlags?.includes('c4-rook-tore-coat-lining')
  || !/disguise visibly incomplete/i.test(splintChoice?.result ?? '')) {
  failures.push('Rook’s treatment of Brann still provides two benefits without weakening a later trick');
}
const damagedDisguise = renderedBody('c4-stage-turn', {
  ...chapterFourBase,
  flags: ['c4-snow-route', 'c4-rook-tore-coat-lining'],
});
if (!/disguise will work only at a distance/i.test(damagedDisguise)
  || !/(?:You recognise|Your hand makes) the western recall/i.test(damagedDisguise)) {
  failures.push('Rook’s first performance does not remember his cost or depend on Caelan’s military knowledge');
}
const theatreExplanation = renderedBody('c4-theatre-plan', chapterFourBase);
if (!/one small mirrored curtain/i.test(theatreExplanation)
  || !/single voice reed/i.test(theatreExplanation)
  || !/stage one clear lie/i.test(theatreExplanation)
  || !/repeat that same scene in three places/i.test(theatreExplanation)
  || /voice reeds/i.test(theatreExplanation)) {
  failures.push('Rook’s travelling theatre still creates three captains without a visible bridge mechanism');
}
const quietArchChoiceIds = new Set(nodes['c4-mara'].choices.map((choice) => choice.id));
if (!quietArchChoiceIds.has('c4-hear-lysara-private-risk')
  || !quietArchChoiceIds.has('c4-name-lysara-personal')
  || !quietArchChoiceIds.has('c4-keep-quiet-arch-platonic')
  || !quietArchChoiceIds.has('c4-return-to-duty')) {
  failures.push('The Chapter Four quiet arch still forces a private Mara scene');
}
const lysaraTruthChoice = nodes['c4-mara'].choices.find((choice) => choice.id === 'c4-hear-lysara-private-risk');
const lysaraInterestChoice = nodes['c4-mara'].choices.find((choice) => choice.id === 'c4-name-lysara-personal');
const lysaraTruthEffects = relationshipChanges(lysaraTruthChoice);
const lysaraInterestEffects = relationshipChanges(lysaraInterestChoice);
if (!/promise not to ask her to soften the truth/i.test(lysaraTruthChoice?.label ?? '')
  || (lysaraTruthEffects.lysara?.attraction ?? 0) !== 0
  || lysaraTruthEffects.lysara?.intent) {
  failures.push('Lysara’s private truth choice still grants unchosen attraction or an unselected promise');
}
if ((lysaraInterestEffects.lysara?.attraction ?? 0) <= 0
  || lysaraInterestEffects.lysara?.intent !== 'exploring') {
  failures.push('Chapter Four has no explicit player choice for personal interest in Lysara');
}
const maraAbsentState = { ...chapterFourBase, flags: ['c4-mara-escorted-brann', 'c4-snow-route'] };
const maraAbsentCrossing = [
  renderedBody('c4-three-spans', maraAbsentState),
  renderedBody('c4-snow-span', maraAbsentState),
  renderedBody('c4-stage-turn', maraAbsentState),
].join(' ');
if (/Mara sets one hand|Mara presses close|Mara stares at Rook/i.test(maraAbsentCrossing)
  || !/Lysara tightens the green thread/i.test(maraAbsentCrossing)
  || !/One Harrowfen guard misses the rope/i.test(maraAbsentCrossing)) {
  failures.push('Chapter Four places Mara or Brann back on the bridge before Mara returns from Harrowfen');
}
const maraReturn = renderedBody('c4-mara', maraAbsentState);
if (!/Mara returns along Lysara’s guide rope.*Brann is safe in Harrowfen/is.test(maraReturn)) {
  failures.push('Chapter Four does not visibly return Mara after she escorts Brann to Harrowfen');
}
const capturedOrdanFight = renderedBody('c4-soldiers', { ...chapterFourBase, flags: ['c4-captured-ordan'] });
const absentOrdanFight = renderedBody('c4-soldiers', { ...chapterFourBase, flags: ['c4-ordan-lower-road'] });
if (!/bound Ordan/i.test(capturedOrdanFight)
  || /bound Ordan/i.test(absentOrdanFight)
  || !/every witness/i.test(absentOrdanFight)) {
  failures.push('Chapter Four Crown fight does not remember whether Ordan is a prisoner');
}
const chapterFourEndIds = ['c4-ending-arrest', 'c4-ending-bargain', 'c4-ending-trust'];
for (const endingId of chapterFourEndIds) {
  const limitedCopyEnding = renderedBody(endingId, {
    ...chapterFourBase,
    flags: ['c4-denied-rook-copy'],
  });
  const fullCopyEnding = renderedBody(endingId, {
    ...chapterFourBase,
    flags: ['c4-rook-full-copy'],
  });
  if (!/only the northern mark and two blurred roads/i.test(limitedCopyEnding)) {
    failures.push(`${endingId} forgets that Caelan denied Rook a complete map copy`);
  }
  if (!/complete nine mark wax copy/i.test(fullCopyEnding)) {
    failures.push(`${endingId} forgets that Caelan permitted Rook’s complete map copy`);
  }
}
const arrestEnding = renderedBody('c4-ending-arrest', {
  ...chapterFourBase,
  flags: ['c4-rook-full-copy'],
});
if (!/cuff that held his wrist locked around a bridge chain/i.test(arrestEnding)
  || !/His wrist is bare/i.test(arrestEnding)
  || !/Underways/i.test(arrestEnding)
  || /around your wrist|like a bracelet/i.test(arrestEnding)) {
  failures.push('The Chapter Four arrest ending places the cuff incorrectly or erases the arrest choice');
}
const capturedOrdanTrustEnding = renderedBody('c4-ending-trust', {
  ...chapterFourBase,
  flags: ['c4-captured-ordan', 'c4-rook-trusted'],
});
const lostOrdanTrustEnding = renderedBody('c4-ending-trust', {
  ...chapterFourBase,
  flags: ['c4-ordan-lower-road', 'c4-rook-trusted'],
});
if (!/bound Ordan/i.test(capturedOrdanTrustEnding)
  || /bound Ordan|the prisoner/i.test(lostOrdanTrustEnding)
  || !/Ordan is already gone on the lower road/i.test(lostOrdanTrustEnding)) {
  failures.push('The Chapter Four trust ending does not remember Ordan’s route');
}
const rookBargainChoice = nodes['c4-duty'].choices.find((choice) => choice.id === 'c4-bargain-with-rook');
if (!/one honest warning/i.test(rookBargainChoice?.advantage ?? '')
  || !/one honest warning/i.test(rookBargainChoice?.result ?? '')
  || /per day|daily warning/i.test(`${rookBargainChoice?.advantage ?? ''} ${rookBargainChoice?.result ?? ''}`)) {
  failures.push('Rook’s Chapter Four bargain still promises more than one honest warning');
}
if (/paid Ordan|payment below/i.test(chapterFourSource + chapterFiveSource)) {
  failures.push('Chapter Four or Five still claims Rook’s buyer financed Ordan without evidence');
}

const chapterFiveRookImports = [
  ['c4-rook-arrested', /escaped your cuff.*Underways.*mirrored coin/i],
  ['c4-rook-bargain', /Underways.*mirrored coin.*warning/i],
  ['c4-rook-trusted', /chose the Underways.*silver knot/i],
];
for (const [flag, expected] of chapterFiveRookImports) {
  const arrival = renderedBody('c5-north-road', { ...chapterFiveBase, flags: [flag] });
  if (!expected.test(arrival)) failures.push(`Chapter Five forgets Rook import ${flag}`);
}
const chapterFiveShelterRookImports = [
  ['c4-rook-arrested', /mirrored coin Rook abandoned/i],
  ['c4-rook-bargain', /Rook’s warning coin/i],
  ['c4-rook-trusted', /silver knot Rook left/i],
];
for (const [flag, expected] of chapterFiveShelterRookImports) {
  const shelter = renderedBody('c5-glass-shelter', { ...chapterFiveBase, flags: [flag] });
  if (!expected.test(shelter)) failures.push(`The Chapter Five shelter does not preserve Rook’s parting legacy for ${flag}`);
}
const capturedOrdanArrival = renderedBody('c5-north-road', {
  ...chapterFiveBase,
  flags: ['c4-rook-bargain', 'c4-captured-ordan'],
});
if (!/Elene took him into Harrowfen custody/i.test(capturedOrdanArrival)) {
  failures.push('Chapter Five does not account for captured Ordan before the climb');
}
const chapterFiveRouteImports = [
  ['c4-snow-route', /resembles the flame from the bridge’s mountain span/i],
  ['c4-storm-route', /miss the storm span/i],
  ['c4-brass-route', /measured turning of the bridge’s brass chamber/i],
];
for (const [flag, expected] of chapterFiveRouteImports) {
  const arrival = renderedBody('c5-north-road', {
    ...chapterFiveBase,
    flags: ['c4-rook-bargain', flag],
  });
  if (!expected.test(arrival)) failures.push(`Chapter Five forgets bridge route ${flag}`);
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
  failures.push('Vaor forgets that Caelan asked permission before touching a memory');
}
const extractionOrderAssault = renderedBody('c5-crown-assault', {
  ...chapterFiveBase,
  flags: ['c5-has-extraction-order'],
});
if (!/line permitting Vaor’s death/i.test(extractionOrderAssault)) {
  failures.push('The Crown assault does not pay off the recovered extraction order');
}
for (const [id, node] of Object.entries(nodes)) {
  if (!id.startsWith('c5-')) continue;
  for (const choice of node.choices) {
    if ((choice.changes?.health ?? 0) > 0) {
      failures.push(`Chapter Five restores Health inside cold fire: ${choice.id}`);
    }
  }
}
const memoryGlassExplanation = [
  nodes['c5-memory-wall'].lesson?.body ?? '',
  ...nodes['c5-memory-wall'].body(chapterFiveBase),
].join(' ');
if (!/small scene moves without sound/i.test(memoryGlassExplanation)
  || !/(?:Vaor’s own memories.*bars of his prison|memories have become his cage)/i.test(memoryGlassExplanation)) {
  failures.push('Chapter Five does not plainly distinguish memory glass from alternate timelines');
}
const chapterFiveOpening = [
  nodes['c5-north-road'].objective,
  ...nodes['c5-north-road'].body(chapterFiveBase),
].join(' ');
const coldCrossing = nodes['c5-north-road'].choices.find((choice) => choice.id === 'c5-cross-in-shadow');
if (/extract its ember/i.test(nodes['c5-north-road'].objective)
  || !/black glass.*steals enough heat/i.test(chapterFiveOpening)
  || !/shallow cold burn.*not a loss of Health/i.test(chapterFiveOpening)
  || !/glass chilled cloth/i.test(coldCrossing?.label ?? '')) {
  failures.push('Chapter Five either names the ember too early or lets darkness hide body heat from cold fire');
}
const sorinRescue = renderedBody('c5-coldfire-rescue', chapterFiveBase);
const sorinShelter = renderedBody('c5-glass-shelter', chapterFiveBase);
if (/Vaor|survey force|soldiers died|survivors carried/i.test(sorinRescue)
  || !/Once he can breathe without shaking.*Vaor is an ancient dragon/i.test(sorinShelter)) {
  failures.push('Sorin still delivers the Dragonspine history dump while trapped beneath the glass');
}
const royalCamp = renderedBody('c5-royal-camp', chapterFiveBase);
const decodedRoyalCamp = renderedBody('c5-royal-camp', {
  ...chapterFiveBase,
  flags: ['c5-decoded-parting-clue'],
});
if (!/living ember, a piece of Vaor’s own fire/i.test(royalCamp)
  || /buyer knew this camp/i.test(royalCamp)
  || !/buyer knew this camp.*moved east/i.test(decodedRoyalCamp)) {
  failures.push('The royal camp does not introduce the ember plainly or continue the buyer thread');
}
const ashTunnel = renderedBody('c5-ash-tunnel', chapterFiveBase);
if (!/four sharp notes.*old keeper signal for a collapse/i.test(ashTunnel)) {
  failures.push('Sorin’s keeper collapse signal is not demonstrated before the ash tunnel choice');
}
const vaorMeeting = renderedBody('c5-vaor-wakes', chapterFiveBase);
if (!/broken cage is the fire Nail/i.test(vaorMeeting)
  || !/warm light inside Vaor is his living ember/i.test(vaorMeeting)
  || !/fragment came from the Nail of Distance/i.test(vaorMeeting)
  || !/not part of the fire Nail/i.test(vaorMeeting)
  || !/all nine Nails use the same kind of lock/i.test(vaorMeeting)
  || /belongs to its outer ring/i.test(vaorMeeting)) {
  failures.push('Vaor’s meeting does not distinguish the Distance fragment, fire Nail, and living ember');
}
const mirrorLockChoice = nodes['c5-vaor-wakes'].choices.find((choice) => choice.id === 'c5-test-lock-with-mirror');
if (!/mirrored coin/i.test(mirrorLockChoice?.result ?? '')
  || !/snaps the coin in half/i.test(mirrorLockChoice?.result ?? '')
  || /missing boot/i.test(chapterFiveSource)) {
  failures.push('The parting mirror does not visibly reveal the lock and get consumed');
}
const sealChoice = nodes['c5-royal-camp'].choices.find((choice) => choice.id === 'c5-use-command-seal');
const falseEmberRouteChoice = nodes['c5-crown-assault'].choices.find((choice) => choice.id === 'c5-stage-reflected-ember');
const mapWaxChoice = nodes['c5-heart-memory'].choices.find((choice) => choice.id === 'c5-copy-proof-into-map-wax');
const vaorClawChoice = nodes['c5-crown-assault'].choices.find((choice) => choice.id === 'c5-free-claw-against-crown');
if (isChoiceVisible(sealChoice, chapterFiveBase)
  || !isChoiceVisible(sealChoice, { ...chapterFiveBase, flags: ['c5-decoded-parting-clue'] })) {
  failures.push('The commander seal appears without decoding Rook’s parting clue');
}
if (isChoiceVisible(mirrorLockChoice, { ...chapterFiveBase, flags: ['c4-rook-trusted'] })
  || !isChoiceVisible(mirrorLockChoice, { ...chapterFiveBase, flags: ['c4-rook-arrested'] })
  || !isChoiceVisible(mirrorLockChoice, { ...chapterFiveBase, flags: ['c4-rook-bargain'] })) {
  failures.push('Vaor’s lock does not preserve which Chapter Four routes carry a mirrored coin');
}
if (isChoiceVisible(falseEmberRouteChoice, chapterFiveBase)
  || !isChoiceVisible(falseEmberRouteChoice, { ...chapterFiveBase, flags: ['c5-spent-parting-coin'] })) {
  failures.push('The false ember appears before the mirrored coin breaks');
}
if (isChoiceVisible(mapWaxChoice, { ...chapterFiveBase, flags: ['c4-rook-bargain'] })
  || !isChoiceVisible(mapWaxChoice, { ...chapterFiveBase, flags: ['c4-rook-trusted'] })) {
  failures.push('The Orivane memory copy does not preserve the trust route’s map wax');
}
if (isChoiceVisible(vaorClawChoice, chapterFiveBase)
  || !isChoiceVisible(vaorClawChoice, { ...chapterFiveBase, flags: ['c5-freed-vaor-claw'] })) {
  failures.push('Vaor can strike through a claw the player did not free');
}
if (/Romance is not assumed|without entering a romance scene|chosen companion|six convincing thieves/i.test(chapterFiveSource)) {
  failures.push('Chapter Five still exposes design language or a stale Rook reference to the player');
}
const vaorQuestion = renderedBody('c5-vaor-test', chapterFiveBase);
if (!/people of those who chained me/i.test(vaorQuestion)
  || !/A century ago.*Two nights ago/is.test(vaorQuestion)
  || /world that buried its price/i.test(vaorQuestion)) {
  failures.push('Vaor asks about the Concord’s hidden price before showing it');
}
const haleAssault = renderedBody('c5-crown-assault', chapterFiveBase);
if (!/cold fire leaves these mountains.*next winter kills three provinces/i.test(haleAssault)
  || !/world survive long enough to condemn me/i.test(haleAssault)
  || !/Stopping the drill comes first/i.test(haleAssault)) {
  failures.push('Commander Hale still lacks a distinct motive or a direct response from Caelan');
}
const haleArrivalCases = [
  [['c5-crown-lost-trail'], /only six enter behind him/i],
  [['c5-crown-saw-flare'], /flare showed him exactly which grave door/i],
  [['c5-diverted-patrol-with-seal'], /false order sent the returning patrol downhill/i],
  [['c5-silenced-archers'], /denied Hale a warning/i],
  [['c5-trapped-drill-crew'], /smaller cutting frame.*Ash grinds inside its gears/i],
  [['c5-sorin-revealed-to-crown'], /keeper warning told Hale which tunnel/i],
  [['c5-slow-shadow-crossing'], /slow first crossing gave the returning patrol time/i],
];
for (const [flags, expected] of haleArrivalCases) {
  const arrival = renderedBody('c5-crown-assault', { ...chapterFiveBase, flags });
  if (!expected.test(arrival)) failures.push(`Hale’s arrival forgets Chapter Five route ${flags.join(', ')}`);
}
const haleOrderChoice = nodes['c5-crown-assault'].choices.find((choice) => choice.id === 'c5-turn-hale-soldiers');
const falseEmberChoice = nodes['c5-crown-assault'].choices.find((choice) => choice.id === 'c5-stage-reflected-ember');
if (/read what he ordered/i.test(haleOrderChoice?.label ?? '')
  || !/written order, the abandoned dead, or the killing drill/i.test(haleOrderChoice?.detail ?? '')
  || !/false ember/i.test(falseEmberChoice?.label ?? '')) {
  failures.push('The Hale assault choices still assume evidence the player may not have or hide the reflected decoy');
}
const assaultResolutions = [
  ['c5-break-royal-drill', /drill tears itself apart.*Hale retreats/i],
  ['c5-turn-hale-soldiers', /drill stops.*Hale retreats/i],
  ['c5-stage-reflected-ember', /stopping the drill.*forcing Hale behind/i],
  ['c5-free-claw-against-crown', /crushes the drill.*Hale throws himself behind/i],
];
for (const [choiceId, expected] of assaultResolutions) {
  const choice = nodes['c5-crown-assault'].choices.find((candidate) => candidate.id === choiceId);
  if (!expected.test(choice?.result ?? '')) {
    failures.push(`The battle does not reach a temporary resolution before Vaor’s memory after ${choiceId}`);
  }
}
const heartMemory = renderedBody('c5-heart-memory', chapterFiveBase);
if (!/drill stopped and Hale forced behind/i.test(heartMemory)
  || !/two living versions of the same village/i.test(heartMemory)
  || !/families are awake/i.test(heartMemory)
  || !/rulers knew both villages already held living people/i.test(heartMemory)
  || /Children who might have been born|Towns that might have grown/i.test(heartMemory)) {
  failures.push('Orivane’s memory remains abstract or begins before the assault is contained');
}
const graveCollapse = renderedBody('c5-grave-collapse', chapterFiveBase);
if (!/points to a red release beside the oldest shelf/i.test(graveCollapse)) {
  failures.push('Sorin does not visibly establish the emergency gallery release before the collapse choice');
}
const maraAfterBridgeKiss = renderedBody('c5-mara-burns', {
  ...chapterFiveBase,
  flags: ['c4-kissed-mara'],
});
if (!/bridge returns in a flash.*her mouth on yours/i.test(maraAfterBridgeKiss)) {
  failures.push('Mara’s Chapter Five scene forgets the Chapter Four kiss');
}
const graveEntryChoice = nodes['c5-grave-mouth'].choices[0];
const memoryChoice = nodes['c5-memory-wall'].choices[0];
const lysaraCareState = { ...chapterFiveBase, flags: ['c5-chose-lysara-care'] };
const maraCareState = { ...chapterFiveBase, flags: ['c5-chose-mara-care'] };
const professionalCareState = { ...chapterFiveBase, flags: ['c5-chose-sorin-care'] };
if (resolveNext(graveEntryChoice, lysaraCareState) !== 'c5-memory-wall'
  || resolveNext(memoryChoice, lysaraCareState) !== 'c5-lysara-burns'
  || resolveNext(memoryChoice, maraCareState) !== 'c5-mara-burns'
  || resolveNext(memoryChoice, professionalCareState) !== 'c5-sorin-care') {
  failures.push('Chapter Five does not honour the player’s visible choice of caregiver');
}
for (const choice of nodes['c5-memory-wall'].choices) {
  const next = resolveNext(choice, maraCareState);
  if (next !== 'c5-mara-burns') failures.push(`${choice.id} skips the caregiver selected in Sorin’s refuge`);
}
for (const choice of nodes['c5-mara-burns'].choices) {
  if (resolveNext(choice, maraCareState) !== 'c5-vaor-wakes') {
    failures.push(`${choice.id} returns to a memory gallery scene the player already crossed`);
  }
}
const approachPayoffs = [
  ['c5-stair-formation', /every rope and climbing hook intact/i],
  ['c5-silenced-archers', /No warning horn follows from the stair/i],
  ['c5-stair-scorched-thread', /Three burned strands hang from Lysara’s seed/i],
  ['c5-river-oath-path', /sealed keeper door.*opens directly beside the grave/i],
  ['c5-river-dark-crossing', /No royal scout follows/i],
  ['c5-seed-scorched-river', /seed is scorched.*not enough to hide the whole group/i],
  ['c5-held-ash-beam', /Every companion and evidence pack made it through/i],
  ['c5-trapped-drill-crew', /buried drill is silent/i],
  ['c5-sorin-revealed-to-crown', /Hale heard Sorin’s keeper warning/i],
];
for (const [flag, expected] of approachPayoffs) {
  const payoff = renderedBody('c5-grave-mouth', { ...chapterFiveBase, flags: [flag] });
  if (!expected.test(payoff)) failures.push(`Chapter Five mountain route ${flag} has no later callback`);
}
const fullGuidePayoff = renderedBody('c5-three-climbs', { ...chapterFiveBase, flags: ['c5-sorin-full-guide'] });
if (!/undamaged map case shows the archers.*keeper hatch.*weak beam/i.test(fullGuidePayoff)) {
  failures.push('Saving Sorin with his full map no longer improves the route briefing');
}
const chapterTwoFriendship = nodes['c2-night-watch'].choices.find((choice) => choice.id === 'c2-choose-mara-friendship');
const friendshipState = nextRelationships(initialState.relationships, chapterTwoFriendship);
if (friendshipState.mara.intent !== 'platonic' || friendshipState.mara.respect <= initialState.relationships.mara.respect) {
  failures.push('The Chapter Two friendship choice is not a complete, strengthening relationship path');
}
for (const choiceId of ['c3-stand-with-mara', 'c3-stand-with-lysara']) {
  const choice = Object.values(nodes).flatMap((node) => node.choices).find((candidate) => candidate.id === choiceId);
  const effects = Object.values(relationshipChanges(choice)).flatMap((change) => [change?.attraction ?? 0]);
  if (effects.some((value) => value !== 0)) {
    failures.push(`Tactical agreement still awards romantic attraction: ${choiceId}`);
  }
}
const lysaraKissChoice = nodes['c5-lysara-burns'].choices.find((choice) => choice.id === 'c5-kiss-lysara-after-truth');
const openMaraBondState = {
  ...chapterFiveBase,
  relationships: {
    mara: { ...initialState.relationships.mara, trust: 6, attraction: 5, intent: 'exploring' },
    lysara: { ...initialState.relationships.lysara, trust: 6, attraction: 5, intent: 'interested' },
  },
};
const resolvedMaraBondState = {
  ...openMaraBondState,
  relationships: {
    ...openMaraBondState.relationships,
    mara: { ...openMaraBondState.relationships.mara, intent: 'platonic' },
  },
};
if (canChoose(lysaraKissChoice, openMaraBondState) || !canChoose(lysaraKissChoice, resolvedMaraBondState)) {
  failures.push('Chapter Five allows a new commitment before an existing romance is honestly resolved');
}
const lysaraCollapse = renderedBody('c5-grave-collapse', lysaraCareState);
const sorinCollapse = renderedBody('c5-grave-collapse', professionalCareState);
const lysaraPactEnding = renderedBody('c5-ending-pact', {
  ...lysaraCareState,
  flags: [...lysaraCareState.flags, 'c5-kissed-lysara'],
});
if (!/first step is toward Lysara/i.test(lysaraCollapse)
  || !/first step is toward Sorin/i.test(sorinCollapse)
  || !/Lysara asks you to repeat the last promise/i.test(lysaraPactEnding)) {
  failures.push('Chapter Five returns the emotional camera to Mara after another caregiver was chosen');
}
const pactChoice = nodes['c5-ember-choice'].choices.find((choice) => choice.id === 'c5-pact-with-vaor');
const pactEnding = renderedBody('c5-ending-pact', chapterFiveBase);
if (!/protective glass shell he can break/i.test(pactChoice?.result ?? '')
  || !/no longer chained.*break free when he is ready/i.test(pactEnding)) {
  failures.push('The pact ending leaves Vaor’s physical captivity unresolved');
}
const freedomChoice = nodes['c5-ember-choice'].choices.find((choice) => choice.id === 'c5-free-vaor');
if (!/controls when it answers.*frightened kingdoms will know you released him/i.test(freedomChoice?.advantage ?? '')) {
  failures.push('Freeing Vaor remains a dominant ending without a clear future risk');
}
const savedCompanionChoice = nodes['c5-grave-collapse'].choices.find((choice) => choice.id === 'c5-guard-mara-collapse');
if (savedCompanionChoice?.addFlags?.includes('c5-saved-mara-from-glass')
  || !savedCompanionChoice?.addFlags?.includes('c5-saved-chosen-companion')
  || /chosen companion/i.test(savedCompanionChoice?.label ?? '')) {
  failures.push('The grave collapse still records Mara when another caregiver may be trapped');
}
const emberChoiceBody = renderedBody('c5-ember-choice', chapterFiveBase);
if (/No option protects every claim/i.test(emberChoiceBody)) {
  failures.push('The ember choice still tells the player how to judge its balance');
}
for (const endingId of ['c5-ending-free', 'c5-ending-force', 'c5-ending-pact']) {
  const ending = [nodes[endingId].objective, ...nodes[endingId].body(chapterFiveBase)].join(' ');
  if (!/moving orc town/i.test(ending) || /Black Gate/.test(ending)) {
    failures.push(`${endingId} does not define Kharad Vey simply before withholding the Gate’s proper name`);
  }
  if (!/separate from the damaged Nail left in the mountain/i.test(ending)
    || /part of the fire Nail/i.test(ending)) {
    failures.push(`${endingId} confuses Vaor’s living ember with the fire Nail`);
  }
}
for (const endingId of ['c5-ending-free', 'c5-ending-force', 'c5-ending-pact']) {
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
if (!/promised to meet you here, not to obey/i.test(chapterSixArrivalGiven)
  || !/ember you tore from Vaor/i.test(chapterSixArrivalTaken)
  || !/Vaor moves inside your thoughts/i.test(chapterSixArrivalPact)) {
  failures.push('Chapter Six does not preserve all three Vaor outcomes at arrival');
}
const maraFriendshipArrival = renderedBody('c6-steppe-road', {
  ...chapterSixBase,
  flags: ['c5-freed-vaor', 'c5-mara-friendship'],
});
const lysaraFriendshipArrival = renderedBody('c6-steppe-road', {
  ...chapterSixBase,
  flags: ['c5-freed-vaor', 'c5-lysara-friendship'],
});
if (/friendship|unanswered promise|Underways|Rook chose|Rook is following|escaped your arrest/i.test(maraFriendshipArrival)
  || /friendship|unanswered promise|Underways|Rook chose|Rook is following|escaped your arrest/i.test(lysaraFriendshipArrival)) {
  failures.push('Chapter Six opening recaps absent companions or relationship history before the moving-city danger');
}
if (nodes['c6-steppe-road'].introducesStoryTerms?.includes('Black Gate')
  || !nodes['c6-first-duty'].introducesStoryTerms?.includes('Black Gate')) {
  failures.push('Chapter Six names the Black Gate before Korran explains the name');
}
const chapterSixOpening = renderedBody('c6-steppe-road', chapterSixBase);
if (!/red grass.*wheel tracks/is.test(chapterSixOpening)
  || !/twelve wooden platforms.*wheels are taller than a gatehouse/is.test(chapterSixOpening)
  || !/Ancestor storm.*honoured dead/is.test(chapterSixOpening)
  || /six days|fourth night|Crown riders|Black Gate/i.test(chapterSixOpening)) {
  failures.push('Chapter Six opening does not stay focused on the steppe, the moving town, and the immediate storm');
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
if (/Black Gate|nearest watch forts/i.test(chapterSixMootJournal)
  || !/black stone.*Black Gate/is.test(chapterSixDutyJournal)
  || /watch forts|gone dark/i.test(chapterSixTermsJournal)
  || !/Black Gate.*watch forts/is.test(chapterSixAfterTermsJournal)
  || /Unsea|new knowledge/i.test(chapterSixRevealJournal)
  || !/Unsea.*did not prove/is.test(chapterSixAfterRevealJournal)) {
  failures.push('Chapter Six journal confirms the Gate or Unsea before the playable scene proves it');
}
const emberOriginChoices = nodes['c6-ancestor-warning'].choices.filter(
  (choice) => choice.addFlags?.includes('c6-declared-ember-origin'),
);
const emberOriginCases = [
  ['c5-freed-vaor', 'c6-declare-given-ember', /Vaor gave the ember and kept his freedom/i],
  ['c5-took-ember-by-force', 'c6-confess-stolen-ember', /admit the theft.*Korran does not forgive/is],
  ['c5-vaor-pact', 'c6-declare-pact-ember', /two living wills chose the bond/i],
];
for (const [routeFlag, expectedId, expectedResult] of emberOriginCases) {
  const state = { ...chapterSixBase, flags: [routeFlag] };
  const visible = emberOriginChoices.filter((choice) => isChoiceVisible(choice, state));
  if (visible.length !== 1
    || visible[0].id !== expectedId
    || !expectedResult.test(visible[0].result)) {
    failures.push(`Chapter Six does not give ${routeFlag} a distinct public ember account`);
  }
}
const stormPactArrival = renderedBody('c6-ancestor-warning', {
  ...chapterSixBase,
  flags: ['c5-vaor-pact'],
});
if (/became afraid/i.test(stormPactArrival)
  || !/Something else is speaking with them/i.test(stormPactArrival)) {
  failures.push('Vaor concludes that the storm feels fear before the player performs the test');
}
const stormTrace = renderedBody('c6-storm-trace', chapterSixBase);
if (!/left by Dragonspine last week.*mother died two winters ago/is.test(stormTrace)) {
  failures.push('The new scar test does not give the player an understandable chronology');
}
const vaorFearChoice = nodes['c6-storm-trace'].choices.find(
  (choice) => choice.id === 'c6-ask-vaor-hear-fear',
);
if (isChoiceVisible(vaorFearChoice, { ...chapterSixBase, flags: ['c5-freed-vaor'] })
  || isChoiceVisible(vaorFearChoice, { ...chapterSixBase, flags: ['c5-took-ember-by-force'] })
  || !isChoiceVisible(vaorFearChoice, { ...chapterSixBase, flags: ['c5-vaor-pact'] })) {
  failures.push('The direct Vaor storm test appears when Vaor is not sharing Caelan’s thoughts');
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
  flags: ['c6-compared-living-records'],
});
if (!/hidden source.*does not tell you whether/is.test(unseaSourceFinding)
  || !/perfect copy.*proves depth, not identity/is.test(unseaMemoryFinding)
  || !/reaction looks like fear.*cannot prove/is.test(unseaFearFinding)
  || !/feeding the storm new knowledge now/i.test(unseaRecordFinding)
  || !/do not know whether its faces are truly the dead or only copies/i.test(nodes['c6-impossible-memory'].lesson?.body ?? '')) {
  failures.push('Chapter Six grants the same Unsea conclusion regardless of the selected test');
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
if (canChoose(ilyraInterestChoice, openMaraChapterSix)
  || !canChoose(ilyraInterestChoice, unattachedChapterSix)) {
  failures.push('Ilyra attraction does not respect Caelan’s existing relationship commitments');
}
const ilyraInterestState = nextRelationships(
  unattachedChapterSix.relationships,
  ilyraInterestChoice,
);
if (ilyraInterestState.ilyra.intent !== 'interested'
  || ilyraInterestState.ilyra.attraction <= unattachedChapterSix.relationships.ilyra.attraction) {
  failures.push('Chapter Six does not record the player’s explicit interest in Ilyra');
}
const unattachedIlyraEntry = renderedBody('c6-ilyra-entry', unattachedChapterSix);
if (/Attraction reaches you|The interest is real|delayed permission/i.test(unattachedIlyraEntry)
  || !/What you feel about it remains yours to decide/i.test(unattachedIlyraEntry)
  || !/badge says duty.*people say protection.*reaction says/is.test(unattachedIlyraEntry)) {
  failures.push('Ilyra’s entrance asserts attraction or treats Threadread as exact mind reading');
}
const finalWarChoice = nodes['c6-final-alliance'].choices.find(
  (choice) => choice.id === 'c6-ask-red-war',
);
const finalAllianceChoice = nodes['c6-final-alliance'].choices.find(
  (choice) => choice.id === 'c6-ask-guarded-alliance',
);
const strongMootState = {
  ...chapterSixBase,
  flags: ['c5-freed-vaor', 'c6-service-won-moot', 'c6-korran-respect', 'c6-declared-ember-origin'],
};
const mixedMootState = {
  ...chapterSixBase,
  flags: ['c5-freed-vaor', 'c6-service-won-moot'],
};
const concealedTheftState = {
  ...chapterSixBase,
  flags: ['c5-took-ember-by-force', 'c6-trial-won-moot'],
};
const admittedTheftState = {
  ...chapterSixBase,
  flags: ['c5-took-ember-by-force', 'c6-admitted-ember-theft', 'c6-declared-ember-origin', 'c6-trial-won-moot'],
};
if (!isChoiceVisible(finalWarChoice, strongMootState)
  || isChoiceVisible(finalWarChoice, mixedMootState)
  || !isChoiceVisible(finalAllianceChoice, mixedMootState)
  || isChoiceVisible(finalAllianceChoice, concealedTheftState)
  || !isChoiceVisible(finalAllianceChoice, admittedTheftState)) {
  failures.push('Chapter Six support requests ignore the trust and ember honesty earned before the Moot');
}
const warInterestEnding = renderedBody('c6-ending-war', {
  ...chapterSixBase,
  flags: ['c6-ilyra-interest-acknowledged'],
});
const warBoundaryEnding = renderedBody('c6-ending-war', {
  ...chapterSixBase,
  flags: ['c6-refused-ilyra-pressure'],
});
if (!/kept politics and desire separate/i.test(warInterestEnding)
  || !/Evidence without theatre/i.test(warBoundaryEnding)
  || /curiosity/i.test(warBoundaryEnding)) {
  failures.push('The Chapter Six war ending forgets how the player answered Ilyra');
}
const chapterSixEndingFlags = {
  'c6-ending-war': 'c6-red-moot-war',
  'c6-ending-alliance': 'c6-red-moot-alliance',
  'c6-ending-neutral': 'c6-red-moot-neutral',
};
for (const [endingId, flag] of Object.entries(chapterSixEndingFlags)) {
  const finalChoice = nodes['c6-final-alliance'].choices.find((choice) => choice.next === endingId);
  if (!finalChoice?.addFlags?.includes(flag) || finalChoice.changes?.wayfire !== 2) {
    failures.push(`${endingId} does not record its Moot outcome with equal Wayfire`);
  }
}
for (const endingId of Object.keys(chapterSixEndingFlags)) {
  if (nodes[endingId].nextChapter !== 'c7-red-horizon') {
    failures.push(`${endingId} does not continue into Chapter Seven`);
  }
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
  [chapterSevenWarState, /All twelve platforms of Kharad Vey are turning east/i, /inner decks/i],
  [chapterSevenAllianceState, /Kharad Vey moves on a safer southern line/i, /shield engines/i],
  [chapterSevenNeutralState, /wheel town turns south/i, /split Black Ridge/i],
];
for (const [state, expectedBody, expectedChoice] of supportArrivalCases) {
  const body = renderedBody('c7-red-horizon', state);
  const visibleLabels = nodes['c7-red-horizon'].choices
    .filter((choice) => isChoiceVisible(choice, state))
    .map((choice) => choice.label)
    .join(' ');
  if (!expectedBody.test(body) || !expectedChoice.test(visibleLabels)) {
    failures.push('Chapter Seven does not preserve the physical battlefield created by a Chapter Six support outcome');
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
if (!isChoiceVisible(wheelFeint, chapterSevenWarState)
  || isChoiceVisible(wheelFeint, chapterSevenAllianceState)
  || !isChoiceVisible(shieldFeint, chapterSevenAllianceState)
  || isChoiceVisible(shieldFeint, chapterSevenNeutralState)
  || !isChoiceVisible(ridgeFeint, chapterSevenNeutralState)) {
  failures.push('Chapter Seven offers wheel town actions on routes where Kharad Vey is absent');
}
const lioStates = {
  prisoner: { ...chapterSevenBase, flags: ['c7-lio-prisoner', 'c7-lio-alive'] },
  returned: { ...chapterSevenBase, flags: ['c7-lio-returned', 'c7-lio-alive'] },
  joined: { ...chapterSevenBase, flags: ['c7-lio-joined', 'c7-lio-alive'] },
  guarded: { ...chapterSevenBase, flags: ['c7-lio-under-guard', 'c7-lio-consented-threadread', 'c7-lio-alive'] },
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
    (choice) => funeralChoiceIds.has(choice.id) && isChoiceVisible(choice, state),
  );
  if (visible.length !== 1 || visible[0].id !== expectedFuneralChoice[status]) {
    failures.push(`Chapter Seven gives ${status} Lio an impossible funeral action`);
  }
}
const lioRescueChoice = nodes['c7-many-or-one'].choices.find(
  (choice) => choice.id === 'c7-lio-crosses-for-one',
);
const terenRescueChoice = nodes['c7-many-or-one'].choices.find(
  (choice) => choice.id === 'c7-teren-sends-engineers',
);
if (!isChoiceVisible(lioRescueChoice, lioStates.joined)
  || isChoiceVisible(lioRescueChoice, lioStates.prisoner)
  || isChoiceVisible(lioRescueChoice, lioStates.returned)
  || isChoiceVisible(lioRescueChoice, lioStates.guarded)) {
  failures.push('Lio can cross the final signal frame without joining Caelan');
}
if (isChoiceVisible(terenRescueChoice, lioStates.joined)
  || !isChoiceVisible(terenRescueChoice, lioStates.prisoner)
  || !isChoiceVisible(terenRescueChoice, lioStates.returned)
  || !isChoiceVisible(terenRescueChoice, lioStates.guarded)) {
  failures.push('Teren’s rescue does not remain an honest fallback for routes where Lio did not join');
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
if (!/Mara and the wounded remain safe on the ridge/i.test(ridgeFinalCrisis)
  || /Mara is trapped beneath/i.test(ridgeFinalCrisis)) {
  failures.push('Chapter Seven places Mara back in the basin after the player sent her to the wounded ridge');
}
const preparedSignalChoice = nodes['c7-salt-trap'].choices.find(
  (choice) => choice.id === 'c7-living-signal-block',
);
const unpreparedSignalFallback = nodes['c7-salt-trap'].choices.find(
  (choice) => choice.id === 'c7-sacrifice-supply-wagon-block',
);
if (isChoiceVisible(preparedSignalChoice, chapterSevenBase)
  || !isChoiceVisible(preparedSignalChoice, { ...chapterSevenBase, flags: ['c7-living-signal-post-ready'] })
  || !isChoiceVisible(unpreparedSignalFallback, chapterSevenBase)
  || isChoiceVisible(unpreparedSignalFallback, { ...chapterSevenBase, flags: ['c7-living-signal-post-ready'] })) {
  failures.push('The Chapter Seven signal post preparation does not unlock its later payoff');
}
const evrenAttack = renderedBody('c7-dead-marshal-rises', chapterSevenBase);
if (!/Caelan Vey means to open the eastern Gate.*loyal replacements secure the forts/is.test(evrenAttack)
  || /until the eastern gate opens/i.test(evrenAttack)) {
  failures.push('Evren openly reveals the hidden plan instead of giving soldiers a plausible false order');
}
const chapterSevenEvidence = renderedBody('c7-captured-soldier', chapterSevenBase);
if (!/Hale was alive.*never found a body/is.test(chapterSevenEvidence)
  || !/claim of murder, not proof/i.test(chapterSevenEvidence)
  || !/date answers Malrec’s lie/i.test(chapterSevenEvidence)
  || !/Evren’s commands need a different test/i.test(chapterSevenEvidence)
  || !/Teren can answer that password.*dead memory cannot/is.test(chapterSevenEvidence)) {
  failures.push('Chapter Seven does not separate Hale’s uncertain fate, Malrec’s dated order, and Evren’s password test');
}
const chapterSevenOpening = [
  nodes['c7-red-horizon'].lesson?.body ?? '',
  ...nodes['c7-red-horizon'].body(chapterSevenBase),
].join(' ');
const chapterSevenLioIntroduction = renderedBody('c7-first-riders', chapterSevenBase);
if (/Marshal Evren|Marshal Teren/i.test(chapterSevenOpening)
  || !/Marshal Evren has been dead for nineteen years/i.test(chapterSevenLioIntroduction)
  || !/living army marshal, Teren Voss/i.test(chapterSevenLioIntroduction)
  || !/call that a dead command/i.test(chapterSevenLioIntroduction)) {
  failures.push('Chapter Seven introduces its army leaders before Lio can explain them in plain language');
}
const chapterSevenOpeningJournal = knownTruths(chapterSevenBase).join(' ');
if (/Marshal Evren|Teren Voss|dead command/i.test(chapterSevenOpeningJournal)) {
  failures.push('The Chapter Seven journal names army leaders or dead command before Lio introduces them');
}
const chapterSevenParley = renderedBody('c7-marshal-parley', chapterSevenBase);
const chapterSevenDuel = renderedBody('c7-steppe-duel', chapterSevenBase);
if (!/Captain Vey/i.test(chapterSevenParley)
  || /Captain Vale/i.test(chapterSevenParley)
  || !/accept that law while we stand on this ground/i.test(chapterSevenParley)
  || !/No magic forces obedience/i.test(chapterSevenDuel)) {
  failures.push('The Chapter Seven parley misnames Caelan or fails to establish the duel rule and its limit');
}
for (const endingId of ['c7-ending-army', 'c7-ending-company', 'c7-ending-outlaw']) {
  const ending = renderedBody(endingId, chapterSevenBase);
  if (!/Four forts were emptied by Malrec.*Three more signal fires.*smoke rises from Fourth Fort/is.test(ending)
    || /next seven signal fires|eight cold signal fires/i.test(ending)) {
    failures.push(`${endingId} contradicts Chapter Eight’s occupied Fourth Fort`);
  }
}
if (!/remaining army east under his own command/i.test(
  nodes['c7-army-future'].choices.find((choice) => choice.id === 'c7-take-chosen-company')?.result ?? '',
) || !/Teren chooses the Gate himself.*army turns east/is.test(
  nodes['c7-army-future'].choices.find((choice) => choice.id === 'c7-take-no-formal-allies')?.result ?? '',
)) {
  failures.push('The smaller Chapter Seven force outcomes still leave the Black Gate undefended');
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
  const arrival = renderedBody('c8-gate-ring', { ...chapterEightBase, flags });
  if (!expected.test(arrival)) {
    failures.push(`Chapter Eight loses Teren’s position or injury after ${flags[0]}`);
  }
}
const chapterSevenReaderText = Object.entries(nodes)
  .filter(([id]) => id.startsWith('c7-'))
  .flatMap(([, node]) => [
    node.objective,
    ...node.body(chapterSevenBase),
    ...node.choices.flatMap((choice) => [choice.label, choice.detail, choice.advantage ?? '', choice.result]),
  ])
  .join(' ');
if (/\|\s*(?:One quiet minute|The decisive choice|Execute the chosen plan|Path recorded|Final choice)/i.test(chapterSevenReaderText)
  || /\b(?:countersign|watchword|private answer|field packet|noncombatants|manoeuvre|Crown glass)\b/i.test(chapterSevenReaderText)) {
  failures.push('Chapter Seven still exposes stage directions or inconsistent military terms');
}
const chapterSevenEndingFlags = {
  'c7-ending-army': 'c7-gained-full-army',
  'c7-ending-company': 'c7-gained-chosen-company',
  'c7-ending-outlaw': 'c7-gained-dangerous-reputation',
};
for (const [endingId, flag] of Object.entries(chapterSevenEndingFlags)) {
  const finalChoice = nodes['c7-army-future'].choices.find((choice) => choice.next === endingId);
  if (!finalChoice?.addFlags?.includes(flag) || finalChoice.changes?.wayfire !== 2) {
    failures.push(`${endingId} does not record its army outcome with equal Wayfire`);
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
for (const state of chapterEightForceStates) {
  const visibleDeployments = nodes['c8-force-deployment'].choices.filter(
    (choice) => deploymentChoiceIds.has(choice.id) && isChoiceVisible(choice, state),
  );
  if (visibleDeployments.length !== 3 || visibleDeployments.some((choice) => !canChoose(choice, state))) {
    failures.push('Chapter Eight turns the inherited army size into a one-option deployment screen');
  }
}
const deploymentPayoffs = [
  [['c7-gained-full-army', 'c8-deployed-all-forts'], /Crown March occupies all eight outer yards/i],
  [['c7-gained-chosen-company', 'c8-deployed-all-forts'], /volunteers hold all eight outer yards in thin groups/i],
  [['c7-gained-dangerous-reputation', 'c8-deployed-all-forts'], /small force watches all eight forts in pairs/i],
  [['c7-gained-full-army', 'c8-deployed-strongpoints'], /Crown March holds three strong forts/i],
  [['c7-gained-chosen-company', 'c8-deployed-strongpoints'], /Volunteers hold the three strongest approaches/i],
  [['c7-gained-dangerous-reputation', 'c8-deployed-strongpoints'], /small force holds two strong forts/i],
];
for (const [flags, expected] of deploymentPayoffs) {
  if (!expected.test(renderedBody('c8-occupied-fort', { ...chapterEightBase, flags }))) {
    failures.push(`Chapter Eight deployment does not remember force and plan for ${flags.join(', ')}`);
  }
}
const forcePressureCases = [
  [['c7-gained-full-army'], /Teren can place soldiers at every fire.*remaining loyalist/is, /last saboteur/is],
  [['c7-gained-chosen-company'], /volunteers can hold three fires.*Futureless.*other five/is, /six wardens.*burned hands/is],
  [['c7-gained-dangerous-reputation'], /small force can hold two fires.*wounded wardens.*other six/is, /infirmary fills with burns/is],
];
for (const [flags, openingExpected, mortalOutcomeExpected] of forcePressureCases) {
  const state = { ...chapterEightBase, flags };
  if (!openingExpected.test(renderedBody('c8-opening', state))
    || !mortalOutcomeExpected.test(renderedBody('c8-collector-crossing', {
      ...state,
      flags: [...flags, 'c8-united-wardens'],
    }))) {
    failures.push(`Chapter Eight does not carry the Chapter Seven force cost into the defence for ${flags[0]}`);
  }
}
const hiddenRecord = renderedBody('c8-hidden-record', chapterEightBase);
if (!/seventeen years.*closed three failing garrisons/is.test(hiddenRecord)
  || !/three weeks ago.*Malrec pulled the field army away from four more forts/is.test(hiddenRecord)
  || !/only Fourth Fort occupied tonight/i.test(hiddenRecord)
  || !/sealed packet.*First Fort.*complete copy/is.test(hiddenRecord)) {
  failures.push('Chapter Eight does not join the seventeen-year cover-up to Malrec’s recent withdrawal');
}
const firstKnockJournal = knownTruths({
  ...chapterEightBase,
  nodeId: 'c8-first-knock',
}).join(' ');
const afterFirstKnockJournal = knownTruths({
  ...chapterEightBase,
  nodeId: 'c8-force-deployment',
}).join(' ');
if (/Futureless|sold one specific promise/i.test(firstKnockJournal)
  || !/Futureless.*sold one specific promise/is.test(afterFirstKnockJournal)) {
  failures.push('Chapter Eight journal defines the Futureless before Pell introduces them');
}
const defenceRouteCases = [
  ['c8-united-wardens', /eight mortal signal fires/i, /refused our fire and held the Gate with mortal hands/i, /Ash Compact’s white fire holds the gap/i],
  ['c8-accepted-ash-compact', /Ash Compact’s white fire holds the gap/i, /granted one peaceful embassy permission/i, /stored beneath the fallen First Fort/i],
  ['c8-sacrificed-first-fort', /stored beneath the fallen First Fort/i, /broke one of your own forts/i, /Ash Compact’s white fire holds the gap/i],
];
for (const [flag, collectorExpected, greetingExpected, collectorForbidden] of defenceRouteCases) {
  const state = { ...chapterEightBase, flags: [flag] };
  const collector = renderedBody('c8-collector-crossing', state);
  const greeting = renderedBody('c8-embassy-terms', state);
  if (!collectorExpected.test(collector)
    || collectorForbidden.test(collector)
    || !greetingExpected.test(greeting)) {
    failures.push(`Chapter Eight forgets the chosen defence route for ${flag}`);
  }
}
const contractHall = renderedBody('c8-futureless-reveal', chapterEightBase);
const anselContractChoice = nodes['c8-collector-crossing'].choices.find(
  (choice) => choice.id === 'c8-let-ansel-refuse-collection',
);
if (!/One named promise\. Nothing more/i.test(contractHall)
  || !/act and meaning.*no matter which words/is.test(contractHall)
  || !/One named promise\. Nothing more/i.test(anselContractChoice?.result ?? '')) {
  failures.push('Ansel uses the one-payment contract limit before the player learns it');
}
const choiceById = (nodeId, choiceId) => nodes[nodeId].choices.find((choice) => choice.id === choiceId);
const earnedAnselChoices = [
  ['c8-breach', 'c8-trust-futureless-yard', ['c8-futureless-choice-proven']],
  ['c8-chain-plan', 'c8-use-ansel-furnace-route', ['c8-ansel-chose-entry']],
  ['c8-wardens-route', 'c8-let-ansel-name-keepers', ['c8-complete-futureless-ledger']],
  ['c8-collector-crossing', 'c8-let-ansel-refuse-collection', ['c8-futureless-choice-proven']],
];
for (const [nodeId, choiceId, earnedFlags] of earnedAnselChoices) {
  const choice = choiceById(nodeId, choiceId);
  if (!choice
    || isChoiceVisible(choice, chapterEightBase)
    || !isChoiceVisible(choice, { ...chapterEightBase, flags: earnedFlags })) {
    failures.push(`Chapter Eight exposes the free Ansel payoff ${String(choiceId)} without earning it`);
  }
}
const firstFortSetup = `${renderedBody('c8-occupied-fort', {
  ...chapterEightBase,
  flags: ['c8-deployed-mobile-force'],
})} ${renderedBody('c8-hidden-record', chapterEightBase)}`;
const firstFortCrisis = renderedBody('c8-sacrifice-route', chapterEightBase);
if (!/First Fort.*aid station/is.test(firstFortSetup)
  || !/dry lower room/is.test(firstFortSetup)
  || !/temporary aid station.*complete copy/is.test(firstFortCrisis)) {
  failures.push('Chapter Eight uses First Fort people or evidence before placing them there');
}
const pellOath = choiceById('c8-first-knock', 'c8-oath-hold-pell');
const pellOathEnding = renderedBody('c8-embassy-terms', {
  ...chapterEightBase,
  flags: ['c8-oath-pell-sees-opening-contained'],
});
if (!/invasion stopped/i.test(pellOath?.label ?? '')
  || /Gate close tonight/i.test(`${pellOath?.label} ${pellOath?.detail}`)
  || !/Pell watches.*hostile hand withdraw.*Oath/is.test(pellOathEnding)) {
  failures.push('Chapter Eight gives Pell an impossible promise or fails to resolve it');
}
const normalSeedChoice = choiceById('c8-chain-plan', 'c8-root-lift-chain');
const weakenedSeedChoice = choiceById('c8-chain-plan', 'c8-spend-weakened-seed-on-chain');
const weakenedSeedState = { ...chapterEightBase, flags: ['c8-seed-weakened-saving-pell'] };
if (!normalSeedChoice
  || !weakenedSeedChoice
  || isChoiceVisible(normalSeedChoice, weakenedSeedState)
  || !isChoiceVisible(weakenedSeedChoice, weakenedSeedState)
  || !/dormant/i.test(`${weakenedSeedChoice.detail} ${weakenedSeedChoice.result}`)) {
  failures.push('Chapter Eight forgets that saving Pell weakens Lysara’s living seed');
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
    (choice) => oathShareChoiceIds.has(choice.id) && isChoiceVisible(choice, state),
  );
  if (visible.length !== 1
    || visible[0].id !== expectedId
    || !new RegExp(expectedId.split('-').at(-1), 'i').test(`${visible[0].label} ${visible[0].result}`)) {
    failures.push(`Chapter Eight does not name the willing Oath bearer for ${expectedId}`);
  }
}
const oathLedgerText = [
  nodes['c8-oath-ledger'].lesson?.body ?? '',
  ...nodes['c8-oath-ledger'].body(chapterEightBase),
  ...nodes['c8-oath-ledger'].choices.flatMap((choice) => [choice.label, choice.detail, choice.result]),
].join(' ');
const chapterEightOpening = renderedBody('c8-gate-ring', chapterEightBase);
if (!/key to your father’s roadside inn.*old Warden whistle/is.test(chapterEightOpening)
  || !/father’s old inn key/i.test(oathLedgerText)
  || !/cracked Crown badge/i.test(oathLedgerText)
  || !/Warden whistle/i.test(oathLedgerText)) {
  failures.push('The Chapter Eight Oath prices are not attached to visible, previously introduced objects');
}
const chapterEightReaderText = Object.entries(nodes)
  .filter(([id]) => id.startsWith('c8-'))
  .flatMap(([, node]) => [
    node.objective,
    node.lesson?.body ?? '',
    ...node.body(chapterEightBase),
    ...node.choices.flatMap((choice) => [choice.label, choice.detail, choice.advantage ?? '', choice.result]),
  ])
  .join(' ');
if (/\|\s*(?:The next knock|Do not pretend|Keep the defence|Final choice|Path recorded)/i.test(chapterEightReaderText)
  || /\b(?:surety|collateral|safe conduct|unspoken clause|second price)\b/i.test(chapterEightReaderText)
  || /each path can hold the Gate tonight/i.test(chapterEightReaderText)) {
  failures.push('Chapter Eight still exposes stage directions, contract jargon, or narrator scoring');
}
if (!/more than an hour before the yearly opening/i.test(renderedBody('c8-breach', chapterEightBase))
  || !/Gate opens at sunset/i.test(renderedBody('c8-opening', chapterEightBase))) {
  failures.push('Chapter Eight does not distinguish the early pressure breath from the sunset opening');
}
if (/buying his future|bought Captain Vey|learn who bought Caelan/i.test(chapterEightReaderText)
  || !/owns nothing yet/i.test(renderedBody('c8-embassy-terms', chapterEightBase))) {
  failures.push('Chapter Eight confuses the prepared claim on Caelan with a completed bargain');
}
const compactEmbassyState = { ...chapterEightBase, flags: ['c8-accepted-ash-compact'] };
const nonCompactEmbassyState = { ...chapterEightBase, flags: ['c8-united-wardens'] };
const visibleEmbassyChoices = (state) => nodes['c8-embassy-terms'].choices
  .filter((choice) => isChoiceVisible(choice, state))
  .map((choice) => choice.id);
const compactEmbassyChoices = visibleEmbassyChoices(compactEmbassyState);
const nonCompactEmbassyChoices = visibleEmbassyChoices(nonCompactEmbassyState);
if (compactEmbassyChoices.includes('c8-hear-vexa-at-threshold')
  || compactEmbassyChoices.includes('c8-give-ansel-first-question')
  || !compactEmbassyChoices.includes('c8-receive-vexa-outer-fort')
  || !compactEmbassyChoices.includes('c8-give-ansel-first-question-after-entry')
  || nonCompactEmbassyChoices.includes('c8-receive-vexa-outer-fort')
  || nonCompactEmbassyChoices.includes('c8-give-ansel-first-question-after-entry')
  || !nonCompactEmbassyChoices.includes('c8-hear-vexa-at-threshold')) {
  failures.push('Chapter Eight allows the player to violate or invent the Ash Compact entry agreement');
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
  flags: [...compactEmbassyState.flags, 'c8-ansel-spoke-first', 'c8-ansel-spoke-first-after-entry'],
});
if (!/cross into the empty Second Fort yard/i.test(outerFortEnding)
  || !/remains on the far side/i.test(outsideWitnessEnding)
  || !/embassy crosses under its public agreement/i.test(enteredWitnessEnding)) {
  failures.push('Chapter Eight endings do not state whether Vexa entered or remained outside');
}
for (const [endingId, flag] of Object.entries(chapterEightEndingFlags)) {
  const finalChoice = nodes['c8-embassy-terms'].choices.find((choice) => choice.next === endingId);
  if (!finalChoice?.addFlags?.includes(flag) || finalChoice.changes?.wayfire !== 2) {
    failures.push(`${endingId} does not record its embassy outcome with equal Wayfire`);
  }
}
const stack = [
  { state: initialState, knownTerms: [], knownStoryTerms: [] },
  {
    state: { ...chapterTwoBase, flags: ['chose-silver-road', 'captured-attacker'] },
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
  ...['c3-target-ordan', 'c3-target-thief', 'c3-secured-return'].map((flag) => ({
    state: { ...chapterFourBase, flags: [flag] },
    knownTerms: chapterFourKnownTerms,
    knownStoryTerms: chapterFourKnownStoryTerms,
  })),
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
  ...['c5-freed-vaor', 'c5-took-ember-by-force', 'c5-vaor-pact'].map((flag) => ({
    state: { ...chapterSixBase, flags: [flag] },
    knownTerms: chapterSixKnownTerms,
    knownStoryTerms: chapterSixKnownStoryTerms,
  })),
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
  ...['c6-red-moot-war', 'c6-red-moot-alliance', 'c6-red-moot-neutral'].map((flag) => ({
    state: { ...chapterSevenBase, flags: ['c5-freed-vaor', flag] },
    knownTerms: chapterSevenKnownTerms,
    knownStoryTerms: chapterSevenKnownStoryTerms,
  })),
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
        lysara: { ...chapterSevenBase.relationships.lysara, intent: 'committed' },
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
        lysara: { ...chapterSevenBase.relationships.lysara, intent: 'platonic' },
        ilyra: { trust: 2, attraction: 2, respect: 2, friction: 0, intent: 'interested' },
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
  ...['c7-gained-full-army', 'c7-gained-chosen-company', 'c7-gained-dangerous-reputation'].map((flag) => ({
    state: { ...chapterEightBase, flags: ['c5-freed-vaor', 'c6-red-moot-alliance', flag] },
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
        lysara: { ...chapterEightBase.relationships.lysara, intent: 'committed' },
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
];
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
const deathChapters = new Set();
const endingDepths = [];
let exploredChoices = 0;

while (stack.length && visited.size < 100000) {
  const current = stack.pop();
  const state = current.state;
  const knownTerms = Array.from(new Set([...current.knownTerms, ...(nodes[state.nodeId]?.introduces ?? [])]));
  const knownStoryTerms = Array.from(new Set([
    ...current.knownStoryTerms,
    ...(nodes[state.nodeId]?.introducesStoryTerms ?? []),
  ]));
  const key = `${stateKey(state)}|known:${knownTerms.slice().sort((a, b) => a.localeCompare(b)).join(',')}|story:${knownStoryTerms.slice().sort((a, b) => a.localeCompare(b)).join(',')}`;
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

  const spokenReplyChoices = node.choices.filter((choice) => isSpokenReplyLabel(choice.label));
  if (spokenReplyChoices.length) {
    const lastParagraph = (node.body(state).at(-1) ?? '');
    if (!lastParagraphSupportsReply(lastParagraph)) {
      failures.push(
        `Spoken reply choices in ${node.id} need a spoken line in the last paragraph (${spokenReplyChoices.map((choice) => choice.id).join(', ')})`,
      );
    }
  }

  for (const choice of node.choices) {
    const choiceText = `${choice.label} ${choice.detail}`;
    for (const [term, label] of Object.entries(statLabels)) {
      if (new RegExp(`\\b${label}\\b`, 'i').test(choiceText) && !knownTerms.includes(term)) {
        failures.push(`Choice ${choice.id} uses ${label} before it is introduced`);
      }
    }
  }

  const activeStoryText = [
    node.kicker,
    node.title,
    node.location,
    node.objective,
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
  ].filter(Boolean).join(' ');
  for (const [term, rule] of Object.entries(storyTermRules)) {
    if (rule.use.test(activeStoryText) && !knownStoryTerms.includes(term)) {
      failures.push(`Node ${node.id} uses ${term} before it is introduced on this route`);
    }
  }

  if (node.final) {
    endings.add(node.id);
    if (node.id.startsWith('c8-')) chapterEightEndings.add(node.id);
    else if (node.id.startsWith('c7-')) chapterSevenEndings.add(node.id);
    else if (node.id.startsWith('c6-')) chapterSixEndings.add(node.id);
    else if (node.id.startsWith('c5-')) chapterFiveEndings.add(node.id);
    else if (node.id.startsWith('c4-')) chapterFourEndings.add(node.id);
    else if (node.id.startsWith('c3-')) chapterThreeEndings.add(node.id);
    else if (node.id.startsWith('c2-')) chapterTwoEndings.add(node.id);
    else chapterOneEndings.add(node.id);
    endingDepths.push(state.history.length);
    if (state.chapterChoices !== 15) {
      failures.push(`${node.id} reached after ${state.chapterChoices} decisions instead of 15`);
    }
    if (node.choices.length) failures.push(`Final node has choices: ${node.id}`);
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

if (visited.size >= 100000) failures.push('State exploration exceeded its safety limit');
if (!endings.size) failures.push('No ending is reachable');
if (chapterOneEndings.size !== 3) failures.push(`Expected 3 Chapter One endings, found ${chapterOneEndings.size}`);
if (chapterTwoEndings.size !== 3) failures.push(`Expected 3 Chapter Two endings, found ${chapterTwoEndings.size}`);
if (chapterThreeEndings.size !== 3) failures.push(`Expected 3 Chapter Three endings, found ${chapterThreeEndings.size}`);
if (chapterFourEndings.size !== 3) failures.push(`Expected 3 Chapter Four endings, found ${chapterFourEndings.size}`);
if (chapterFiveEndings.size !== 3) failures.push(`Expected 3 Chapter Five endings, found ${chapterFiveEndings.size}`);
if (chapterSixEndings.size !== 3) failures.push(`Expected 3 Chapter Six endings, found ${chapterSixEndings.size}`);
if (chapterSevenEndings.size !== 3) failures.push(`Expected 3 Chapter Seven endings, found ${chapterSevenEndings.size}`);
if (chapterEightEndings.size !== 3) failures.push(`Expected 3 Chapter Eight endings, found ${chapterEightEndings.size}`);
for (const chapter of [1, 2, 3, 4, 5, 6, 7, 8]) {
  if (!deathChapters.has(chapter)) failures.push(`Chapter ${chapter} has no reachable lethal choice`);
}

if (failures.length) {
  console.error('Game graph check failed:');
  for (const failure of new Set(failures)) console.error(`  ${failure}`);
  process.exit(1);
}

const shortest = Math.min(...endingDepths);
const longest = Math.max(...endingDepths);
console.log(
  `Game graph check passed: ${reachableNodes.size} nodes, ${chapterOneEndings.size} Chapter One endings, ${chapterTwoEndings.size} Chapter Two endings, ${chapterThreeEndings.size} Chapter Three endings, ${chapterFourEndings.size} Chapter Four endings, ${chapterFiveEndings.size} Chapter Five endings, ${chapterSixEndings.size} Chapter Six endings, ${chapterSevenEndings.size} Chapter Seven endings, ${chapterEightEndings.size} Chapter Eight endings, lethal routes in ${deathChapters.size} chapters, ${exploredChoices} reachable choices, ${shortest} to ${longest} decisions per chapter route.`,
);
