import {
  canChoose,
  isChoiceVisible,
  groupedRelationshipPreview,
  nextRelationships,
  nodes,
  relationshipChanges,
  resolveCompletedOathFlags,
  resolveNext,
  type ChapterNumber,
  type Choice,
  type GameState,
  type GameStats,
  type StatKey,
} from './game-data';

export const AUTOMATIC_ACKNOWLEDGMENT_IDS = [
  'c12-record-no-renewal-debt',
  'c12-confirm-no-price-review',
  'c12-record-no-compact-passage',
] as const;

export type AutomaticAcknowledgmentId =
  (typeof AUTOMATIC_ACKNOWLEDGMENT_IDS)[number];

export function cloneGameState(state: GameState): GameState {
  return structuredClone(state);
}

export function wouldBeFatal(choice: Choice, state: GameState) {
  const healthChange = choice.changes?.health ?? 0;
  return healthChange < 0 && state.stats.health + healthChange <= 0;
}

export function defeatForChoice(
  chapter: ChapterNumber,
  choice: Choice,
  state: GameState,
) {
  const bodies: Record<ChapterNumber, string> = {
    1: 'You complete the action, but your wounds finally take your strength. Rain fills your mouth as the road darkens above you. The escort continues for only a few steps before the enemy closes in.',
    2: 'You force the danger back, but your body cannot survive the effort. The last sound you hear is Bellweather’s bell and Mara calling your name through the battle.',
    3: 'Your choice changes the fight, but blood and exhaustion pull you down beside the canal. Harrowfen’s lanterns blur on the water as Ordan escapes toward the eastern bridge.',
    4: 'You complete the action, but the moving bridge takes the last of your strength. Stone turns beneath you. Your shield slips from your hand, and the World Nail fragment disappears into another sky.',
    5: state.flags.includes('c5-chose-lysara-care')
      ? 'You complete the action, but the cold fire takes the last warmth from your wounds. Glass and blue flame blur above you while Lysara calls your name and Vaor roars beneath the mountain.'
      : state.flags.includes('c5-chose-sorin-care')
        ? 'You complete the action, but the cold fire takes the last warmth from your wounds. Glass and blue flame blur above you while your companions call your name and Vaor roars beneath the mountain.'
        : 'You complete the action, but the cold fire takes the last warmth from your wounds. Glass and blue flame blur above you while Mara calls your name and Vaor roars beneath the mountain.',
    6: 'You complete the action, but the moving city and the red storm take the last of your strength. The deck rolls beneath you while Korran calls the living crews together and the ember fades behind your ribs.',
    7: 'You complete the action, but the Red Wind Hunt takes the last of your strength. Salt and red sky blur together while your companions fight to keep the living army from obeying its dead.',
    8: 'You complete the action, but the Black Gate takes the last of your strength. Snow and furnace light blur together while the defenders struggle to keep the opening from becoming an invasion road.',
    9: 'You complete the action, but the embassy attack takes the last of your strength. Glass chains and handbow smoke blur while your allies keep the Gate Nail fragment from both assassin groups.',
    10: 'You complete the action, but the Ash Road takes the last of your strength. Your expedition closes around the fragment while the road carries its unanswered offers toward Vathis.',
    11: 'You complete the action, but Vathis takes the last of your strength. Contract streets rise around the expedition while Malrec’s engine pulls the inner Black Gate open.',
    12: 'You complete the action, but the failing Black Gate takes the last of your strength. Both realms remain visible as the promise storm closes over you.',
  };
  return {
    title: 'Caelan has fallen',
    body: bodies[chapter],
    choiceId: choice.id,
  };
}

export function applyChoice(state: GameState, choice: Choice): GameState {
  const nextStats = { ...state.stats };
  for (const [key, value] of Object.entries(choice.changes ?? {})) {
    const stat = key as StatKey;
    nextStats[stat] = Math.max(0, nextStats[stat] + (value ?? 0));
  }
  const nodeId = resolveNext(choice, state);
  const updatedRelationships = nextRelationships(state.relationships, choice);
  const completedChapters =
    nodes[nodeId]?.final && nextStats.health > 0
      ? Array.from(new Set([...state.completedChapters, state.chapter]))
      : state.completedChapters;
  return {
    nodeId,
    chapter: state.chapter,
    chapterChoices: state.chapterChoices + 1,
    completedChapters,
    stats: nextStats,
    relationships: updatedRelationships,
    contentPreference: state.contentPreference,
    flags: resolveCompletedOathFlags(
      Array.from(new Set([...state.flags, ...(choice.addFlags ?? [])])),
    ),
    history: [...state.history, choice.result],
    defeat:
      nextStats.health <= 0
        ? defeatForChoice(state.chapter, choice, state)
        : null,
  };
}

