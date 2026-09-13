'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  BookOpen,
  Flame,
  Heart,
  MapPin,
  RotateCcw,
  Shield,
  Sparkles,
  Swords,
  TriangleAlert,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  canChoose,
  isChoiceVisible,
  initialState,
  nextRelationships,
  nodes,
  normaliseRelationships,
  relationshipChanges,
  relationshipLabels,
  relationshipSummary,
  requirementText,
  resolveNext,
  statLabels,
  type Choice,
  type GameStats,
  type GameState,
  type RelationshipKey,
  type StatKey,
} from './game-data';
import { knownTruths, majorConsequences } from './story-memory';

const CURRENT_SAVE_KEY = 'veilfall.saga.v13.save';
const LEGACY_SAVE_KEYS = [
  'veilfall.saga.v12.save',
  'veilfall.saga.v11.save',
  'veilfall.saga.v10.save',
  'veilfall.saga.v9.save',
  'veilfall.saga.v8.save',
  'veilfall.saga.v7.save',
  'veilfall.saga.v6.save',
  'veilfall.saga.v5.save',
  'veilfall.saga.v4.save',
  'veilfall.chapter-one.v3.save',
  'veilfall.chapter-one.v2.save',
];
type ChapterNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const sceneArtwork = {
  departure: {
    src: '/art/caelan-east-gate.png',
    alt: 'Caelan and Mara travel with the diplomatic escort beyond Greyhaven',
  },
  folded: {
    src: '/art/kings-road-folded.png',
    alt: 'Caelan and the wounded escort face an impossible sea across the King’s Road',
  },
  inn: {
    src: '/art/bellweather-inn.png',
    alt: 'Caelan leads the wounded escort into Bellweather Inn during a storm',
  },
  harrowfen: {
    src: '/art/harrowfen-wrong-mile.png',
    alt: 'Caelan approaches Harrowfen while royal archers watch from the canal gate',
  },
  mileless: {
    src: '/art/mileless-bridge-chase.png',
    alt: 'Caelan pursues Rook and Ordan across the broken arches of the Mileless Bridge',
  },
  crossroads: {
    src: '/art/mileless-three-spans.png',
    alt: 'Caelan and his companions face three impossible roads beneath different skies',
  },
  nails: {
    src: '/art/nine-nails-revelation.png',
    alt: 'Caelan, Mara, Lysara, and Rook discover the hidden map of nine World Nails',
  },
  dragonspine: {
    src: '/art/dragonspine-coldfire.png',
    alt: 'Caelan and his companions climb through the glass valleys while cold fire hunts them',
  },
  vaor: {
    src: '/art/vaor-memory-grave.png',
    alt: 'Caelan finds the ancient dragon Vaor imprisoned beneath glass memories',
  },
  ember: {
    src: '/art/ember-bearer-vision.png',
    alt: 'Caelan carries Vaor’s ember while a vision of the Black Gate opens above him',
  },
  kharad: {
    src: '/art/kharad-vey-wheel-city.png',
    alt: 'Caelan and his companions approach Kharad Vey as the wheel town crosses the Ember Steppe',
  },
  storm: {
    src: '/art/ancestor-storm-attack.png',
    alt: 'Caelan and Korran defend the moving town from an ancestor storm',
  },
  moot: {
    src: '/art/red-moot-ilyra.png',
    alt: 'Caelan and Ilyra stand before the Red Moot while ancestor voices gather outside',
  },
  redwind: {
    src: '/art/red-wind-pursuit.png',
    alt: 'Caelan and the moving Kharad town flee Asterra Crown soldiers beneath a red ancestor storm',
  },
  saltbattle: {
    src: '/art/salt-basin-battle.png',
    alt: 'Caelan and Ilyra face the divided Crown March in the Salt Basin',
  },
  marshal: {
    src: '/art/marshal-field-confrontation.png',
    alt: 'Caelan confronts Marshal Teren Voss while a dead commander forms in the red storm',
  },
  blackgate: {
    src: '/art/black-gate-fortress-ring.png',
    alt: 'Caelan approaches the eight cold forts surrounding the colossal Black Gate',
  },
  futureless: {
    src: '/art/futureless-fort-breach.png',
    alt: 'Caelan and the defenders of Fourth Fort fight to save its wounded during the Gate breach',
  },
  embassy: {
    src: '/art/first-devil-embassy.png',
    alt: 'Vexa Ash leads the first devil embassy across the Black Gate under open safe conduct',
  },
  cinderembassy: {
    src: '/art/cinder-deep-embassy.png',
    alt: 'Caelan and Vexa face each other across the neutral Cinder Deep embassy table',
  },
  twosidedattack: {
    src: '/art/two-sided-assassination.png',
    alt: 'Mortal handbow assassins and rival devil chain wielders attack the embassy from opposite sides',
  },
  gatecrossing: {
    src: '/art/black-gate-crossing.png',
    alt: 'Caelan crosses the Black Gate with Vexa, willing allies, and the recovered Gate Nail fragment',
  },
} as const;

const CHAPTER_START_KEYS: Partial<Record<ChapterNumber, string>> = {
  2: 'veilfall.chapter-two.v1.start',
  3: 'veilfall.chapter-three.v1.start',
  4: 'veilfall.chapter-four.v1.start',
  5: 'veilfall.chapter-five.v1.start',
  6: 'veilfall.chapter-six.v1.start',
  7: 'veilfall.chapter-seven.v1.start',
  8: 'veilfall.chapter-eight.v1.start',
  9: 'veilfall.chapter-nine.v1.start',
};

const chapterLibrary = [
  {
    number: 1 as const,
    title: 'The Road Before Rain',
    summary:
      'Escort Ambassador Lysara beyond Greyhaven before the storm closes the road.',
  },
  {
    number: 2 as const,
    title: 'The Inn That Waited',
    summary:
      'Defend the wounded during an inn siege and repair the road beneath it.',
  },
  {
    number: 3 as const,
    title: 'The Town at the Wrong Mile',
    summary:
      'Hunt the courier who framed you through Harrowfen and onto a hidden bridge.',
  },
  {
    number: 4 as const,
    title: 'Thief at the Mileless Bridge',
    summary:
      'Pursue Rook and Ordan across impossible roads while the Crown destroys the bridge.',
  },
  {
    number: 5 as const,
    title: 'The Dragon’s Cold Grave',
    summary:
      'Climb through hunting cold fire and decide how Vaor’s living ember leaves Dragonspine.',
  },
  {
    number: 6 as const,
    title: 'The City on Wheels',
    summary:
      'Earn a voice in Kharad Vey and keep its living clans free from an ancestor storm.',
  },
  {
    number: 7 as const,
    title: 'The Red Wind Hunt',
    summary:
      'Face your own kingdom’s army and uncover why the Black Gate forts were emptied.',
  },
  {
    number: 8 as const,
    title: 'Seven Cold Fires',
    summary:
      'Restore the Black Gate defences and face the price paid during seventeen hidden openings.',
  },
  {
    number: 9 as const,
    title: 'The Price of a Name',
    summary:
      'Recover the missing Gate Nail piece while mortal and devil assassins strike the first embassy.',
  },
];

type ModelTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: unknown) => unknown;
};

type ModelContext = {
  registerTool: (
    tool: ModelTool,
    options?: { signal?: AbortSignal },
  ) => void | Promise<void>;
};

