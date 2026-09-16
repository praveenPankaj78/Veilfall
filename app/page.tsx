'use client';

import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  BookOpen,
  Bug,
  Copy,
  Download,
  Flame,
  HardDrive,
  Heart,
  Info,
  MapPin,
  RotateCcw,
  Settings,
  Shield,
  Swords,
  TriangleAlert,
  Type,
  Upload,
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
  chapterDefinitions,
  isChoiceVisible,
  initialState,
  nextRelationships,
  resolveCompletedOathFlags,
  nodes,
  relationshipChanges,
  relationshipLabels,
  relationshipSummary,
  requirementText,
  resolveNext,
  statLabels,
  type Choice,
  type ChapterNumber,
  type GameState,
  type RelationshipKey,
  type StatKey,
} from './game-data';
import {
  BUILD_VERSION,
  createPortableSave,
  createStoredSave,
  exportFilename,
  MAX_IMPORT_BYTES,
  parsePortableSave,
  readBackupSave,
  readReadingPreference,
  readStoredSave,
  replaceDamagedStoredSave,
  replaceStoredSave,
  writeReadingPreference,
  writeStoredSave,
  type CheckpointMap,
  type ImportSummary,
  type StoredSaveDocument,
  type TextSizePreference,
} from './save-system';
import { knownTruths, majorConsequences } from './story-memory';

