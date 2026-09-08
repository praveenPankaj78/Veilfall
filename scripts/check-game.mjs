import { access, readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

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
    throw new Error(`Unexpected module in game graph check: ${specifier}`);
  },
};
vm.runInNewContext(compiled, context, { filename: 'game-data.js' });

const {
  canChoose,
  initialState,
  nodeOrder,
  nodes,
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
  const relationships = {
    mara: { ...state.relationships.mara },
    lysara: { ...state.relationships.lysara },
  };
  for (const [person, changes] of Object.entries(relationshipChanges(choice))) {
    relationships[person].trust = Math.max(0, relationships[person].trust + (changes?.trust ?? 0));
    relationships[person].attraction = Math.max(0, relationships[person].attraction + (changes?.attraction ?? 0));
  }
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
    .map(([person, score]) => `${person}:${Math.min(score.trust, 4)}:${Math.min(score.attraction, 3)}`)
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
    introduction: /(?:words remain deep enough to read: road pin|stamped into the bracket: ROAD PIN|iron anchor called a road pin)/i,
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
    introduction: /There are nine World Nails/i,
  },
  Dragonspine: {
    use: /\bDragonspine\b/i,
    introduction: /Dragonspine is the northern mountain realm/i,
  },
  'Regent Malrec': {
    use: /\bRegent Malrec\b/i,
    introduction: /Regent Malrec Vale rules Asterra while the young Queen is ill/i,
  },
  'cold fire': {
    use: /\bcold fire\b/i,
    introduction: /damaged fire Nail has created blue flame that steals heat instead of giving it/i,
  },
  Vaor: {
    use: /\bVaor\b/i,
    introduction: /Vaor is an ancient dragon buried alive near the fire Nail/i,
  },
  Orivane: {
    use: /\bOrivane\b/i,
    introduction: /Orivane gave her living heart to create the Concord/i,
  },
};
for (const [id, node] of Object.entries(nodes)) {
  const sampleState = id.startsWith('c5-')
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
for (const chapter of [1, 2, 3, 4, 5]) {
  const chapterNodes = nodeOrder.filter((id) => chapter === 1
    ? !/^c[2345]-/.test(id)
    : id.startsWith(`c${chapter}-`));
  const sampleState = chapter === 1
    ? initialState
    : chapter === 2
      ? chapterTwoBase
      : chapter === 3
        ? chapterThreeBase
        : chapter === 4
          ? chapterFourBase
          : chapterFiveBase;
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
  ['c2-attacker', /iron anchor called a road pin/i],
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
    expected: [/wagon driver/i, /hangs above the flood/i],
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
const sealedCaseTruths = knownTruths({
  ...initialState,
  nodeId: 'sealed-case',
  chapterChoices: 4,
});
if (sealedCaseTruths.some((truth) => /prepared road|someone altered/i.test(truth))) {
  failures.push('The sealed case journal reveals the conspiracy before Caelan proves it');
}
if (!sealedCaseTruths.some((truth) => /does not match|although he remembers/i.test(truth))) {
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
if (!/confrontation is not over/i.test(rennFightBody) || /warrant false/i.test(rennFightBody)) {
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
if (!/not a foreign army entering Harrowfen/i.test(worldNailBody)
  || !/secret Asterra force being placed on the Mileless Bridge/i.test(worldNailBody)) {
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
  || !/one of nine anchors/i.test(chapterFourNailExplanation)
  || !/Bellweather and this bridge held broken pieces of it/i.test(chapterFourNailExplanation)
  || !/Dragonspine guards another Nail/i.test(chapterFourNailExplanation)
  || /Bellweather was only one of nine Nails/i.test(chapterFourNailExplanation)) {
  failures.push('Chapter Four does not clearly distinguish the Nail of Distance, its broken pieces, and the other World Nails');
}
const chapterFourCollapse = renderedBody('c4-collapse', chapterFourBase);
if (!/ignore Ordan’s order to take everyone alive/i.test(chapterFourCollapse)) {
  failures.push('The Bell Arch collapse does not explicitly show Crown soldiers disobeying Ordan');
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
  || !/You recognise the western recall/i.test(damagedDisguise)) {
  failures.push('Rook’s first performance does not remember his cost or depend on Caelan’s military knowledge');
}
const theatreExplanation = renderedBody('c4-theatre-plan', chapterFourBase);
if (!/Bridge repeats reflections across neighbouring spans/i.test(theatreExplanation)
  || !/one disguised figure/i.test(theatreExplanation)
  || !/reflection onto three arches/i.test(theatreExplanation)) {
  failures.push('Rook’s travelling theatre still creates three captains without a visible bridge mechanism');
}
const maraKissChoice = nodes['c4-mara'].choices.find((choice) => choice.id === 'c4-kiss-mara-bridge');
const maraDelayChoice = nodes['c4-mara'].choices.find((choice) => choice.id === 'c4-return-to-duty');
if (!/survival comes before rigid law.*then kiss/i.test(maraKissChoice?.label ?? '')
  || !/hear Rook out.*delay/i.test(maraDelayChoice?.label ?? '')) {
  failures.push('Mara’s personal choices do not answer her immediate question about Rook');
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
if (!/cuff now hangs from his own wrist like a bracelet/i.test(arrestEnding)
  || !/twenty steps ahead/i.test(arrestEnding)
  || /around your wrist/i.test(arrestEnding)) {
  failures.push('The Chapter Four arrest ending places the cuff incorrectly or erases the arrest choice');
}

const chapterFiveRookImports = [
  ['c4-rook-arrested', /empty iron cuff worn as a bracelet/i],
  ['c4-rook-bargain', /one honest warning per day/i],
  ['c4-rook-trusted', /deliberately rejoined your group.*buyer is also somewhere in Dragonspine/i],
];
for (const [flag, expected] of chapterFiveRookImports) {
  const arrival = renderedBody('c5-north-road', { ...chapterFiveBase, flags: [flag] });
  if (!expected.test(arrival)) failures.push(`Chapter Five forgets Rook import ${flag}`);
}
const chapterFiveShelterRookImports = [
  ['c4-rook-arrested', /still travelling north under your arrest/i],
  ['c4-rook-bargain', /bargain keeps him with the group/i],
  ['c4-rook-trusted', /still with you after rejoining the group/i],
];
for (const [flag, expected] of chapterFiveShelterRookImports) {
  const shelter = renderedBody('c5-glass-shelter', { ...chapterFiveBase, flags: [flag] });
  if (!expected.test(shelter)) failures.push(`The Chapter Five shelter does not establish Rook’s presence for ${flag}`);
}
const capturedOrdanArrival = renderedBody('c5-north-road', {
  ...chapterFiveBase,
  flags: ['c4-rook-bargain', 'c4-captured-ordan'],
});
if (!/Elene took him into Harrowfen custody/i.test(capturedOrdanArrival)) {
  failures.push('Chapter Five does not account for captured Ordan before the climb');
}
const chapterFiveRouteImports = [
  ['c4-snow-route', /resembles the flame you crossed on the bridge’s mountain span/i],
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
if (!/recordings of events he truly lived/i.test(memoryGlassExplanation)
  || !/not other timelines or copies/i.test(memoryGlassExplanation)) {
  failures.push('Chapter Five does not plainly distinguish memory glass from alternate timelines');
}
const chapterFiveOpening = [
  nodes['c5-north-road'].objective,
  ...nodes['c5-north-road'].body(chapterFiveBase),
].join(' ');
const coldCrossing = nodes['c5-north-road'].choices.find((choice) => choice.id === 'c5-cross-in-shadow');
if (/extract its ember/i.test(nodes['c5-north-road'].objective)
  || !/black glass.*steals enough heat/i.test(chapterFiveOpening)
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
if (!/living ember, a piece of Vaor’s own fire/i.test(royalCamp)
  || !/buyer was connected to this camp.*already moved east/i.test(royalCamp)) {
  failures.push('The royal camp does not introduce the ember plainly or continue Rook’s buyer thread');
}
const ashTunnel = renderedBody('c5-ash-tunnel', chapterFiveBase);
if (!/four sharp notes.*old keeper signal for a collapse/i.test(ashTunnel)) {
  failures.push('Rook’s copied collapse signal is not demonstrated before the ash tunnel choice');
}
const vaorMeeting = renderedBody('c5-vaor-wakes', chapterFiveBase);
if (!/broken cage is the fire Nail/i.test(vaorMeeting)
  || !/warm light inside Vaor is his living ember/i.test(vaorMeeting)
  || !/fragment.*belongs to the Nail of Distance/i.test(vaorMeeting)
  || !/same outer lock/i.test(vaorMeeting)
  || /belongs to its outer ring/i.test(vaorMeeting)) {
  failures.push('Vaor’s meeting does not distinguish the Distance fragment, fire Nail, and living ember');
}
const rookLockChoice = nodes['c5-vaor-wakes'].choices.find((choice) => choice.id === 'c5-let-rook-test-lock');
if (!/established mirrored coins?/i.test(rookLockChoice?.result ?? '')
  || /missing boot/i.test(chapterFiveSource)) {
  failures.push('Rook still uses an unestablished object to test Vaor’s lock');
}
const vaorQuestion = renderedBody('c5-vaor-test', chapterFiveBase);
if (!/people of those who chained me/i.test(vaorQuestion)
  || /world that buried its price/i.test(vaorQuestion)) {
  failures.push('Vaor asks about the Concord’s hidden price before showing it');
}
const haleAssault = renderedBody('c5-crown-assault', chapterFiveBase);
if (!/world to survive long enough to condemn me/i.test(haleAssault)
  || !/stopping the drill/i.test(haleAssault)) {
  failures.push('Commander Hale still lacks a distinct motive or a direct response from Caelan');
}
const haleOrderChoice = nodes['c5-crown-assault'].choices.find((choice) => choice.id === 'c5-turn-hale-soldiers');
const falseEmberChoice = nodes['c5-crown-assault'].choices.find((choice) => choice.id === 'c5-trust-rook-false-extraction');
if (/read what he ordered/i.test(haleOrderChoice?.label ?? '')
  || !/written order, the abandoned dead, or the killing drill/i.test(haleOrderChoice?.detail ?? '')
  || !/false ember/i.test(falseEmberChoice?.label ?? '')) {
  failures.push('The Hale assault choices still assume evidence the player may not have or hide Rook’s decoy');
}
const assaultResolutions = [
  ['c5-break-royal-drill', /drill tears itself apart.*Hale retreats/i],
  ['c5-turn-hale-soldiers', /drill stops.*Hale retreats/i],
  ['c5-trust-rook-false-extraction', /stopping the drill.*forcing Hale behind/i],
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
  || !/one village existing in two forming histories/i.test(heartMemory)
  || !/families are already awake/i.test(heartMemory)
  || !/rulers knew that some forming histories already held living people/i.test(heartMemory)
  || /Children who might have been born|Towns that might have grown/i.test(heartMemory)) {
  failures.push('Orivane’s memory remains abstract or begins before the assault is contained');
}
if (!/Rook stretches painted theatre cloth.*anchors it with wire/i.test(heartMemory)) {
  failures.push('Rook’s false gallery is not visibly prepared before the collapse');
}
const maraAfterBridgeKiss = renderedBody('c5-mara-burns', {
  ...chapterFiveBase,
  flags: ['c4-kissed-mara'],
});
if (!/kiss on the bridge removed the uncertainty/i.test(maraAfterBridgeKiss)) {
  failures.push('Mara’s Chapter Five scene forgets the Chapter Four kiss');
}
const graveEntryChoice = nodes['c5-grave-mouth'].choices[0];
const lysaraInterludeState = {
  ...chapterFiveBase,
  relationships: {
    mara: { trust: 2, attraction: 1 },
    lysara: { trust: 6, attraction: 5 },
  },
};
const committedMaraState = {
  ...lysaraInterludeState,
  flags: ['c4-kissed-mara'],
};
if (resolveNext(graveEntryChoice, lysaraInterludeState) !== 'c5-lysara-burns'
  || resolveNext(graveEntryChoice, committedMaraState) !== 'c5-mara-burns') {
  failures.push('Chapter Five does not respect established Lysara attraction or Mara commitment when choosing the personal scene');
}
const pactChoice = nodes['c5-ember-choice'].choices.find((choice) => choice.id === 'c5-pact-with-vaor');
const pactEnding = renderedBody('c5-ending-pact', chapterFiveBase);
if (!/protective glass shell he can break/i.test(pactChoice?.result ?? '')
  || !/no longer chained.*break free when he is ready/i.test(pactEnding)) {
  failures.push('The pact ending leaves Vaor’s physical captivity unresolved');
}
const freedomChoice = nodes['c5-ember-choice'].choices.find((choice) => choice.id === 'c5-free-vaor');
if (!/promises no obedience.*may refuse future help/i.test(freedomChoice?.advantage ?? '')) {
  failures.push('Freeing Vaor remains a dominant ending without a clear future risk');
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
];
const visited = new Set();
const reachableNodes = new Set();
const endings = new Set();
const chapterOneEndings = new Set();
const chapterTwoEndings = new Set();
const chapterThreeEndings = new Set();
const chapterFourEndings = new Set();
const chapterFiveEndings = new Set();
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
    if (node.id.startsWith('c5-')) chapterFiveEndings.add(node.id);
    else if (node.id.startsWith('c4-')) chapterFourEndings.add(node.id);
    else if (node.id.startsWith('c3-')) chapterThreeEndings.add(node.id);
    else if (node.id.startsWith('c2-')) chapterTwoEndings.add(node.id);
    else chapterOneEndings.add(node.id);
    endingDepths.push(state.history.length);
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
for (const chapter of [1, 2, 3, 4, 5]) {
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
  `Game graph check passed: ${reachableNodes.size} nodes, ${chapterOneEndings.size} Chapter One endings, ${chapterTwoEndings.size} Chapter Two endings, ${chapterThreeEndings.size} Chapter Three endings, ${chapterFourEndings.size} Chapter Four endings, ${chapterFiveEndings.size} Chapter Five endings, lethal routes in ${deathChapters.size} chapters, ${exploredChoices} reachable choices, ${shortest} to ${longest} decisions per chapter route.`,
);