const statIcons: Record<StatKey, typeof Heart> = {
  health: Heart,
  resolve: Shield,
  command: Swords,
  oathfire: Flame,
  medicine: Heart,
  wayfire: Sparkles,
};

const statHelp: Record<StatKey, string> = {
  health: 'Injury and exhaustion reduce this. At zero, Caelan dies.',
  resolve: 'His strength against fear, pain, manipulation, and despair.',
  command: 'Readiness and trust he can spend to coordinate the escort.',
  oathfire:
    'Magic gained from a binding promise and spent on extraordinary protection.',
  medicine:
    'Strong healing supplies. The story explains who can benefit before you spend any.',
  wayfire:
    'Optional path currency earned through lasting choices and chapter completion.',
};

const coreStatKeys: StatKey[] = ['health', 'resolve', 'command', 'oathfire'];
const resourceStatKeys: StatKey[] = ['medicine', 'wayfire'];

function migrateRelationships(value: Partial<GameState>) {
  const flags = new Set(value.flags ?? []);
  const inferredIntent = (person: RelationshipKey) => {
    if (person === 'mara') {
      if (flags.has('c7-mara-romance-ended')) return 'ended' as const;
      if (flags.has('c7-mara-friendship-chosen')) return 'platonic' as const;
      if (flags.has('c7-mara-chosen-future')) return 'committed' as const;
      if (flags.has('c7-mara-duty-before-future')) return 'exploring' as const;
      if (
        flags.has('c5-mara-friendship') ||
        flags.has('c4-platonic-mara') ||
        flags.has('c2-mara-friendship')
      )
        return 'platonic' as const;
      if (flags.has('c5-admitted-future-with-mara'))
        return 'committed' as const;
      if (
        flags.has('c5-kissed-mara') ||
        flags.has('c4-kissed-mara') ||
        flags.has('c2-kissed-mara')
      )
        return 'exploring' as const;
      if (flags.has('flirted-mara') || flags.has('shared-unease'))
        return 'interested' as const;
    } else if (person === 'lysara') {
      if (flags.has('c7-lysara-romance-ended')) return 'ended' as const;
      if (flags.has('c7-lysara-friendship-chosen')) return 'platonic' as const;
      if (flags.has('c7-lysara-chosen-future')) return 'committed' as const;
      if (flags.has('c7-lysara-duty-before-future'))
        return 'exploring' as const;
      if (flags.has('c5-lysara-friendship') || flags.has('c4-platonic-lysara'))
        return 'platonic' as const;
      if (flags.has('c5-admitted-future-with-lysara'))
        return 'committed' as const;
      if (flags.has('c5-kissed-lysara')) return 'exploring' as const;
      if (flags.has('c4-lysara-private-truth') || flags.has('intrigued-lysara'))
        return 'interested' as const;
    } else if (person === 'ilyra') {
      if (flags.has('c7-ilyra-leverage-refused')) return 'ended' as const;
      if (flags.has('c7-ilyra-friendship-chosen')) return 'platonic' as const;
      if (flags.has('c7-ilyra-bond-deepened')) return 'exploring' as const;
      if (flags.has('c7-ilyra-interest-kept')) return 'interested' as const;
      if (flags.has('c6-ilyra-interest-acknowledged'))
        return 'interested' as const;
    } else {
      if (flags.has('c9-vexa-permanent-hostility')) return 'hostile' as const;
      if (flags.has('c9-shared-private-night')) return 'exploring' as const;
      if (flags.has('c9-vexa-attraction-acknowledged'))
        return 'interested' as const;
      if (flags.has('c9-vexa-adversarial-respect')) return 'platonic' as const;
    }
    return 'unresolved' as const;
  };

  if (value.relationships) {
    const saved = normaliseRelationships(value.relationships);
    return {
      mara: {
        ...saved.mara,
        intent: value.relationships.mara?.intent ?? inferredIntent('mara'),
      },
      lysara: {
        ...saved.lysara,
        intent: value.relationships.lysara?.intent ?? inferredIntent('lysara'),
      },
      ilyra: {
        ...saved.ilyra,
        intent: value.relationships.ilyra?.intent ?? inferredIntent('ilyra'),
      },
      vexa: {
        ...saved.vexa,
        intent: value.relationships.vexa?.intent ?? inferredIntent('vexa'),
      },
    };
  }

  const count = (names: string[]) =>
    names.filter((flag) => flags.has(flag)).length;
  return {
    mara: {
      trust:
        2 +
        count([
          'trusted-mara-scouting',
          'shared-unease',
          'mara-read-order',
          'ridge-route',
          'planned-evening',
          'trusted-mara-in-fight',
          'saved-mara',
          'mara-tended',
          'c2-mara-led-entry',
          'c2-compressed-wound',
          'c2-shared-fear',
          'c2-mara-below',
          'c3-shielded-wounded',
          'c3-entered-unarmed',
          'c3-backed-mara',
          'c3-priority-people',
          'c3-mara-flanked-double',
          'c3-pursuit-mara',
        ]),
      attraction:
        1 +
        count([
          'flirted-mara',
          'shared-unease',
          'planned-evening',
          'saved-mara',
          'mara-tended',
          'c2-shared-fear',
          'c2-kissed-mara',
          'c3-entered-unarmed',
          'c3-priority-people',
          'c3-pursuit-mara',
        ]),
      respect: 2 + count(['c3-priority-people', 'c4-told-mara-law-bends']),
      friction: 0,
      intent: inferredIntent('mara'),
    },
    lysara: {
      trust: Math.max(
        0,
        count([
          'kept-seed-secret',
          'seed-safe',
          'found-shard-salt',
          'c2-lysara-led-care',
          'c2-saved-lysara',
          'c2-lysara-below',
          'c3-backed-lysara',
          'c3-lysara-read-ink',
          'c3-priority-cause',
          'c3-pursuit-lysara',
        ]) - (flags.has('revealed-seed') ? 1 : 0),
      ),
      attraction: count([
        'intrigued-lysara',
        'kept-seed-secret',
        'c3-lysara-read-ink',
        'c3-priority-cause',
        'c3-pursuit-lysara',
      ]),
      respect: 1 + count(['c3-priority-cause', 'c4-lysara-private-truth']),
      friction: flags.has('revealed-seed') ? 1 : 0,
      intent: inferredIntent('lysara'),
    },
    ilyra: {
      trust: count([
        'c6-named-ilyra-manipulation',
        'c6-ilyra-professional-alliance',
        'c6-precise-unsea-truth',
        'c6-ilyra-leads-evidence',
      ]),
      attraction: flags.has('c6-ilyra-interest-acknowledged') ? 2 : 0,
      respect: count([
        'c6-named-ilyra-manipulation',
        'c6-ilyra-professional-alliance',
        'c6-ilyra-leads-evidence',
      ]),
      friction: flags.has('c6-refused-ilyra-pressure') ? 1 : 0,
      intent: inferredIntent('ilyra'),
    },
    vexa: {
      ...initialState.relationships.vexa,
      intent: inferredIntent('vexa'),
    },
  };
}