const sceneArtwork = {
  departure: {
    src: '/art/caelan-east-gate.png',
    alt: 'Caelan and Mara travel with the diplomatic escort beyond Greyhaven',
  },
  ambush: {
    src: '/art/kings-road-ambush.webp',
    alt: 'Caelan and Mara defend the diplomatic escort from black arrows on the rain-soaked King’s Road',
  },
  folded: {
    src: '/art/kings-road-folded.png',
    alt: 'Caelan and the wounded escort face an impossible sea across the King’s Road',
  },
  inn: {
    src: '/art/bellweather-inn.png',
    alt: 'Caelan leads the wounded escort into Bellweather Inn during a storm',
  },
  othernights: {
    src: '/art/bellweather-other-nights.webp',
    alt: 'Caelan and Mara protect the wounded as other nights open inside Bellweather Inn',
  },
  foldedcellar: {
    src: '/art/bellweather-folded-cellar.webp',
    alt: 'Caelan and Tivik follow an impossible road through the repeating cellar beneath Bellweather Inn',
  },
  roadpin: {
    src: '/art/bellweather-road-pin.webp',
    alt: 'Caelan and Tivik discover the damaged iron road pin beneath Bellweather Inn',
  },
  harrowfen: {
    src: '/art/harrowfen-wrong-mile.png',
    alt: 'Caelan approaches Harrowfen while royal archers watch from the canal gate',
  },
  shiftingmarket: {
    src: '/art/harrowfen-shifting-market.webp',
    alt: 'Caelan, Mara, and Tivik protect Harrowfen as alternate streets return around the old well',
  },
  bridgereveal: {
    src: '/art/mileless-bridge-reveal.webp',
    alt: 'Caelan and his companions discover the Mileless Bridge crossing several worlds beneath different skies',
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
  ashroadoffer: {
    src: '/art/ash-road-first-offer.png',
    alt: 'A clear cup of water rises from the ash before Caelan and the expedition',
  },
  privateoffers: {
    src: '/art/ash-road-private-offers.png',
    alt: 'Caelan and the expedition face separate glowing offers along the Ash Road',
  },
  vathisapproach: {
    src: '/art/vathis-approach.png',
    alt: 'Caelan leads the surviving expedition toward the divided towers of Vathis',
  },
  vathisstreets: {
    src: '/art/vathis-contract-streets.png',
    alt: 'Contract streets move between the black hand shaped towers of Vathis',
  },
  vathisauction: {
    src: '/art/vathis-invasion-auction.png',
    alt: 'Three Price Court seals hang above the circular invasion auction in Vathis',
  },
  vathisengine: {
    src: '/art/vathis-engine-gate.png',
    alt: 'Malrec’s white engine pulls contract chains as the inner Black Gate begins to open',
  },
  blackgatecollision: {
    src: '/art/black-gate-two-faces.png',
    alt: 'The mortal fortress ring and Vathis face each other through the widening Black Gate',
  },
  blackgatesealed: {
    src: '/art/black-gate-sealed.png',
    alt: 'The sealed Black Gate divides a pale mortal dawn from distant Cinder Deep fire',
  },
  blackgatepassage: {
    src: '/art/black-gate-mutual-passage.png',
    alt: 'Independent mortal and devil witnesses watch a narrow consent governed passage',
  },
  blackgatebroken: {
    src: '/art/black-gate-broken.png',
    alt: 'The shattered Black Gate releases many distinct promise lights into both realms',
  },
  blackgatekeeper: {
    src: '/art/caelan-living-gate.png',
    alt: 'Caelan carries ember lines of the Black Gate while distinct voices circle him',
  },
} as const;

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

type ReleaseNotice = {
  kind: 'error' | 'success' | 'info';
  message: string;
  storageError?: boolean;
};

type PendingImport = {
  document: StoredSaveDocument;
  summary: ImportSummary;
  source: 'file' | 'backup';
};

const statIcons: Record<StatKey, typeof Heart> = {
  health: Heart,
  resolve: Shield,
  command: Swords,
  oathfire: Flame,
  medicine: Heart,
};

const statHelp: Record<StatKey, string> = {
  health: 'Injury and exhaustion reduce this. At zero, Caelan dies.',
  resolve: 'His strength against fear, pain, manipulation, and despair.',
  command: 'Readiness and trust he can spend to coordinate the escort.',
  oathfire:
    'Magic gained from a binding promise and spent on extraordinary protection.',
  medicine:
    'Strong healing supplies. The story explains who can benefit before you spend any.',
};

const coreStatKeys: StatKey[] = ['health', 'resolve', 'command', 'oathfire'];
const resourceStatKeys: StatKey[] = ['medicine'];
// Build-time target, not hostname detection: local itch previews match the upload.
const showExpectedAdvantages =
  process.env.NEXT_PUBLIC_VEILFALL_TARGET !== 'itch';

function defeatForChoice(
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
  if (game.flags.includes('c3-oath-hold-town') && game.chapter <= 4)
    promises.push('Do not let Harrowfen fall while Ordan is pursued.');
  if (game.flags.includes('c4-oath-no-one-falls') && game.chapter <= 4)
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
  if (
    game.flags.includes('c9-return-promise-owned') &&
    !game.flags.some((flag) =>
      [
        'c12-fragment-return-fulfilled',
        'c12-fragment-custody-amended',
        'c12-fragment-return-breached',
      ].includes(flag),
    )
  )
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
  if (
    game.completedChapters.includes(8) ||
    game.nodeId.startsWith('c9-') ||
    game.nodeId.startsWith('c10-')
  ) {
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
  const [showSettings, setShowSettings] = useState(false);
  const [showReturnRecap, setShowReturnRecap] = useState(false);
  const [readingSize, setReadingSize] = useState<TextSizePreference>('default');
  const [notice, setNotice] = useState<ReleaseNotice | null>(null);
  const [damagedSave, setDamagedSave] = useState<string | null>(null);
  const [pendingImport, setPendingImport] = useState<PendingImport | null>(
    null,
  );
  const [hasBackup, setHasBackup] = useState(false);
  const [bugDescription, setBugDescription] = useState('');
  const [pendingReplay, setPendingReplay] = useState<ChapterNumber | null>(
    null,
  );
  const gameRef = useRef(game);
  const checkpointsRef = useRef<CheckpointMap>({});
  const autosaveBlockedRef = useRef(false);
  const importInputRef = useRef<HTMLInputElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const sceneHeadingRef = useRef<HTMLHeadingElement>(null);
  const scrollAfterChoice = useRef<'story' | 'scene' | null>(null);

  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const savedReadingSize = readReadingPreference(window.localStorage);
        setReadingSize(savedReadingSize);
        document.documentElement.dataset.textSize = savedReadingSize;
        const result = readStoredSave(window.localStorage);
        if (!result.ok) {
          autosaveBlockedRef.current = true;
          setDamagedSave(result.damagedRaw ?? null);
          setNotice({
            kind: 'error',
            message: result.error,
            storageError: true,
          });
        } else if (result.document) {
          checkpointsRef.current = result.document.checkpoints;
          setReadingSize(result.document.readingPreference);
          document.documentElement.dataset.textSize =
            result.document.readingPreference;
          setGame(result.document.game);
          gameRef.current = result.document.game;
          setStarted(true);
          setShowReturnRecap(true);
          setHasBackup(Boolean(readBackupSave(window.localStorage)?.ok));
          if (result.migrated) {
            const writeResult = writeStoredSave(
              window.localStorage,
              result.document,
            );
            if (!writeResult.ok) {
              autosaveBlockedRef.current = true;
              setNotice({
                kind: 'error',
                message: writeResult.error,
                storageError: true,
              });
            } else if (result.warnings.length)
              setNotice({ kind: 'info', message: result.warnings.join(' ') });
          } else if (result.warnings.length) {
            setNotice({ kind: 'info', message: result.warnings.join(' ') });
          }
        }
      } catch {
        autosaveBlockedRef.current = true;
        setNotice({
          kind: 'error',
          message:
            'Veilfall could not initialise browser saving. This session can still be played and exported.',
          storageError: true,
        });
      } finally {
        setLoaded(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded || !started || autosaveBlockedRef.current) return;
    const result = writeStoredSave(
      window.localStorage,
      createStoredSave(game, checkpointsRef.current, readingSize),
    );
    if (!result.ok) {
      autosaveBlockedRef.current = true;
      setNotice({ kind: 'error', message: result.error, storageError: true });
    }
  }, [game, loaded, readingSize, started]);

  useEffect(() => {
    if (!scrollAfterChoice.current) return;
    const target =
      scrollAfterChoice.current === 'scene'
        ? sceneRef.current
        : storyRef.current;
    scrollAfterChoice.current = null;
    window.requestAnimationFrame(() => {
      sceneHeadingRef.current?.focus({ preventScroll: true });
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      target?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
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
        scrollAfterChoice.current =
          nodes[next.nodeId].art !== nodes[current.nodeId].art
            ? 'scene'
            : 'story';
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
  const currentChapter = chapterDefinitions[game.chapter - 1];
  const diagnosticText = [
    'Veilfall: The Ember Oath bug report',
    `Build: ${BUILD_VERSION}`,
    `Chapter: ${currentChapter.roman} (${game.chapter} of ${chapterDefinitions.length})`,
    `Node: ${game.nodeId}`,
    `Browser: ${typeof navigator === 'undefined' ? 'Unavailable' : navigator.userAgent}`,
    `Language: ${typeof navigator === 'undefined' ? 'Unavailable' : navigator.language}`,
    `Viewport: ${typeof window === 'undefined' ? 'Unavailable' : `${window.innerWidth} × ${window.innerHeight}`}`,
    `Text size: ${readingSize}`,
    '',
    'Description:',
    bugDescription.trim() || '[Describe what happened and what you expected.]',
  ].join('\n');

  function currentSaveDocument() {
    return createStoredSave(game, checkpointsRef.current, readingSize);
  }

  function recordChapterCheckpoint(chapter: ChapterNumber, next: GameState) {
    checkpointsRef.current = {
      ...checkpointsRef.current,
      [chapter]: next,
    };
  }

  function downloadText(filename: string, text: string) {
    const url = URL.createObjectURL(
      new Blob([text], { type: 'application/json;charset=utf-8' }),
    );
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    window.setTimeout(() => {
      anchor.remove();
      URL.revokeObjectURL(url);
    }, 5_000);
  }

  function exportSave() {
    const portable = createPortableSave(currentSaveDocument());
    downloadText(
      exportFilename(game),
      `${JSON.stringify(portable, null, 2)}\n`,
    );
    setNotice({
      kind: 'success',
      message: `Prepared ${currentChapter.title} progress with ${Object.keys(checkpointsRef.current).length} replay checkpoints for download. If your browser did not start the download, try Export Save again.`,
    });
  }

  function downloadDamagedSave() {
    if (!damagedSave) return;
    downloadText('veilfall-damaged-browser-save-recovery.json', damagedSave);
    setNotice({
      kind: 'info',
      message:
        'Prepared the damaged browser data for recovery download. It has not been removed from browser storage.',
    });
  }

  async function handleImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > MAX_IMPORT_BYTES) {
      setNotice({
        kind: 'error',
        message:
          'That file is too large. Veilfall save files must be under 1 MB.',
      });
      return;
    }
    try {
      const parsed = parsePortableSave(await file.text(), file.size);
      if (!parsed.ok) {
        setNotice({ kind: 'error', message: parsed.error });
        return;
      }
      setPendingImport({
        document: parsed.document,
        summary: parsed.summary,
        source: 'file',
      });
      setNotice(null);
    } catch {
      setNotice({
        kind: 'error',
        message:
          'Veilfall could not read that file. Your current save is unchanged.',
      });
    }
  }

  function prepareBackupRestore() {
    const result = readBackupSave(window.localStorage);
    if (!result?.ok) {
      setHasBackup(false);
      setNotice({
        kind: 'error',
        message: 'The pre-import backup is unavailable or damaged.',
      });
      return;
    }
    const definition = chapterDefinitions[result.document.game.chapter - 1];
    setPendingImport({
      document: result.document,
      source: 'backup',
      summary: {
        chapter: result.document.game.chapter,
        chapterLabel: `Chapter ${definition.roman}: ${definition.title}`,
        completedChapters: result.document.game.completedChapters.length,
        checkpointCount: Object.keys(result.document.checkpoints).length,
        endingRecorded: result.document.game.flags.includes(
          'c12-series-complete',
        ),
        exportedAt: 'the previous import',
      },
    });
  }

  function confirmImportSave() {
    if (!pendingImport) return;
    const result = replaceStoredSave(
      window.localStorage,
      pendingImport.document,
      currentSaveDocument(),
    );
    if (!result.ok) {
      setNotice({ kind: 'error', message: result.error, storageError: true });
      setPendingImport(null);
      return;
    }
    checkpointsRef.current = pendingImport.document.checkpoints;
    autosaveBlockedRef.current = false;
    setDamagedSave(null);
    setReadingSize(pendingImport.document.readingPreference);
    document.documentElement.dataset.textSize =
      pendingImport.document.readingPreference;
    gameRef.current = pendingImport.document.game;
    setGame(pendingImport.document.game);
    setLastResult(null);
    setStarted(true);
    setShowReturnRecap(true);
    setHasBackup(true);
    setNotice({
      kind: 'success',
      message:
        pendingImport.source === 'backup'
          ? 'Restored the pre-import backup. The replaced progress is now the new recoverable backup.'
          : 'Imported the save. Your previous progress is available as a recoverable backup.',
    });
    setPendingImport(null);
  }

  function changeReadingSize(value: TextSizePreference) {
    setReadingSize(value);
    document.documentElement.dataset.textSize = value;
    const result = writeReadingPreference(window.localStorage, value);
    if (!result.ok)
      setNotice({ kind: 'error', message: result.error, storageError: true });
  }

  function retrySaving() {
    const saveDocument = currentSaveDocument();
    const result = damagedSave
      ? replaceDamagedStoredSave(window.localStorage, saveDocument, damagedSave)
      : writeStoredSave(window.localStorage, saveDocument);
    if (!result.ok) {
      setNotice({ kind: 'error', message: result.error, storageError: true });
      return;
    }
    autosaveBlockedRef.current = false;
    setDamagedSave(null);
    setNotice({
      kind: 'success',
      message: damagedSave
        ? 'The damaged data was preserved separately and this session is now saving.'
        : 'Browser saving is available again.',
    });
  }

  async function copyDiagnostics() {
    try {
      await navigator.clipboard.writeText(diagnosticText);
      setNotice({
        kind: 'success',
        message: 'Copied the visible diagnostic report.',
      });
    } catch {
      setNotice({
        kind: 'error',
        message:
          'The browser blocked clipboard access. Select and copy the diagnostic text manually.',
      });
    }
  }

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
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
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
    checkpointsRef.current = {};
    autosaveBlockedRef.current = false;
    setDamagedSave(null);
    loadChapterState(initialState);
  }

  function chapterStart(chapter: ChapterNumber) {
    if (chapter === 1) return initialState;
    return checkpointsRef.current[chapter] ?? null;
  }

  function replayChapter(chapter: ChapterNumber) {
    if (chapter === 1) {
      checkpointsRef.current = {};
      autosaveBlockedRef.current = false;
      setDamagedSave(null);
      loadChapterState(initialState);
      return;
    }

    const retained: CheckpointMap = {};
    for (const definition of chapterDefinitions) {
      if (definition.number > chapter) continue;
      const checkpoint = checkpointsRef.current[definition.number];
      if (checkpoint) retained[definition.number] = checkpoint;
    }
    checkpointsRef.current = retained;
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
    recordChapterCheckpoint(2, next);
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
    recordChapterCheckpoint(3, next);
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
    recordChapterCheckpoint(4, next);
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
    recordChapterCheckpoint(5, next);
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
    recordChapterCheckpoint(6, next);
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
    recordChapterCheckpoint(7, next);
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
    recordChapterCheckpoint(8, next);
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
    recordChapterCheckpoint(9, next);
    loadChapterState(next);
  }

  function startChapterTen() {
    const next: GameState = {
      ...game,
      nodeId: 'c10-ash-road',
      chapter: 10,
      chapterChoices: 0,
      completedChapters: Array.from(new Set([...game.completedChapters, 9])),
      stats: {
        ...game.stats,
        health: Math.min(8, game.stats.health + 1),
        resolve: Math.min(8, game.stats.resolve + 1),
      },
      history: [
        ...game.history,
        'You take the exact voluntary expedition from the inner Black Gate onto the Ash Road.',
      ],
    };
    recordChapterCheckpoint(10, next);
    loadChapterState(next);
  }

  function startChapterEleven() {
    const next: GameState = {
      ...game,
      nodeId: 'c11-vathis-gate',
      chapter: 11,
      chapterChoices: 0,
      completedChapters: Array.from(new Set([...game.completedChapters, 10])),
      stats: {
        ...game.stats,
        health: Math.min(8, game.stats.health + 1),
        resolve: Math.min(8, game.stats.resolve + 1),
      },
      history: [
        ...game.history,
        'You enter Vathis with the exact Ash Road expedition, recovered fragment, and every surviving contract limit.',
      ],
    };
    recordChapterCheckpoint(11, next);
    loadChapterState(next);
  }

  function startChapterTwelve() {
    const next: GameState = {
      ...game,
      nodeId: 'c12-inner-gate',
      chapter: 12,
      chapterChoices: 0,
      completedChapters: Array.from(new Set([...game.completedChapters, 11])),
      stats: {
        ...game.stats,
        health: Math.min(8, game.stats.health + 1),
        resolve: Math.min(8, game.stats.resolve + 1),
      },
      history: [
        ...game.history,
        'You reach the inner Black Gate with the exact Vathis alliance, expedition, fragment custody, and mythic freedom restrictions.',
      ],
    };
    recordChapterCheckpoint(12, next);
    loadChapterState(next);
  }

  const releaseOverlays = (
    <>
      <Sheet open={showSettings} onOpenChange={setShowSettings}>
        <SheetContent className="release-settings-sheet" side="right">
          <SheetHeader>
            <SheetTitle>Settings &amp; game information</SheetTitle>
            <SheetDescription>
              Adjust the text, back up your progress, or learn about the game.
            </SheetDescription>
          </SheetHeader>

          <div className="release-settings-sections">
            {notice && (
              <div
                className={`release-notice release-notice-${notice.kind}`}
                role={notice.kind === 'error' ? 'alert' : 'status'}
              >
                {notice.message}
              </div>
            )}

            <section aria-labelledby="reading-settings-title">
              <div className="settings-section-heading">
                <Type aria-hidden="true" />
                <h3 id="reading-settings-title">Text size</h3>
              </div>
              <p>Make all story text and menus easier to read.</p>
              <fieldset className="reading-size-options">
                <legend className="visually-hidden">Text size</legend>
                {(
                  [
                    ['default', 'Default'],
                    ['large', 'Large'],
                    ['extra-large', 'Extra large'],
                  ] as const
                ).map(([value, label]) => (
                  <Button
                    key={value}
                    type="button"
                    variant={readingSize === value ? 'default' : 'outline'}
                    aria-pressed={readingSize === value}
                    onClick={() => changeReadingSize(value)}
                  >
                    {label}
                  </Button>
                ))}
              </fieldset>
            </section>

            <section aria-labelledby="save-settings-title">
              <div className="settings-section-heading">
                <HardDrive aria-hidden="true" />
                <h3 id="save-settings-title">Your saved game</h3>
              </div>
              <p>
                Your progress saves automatically in this browser. Clearing
                browser data or playing at a different web address can leave
                your save behind. Use Export Save to download a backup, then
                Import Save to continue from that file.
              </p>
              <p className="settings-summary">
                {started
                  ? `Chapter ${currentChapter.number} of ${chapterDefinitions.length} · ${game.completedChapters.length} chapters completed`
                  : 'Your adventure has not started yet.'}
              </p>
              <input
                ref={importInputRef}
                className="visually-hidden"
                type="file"
                accept="application/json,.json"
                tabIndex={-1}
                aria-hidden="true"
                onChange={handleImportFile}
              />
              <div className="settings-actions">
                <Button type="button" variant="outline" onClick={exportSave}>
                  <Download data-icon="inline-start" />
                  Export Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => importInputRef.current?.click()}
                >
                  <Upload data-icon="inline-start" />
                  Import Save
                </Button>
                {hasBackup && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={prepareBackupRestore}
                  >
                    <RotateCcw data-icon="inline-start" />
                    Restore pre-import backup
                  </Button>
                )}
              </div>
              {damagedSave && (
                <div className="recovery-actions">
                  <p>
                    The damaged browser data remains untouched. Download it
                    before starting a new browser save if you may need help
                    recovering it.
                  </p>
                  <div className="settings-actions">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={downloadDamagedSave}
                    >
                      Download damaged data
                    </Button>
                    <Button type="button" onClick={retrySaving}>
                      Preserve it and save this session
                    </Button>
                  </div>
                </div>
              )}
              {!damagedSave && notice?.storageError && (
                <Button type="button" variant="ghost" onClick={retrySaving}>
                  Retry browser saving
                </Button>
              )}
            </section>

            <section aria-labelledby="content-settings-title">
              <div className="settings-section-heading">
                <Info aria-hidden="true" />
                <h3 id="content-settings-title">About the game</h3>
              </div>
              <p>
                <strong>Veilfall: The Ember Oath</strong> is a fantasy story you
                play by making choices. You are a captain responsible for
                getting your people home. Decide who to trust, what to risk, and
                which promises to keep. The complete story spans{' '}
                {chapterDefinitions.length} chapters and reaches a full ending.
                No knowledge of the world or its characters is needed.
              </p>
              <p>
                <strong>Content notes:</strong> Violence, blood, injury, death,
                and people pressured into dangerous bargains. Your character can
                die. Romance is optional.
              </p>
              <p className="build-version">Release build {BUILD_VERSION}</p>
            </section>

            <section aria-labelledby="diagnostics-title">
              <div className="settings-section-heading">
                <Bug aria-hidden="true" />
                <h3 id="diagnostics-title">Found a problem?</h3>
              </div>
              <p>
                Describe what went wrong, then copy the report to share with the
                person who invited you to play. It includes your game version,
                current scene, and browser information, but not your saved game
                or relationship choices. Nothing is sent automatically.
              </p>
              <label htmlFor="bug-description">What happened?</label>
              <textarea
                id="bug-description"
                value={bugDescription}
                onChange={(event) => setBugDescription(event.target.value)}
                placeholder="Describe the problem and what you expected."
                rows={4}
              />
              <details>
                <summary>See what the report includes</summary>
                <pre className="diagnostic-preview">{diagnosticText}</pre>
              </details>
              <Button type="button" variant="outline" onClick={copyDiagnostics}>
                <Copy data-icon="inline-start" />
                Copy report
              </Button>
            </section>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={pendingImport !== null}
        onOpenChange={(open) => !open && setPendingImport(null)}
      >
        <AlertDialogContent className="import-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingImport?.source === 'backup'
                ? 'Restore the pre-import backup?'
                : 'Replace current progress with this save?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingImport
                ? `${pendingImport.summary.chapterLabel}. ${pendingImport.summary.completedChapters} chapters completed, ${pendingImport.summary.checkpointCount} replay checkpoints${pendingImport.summary.endingRecorded ? ', terminal ending recorded' : ''}. A recoverable backup of your current progress will be preserved before replacement.`
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingImport(null)}>
              Keep current progress
            </AlertDialogCancel>
            <AlertDialogAction
              className="confirm-replay"
              onClick={confirmImportSave}
            >
              {pendingImport?.source === 'backup'
                ? 'Restore backup'
                : 'Import and replace'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );

  if (!loaded) {
    return (
      <main
        className="loading-screen min-h-screen"
        aria-label="Loading Veilfall"
      >
        <div className="brand-mark" aria-hidden="true">
          V
        </div>
        <p>Loading Veilfall: The Ember Oath…</p>
        <small>
          If loading does not finish, reload the page. Your browser save will
          not be removed.
        </small>
      </main>
    );
  }

  if (!started) {
    return (
      <>
        <main className="cover-screen min-h-screen text-[#eee7d8]">
          <Image
            src="/art/caelan-east-gate.png"
            alt="A captain and a scout lead their people out of a city beneath storm clouds"
            fill
            priority
            className="cover-art object-cover"
            sizes="100vw"
          />
          <div className="cover-shade" />
          <Button
            className="cover-settings-button"
            variant="outline"
            onClick={() => setShowSettings(true)}
          >
            <Settings data-icon="inline-start" />
            Settings &amp; info
          </Button>
          <section className="cover-copy">
            <div className="brand-mark" aria-hidden="true">
              V
            </div>
            <p className="eyebrow">
              A dark fantasy story shaped by your choices
            </p>
            <h1>Veilfall</h1>
            <p className="cover-subtitle">The Ember Oath</p>
            <p className="cover-scope">
              A complete adventure in {chapterDefinitions.length} chapters
            </p>
            <p className="cover-intro">
              You are a captain drawn into a struggle between two realms. Across{' '}
              {chapterDefinitions.length} chapters, cross shifting roads, face
              armies, and bargain with devils. Choose your allies, build
              friendships or romance, and wield fire through promises that bind
              you. Your decisions shape who survives, the fate of the gate
              between worlds, and the life you choose at journey’s end.
            </p>
            <Button
              className="begin-button"
              size="lg"
              onClick={() => setStarted(true)}
            >
              Start your adventure
              <ArrowRight data-icon="inline-end" />
            </Button>
            <p className="play-note">
              Read the story and choose what you do next. Chapter 1 takes about
              30–40 minutes. Your progress saves in this browser, so you can
              take a break and return.
            </p>
            {notice && (
              <div
                className={`release-notice cover-notice release-notice-${notice.kind}`}
                role={notice.kind === 'error' ? 'alert' : 'status'}
              >
                {notice.message}{' '}
                <button type="button" onClick={() => setShowSettings(true)}>
                  Open save tools
                </button>
              </div>
            )}
          </section>
        </main>
        {releaseOverlays}
      </>
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
          Caelan {currentChapter.roman} of {chapterDefinitions.at(-1)?.roman}
        </div>
        <div className="top-actions">
          <Button
            className="journal-button"
            variant="ghost"
            size="sm"
            onClick={() => setShowJournal(true)}
            aria-label="Open journal"
          >
            <BookOpen data-icon="inline-start" />
            <span>Journal</span>
          </Button>
          <Button
            className="chapter-menu-button"
            variant="ghost"
            size="sm"
            onClick={() => setShowChapterLibrary((open) => !open)}
            aria-expanded={showChapterLibrary}
            aria-label="Open chapter library"
          >
            <BookOpen data-icon="inline-start" />
            <span>Chapters</span>
          </Button>
          <Button
            className="restart-button"
            variant="ghost"
            size="sm"
            onClick={restart}
            aria-label={`Replay Chapter ${currentChapter.roman}`}
          >
            <RotateCcw data-icon="inline-start" />
            <span>Replay current</span>
          </Button>
          <Button
            className="settings-button"
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
            aria-label="Open settings, saves, and release information"
          >
            <Settings data-icon="inline-start" />
            <span>Settings</span>
          </Button>
        </div>
      </header>

      {notice?.storageError && (
        <div className="save-alert" role="alert">
          <span>{notice.message}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(true)}
          >
            Open save tools
          </Button>
        </div>
      )}

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

      <Sheet open={showChapterLibrary} onOpenChange={setShowChapterLibrary}>
        <SheetContent className="chapter-library" side="right">
          <SheetHeader>
            <SheetTitle>Replay an unlocked chapter</SheetTitle>
            <SheetDescription>
              Caelan’s complete twelve-chapter journey
            </SheetDescription>
          </SheetHeader>
          <div className="chapter-library-body">
            <p className="chapter-library-note">
              Replaying a chapter replaces its choices, points, and outcome.
              Earlier chapters stay the same. Replaying an earlier chapter
              removes later chapter progress, because those events came from the
              old path.
            </p>
            <div className="chapter-library-list">
              {chapterDefinitions.map((chapter) => {
                const unlocked =
                  chapter.number === 1 ||
                  game.chapter === chapter.number ||
                  game.completedChapters.includes(chapter.number - 1);
                const available =
                  chapter.number === 1 ||
                  Boolean(checkpointsRef.current[chapter.number]);
                return (
                  <div className="chapter-library-entry" key={chapter.number}>
                    <div>
                      <span>
                        Chapter {chapter.roman} of{' '}
                        {chapterDefinitions.at(-1)?.roman}
                      </span>
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
                        Finish Chapter{' '}
                        {chapterDefinitions[chapter.number - 2]?.roman} to
                        unlock
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </SheetContent>
      </Sheet>

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
        <section className="story-column">
          <output className="visually-hidden" aria-live="polite">
            New scene: {node.title}. {node.objective}
          </output>
          <div className="scene-art-wrap" ref={sceneRef}>
            <Image
              src={sceneArtwork[node.art ?? 'departure'].src}
              alt={sceneArtwork[node.art ?? 'departure'].alt}
              width={1536}
              height={864}
              className="scene-art"
              priority={game.chapter === 1 && game.nodeId === 'gate-yard'}
              sizes="(max-width: 950px) 92vw, calc(92vw - 27rem)"
            />
            <div className="scene-vignette" />
            <div className="location-stamp">{node.location}</div>
          </div>

          <article className="story-page" key={node.id} ref={storyRef}>
            <p className="eyebrow">{node.kicker}</p>
            <h1 ref={sceneHeadingRef} tabIndex={-1}>
              {node.title}
            </h1>

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
                          {showExpectedAdvantages && choice.advantage ? (
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
                        from this route.
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
                        surviving consequence.
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
                        surviving consequence.
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
                        surviving consequence.
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
                        consequence.
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
                        consequence.
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
                        consequence.
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
                  ) : game.chapter === 8 ? (
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
                  ) : game.chapter === 9 ? (
                    <>
                      <h2>Chapter Ten is ready</h2>
                      <p>
                        Continue into The Ash Road with the recovered fragment,
                        exact expedition, surviving Oaths, and chosen limits.
                      </p>
                      <Button
                        className="begin-button"
                        size="lg"
                        onClick={startChapterTen}
                      >
                        Continue to Chapter Ten
                        <ArrowRight data-icon="inline-end" />
                      </Button>
                      <Button
                        className="restart-button"
                        variant="ghost"
                        size="sm"
                        onClick={restart}
                      >
                        Replay Chapter Nine
                        <RotateCcw data-icon="inline-end" />
                      </Button>
                    </>
                  ) : game.chapter === 10 ? (
                    <>
                      <h2>Chapter Eleven is ready</h2>
                      <p>
                        Continue into City of Every Price with the exact
                        expedition, fragment custody, offer method, Free Ledger
                        price, and surviving Oaths.
                      </p>
                      <Button
                        className="begin-button"
                        size="lg"
                        onClick={startChapterEleven}
                      >
                        Continue to Chapter Eleven
                        <ArrowRight data-icon="inline-end" />
                      </Button>
                      <Button
                        className="restart-button"
                        variant="ghost"
                        size="sm"
                        onClick={restart}
                      >
                        Replay Chapter Ten
                        <RotateCcw data-icon="inline-end" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <h2>Chapter Twelve is ready</h2>
                      <p>
                        Continue into The Ember Oath with the exact Vathis
                        alliance, fragment custody, expedition, and every
                        freedom restriction still in force.
                      </p>
                      <Button
                        className="begin-button"
                        size="lg"
                        onClick={startChapterTwelve}
                      >
                        Continue to Chapter Twelve
                        <ArrowRight data-icon="inline-end" />
                      </Button>
                      <Button
                        className="restart-button"
                        variant="ghost"
                        size="sm"
                        onClick={restart}
                      >
                        Replay Chapter Eleven
                        <RotateCcw data-icon="inline-end" />
                      </Button>
                    </>
                  )
                ) : (
                  <>
                    <h2>Caelan’s complete adventure has ended</h2>
                    <p>
                      The Gate law, Caelan’s destination, relationship ending,
                      fragment custody, and changed sunrise are recorded. This
                      is a terminal ending; no sequel is required to complete
                      Caelan’s story.
                    </p>
                    <Button
                      className="begin-button"
                      size="lg"
                      onClick={restart}
                    >
                      Replay Chapter Twelve
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

          {game.chapter >= 2 && (
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
          )}

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
          {game.chapter >= 2 && (
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
          )}
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

      {releaseOverlays}

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
            <AlertDialogTitle>
              Replay Chapter{' '}
              {pendingReplay ? chapterDefinitions[pendingReplay - 1].roman : ''}
              ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingReplay === 1
                ? 'This restarts Caelan’s complete adventure and removes every later chapter checkpoint from the current path.'
                : pendingReplay
                  ? `This restores the Chapter ${chapterDefinitions[pendingReplay - 1].roman} checkpoint and removes every later chapter result and checkpoint created by the current path.`
                  : ''}
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