function isAutomaticAcknowledgmentId(
  id: string,
): id is AutomaticAcknowledgmentId {
  return (AUTOMATIC_ACKNOWLEDGMENT_IDS as readonly string[]).includes(id);
}

export function isGuardedAutomaticAcknowledgment(
  choice: Choice,
  state: GameState,
) {
  if (!isAutomaticAcknowledgmentId(choice.id)) return false;
  const node = nodes[state.nodeId];
  if (!node || node.final || node.nextChapter) return false;
  const visible = node.choices.filter((item) => isChoiceVisible(item, state));
  if (visible.length !== 1 || visible[0].id !== choice.id) return false;
  if (!canChoose(choice, state)) return false;
  if (
    Object.values(choice.changes ?? {}).some((value) => (value ?? 0) !== 0)
  )
    return false;
  if (Object.keys(relationshipChanges(choice)).length > 0) return false;
  if ((choice.addFlags ?? []).length > 0) return false;
  return true;
}

export function drainAutomaticAcknowledgments(state: GameState): GameState {
  const applied = new Set<string>();
  let current = state;
  while (true) {
    if (current.defeat || current.stats.health <= 0) return current;
    const node = nodes[current.nodeId];
    if (!node || node.final || node.nextChapter) return current;
    const visible = node.choices.filter((choice) =>
      isChoiceVisible(choice, current),
    );
    if (visible.length !== 1) return current;
    const choice = visible[0];
    if (!isGuardedAutomaticAcknowledgment(choice, current)) return current;
    if (applied.has(choice.id)) return current;
    applied.add(choice.id);
    current = applyChoice(current, choice);
  }
}

export function applyPlayerChoice(state: GameState, choice: Choice): GameState {
  return drainAutomaticAcknowledgments(applyChoice(state, choice));
}

export function previewRelationshipChanges(state: GameState, choice: Choice) {
  const untouched = cloneGameState(state);
  const after = applyPlayerChoice(cloneGameState(state), choice);
  return {
    groups: groupedRelationshipPreview(
      untouched.relationships,
      after.relationships,
    ),
    after: after.relationships,
    inputUnchanged: statesEquivalent(untouched, state),
  };
}

type HandoffDefinition = {
  nodeId: string;
  history: string;
  rest: string;
  stats: (stats: GameStats) => GameStats;
};

const chapterHandoffs: Record<Exclude<ChapterNumber, 1>, HandoffDefinition> = {
  2: {
    nodeId: 'c2-arrival',
    history: 'You continue to Bellweather Inn with every earlier consequence.',
    rest: 'The remaining road to Bellweather lets the wounded rest and take treatment already prepared for this arrival.',
    stats: (stats) => ({
      ...stats,
      health: Math.min(8, stats.health + 2),
      resolve: Math.min(8, stats.resolve + 1),
      medicine: 1,
    }),
  },
  3: {
    nodeId: 'c3-arrival',
    history: 'You continue to Harrowfen with every earlier consequence.',
    rest: 'The ride to Harrowfen gives time to rest, bind wounds, and settle the company after Bellweather.',
    stats: (stats) => ({
      ...stats,
      health: Math.min(8, stats.health + 2),
      resolve: Math.min(8, stats.resolve + 1),
      command: Math.min(6, stats.command + 1),
    }),
  },
  4: {
    nodeId: 'c4-bridge-start',
    history: 'You enter the Mileless Bridge with every earlier consequence.',
    rest: 'The short approach onto the bridge lets you catch your breath before the chase begins.',
    stats: (stats) => ({
      ...stats,
      health: Math.min(8, stats.health + 1),
    }),
  },
  5: {
    nodeId: 'c5-north-road',
    history:
      'You follow the northern mark into Dragonspine with every earlier consequence.',
    rest: 'The northern road into Dragonspine restores a little strength after the bridge.',
    stats: (stats) => ({
      ...stats,
      health: Math.min(8, stats.health + 1),
      resolve: Math.min(8, stats.resolve + 1),
      command: Math.min(6, stats.command + 1),
    }),
  },
  6: {
    nodeId: 'c6-steppe-road',
    history:
      'You leave Dragonspine for Kharad Vey with every earlier consequence.',
    rest: 'Leaving the mountain for the steppe lets the company rest and treat what the cold fire left.',
    stats: (stats) => ({
      ...stats,
      health: Math.min(8, stats.health + 2),
      resolve: Math.min(8, stats.resolve + 1),
      command: Math.min(6, stats.command + 1),
    }),
  },
  7: {
    nodeId: 'c7-red-horizon',
    history:
      'You leave Kharad Vey beneath the Red Wind Hunt with every earlier consequence.',
    rest: 'The ride off the moving town gives a short rest before the hunt closes in.',
    stats: (stats) => ({
      ...stats,
      health: Math.min(8, stats.health + 2),
      resolve: Math.min(8, stats.resolve + 1),
      command: Math.min(6, stats.command + 1),
    }),
  },
  8: {
    nodeId: 'c8-gate-ring',
    history:
      'You reach the eight forts surrounding the Black Gate with every earlier consequence.',
    rest: 'Arrival among the forts lets the wounded take the treatment already carried with the company.',
    stats: (stats) => ({
      ...stats,
      health: Math.min(8, stats.health + 2),
      resolve: Math.min(8, stats.resolve + 1),
      command: Math.min(6, stats.command + 1),
      medicine: Math.max(1, stats.medicine),
    }),
  },
  9: {
    nodeId: 'c9-embassy-watch',
    history:
      'You establish neutral Second Fort for the first Cinder Deep embassy with every earlier consequence.',
    rest: 'The pause while Second Fort is prepared lets the embassy party rest and restock medicine already on hand.',
    stats: (stats) => ({
      ...stats,
      health: Math.min(8, stats.health + 1),
      resolve: Math.min(8, stats.resolve + 1),
      medicine: Math.max(1, stats.medicine),
    }),
  },
  10: {
    nodeId: 'c10-ash-road',
    history:
      'You take the exact voluntary expedition from the inner Black Gate onto the Ash Road.',
    rest: 'The first stretch of the Ash Road is walked, not fought, and the expedition uses that time to recover.',
    stats: (stats) => ({
      ...stats,
      health: Math.min(8, stats.health + 1),
      resolve: Math.min(8, stats.resolve + 1),
    }),
  },
  11: {
    nodeId: 'c11-vathis-gate',
    history:
      'You enter Vathis with the exact Ash Road expedition, recovered fragment, and every surviving contract limit.',
    rest: 'The approach into Vathis gives a brief rest after the road’s last offers.',
    stats: (stats) => ({
      ...stats,
      health: Math.min(8, stats.health + 1),
      resolve: Math.min(8, stats.resolve + 1),
    }),
  },
  12: {
    nodeId: 'c12-inner-gate',
    history:
      'You reach the inner Black Gate with the exact Vathis alliance, expedition, fragment custody, and mythic freedom restrictions.',
    rest: 'The last inner approach lets the expedition recover what the city fight did not already spend.',
    stats: (stats) => ({
      ...stats,
      health: Math.min(8, stats.health + 1),
      resolve: Math.min(8, stats.resolve + 1),
    }),
  },
};