function normaliseState(value: Partial<GameState>): GameState {
  const nodeId =
    value.nodeId && nodes[value.nodeId] ? value.nodeId : initialState.nodeId;
  const chapter = nodeId.startsWith('c9-')
    ? 9
    : nodeId.startsWith('c8-')
      ? 8
      : nodeId.startsWith('c7-')
        ? 7
        : nodeId.startsWith('c6-')
          ? 6
          : nodeId.startsWith('c5-')
            ? 5
            : nodeId.startsWith('c4-')
              ? 4
              : nodeId.startsWith('c3-')
                ? 3
                : nodeId.startsWith('c2-')
                  ? 2
                  : (value.chapter ?? 1);
  const savedStats = (value.stats ?? {}) as Partial<GameStats> & {
    stamina?: number;
  };
  const health =
    savedStats.health ?? savedStats.stamina ?? initialState.stats.health;
  const completedChapters = Array.from(
    new Set([
      ...(value.completedChapters ?? []),
      ...(nodes[nodeId]?.final && health > 0 && !value.defeat ? [chapter] : []),
    ]),
  );
  return {
    nodeId,
    chapter,
    chapterChoices:
      value.chapterChoices ??
      (chapter === 1 ? (value.history?.length ?? 0) : 0),
    completedChapters,
    stats: {
      health,
      resolve: savedStats.resolve ?? initialState.stats.resolve,
      command: savedStats.command ?? initialState.stats.command,
      oathfire: savedStats.oathfire ?? initialState.stats.oathfire,
      medicine: savedStats.medicine ?? initialState.stats.medicine,
      wayfire: savedStats.wayfire ?? initialState.stats.wayfire,
    },
    relationships: migrateRelationships(value),
    contentPreference: {
      ...initialState.contentPreference,
      ...value.contentPreference,
    },
    flags: value.flags ?? [],
    history: value.history ?? [],
    defeat: value.defeat ?? null,
  };
}

function defeatForChoice(
  chapter: ChapterNumber,
  choice: Choice,
  state: GameState,
) {
  const bodies: Record<ChapterNumber, string> = {
    1: 'You complete the action, but your wounds finally take your strength. Rain fills your mouth as the road darkens above you. The escort continues for only a few steps before the enemy closes in.',
    2: 'You force the danger back, but your body cannot survive the effort. The last sound you hear is Bellweather’s bell and Mara calling your name through the battle.',
    3: 'Your choice changes the fight, but blood and exhaustion pull you down beside the canal. Harrowfen’s lanterns blur on the water as Ordan escapes toward the eastern bridge.',
    4: 'You complete the action, but the moving bridge takes the last of your strength. Stone turns beneath you as Mara reaches for your hand and the World Nail fragment disappears into another sky.',
    5: state.flags.includes('c5-chose-lysara-care')
      ? 'You complete the action, but the cold fire takes the last warmth from your wounds. Glass and blue flame blur above you while Lysara calls your name and Vaor roars beneath the mountain.'
      : state.flags.includes('c5-chose-sorin-care')
        ? 'You complete the action, but the cold fire takes the last warmth from your wounds. Glass and blue flame blur above you while your companions call your name and Vaor roars beneath the mountain.'
        : 'You complete the action, but the cold fire takes the last warmth from your wounds. Glass and blue flame blur above you while Mara calls your name and Vaor roars beneath the mountain.',
    6: 'You complete the action, but the moving city and the red storm take the last of your strength. The deck rolls beneath you while Korran calls the living crews together and the ember fades behind your ribs.',
    7: 'You complete the action, but the Red Wind Hunt takes the last of your strength. Salt and red sky blur together while your companions fight to keep the living army from obeying its dead.',
    8: 'You complete the action, but the Black Gate takes the last of your strength. Snow and furnace light blur together while the defenders struggle to keep the opening from becoming an invasion road.',
    9: 'You complete the action, but the embassy attack takes the last of your strength. Glass chains and handbow smoke blur while your allies keep the Gate Nail fragment from both assassin groups.',
  };
  return {
    title: 'Caelan has fallen',
    body: bodies[chapter],
    choiceId: choice.id,
  };
}

function applyChoice(state: GameState, choice: Choice): GameState {
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
    flags: Array.from(new Set([...state.flags, ...(choice.addFlags ?? [])])),
    history: [...state.history, choice.result],
    defeat:
      nextStats.health <= 0
        ? defeatForChoice(state.chapter, choice, state)
        : null,
  };
}

function wouldBeFatal(choice: Choice, state: GameState) {
  const healthChange = choice.changes?.health ?? 0;
  return healthChange < 0 && state.stats.health + healthChange <= 0;
}

function changeSummary(choice: Choice, state: GameState) {
  const statChanges = Object.entries(choice.changes ?? {})
    .filter(([, value]) => value !== 0)
    .map(([key, value]) => {
      const amount = Math.abs(value ?? 0);
      return (value ?? 0) < 0
        ? `Cost: ${statLabels[key as StatKey]} ${amount}`
        : `Gain: ${statLabels[key as StatKey]} ${amount}`;
    });
  const personalChanges = Object.entries(relationshipChanges(choice)).flatMap(
    ([person, changes]) => {
      const name = relationshipLabels[person as RelationshipKey];
      const notes: string[] = [];
      if ((changes?.trust ?? 0) > 0) notes.push(`${name}: trust may deepen`);
      if ((changes?.trust ?? 0) < 0)
        notes.push(`${name}: trust may be damaged`);
      if ((changes?.attraction ?? 0) > 0)
        notes.push(`${name}: attraction may deepen`);
      if ((changes?.respect ?? 0) > 0)
        notes.push(`${name}: respect may deepen`);
      if ((changes?.friction ?? 0) > 0) notes.push(`${name}: tension may rise`);
      if (changes?.intent === 'platonic')
        notes.push(`${name}: friendship chosen`);
      if (changes?.intent === 'interested')
        notes.push(`${name}: interest acknowledged`);
      if (changes?.intent === 'exploring')
        notes.push(`${name}: relationship being explored`);
      if (changes?.intent === 'committed')
        notes.push(`${name}: commitment chosen`);
      if (changes?.intent === 'ended') notes.push(`${name}: romance ended`);
      return notes;
    },
  );
  return [
    ...statChanges,
    ...personalChanges,
    ...(wouldBeFatal(choice, state) ? ['Lethal at current Health'] : []),
  ];
}

