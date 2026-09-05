import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const source = await readFile('app/game-data.ts', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;

const exported = {};
const context = {
  exports: exported,
  module: { exports: exported },
  console,
};
vm.runInNewContext(compiled, context, { filename: 'game-data.js' });

const {
  canChoose,
  initialState,
  nodeOrder,
  nodes,
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
  return {
    nodeId: resolveNext(choice, state),
    stats,
    flags: Array.from(new Set([...state.flags, ...(choice.addFlags ?? [])])),
    history: [...state.history, choice.result],
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
    stamina: 2,
    resolve: 4,
    command: 2,
    rapport: 3,
    oathfire: 2,
    medicine: 1,
    wayfire: 0,
  };
  const stats = Object.entries(state.stats)
    .map(([key, value]) => `${key}:${Math.min(value, requirementCaps[key] ?? value)}`)
    .join('|');
  const flags = state.flags.filter((flag) => navigationFlags.has(flag)).sort().join('|');
  return `${state.nodeId}|${stats}|${flags}`;
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
    stamina: 8,
    resolve: 6,
    command: 4,
    rapport: 5,
    oathfire: 4,
    medicine: 1,
  },
};
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
        stamina: 0,
        resolve: 0,
        command: 0,
        rapport: 1,
        oathfire: 0,
      },
    },
    knownTerms: chapterTwoKnownTerms,
  },
];
const visited = new Set();
const reachableNodes = new Set();
const endings = new Set();
const chapterOneEndings = new Set();
const chapterTwoEndings = new Set();
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
    if (node.id.startsWith('c2-')) chapterTwoEndings.add(node.id);
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

if (failures.length) {
  console.error('Game graph check failed:');
  for (const failure of new Set(failures)) console.error(`  ${failure}`);
  process.exit(1);
}

const shortest = Math.min(...endingDepths);
const longest = Math.max(...endingDepths);
console.log(
  `Game graph check passed: ${reachableNodes.size} nodes, ${chapterOneEndings.size} Chapter One endings, ${chapterTwoEndings.size} Chapter Two endings, ${exploredChoices} reachable choices, ${shortest} to ${longest} decisions per chapter route.`,
);