export function applyChapterHandoff(
  game: GameState,
  chapter: Exclude<ChapterNumber, 1>,
): GameState {
  const handoff = chapterHandoffs[chapter];
  return {
    ...game,
    nodeId: handoff.nodeId,
    chapter,
    chapterChoices: 0,
    completedChapters: Array.from(
      new Set([...game.completedChapters, (chapter - 1) as ChapterNumber]),
    ),
    stats: handoff.stats(game.stats),
    history: [...game.history, handoff.history],
  };
}

const statOrder: StatKey[] = [
  'health',
  'resolve',
  'command',
  'oathfire',
  'medicine',
];

export function chapterRecoveryDisplay(
  before: GameState,
  chapter: Exclude<ChapterNumber, 1>,
) {
  const after = applyChapterHandoff(before, chapter);
  const deltas = statOrder.flatMap((key) => {
    const change = after.stats[key] - before.stats[key];
    if (change === 0) return [];
    const label = key[0].toUpperCase() + key.slice(1);
    return [`${label} ${change > 0 ? '+' : ''}${change}`];
  });
  return {
    next: after,
    deltas,
    rest: chapterHandoffs[chapter].rest,
  };
}

export function fatalChoiceCost(choice: Choice) {
  return Math.abs(choice.changes?.health ?? 0);
}

export function captureFatalRetry(before: GameState, choice: Choice) {
  return {
    before: cloneGameState(before),
    choiceId: choice.id,
    healthBefore: before.stats.health,
    healthCost: fatalChoiceCost(choice),
  };
}

export function captureDeathCause(before: GameState, choice: Choice) {
  return {
    choiceId: choice.id,
    label: choice.label,
    healthBefore: before.stats.health,
    healthCost: fatalChoiceCost(choice),
  };
}

export function deathCauseText(options: {
  actionLabel: string;
  healthBefore: number | null;
  healthCost: number | null;
}) {
  const healthBefore =
    options.healthBefore === null
      ? 'unknown'
      : String(options.healthBefore);
  const healthCost =
    options.healthCost === null
      ? 'unknown'
      : `-${Math.abs(options.healthCost)}`;
  return `You chose “${options.actionLabel}”. Health before: ${healthBefore}; Health cost: ${healthCost}; Health after: 0`;
}

export function statesEquivalent(left: GameState, right: GameState) {
  return JSON.stringify(left) === JSON.stringify(right);
}
