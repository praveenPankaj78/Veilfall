import { readFile } from 'node:fs/promises';
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

const failures = [];
const nodeIds = Object.keys(nodes);
const ordered = new Set(nodeOrder);

for (const id of nodeIds) {
  if (!ordered.has(id)) failures.push(`Node missing from nodeOrder: ${id}`);
}
for (const id of nodeOrder) {
  if (!nodes[id]) failures.push(`nodeOrder references a missing node: ${id}`);
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
const retiredPlotPhrases = [
  /eleven years/i,
  /other versions?/i,
  /different years/i,
  /false Caelan/i,
  /room (?:built )?tomorrow/i,
  /died twice/i,
  /living Nilo/i,
];
for (const [id, node] of Object.entries(nodes)) {
  if (!id.startsWith('c2-') && !id.startsWith('c3-')) continue;
  const sampleState = id.startsWith('c2-') ? chapterTwoBase : chapterThreeBase;
  const activeText = [
    node.title,
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
const routeProofChecks = [
  ['c2-chose-testimony', /Sable|Jory/i],
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
const stack = [
  { state: initialState, knownTerms: [] },
  {
    state: { ...chapterTwoBase, flags: ['chose-silver-road', 'captured-attacker'] },
    knownTerms: chapterTwoKnownTerms,
  },
  {
    state: { ...chapterTwoBase, flags: ['chose-high-ground'] },
    knownTerms: chapterTwoKnownTerms,
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
  },
  {
    state: {
      ...chapterThreeBase,
      flags: ['c2-saved-attacker', 'c2-saved-nilo', 'c2-oath-expose-crown'],
    },
    knownTerms: chapterThreeKnownTerms,
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
  },
];
const visited = new Set();
const reachableNodes = new Set();
const endings = new Set();
const chapterOneEndings = new Set();
const chapterTwoEndings = new Set();
const chapterThreeEndings = new Set();
const deathChapters = new Set();
const endingDepths = [];
let exploredChoices = 0;

while (stack.length && visited.size < 100000) {
  const current = stack.pop();
  const state = current.state;
  const knownTerms = Array.from(new Set([...current.knownTerms, ...(nodes[state.nodeId]?.introduces ?? [])]));
  const key = `${stateKey(state)}|known:${knownTerms.slice().sort((a, b) => a.localeCompare(b)).join(',')}`;
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

  for (const choice of node.choices) {
    const choiceText = `${choice.label} ${choice.detail}`;
    for (const [term, label] of Object.entries(statLabels)) {
      if (new RegExp(`\\b${label}\\b`, 'i').test(choiceText) && !knownTerms.includes(term)) {
        failures.push(`Choice ${choice.id} uses ${label} before it is introduced`);
      }
    }
  }

  if (node.final) {
    endings.add(node.id);
    if (node.id.startsWith('c3-')) chapterThreeEndings.add(node.id);
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
    stack.push({ state: next, knownTerms });
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
for (const chapter of [1, 2, 3]) {
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
  `Game graph check passed: ${reachableNodes.size} nodes, ${chapterOneEndings.size} Chapter One endings, ${chapterTwoEndings.size} Chapter Two endings, ${chapterThreeEndings.size} Chapter Three endings, lethal routes in ${deathChapters.size} chapters, ${exploredChoices} reachable choices, ${shortest} to ${longest} decisions per chapter route.`,
);