function activePromises(game: GameState) {
  const promises: string[] = [];
  if (game.flags.includes('oath-bring-them-home'))
    promises.push('Bring the escort home alive.');
  if (game.flags.includes('c2-oath-repair-road'))
    promises.push('Repair the damaged King’s Road.');
  if (game.flags.includes('c2-oath-expose-crown'))
    promises.push('Expose the Crown officer behind the attack.');
  if (game.flags.includes('c3-oath-hold-town'))
    promises.push('Do not let Harrowfen fall while Ordan is pursued.');
  if (game.flags.includes('c4-oath-no-one-falls'))
    promises.push(
      'Do not let anyone fall from the Mileless Bridge while you stand.',
    );
  if (game.flags.includes('c4-oath-honest-with-mara'))
    promises.push('Do not hide behind duty when speaking with Mara.');
  if (game.flags.includes('c5-oath-carry-vaor-grief'))
    promises.push('Hear Vaor’s grief without turning away.');
  if (game.flags.includes('c5-vaor-pact'))
    promises.push(
      'Carry Vaor’s voice and ember until both of you agree the duty is complete.',
    );
  if (
    game.flags.includes('c6-oath-investigate-unsea') &&
    !game.flags.includes('c9-destroyed-unsea-investigation-oath')
  )
    promises.push('Discover which ancestor voices are truly conscious.');
  if (
    game.flags.includes('c6-oath-recognised-red-moot') &&
    !game.flags.includes('c9-destroyed-red-moot-authority-oath')
  )
    promises.push(
      'Recognise the Red Moot’s living authority in every alliance you lead.',
    );
  if (
    game.flags.includes('c6-oath-crown-restitution') &&
    !game.flags.includes('c8-released-crown-oath') &&
    !game.flags.includes('c9-destroyed-crown-restitution-oath')
  )
    promises.push(
      'Bring the Concord’s hidden victims before the Queen or oppose the throne that buries them.',
    );
  if (
    game.flags.includes('c6-oath-defends-refusal') &&
    !game.flags.includes('c9-destroyed-clan-refusal-oath')
  )
    promises.push('Defend the clans’ right to refuse future Crown control.');
  if (
    game.flags.includes('c6-oath-honest-limit') &&
    !game.flags.includes('c9-destroyed-honest-command-limit-oath')
  )
    promises.push(
      'Bind only your own command, testimony, and defence of the Red Moot.',
    );
  if (game.flags.includes('c7-oath-living-command'))
    promises.push('No dead officer holds lawful rank over a living soldier.');
  if (game.flags.includes('c7-oath-surrender-road'))
    promises.push('Give safe ground to every soldier who lowers a weapon.');
  if (game.flags.includes('c9-return-promise-owned'))
    promises.push(
      'Return the Black Gate fragment to neutral custody after Malrec’s inside opening is stopped, unless every living Gate keeper freely agrees otherwise.',
    );
  if (game.flags.includes('c2-caelan-injured'))
    promises.push(
      'Injury: Caelan hurt his back driving the road pin into place.',
    );
  return promises.length
    ? promises
    : ['No binding Oath or lasting injury is active.'];
}

const beforeIlyraNodes = new Set([
  'c6-steppe-road',
  'c6-running-gate',
  'c6-broken-axle',
  'c6-first-duty',
  'c6-herd-duty',
  'c6-forge-duty',
  'c6-shrine-duty',
  'c6-ancestor-warning',
  'c6-storm-breach',
  'c6-korran-terms',
]);

function visibleRelationshipKeys(game: GameState): RelationshipKey[] {
  const ilyraKnown =
    game.completedChapters.includes(6) ||
    game.nodeId.startsWith('c7-') ||
    (game.nodeId.startsWith('c6-') && !beforeIlyraNodes.has(game.nodeId));
  const known: RelationshipKey[] = ilyraKnown
    ? ['mara', 'lysara', 'ilyra']
    : ['mara', 'lysara'];
  if (game.completedChapters.includes(8) || game.nodeId.startsWith('c9-')) {
    known.push('vexa');
  }
  return known;
}

export default function Home() {
  const [game, setGame] = useState<GameState>(initialState);
  const [started, setStarted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [showChapterLibrary, setShowChapterLibrary] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);
  const [showReturnRecap, setShowReturnRecap] = useState(false);
  const [pendingReplay, setPendingReplay] = useState<ChapterNumber | null>(
    null,
  );
  const gameRef = useRef(game);
  const storyRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const scrollAfterChoice = useRef<'story' | 'scene' | null>(null);

  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const saved = [CURRENT_SAVE_KEY, ...LEGACY_SAVE_KEYS]
        .map((key) => window.localStorage.getItem(key))
        .find((value) => value !== null);
      if (saved) {
        try {
          const parsed = normaliseState(
            JSON.parse(saved) as Partial<GameState>,
          );
          if (parsed.nodeId && nodes[parsed.nodeId]) {
            setGame(parsed);
            setStarted(true);
            setShowReturnRecap(true);
          }
        } catch {
          window.localStorage.removeItem(CURRENT_SAVE_KEY);
        }
      }
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loaded && started) {
      window.localStorage.setItem(CURRENT_SAVE_KEY, JSON.stringify(game));
    }
  }, [game, loaded, started]);

  useEffect(() => {
    if (!scrollAfterChoice.current) return;
    const target =
      scrollAfterChoice.current === 'scene'
        ? sceneRef.current
        : storyRef.current;
    scrollAfterChoice.current = null;
    window.requestAnimationFrame(() => {
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [game.nodeId]);

  useEffect(() => {
    const modelContext = (
      document as Document & { modelContext?: ModelContext }
    ).modelContext;
    if (!modelContext?.registerTool) return;

    const lifecycle = new AbortController();
    const register = (tool: ModelTool) => {
      try {
        void Promise.resolve(
          modelContext.registerTool(tool, { signal: lifecycle.signal }),
        ).catch(() => undefined);
      } catch {
        return;
      }
    };

    register({
      name: 'read_current_scene',
      title: 'Read current Veilfall scene',
      description:
        'Read the active scene, character stats, and available actions without changing the game.',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: () => {
        const current = gameRef.current;
        const currentNode = nodes[current.nodeId];
        return {
          sceneId: current.nodeId,
          title: currentNode.title,
          stats: current.stats,
          relationships: current.relationships,
          defeat: current.defeat,
          actions: current.defeat
            ? []
            : currentNode.choices
                .filter((choice) => canChoose(choice, current))
                .map((choice) => ({ id: choice.id, label: choice.label })),
        };
      },
    });

    register({
      name: 'choose_veilfall_action',
      title: 'Choose a Veilfall action',
      description:
        'Choose one currently available action by its id and advance the visible story.',
      inputSchema: {
        type: 'object',
        properties: { choiceId: { type: 'string' } },
        required: ['choiceId'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: (input) => {
        if (!input || typeof input !== 'object' || !('choiceId' in input)) {
          throw new Error('choiceId is required');
        }
        const choiceId = (input as { choiceId?: unknown }).choiceId;
        if (typeof choiceId !== 'string')
          throw new Error('choiceId must be a string');

        const current = gameRef.current;
        if (current.defeat) {
          throw new Error(
            'Caelan has fallen. Return to the chapter start before choosing again',
          );
        }
        const choice = nodes[current.nodeId].choices.find(
          (item) => item.id === choiceId,
        );
        if (!choice || !canChoose(choice, current)) {
          throw new Error('That action is not available in the current scene');
        }

        const next = applyChoice(current, choice);
        gameRef.current = next;
        setStarted(true);
        setLastResult(choice.result);
        setGame(next);
        return {
          sceneId: next.nodeId,
          result: choice.result,
          stats: next.stats,
        };
      },
    });

    return () => lifecycle.abort();
  }, []);

  const node = nodes[game.nodeId];
  const paragraphs = useMemo(() => node.body(game), [game, node]);
  const truths = useMemo(() => knownTruths(game), [game]);
  const promises = useMemo(() => activePromises(game), [game]);
  const consequences = useMemo(() => majorConsequences(game), [game]);
  const visibleRelationships = visibleRelationshipKeys(game);
  const chapterProgress = node.final
    ? 100
    : Math.min(96, Math.round((game.chapterChoices / 15) * 100));

  function choose(choice: Choice) {
    if (game.defeat || !canChoose(choice, game)) return;
    const next = applyChoice(game, choice);
    scrollAfterChoice.current =
      nodes[next.nodeId].art !== node.art ? 'scene' : 'story';
    setLastResult(choice.result);
    setGame(next);
  }

  function loadChapterState(next: GameState) {
    gameRef.current = next;
    setGame(next);
    setLastResult(null);
    setStarted(true);
    setShowChapterLibrary(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function returnToChapterStart() {
    const checkpoint = chapterStart(game.chapter) ?? initialState;
    loadChapterState({
      ...checkpoint,
      stats: {
        ...checkpoint.stats,
        health: Math.max(3, checkpoint.stats.health),
      },
      defeat: null,
    });
  }

  function restartStoryAfterDeath() {
    for (const key of [
      CURRENT_SAVE_KEY,
      ...LEGACY_SAVE_KEYS,
      ...Object.values(CHAPTER_START_KEYS),
    ]) {
      window.localStorage.removeItem(key);
    }
    loadChapterState(initialState);
  }

  function chapterStart(chapter: ChapterNumber) {
    if (chapter === 1) return initialState;
    const key = CHAPTER_START_KEYS[chapter];
    if (!key) return null;
    const savedStart = window.localStorage.getItem(key);
    if (!savedStart) return null;
    try {
      return normaliseState(JSON.parse(savedStart) as Partial<GameState>);
    } catch {
      window.localStorage.removeItem(key);
      return null;
    }
  }

  function replayChapter(chapter: ChapterNumber) {
    if (chapter === 1) {
      window.localStorage.removeItem(CURRENT_SAVE_KEY);
      for (const key of LEGACY_SAVE_KEYS) window.localStorage.removeItem(key);
      for (const key of Object.values(CHAPTER_START_KEYS)) {
        window.localStorage.removeItem(key);
      }
      loadChapterState(initialState);
      return;
    }

    for (const later of ([2, 3, 4, 5, 6, 7, 8, 9] as ChapterNumber[]).filter(
      (number) => number > chapter,
    )) {
      const key = CHAPTER_START_KEYS[later];
      if (key) window.localStorage.removeItem(key);
    }
    const savedStart = chapterStart(chapter);
    if (savedStart) loadChapterState(savedStart);
  }

  function restart() {
    setPendingReplay(game.chapter);
  }

  function confirmReplay() {
    if (!pendingReplay) return;
    const chapter = pendingReplay;
    setPendingReplay(null);
    replayChapter(chapter);
  }

  function startChapterTwo() {
    const next: GameState = {
      ...game,
      nodeId: 'c2-arrival',
      chapter: 2,
      chapterChoices: 0,
      completedChapters: Array.from(new Set([...game.completedChapters, 1])),
      stats: {
        ...game.stats,
        health: Math.min(8, game.stats.health + 2),
        resolve: Math.min(8, game.stats.resolve + 1),
        medicine: 1,
      },
      history: [
        ...game.history,
        'You continue to Bellweather Inn with every earlier consequence.',
      ],
    };
    window.localStorage.setItem(CHAPTER_START_KEYS[2]!, JSON.stringify(next));
    loadChapterState(next);
  }

  function startChapterThree() {
    const next: GameState = {
      ...game,
      nodeId: 'c3-arrival',
      chapter: 3,
      chapterChoices: 0,
      completedChapters: Array.from(new Set([...game.completedChapters, 2])),
      stats: {
        ...game.stats,
        health: Math.min(8, game.stats.health + 2),
        resolve: Math.min(8, game.stats.resolve + 1),
        command: Math.min(6, game.stats.command + 1),
      },
      history: [
        ...game.history,
        'You continue to Harrowfen with every earlier consequence.',
      ],
    };
    window.localStorage.setItem(CHAPTER_START_KEYS[3]!, JSON.stringify(next));
    loadChapterState(next);
  }

  function startChapterFour() {
    const next: GameState = {
      ...game,
      nodeId: 'c4-bridge-start',
      chapter: 4,
      chapterChoices: 0,
      completedChapters: Array.from(new Set([...game.completedChapters, 3])),
      stats: {
        ...game.stats,
        health: Math.min(8, game.stats.health + 1),
      },
      history: [
        ...game.history,
        'You enter the Mileless Bridge with every earlier consequence.',
      ],
    };
    window.localStorage.setItem(CHAPTER_START_KEYS[4]!, JSON.stringify(next));
    loadChapterState(next);
  }

  function startChapterFive() {
    const next: GameState = {
      ...game,
      nodeId: 'c5-north-road',
      chapter: 5,
      chapterChoices: 0,
      completedChapters: Array.from(new Set([...game.completedChapters, 4])),
      stats: {
        ...game.stats,
        health: Math.min(8, game.stats.health + 1),
        resolve: Math.min(8, game.stats.resolve + 1),
        command: Math.min(6, game.stats.command + 1),
      },
      history: [
        ...game.history,
        'You follow the northern mark into Dragonspine with every earlier consequence.',
      ],
    };
    window.localStorage.setItem(CHAPTER_START_KEYS[5]!, JSON.stringify(next));
    loadChapterState(next);
  }

  function startChapterSix() {
    const next: GameState = {
      ...game,
      nodeId: 'c6-steppe-road',
      chapter: 6,
      chapterChoices: 0,
      completedChapters: Array.from(new Set([...game.completedChapters, 5])),
      stats: {
        ...game.stats,
        health: Math.min(8, game.stats.health + 2),
        resolve: Math.min(8, game.stats.resolve + 1),
        command: Math.min(6, game.stats.command + 1),
      },
      history: [
        ...game.history,
        'You leave Dragonspine for Kharad Vey with every earlier consequence.',
      ],
    };
    window.localStorage.setItem(CHAPTER_START_KEYS[6]!, JSON.stringify(next));
    loadChapterState(next);
  }

  function startChapterSeven() {
    const next: GameState = {
      ...game,
      nodeId: 'c7-red-horizon',
      chapter: 7,
      chapterChoices: 0,
      completedChapters: Array.from(new Set([...game.completedChapters, 6])),
      stats: {
        ...game.stats,
        health: Math.min(8, game.stats.health + 2),
        resolve: Math.min(8, game.stats.resolve + 1),
        command: Math.min(6, game.stats.command + 1),
      },
      history: [
        ...game.history,
        'You leave Kharad Vey beneath the Red Wind Hunt with every earlier consequence.',
      ],
    };
    window.localStorage.setItem(CHAPTER_START_KEYS[7]!, JSON.stringify(next));
    loadChapterState(next);
  }

  function startChapterEight() {
    const next: GameState = {
      ...game,
      nodeId: 'c8-gate-ring',
      chapter: 8,
      chapterChoices: 0,
      completedChapters: Array.from(new Set([...game.completedChapters, 7])),
      stats: {
        ...game.stats,
        health: Math.min(8, game.stats.health + 2),
        resolve: Math.min(8, game.stats.resolve + 1),
        command: Math.min(6, game.stats.command + 1),
        medicine: Math.max(1, game.stats.medicine),
      },
      history: [
        ...game.history,
        'You reach the eight forts surrounding the Black Gate with every earlier consequence.',
      ],
    };
    window.localStorage.setItem(CHAPTER_START_KEYS[8]!, JSON.stringify(next));
    loadChapterState(next);
  }

  function startChapterNine() {
    const next: GameState = {
      ...game,
      nodeId: 'c9-embassy-watch',
      chapter: 9,
      chapterChoices: 0,
      completedChapters: Array.from(new Set([...game.completedChapters, 8])),
      stats: {
        ...game.stats,
        health: Math.min(8, game.stats.health + 1),
        resolve: Math.min(8, game.stats.resolve + 1),
        medicine: Math.max(1, game.stats.medicine),
      },
      history: [
        ...game.history,
        'You establish neutral Second Fort for the first Cinder Deep embassy with every earlier consequence.',
      ],
    };
    window.localStorage.setItem(CHAPTER_START_KEYS[9]!, JSON.stringify(next));
    loadChapterState(next);
  }

  if (!loaded) {
    return (
      <main
        className="min-h-screen bg-[#07090b]"
        aria-label="Loading Veilfall"
      />
    );
  }

  if (!started) {
    return (
      <main className="cover-screen min-h-screen text-[#eee7d8]">
        <Image
          src="/art/caelan-east-gate.png"
          alt="Caelan and Mara lead a diplomatic escort out of Greyhaven"
          fill
          priority
          className="cover-art object-cover"
          sizes="100vw"
        />
        <div className="cover-shade" />
        <section className="cover-copy">
          <div className="brand-mark" aria-hidden="true">
            V
          </div>
          <p className="eyebrow">An interactive dark fantasy</p>
          <h1>Veilfall</h1>
          <p className="cover-subtitle">The Broken Concord</p>
          <p className="cover-intro">
            You know the King&apos;s Road, the people under your command, and
            the promise waiting at its end. Before night, an enemy will know
            every route you might choose.
          </p>
          <Button
            className="begin-button"
            size="lg"
            onClick={() => setStarted(true)}
          >
            Begin chapter one
            <ArrowRight data-icon="inline-end" />
          </Button>
          <p className="play-note">
            About 30 to 40 minutes. Your choices are saved on this device.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main
      className={`game-shell min-h-screen text-[#eee7d8] ${game.stats.health <= 2 ? 'health-critical' : ''}`}
    >
      <header className="topbar">
        <div className="wordmark">
          <span className="wordmark-rune" aria-hidden="true">
            V
          </span>
          <span>VEILFALL</span>
        </div>
        <div className="chapter-label">
          <BookOpen aria-hidden="true" />
          Caelan{' '}
          {
            ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'][
              game.chapter - 1
            ]
          }
        </div>
        <div className="top-actions">
          <Button
            className="journal-button"
            variant="ghost"
            size="sm"
            onClick={() => setShowJournal(true)}
          >
            <BookOpen data-icon="inline-start" />
            Journal
          </Button>
          <Button
            className="chapter-menu-button"
            variant="ghost"
            size="sm"
            onClick={() => setShowChapterLibrary((open) => !open)}
            aria-expanded={showChapterLibrary}
          >
            <BookOpen data-icon="inline-start" />
            Chapters
          </Button>
          <Button
            className="restart-button"
            variant="ghost"
            size="sm"
            onClick={restart}
          >
            <RotateCcw data-icon="inline-start" />
            Replay current
          </Button>
        </div>
      </header>

      {showReturnRecap && (
        <aside className="return-recap" aria-label="Returning player recap">
          <div>
            <p className="eyebrow">Welcome back</p>
            <strong>{node.objective}</strong>
            <p>{game.history.at(-1) ?? truths.at(-1)}</p>
          </div>
          <div className="return-recap-actions">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowJournal(true)}
            >
              Open journal
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReturnRecap(false)}
            >
              Continue reading
            </Button>
          </div>
        </aside>
      )}

      {showChapterLibrary && (
        <aside className="chapter-library" aria-label="Unlocked chapters">
          <div className="chapter-library-heading">
            <div>
              <p className="eyebrow">Caelan’s journey</p>
              <h2>Replay an unlocked chapter</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChapterLibrary(false)}
            >
              Close
            </Button>
          </div>
          <p className="chapter-library-note">
            Replaying a chapter replaces its choices, points, and outcome.
            Earlier chapters stay the same. Replaying an earlier chapter removes
            later chapter progress, because those events came from the old path.
          </p>
          <div className="chapter-library-list">
            {chapterLibrary.map((chapter) => {
              const unlocked =
                chapter.number === 1 ||
                game.chapter === chapter.number ||
                game.completedChapters.includes(chapter.number - 1);
              const available =
                chapter.number === 1 ||
                (loaded &&
                  typeof window !== 'undefined' &&
                  Boolean(
                    window.localStorage.getItem(
                      CHAPTER_START_KEYS[chapter.number]!,
                    ),
                  ));
              return (
                <div className="chapter-library-entry" key={chapter.number}>
                  <div>
                    <span>Chapter {chapter.number}</span>
                    <h3>{chapter.title}</h3>
                    <p>{chapter.summary}</p>
                  </div>
                  {unlocked ? (
                    <Button
                      className="chapter-library-button"
                      variant="outline"
                      size="sm"
                      disabled={!available}
                      onClick={() => setPendingReplay(chapter.number)}
                    >
                      {chapter.number === game.chapter
                        ? 'Replay'
                        : 'Play again'}
                    </Button>
                  ) : (
                    <span className="chapter-locked">
                      Finish Chapter {chapter.number - 1} to unlock
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      )}

      <section className="mobile-status-strip" aria-label="Current status">
        <div>
          <span>Threat</span>
          <strong>{node.threat}</strong>
        </div>
        <div>
          <span>Health</span>
          <strong>{game.stats.health}</strong>
        </div>
        <div>
          <span>Resolve</span>
          <strong>{game.stats.resolve}</strong>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowJournal(true)}>
          Journal
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowCharacterSheet(true)}
        >
          Stats
        </Button>
      </section>

      <div className="game-grid">
        <section className="story-column" aria-live="polite">
          <div className="scene-art-wrap" ref={sceneRef}>
            <Image
              src={sceneArtwork[node.art ?? 'departure'].src}
              alt={sceneArtwork[node.art ?? 'departure'].alt}
              width={1536}
              height={864}
              className="scene-art"
              priority
            />
            <div className="scene-vignette" />
            <div className="location-stamp">{node.location}</div>
          </div>

          <article className="story-page" key={node.id} ref={storyRef}>
            <p className="eyebrow">{node.kicker}</p>
            <h1>{node.title}</h1>

            {node.lesson && (
              <aside className="lesson-card">
                <span>{node.lesson.title}</span>
                <p>{node.lesson.body}</p>
              </aside>
            )}

            <div className="prose">
              {lastResult && <p>{lastResult}</p>}
              {paragraphs.map((paragraph, index) => (
                <p key={`${node.id}-${index}`}>{paragraph}</p>
              ))}
            </div>

            {node.intimacyControls?.(game) ? (
              <aside
                className="lesson-card"
                aria-label="Optional intimacy detail"
              >
                <p className="eyebrow">Optional scene detail</p>
                <h3>Choose how the same scene is described</h3>
                <p>
                  Fade and detailed versions preserve identical choices,
                  information, flags, and later consequences.
                </p>
                <label>
                  <input
                    type="checkbox"
                    checked={game.contentPreference.adultConfirmed}
                    onChange={(event) =>
                      setGame((current) => ({
                        ...current,
                        contentPreference: {
                          ...current.contentPreference,
                          adultConfirmed: event.target.checked,
                          intimacy: event.target.checked
                            ? current.contentPreference.intimacy
                            : 'fade',
                        },
                      }))
                    }
                  />{' '}
                  I confirm that I am an adult and may choose detailed prose.
                </label>
                <div className="top-actions">
                  <Button
                    type="button"
                    variant={
                      game.contentPreference.intimacy === 'fade'
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                      setGame((current) => ({
                        ...current,
                        contentPreference: {
                          ...current.contentPreference,
                          intimacy: 'fade',
                        },
                      }))
                    }
                  >
                    Fade
                  </Button>
                  <Button
                    type="button"
                    variant={
                      game.contentPreference.intimacy === 'detailed'
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    disabled={!game.contentPreference.adultConfirmed}
                    onClick={() =>
                      setGame((current) => ({
                        ...current,
                        contentPreference: {
                          ...current.contentPreference,
                          intimacy: 'detailed',
                        },
                      }))
                    }
                  >
                    Detailed
                  </Button>
                </div>
              </aside>
            ) : null}

            {!node.final ? (
              <div className="choices" aria-label="Choose Caelan's action">
                {node.choices
                  .filter((choice) => isChoiceVisible(choice, game))
                  .map((choice, index) => {
                    const available = canChoose(choice, game);
                    const changes = changeSummary(choice, game);
                    const lethal = wouldBeFatal(choice, game);
                    return (
                      <Button
                        key={choice.id}
                        className="choice-card"
                        variant="outline"
                        disabled={!available}
                        onClick={() => choose(choice)}
                      >
                        <span className="choice-number">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="choice-copy">
                          <strong>{choice.label}</strong>
                          <span>{choice.detail}</span>
                          {choice.advantage ? (
                            <span className="choice-advantage">
                              <b>Expected advantage</b>
                              {choice.advantage}
                            </span>
                          ) : null}
                          <span
                            className={`choice-effects ${lethal ? 'choice-effects-lethal' : ''}`}
                          >
                            {available
                              ? changes.join(' · ')
                              : [
                                  `Requires ${requirementText(choice)}`,
                                  ...changes,
                                ].join(' · ')}
                          </span>
                        </span>
                        <ArrowRight
                          className="choice-arrow"
                          aria-hidden="true"
                        />
                      </Button>
                    );
                  })}
              </div>
            ) : (
              <div className="ending-panel">
                <p className="ending-label">Your path is recorded</p>
                <div className="ending-consequences">
                  <h3>Because you chose</h3>
                  <ul>
                    {consequences.slice(-4).map((consequence) => (
                      <li key={consequence}>{consequence}</li>
                    ))}
                  </ul>
                </div>
                {node.nextChapter ? (
                  game.chapter === 1 ? (
                    <>
                      <h2>Chapter Two is ready</h2>
                      <p>
                        Continue into The Inn That Waited with every consequence
                        from this route. Your {game.stats.wayfire} Wayfire
                        remains available for future optional paths.
                      </p>
                      <Button
                        className="begin-button"
                        size="lg"
                        onClick={startChapterTwo}
                      >
                        Continue to Chapter Two
                        <ArrowRight data-icon="inline-end" />
                      </Button>
                      <Button
                        className="restart-button"
                        variant="ghost"
                        size="sm"
                        onClick={restart}
                      >
                        Replay Chapter One
                        <RotateCcw data-icon="inline-end" />
                      </Button>
                    </>
                  ) : game.chapter === 2 ? (
                    <>
                      <h2>Chapter Three is ready</h2>
                      <p>
                        Continue into The Town at the Wrong Mile with every
                        surviving consequence. Your {game.stats.wayfire} Wayfire
                        remains available for future optional paths.
                      </p>
                      <Button
                        className="begin-button"
                        size="lg"
                        onClick={startChapterThree}
                      >
                        Continue to Chapter Three
                        <ArrowRight data-icon="inline-end" />
                      </Button>
                      <Button
                        className="restart-button"
                        variant="ghost"
                        size="sm"
                        onClick={restart}
                      >
                        Replay Chapter Two
                        <RotateCcw data-icon="inline-end" />
                      </Button>
                    </>
                  ) : game.chapter === 3 ? (
                    <>
                      <h2>Chapter Four is ready</h2>
                      <p>
                        Continue into Thief at the Mileless Bridge with every
                        surviving consequence. Your {game.stats.wayfire} Wayfire
                        remains available for future optional paths.
                      </p>
                      <Button
                        className="begin-button"
                        size="lg"
                        onClick={startChapterFour}
                      >
                        Continue to Chapter Four
                        <ArrowRight data-icon="inline-end" />
                      </Button>
                      <Button
                        className="restart-button"
                        variant="ghost"
                        size="sm"
                        onClick={restart}
                      >
                        Replay Chapter Three
                        <RotateCcw data-icon="inline-end" />
                      </Button>
                    </>
                  ) : game.chapter === 4 ? (
                    <>
                      <h2>Chapter Five is ready</h2>
                      <p>
                        Continue into The Dragon&apos;s Cold Grave with every
                        surviving consequence. Your {game.stats.wayfire} Wayfire
                        remains available for future optional paths.
                      </p>
                      <Button
                        className="begin-button"
                        size="lg"
                        onClick={startChapterFive}
                      >
                        Continue to Chapter Five
                        <ArrowRight data-icon="inline-end" />
                      </Button>
                      <Button
                        className="restart-button"
                        variant="ghost"
                        size="sm"
                        onClick={restart}
                      >
                        Replay Chapter Four
                        <RotateCcw data-icon="inline-end" />
                      </Button>
                    </>
                  ) : game.chapter === 5 ? (
                    <>
                      <h2>Chapter Six is ready</h2>
                      <p>
                        Continue into The City on Wheels with every surviving
                        consequence. Your {game.stats.wayfire} Wayfire remains
                        available for future optional paths.
                      </p>
                      <Button
                        className="begin-button"
                        size="lg"
                        onClick={startChapterSix}
                      >
                        Continue to Chapter Six
                        <ArrowRight data-icon="inline-end" />
                      </Button>
                      <Button
                        className="restart-button"
                        variant="ghost"
                        size="sm"
                        onClick={restart}
                      >
                        Replay Chapter Five
                        <RotateCcw data-icon="inline-end" />
                      </Button>
                    </>
                  ) : game.chapter === 6 ? (
                    <>
                      <h2>Chapter Seven is ready</h2>
                      <p>
                        Continue into The Red Wind Hunt with every surviving
                        consequence. Your {game.stats.wayfire} Wayfire remains
                        available for future optional paths.
                      </p>
                      <Button
                        className="begin-button"
                        size="lg"
                        onClick={startChapterSeven}
                      >
                        Continue to Chapter Seven
                        <ArrowRight data-icon="inline-end" />
                      </Button>
                      <Button
                        className="restart-button"
                        variant="ghost"
                        size="sm"
                        onClick={restart}
                      >
                        Replay Chapter Six
                        <RotateCcw data-icon="inline-end" />
                      </Button>
                    </>
                  ) : game.chapter === 7 ? (
                    <>
                      <h2>Chapter Eight is ready</h2>
                      <p>
                        Continue into Seven Cold Fires with every surviving
                        consequence. Your {game.stats.wayfire} Wayfire remains
                        available for future optional paths.
                      </p>
                      <Button
                        className="begin-button"
                        size="lg"
                        onClick={startChapterEight}
                      >
                        Continue to Chapter Eight
                        <ArrowRight data-icon="inline-end" />
                      </Button>
                      <Button
                        className="restart-button"
                        variant="ghost"
                        size="sm"
                        onClick={restart}
                      >
                        Replay Chapter Seven
                        <RotateCcw data-icon="inline-end" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <h2>Chapter Nine is ready</h2>
                      <p>
                        Continue into The Price of a Name with the exact Gate
                        defence, evidence, Oath price, and embassy position you
                        carried from Chapter Eight.
                      </p>
                      <Button
                        className="begin-button"
                        size="lg"
                        onClick={startChapterNine}
                      >
                        Continue to Chapter Nine
                        <ArrowRight data-icon="inline-end" />
                      </Button>
                      <Button
                        className="restart-button"
                        variant="ghost"
                        size="sm"
                        onClick={restart}
                      >
                        Replay Chapter Eight
                        <RotateCcw data-icon="inline-end" />
                      </Button>
                    </>
                  )
                ) : (
                  <>
                    <h2>Chapter Ten will return</h2>
                    <p>
                      The recovered Gate Nail fragment, your chosen allies, and
                      every surviving Oath cross into the Cinder Deep. The next
                      question is how desire can remain free when it becomes an
                      offer before thought can refuse.
                    </p>
                    <Button
                      className="begin-button"
                      size="lg"
                      onClick={restart}
                    >
                      Replay Chapter Nine
                      <RotateCcw data-icon="inline-end" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </article>
        </section>

        <aside
          className="character-panel"
          aria-label="Caelan's character sheet"
        >
          <div className="character-heading">
            <div className="sigil" aria-hidden="true">
              <Swords />
            </div>
            <div>
              <p className="eyebrow">The Ember Oath</p>
              <h2>Caelan Vey</h2>
              <p>Road captain who binds magic to promises</p>
            </div>
          </div>

          <Progress className="chapter-progress" value={chapterProgress}>
            <ProgressLabel>Chapter progress</ProgressLabel>
            <ProgressValue>{() => `${chapterProgress}%`}</ProgressValue>
          </Progress>

          <div className="mission-card">
            <div>
              <MapPin aria-hidden="true" />
              <span>Current objective</span>
            </div>
            <p>{node.objective}</p>
          </div>

          <div className={`threat-card threat-${node.threat.toLowerCase()}`}>
            <TriangleAlert aria-hidden="true" />
            <span>Threat</span>
            <strong>{node.threat}</strong>
          </div>

          <div className="stats-list">
            {coreStatKeys.map((key) => {
              const Icon = statIcons[key];
              return (
                <div
                  className={`stat-row ${key === 'health' && game.stats.health <= 2 ? 'danger-row' : ''}`}
                  key={key}
                >
                  <Icon aria-hidden="true" />
                  <div>
                    <span>{statLabels[key]}</span>
                    <small>{statHelp[key]}</small>
                  </div>
                  <strong>{game.stats[key]}</strong>
                </div>
              );
            })}
          </div>

          <div className="resources-panel">
            <p className="panel-title">Resources</p>
            {resourceStatKeys
              .filter((key) => game.chapter >= 2 || key !== 'medicine')
              .map((key) => (
                <div className="resource-row" key={key}>
                  <span>{statLabels[key]}</span>
                  <strong>{game.stats[key]}</strong>
                </div>
              ))}
          </div>

          <div className="relationships-panel">
            <p className="panel-title">Relationships</p>
            {visibleRelationships.map((person) => (
              <div className="relationship-row" key={person}>
                <strong>{relationshipLabels[person]}</strong>
                <span>{relationshipSummary(game.relationships[person])}</span>
              </div>
            ))}
          </div>

          <div className="chronicle">
            <p className="panel-title">Recent choices</p>
            {game.history.length ? (
              <ol>
                {game.history.slice(-3).map((entry, index) => (
                  <li key={`${entry}-${index}`}>{entry}</li>
                ))}
              </ol>
            ) : (
              <p className="empty-note">
                The page is waiting for your first mark.
              </p>
            )}
          </div>
        </aside>
      </div>

      <Sheet open={showJournal} onOpenChange={setShowJournal}>
        <SheetContent className="journal-sheet" side="right">
          <SheetHeader>
            <SheetTitle>Caelan’s journal</SheetTitle>
            <SheetDescription>
              Only facts Caelan has learned appear here.
            </SheetDescription>
          </SheetHeader>
          <div className="journal-sections">
            <section>
              <span>Now</span>
              <h3>{node.title}</h3>
              <p>{node.objective}</p>
              <small>
                {node.location} · Threat {node.threat}
              </small>
            </section>
            <section>
              <span>Confirmed knowledge</span>
              <ul>
                {truths.map((truth) => (
                  <li key={truth}>{truth}</li>
                ))}
              </ul>
            </section>
            <section>
              <span>People</span>
              <div className="journal-people">
                {visibleRelationships.map((person) => (
                  <p key={person}>
                    <strong>{relationshipLabels[person]}</strong>
                    {relationshipSummary(game.relationships[person])}
                  </p>
                ))}
              </div>
            </section>
            <section>
              <span>Promises and injuries</span>
              <ul>
                {promises.map((promise) => (
                  <li key={promise}>{promise}</li>
                ))}
              </ul>
            </section>
            <section>
              <span>Because you chose</span>
              <ul>
                {consequences.map((consequence) => (
                  <li key={consequence}>{consequence}</li>
                ))}
              </ul>
            </section>
            <section>
              <span>Recent path</span>
              <ol>
                {game.history.slice(-8).map((entry, index) => (
                  <li key={`${entry}-${index}`}>{entry}</li>
                ))}
              </ol>
            </section>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={showCharacterSheet} onOpenChange={setShowCharacterSheet}>
        <SheetContent className="mobile-character-sheet" side="bottom">
          <SheetHeader>
            <SheetTitle>Caelan Vey</SheetTitle>
            <SheetDescription>{node.objective}</SheetDescription>
          </SheetHeader>
          <div className="mobile-sheet-grid">
            {coreStatKeys.map((key) => (
              <div key={key}>
                <span>{statLabels[key]}</span>
                <strong>{game.stats[key]}</strong>
              </div>
            ))}
          </div>
          <div className="mobile-sheet-resources">
            {resourceStatKeys
              .filter((key) => game.chapter >= 2 || key !== 'medicine')
              .map((key) => (
                <p key={key}>
                  <span>{statLabels[key]}</span>
                  <strong>{game.stats[key]}</strong>
                </p>
              ))}
          </div>
          <div className="mobile-sheet-relationships">
            {visibleRelationships.map((person) => (
              <p key={person}>
                <strong>{relationshipLabels[person]}</strong>
                {relationshipSummary(game.relationships[person])}
              </p>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={Boolean(game.defeat)}>
        <AlertDialogContent className="death-dialog">
          <AlertDialogHeader>
            <p className="eyebrow">The road ends here</p>
            <AlertDialogTitle>{game.defeat?.title}</AlertDialogTitle>
            <AlertDialogDescription>{game.defeat?.body}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={restartStoryAfterDeath}>
              Restart the story
            </AlertDialogCancel>
            <AlertDialogAction
              className="confirm-replay"
              onClick={returnToChapterStart}
            >
              Return to chapter start
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={pendingReplay !== null}
        onOpenChange={(open) => !open && setPendingReplay(null)}
      >
        <AlertDialogContent className="replay-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Replay Chapter {pendingReplay}?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingReplay === 1
                ? 'This restarts Caelan’s journey and removes all later chapter progress on this device.'
                : pendingReplay === 2
                  ? 'This restores the Chapter Two checkpoint and removes all Chapter Three, Chapter Four, and Chapter Five progress created by the current path.'
                  : pendingReplay === 3
                    ? 'This restores the Chapter Three checkpoint and removes all Chapter Four and Chapter Five progress created by the current path.'
                    : pendingReplay === 4
                      ? 'This restores the Chapter Four checkpoint and removes all Chapter Five progress created by the current path.'
                      : 'This restores the Chapter Five checkpoint and replaces every choice made after it.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep current path</AlertDialogCancel>
            <AlertDialogAction
              className="confirm-replay"
              onClick={confirmReplay}
            >
              Replay chapter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
