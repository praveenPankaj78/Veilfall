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
  initialState,
  nodes,
  relationshipChanges,
  relationshipLabels,
  requirementText,
  resolveNext,
  statLabels,
  type Choice,
  type GameState,
  type RelationshipKey,
  type StatKey,
} from './game-data';

const CURRENT_SAVE_KEY = 'veilfall.saga.v6.save';
const LEGACY_SAVE_KEYS = [
  'veilfall.saga.v5.save',
  'veilfall.saga.v4.save',
  'veilfall.chapter-one.v3.save',
  'veilfall.chapter-one.v2.save',
];
type ChapterNumber = 1 | 2 | 3;

const CHAPTER_START_KEYS: Partial<Record<ChapterNumber, string>> = {
  2: 'veilfall.chapter-two.v1.start',
  3: 'veilfall.chapter-three.v1.start',
};

const chapterLibrary = [
  {
    number: 1 as const,
    title: 'The Road Before Rain',
    summary: 'Escort Ambassador Lysara beyond Greyhaven before the storm closes the road.',
  },
  {
    number: 2 as const,
    title: 'The Inn That Waited',
    summary: 'Defend the wounded during an inn siege and repair the road beneath it.',
  },
  {
    number: 3 as const,
    title: 'The Town at the Wrong Mile',
    summary: 'Hunt the courier who framed you through Harrowfen and onto a hidden bridge.',
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
  registerTool: (tool: ModelTool, options?: { signal?: AbortSignal }) => void | Promise<void>;
};

const statIcons: Record<StatKey, typeof Heart> = {
  stamina: Heart,
  resolve: Shield,
  command: Swords,
  rapport: Heart,
  oathfire: Flame,
  medicine: Heart,
  wayfire: Sparkles,
};

const statHelp: Record<StatKey, string> = {
  stamina: 'Caelan spends this on force, endurance, and physical protection.',
  resolve: 'His strength against fear, pain, manipulation, and despair.',
  command: 'Readiness and trust he can spend to coordinate the escort.',
  rapport: 'Understanding people beyond your closest personal relationships.',
  oathfire: 'Magic gained from a binding promise and spent on extraordinary protection.',
  medicine: 'Strong healing supplies. The story explains who can benefit before you spend any.',
  wayfire: 'Optional path currency earned through lasting choices and chapter completion.',
};

function migrateRelationships(value: Partial<GameState>) {
  if (value.relationships) {
    return {
      mara: { ...initialState.relationships.mara, ...value.relationships.mara },
      lysara: { ...initialState.relationships.lysara, ...value.relationships.lysara },
    };
  }

  const flags = new Set(value.flags ?? []);
  const count = (names: string[]) => names.filter((flag) => flags.has(flag)).length;
  return {
    mara: {
      trust: 2 + count([
        'trusted-mara-scouting', 'shared-unease', 'mara-read-order', 'ridge-route',
        'planned-evening', 'trusted-mara-in-fight', 'saved-mara', 'mara-tended',
        'c2-mara-led-entry', 'c2-compressed-wound', 'c2-shared-fear', 'c2-mara-below',
        'c3-shielded-wounded', 'c3-entered-unarmed', 'c3-backed-mara',
        'c3-priority-people', 'c3-mara-flanked-double', 'c3-pursuit-mara',
      ]),
      attraction: 1 + count([
        'flirted-mara', 'shared-unease', 'planned-evening', 'saved-mara',
        'mara-tended', 'c2-shared-fear', 'c2-kissed-mara', 'c3-entered-unarmed',
        'c3-priority-people', 'c3-pursuit-mara',
      ]),
    },
    lysara: {
      trust: Math.max(0, count([
        'kept-seed-secret', 'seed-safe', 'found-shard-salt', 'c2-lysara-led-care',
        'c2-saved-lysara', 'c2-lysara-below', 'c3-backed-lysara',
        'c3-lysara-read-ink', 'c3-priority-cause', 'c3-pursuit-lysara',
      ]) - (flags.has('revealed-seed') ? 1 : 0)),
      attraction: count([
        'intrigued-lysara', 'kept-seed-secret', 'c3-lysara-read-ink',
        'c3-priority-cause', 'c3-pursuit-lysara',
      ]),
    },
  };
}

function normaliseState(value: Partial<GameState>): GameState {
  const nodeId = value.nodeId && nodes[value.nodeId] ? value.nodeId : initialState.nodeId;
  const chapter = nodeId.startsWith('c3-')
    ? 3
    : nodeId.startsWith('c2-')
      ? 2
      : (value.chapter ?? 1);
  const completedChapters = Array.from(new Set([
    ...(value.completedChapters ?? []),
    ...(nodes[nodeId]?.final ? [chapter] : []),
  ]));
  return {
    nodeId,
    chapter,
    chapterChoices: value.chapterChoices ?? (chapter === 1 ? value.history?.length ?? 0 : 0),
    completedChapters,
    stats: { ...initialState.stats, ...value.stats },
    relationships: migrateRelationships(value),
    contentPreference: {
      ...initialState.contentPreference,
      ...value.contentPreference,
    },
    flags: value.flags ?? [],
    history: value.history ?? [],
  };
}

function applyChoice(state: GameState, choice: Choice): GameState {
  const nextStats = { ...state.stats };
  for (const [key, value] of Object.entries(choice.changes ?? {})) {
    const stat = key as StatKey;
    nextStats[stat] = Math.max(0, nextStats[stat] + (value ?? 0));
  }
  const nodeId = resolveNext(choice, state);
  const nextRelationships = {
    mara: { ...state.relationships.mara },
    lysara: { ...state.relationships.lysara },
  };
  for (const [person, changes] of Object.entries(relationshipChanges(choice))) {
    const key = person as RelationshipKey;
    nextRelationships[key].trust = Math.max(
      0,
      nextRelationships[key].trust + (changes?.trust ?? 0),
    );
    nextRelationships[key].attraction = Math.max(
      0,
      nextRelationships[key].attraction + (changes?.attraction ?? 0),
    );
  }
  const completedChapters = nodes[nodeId]?.final
    ? Array.from(new Set([...state.completedChapters, state.chapter]))
    : state.completedChapters;
  return {
    nodeId,
    chapter: state.chapter,
    chapterChoices: state.chapterChoices + 1,
    completedChapters,
    stats: nextStats,
    relationships: nextRelationships,
    contentPreference: state.contentPreference,
    flags: Array.from(new Set([...state.flags, ...(choice.addFlags ?? [])])),
    history: [...state.history, choice.result],
  };
}

function changeSummary(choice: Choice) {
  const statChanges = Object.entries(choice.changes ?? {})
    .filter(([, value]) => value !== 0)
    .map(([key, value]) => {
      const sign = (value ?? 0) > 0 ? '+' : '';
      return `${statLabels[key as StatKey]} ${sign}${value}`;
    });
  const personalChanges = Object.entries(relationshipChanges(choice)).flatMap(
    ([person, changes]) => Object.entries(changes ?? {})
      .filter(([, value]) => value !== 0)
      .map(([dimension, value]) => {
        const sign = (value ?? 0) > 0 ? '+' : '';
        return `${relationshipLabels[person as RelationshipKey]} ${dimension} ${sign}${value}`;
      }),
  );
  return [...statChanges, ...personalChanges];
}

function knownTruths(game: GameState) {
  const truths = game.chapter > 1 || game.chapterChoices >= 4
    ? ['Someone altered an official route order to force the escort onto a prepared road.']
    : ['Caelan is leading Ambassador Lysara and a Warden escort toward Bellweather Inn.'];
  const roadRevealNodes = [
    'c2-eleven-years', 'c2-investigate', 'c2-ledger', 'c2-cellar', 'c2-attacker',
    'c2-night-watch', 'c2-bell', 'c2-common-room-crisis', 'c2-descend',
    'c2-folded-cellar', 'c2-road-pin', 'c2-remove-pin', 'c2-last-testimony',
  ];
  if (game.chapter >= 3 || roadRevealNodes.includes(game.nodeId)) {
    truths.push('Ordan lured Caelan and Lysara to Bellweather because their road authority and living magic could unlock the road pin.');
  }
  if (game.chapter >= 3
    || game.flags.includes('c2-found-road-pin-term')
    || ['c2-road-pin', 'c2-remove-pin', 'c2-last-testimony'].includes(game.nodeId)) {
    truths.push('A damaged road pin pulled distant road ends beside Bellweather Inn until Caelan drove it back into place.');
  }
  const courierRevealNodes = [
    'c3-evidence', 'c3-watch-house', 'c3-divided-loyalty', 'c3-market-memory',
    'c3-pin-test', 'c3-duplicate', 'c3-courier', 'c3-collapse', 'c3-pursuit',
    'c3-world-nail', 'c3-ending-courier', 'c3-ending-thief', 'c3-ending-return',
  ];
  if (courierRevealNodes.includes(game.nodeId) || game.completedChapters.includes(3)) {
    truths.push('Royal courier Ordan Vale arranged the Bellweather attack, forged Caelan’s orders, and hired a Warden to impersonate him.');
  }
  if (game.nodeId === 'c3-world-nail'
    || game.flags.includes('c3-target-ordan')
    || game.flags.includes('c3-target-thief')
    || game.flags.includes('c3-secured-return')) {
    truths.push('The iron is part of a World Nail that normally keeps distance stable across Edrath.');
  }
  return truths;
}

function activePromises(game: GameState) {
  const promises: string[] = [];
  if (game.flags.includes('oath-bring-them-home')) promises.push('Bring the escort home alive.');
  if (game.flags.includes('c2-oath-repair-road')) promises.push('Repair the damaged King’s Road.');
  if (game.flags.includes('c2-oath-expose-crown')) promises.push('Expose the Crown officer behind the attack.');
  if (game.flags.includes('c3-oath-hold-town')) promises.push('Do not let Harrowfen fall while Ordan is pursued.');
  if (game.flags.includes('c2-caelan-injured')) promises.push('Injury: Caelan hurt his back driving the road pin into place.');
  return promises.length ? promises : ['No binding Oath or lasting injury is active.'];
}

function majorConsequences(game: GameState) {
  const consequences: string[] = [];
  if (game.flags.includes('checked-people')) consequences.push('Because you inspected your people, a feverish guard avoided the hardest part of the march.');
  if (game.flags.includes('checked-horses')) consequences.push('Because you checked the harness, the escort avoided a planned equipment failure.');
  if (game.flags.includes('mara-read-order')) consequences.push('Because you trusted Mara with the changed order, she helped prove the page was physically altered.');
  if (game.flags.includes('low-route')) consequences.push('Because you took the low road, the escort found the hidden silver route beneath the flood.');
  if (game.flags.includes('ridge-route')) consequences.push('Because you trusted Mara’s ridge, the escort gained height but faced the ambush exposed to the storm.');
  if (game.flags.includes('inspection-route')) consequences.push('Because you delayed for an inspection, the escort found sabotage before entering either road.');
  if (game.flags.includes('saved-family')) consequences.push('Because you rescued the roadside family, more civilians survived the first ambush.');
  if (game.flags.includes('captured-attacker')) consequences.push('Because you captured an attacker, the Crown plot gained a living witness.');
  if (game.flags.includes('treaty-damaged')) consequences.push('Because the treaty wagon was damaged, peace now depends more heavily on Lysara’s second proof.');
  if (game.flags.includes('c2-saved-nilo')) consequences.push('Because you used the medicine on Nilo, his injured leg can recover.');
  if (game.flags.includes('c2-saved-lysara')) consequences.push('Because you treated Lysara, her hand, living magic, and treaty work remain safe.');
  if (game.flags.includes('c2-saved-attacker')) consequences.push('Because you treated Sable, he can testify publicly that Ordan hired the attackers.');
  if (game.flags.includes('c2-ledger-route')) consequences.push('Because you read Maelin’s ledger, you connected Ordan to the supplies used in the siege.');
  if (game.flags.includes('c2-cellar-route')) consequences.push('Because you inspected the cellar, you found the enemy rope and the shifted coastal road before the siege.');
  if (game.flags.includes('c2-attacker-route')) consequences.push('Because you questioned Sable, you connected the road pin to sealed Crown orders.');
  if (game.flags.includes('c2-pin-broken')) consequences.push('Because the road pin broke, part of its power remains beneath Bellweather Inn.');
  if (game.flags.includes('c2-chose-testimony')) consequences.push('Because you carried testimony to Harrowfen, Sable or Jory’s papers challenged Ordan before the gate.');
  if (game.flags.includes('c2-chose-pin')) consequences.push('Because you carried the iron as your main proof, its pull exposed the danger beneath Harrowfen.');
  if (game.flags.includes('c2-oath-expose-crown')) consequences.push('Because you swore publicly against the Crown plot, Elene could test your promise at Harrowfen’s gate.');
  if (game.flags.includes('c2-kissed-mara')) consequences.push('Because you and Mara chose to kiss, your attraction is no longer unspoken.');
  if (game.flags.includes('c3-saved-healing-house')) consequences.push('Because you stayed behind, Harrowfen’s wounded escaped the burning healing house.');
  if (game.flags.includes('c3-kept-close')) consequences.push('Because you continued the chase, Ordan reached the bridge with less time to hide his trail.');
  if (game.flags.includes('c3-bridge-warning')) consequences.push('Because you questioned Renn, you know the unknown thief opposes Ordan but wants the iron for himself.');
  if (game.flags.includes('c3-route-archive')) consequences.push('Because you searched the archive, Lysara copied Ordan’s route to the Mileless Bridge.');
  if (game.flags.includes('c3-route-healer')) consequences.push('Because you put the wounded first, Sable survived to identify Ordan’s personal guard.');
  if (game.flags.includes('c3-route-broker')) consequences.push('Because you tested the road broker, you learned how Ordan planned to open the Mileless Bridge.');
  if (game.flags.includes('c3-priority-people')) consequences.push('Because you chose immediate lives first, Mara knows exactly where your duty begins.');
  if (game.flags.includes('c3-priority-cause')) consequences.push('Because you chose the wider danger first, Lysara trusts you to face difficult truths.');
  if (game.flags.includes('c3-balanced-plan')) consequences.push('Because you joined protection and investigation, Mara and Lysara were ready when Harrowfen changed.');
  if (game.flags.includes('c3-target-ordan')) consequences.push('Because you targeted Ordan, the Crown courier must face you before reaching the thief.');
  if (game.flags.includes('c3-target-thief')) consequences.push('Because you targeted the thief, you reach for the fragment as the bridge breaks.');
  if (game.flags.includes('c3-secured-return')) consequences.push('Because you secured the first arch, your companions still have a path back to Harrowfen.');
  return consequences.length ? consequences : ['Your first lasting consequence has not been written yet.'];
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
  const [pendingReplay, setPendingReplay] = useState<ChapterNumber | null>(null);
  const [showMatureConfirm, setShowMatureConfirm] = useState(false);
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
          const parsed = normaliseState(JSON.parse(saved) as Partial<GameState>);
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
    const target = scrollAfterChoice.current === 'scene' ? sceneRef.current : storyRef.current;
    scrollAfterChoice.current = null;
    window.requestAnimationFrame(() => {
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [game.nodeId]);

  useEffect(() => {
    const modelContext = (document as Document & { modelContext?: ModelContext }).modelContext;
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
      description: 'Read the active scene, character stats, and available actions without changing the game.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: () => {
        const current = gameRef.current;
        const currentNode = nodes[current.nodeId];
        return {
          sceneId: current.nodeId,
          title: currentNode.title,
          stats: current.stats,
          relationships: current.relationships,
          actions: currentNode.choices
            .filter((choice) => canChoose(choice, current))
            .map((choice) => ({ id: choice.id, label: choice.label })),
        };
      },
    });

    register({
      name: 'choose_veilfall_action',
      title: 'Choose a Veilfall action',
      description: 'Choose one currently available action by its id and advance the visible story.',
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
        if (typeof choiceId !== 'string') throw new Error('choiceId must be a string');

        const current = gameRef.current;
        const choice = nodes[current.nodeId].choices.find((item) => item.id === choiceId);
        if (!choice || !canChoose(choice, current)) {
          throw new Error('That action is not available in the current scene');
        }

        const next = applyChoice(current, choice);
        gameRef.current = next;
        setStarted(true);
        setLastResult(choice.result);
        setGame(next);
        return { sceneId: next.nodeId, result: choice.result, stats: next.stats };
      },
    });

    return () => lifecycle.abort();
  }, []);

  const node = nodes[game.nodeId];
  const chapterTwoUnlocked = game.chapter === 2 || game.completedChapters.includes(1);
  const chapterThreeUnlocked = game.chapter === 3 || game.completedChapters.includes(2);
  const chapterTwoStartExists = loaded && typeof window !== 'undefined'
    && Boolean(window.localStorage.getItem(CHAPTER_START_KEYS[2]!));
  const chapterThreeStartExists = loaded && typeof window !== 'undefined'
    && Boolean(window.localStorage.getItem(CHAPTER_START_KEYS[3]!));
  const paragraphs = useMemo(() => node.body(game), [game, node]);
  const truths = useMemo(() => knownTruths(game), [game]);
  const promises = useMemo(() => activePromises(game), [game]);
  const consequences = useMemo(() => majorConsequences(game), [game]);
  const chapterProgress = node.final
    ? 100
    : Math.min(96, Math.round((game.chapterChoices / 15) * 100));

  function choose(choice: Choice) {
    if (!canChoose(choice, game)) return;
    const next = applyChoice(game, choice);
    scrollAfterChoice.current = nodes[next.nodeId].art !== node.art ? 'scene' : 'story';
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

    for (const later of ([2, 3] as ChapterNumber[]).filter((number) => number > chapter)) {
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
        stamina: Math.min(8, game.stats.stamina + 2),
        resolve: Math.min(8, game.stats.resolve + 1),
        medicine: 1,
      },
      history: [...game.history, 'You continue to Bellweather Inn with every earlier consequence.'],
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
        stamina: Math.min(8, game.stats.stamina + 2),
        resolve: Math.min(8, game.stats.resolve + 1),
        command: Math.min(6, game.stats.command + 1),
      },
      history: [...game.history, 'You continue to Harrowfen with every earlier consequence.'],
    };
    window.localStorage.setItem(CHAPTER_START_KEYS[3]!, JSON.stringify(next));
    loadChapterState(next);
  }

  if (!loaded) {
    return <main className="min-h-screen bg-[#07090b]" aria-label="Loading Veilfall" />;
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
          <div className="brand-mark" aria-hidden="true">V</div>
          <p className="eyebrow">An interactive dark fantasy</p>
          <h1>Veilfall</h1>
          <p className="cover-subtitle">The Broken Concord</p>
          <p className="cover-intro">
            You know the King&apos;s Road, the people under your command, and the promise
            waiting at its end. Before night, an enemy will know every route you might choose.
          </p>
          <Button className="begin-button" size="lg" onClick={() => setStarted(true)}>
            Begin chapter one
            <ArrowRight data-icon="inline-end" />
          </Button>
          <p className="play-note">About 30 to 40 minutes. Your choices are saved on this device.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="game-shell min-h-screen text-[#eee7d8]">
      <header className="topbar">
        <div className="wordmark">
          <span className="wordmark-rune" aria-hidden="true">V</span>
          <span>VEILFALL</span>
        </div>
        <div className="chapter-label">
          <BookOpen aria-hidden="true" />
          Caelan {game.chapter === 3 ? 'III' : game.chapter === 2 ? 'II' : 'I'}
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
          <Button className="restart-button" variant="ghost" size="sm" onClick={restart}>
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
            <Button variant="outline" size="sm" onClick={() => setShowJournal(true)}>
              Open journal
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowReturnRecap(false)}>
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
            <Button variant="ghost" size="sm" onClick={() => setShowChapterLibrary(false)}>
              Close
            </Button>
          </div>
          <p className="chapter-library-note">
            Replaying a chapter replaces its choices, points, and outcome. Earlier chapters stay the same. Replaying an earlier chapter removes later chapter progress, because those events came from the old path.
          </p>
          <div className="chapter-library-list">
            {chapterLibrary.map((chapter) => {
              const unlocked = chapter.number === 1
                || (chapter.number === 2 ? chapterTwoUnlocked : chapterThreeUnlocked);
              const available = chapter.number === 1
                || (chapter.number === 2 ? chapterTwoStartExists : chapterThreeStartExists);
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
                      {chapter.number === game.chapter ? 'Replay' : 'Play again'}
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
          <span>Stamina</span>
          <strong>{game.stats.stamina}</strong>
        </div>
        <div>
          <span>Resolve</span>
          <strong>{game.stats.resolve}</strong>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowJournal(true)}>
          Journal
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowCharacterSheet(true)}>
          Stats
        </Button>
      </section>

      <div className="game-grid">
        <section className="story-column" aria-live="polite">
          <div className="scene-art-wrap" ref={sceneRef}>
            <Image
              src={node.art === 'harrowfen'
                ? '/art/harrowfen-wrong-mile.png'
                : node.art === 'inn'
                ? '/art/bellweather-inn.png'
                : node.art === 'folded'
                  ? '/art/kings-road-folded.png'
                  : '/art/caelan-east-gate.png'}
              alt={node.art === 'harrowfen'
                ? 'Caelan approaches Harrowfen while royal archers watch from the canal gate'
                : node.art === 'inn'
                ? 'Caelan leads the wounded escort into Bellweather Inn during a storm'
                : node.art === 'folded'
                  ? 'Caelan and the wounded escort face an impossible sea across the King’s Road'
                  : 'Caelan and Mara travel with the diplomatic escort beyond Greyhaven'}
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

            {lastResult && (
              <aside className="consequence">
                <span>Consequence</span>
                <p>{lastResult}</p>
              </aside>
            )}

            <div className="prose">
              {paragraphs.map((paragraph, index) => (
                <p key={`${node.id}-${index}`}>{paragraph}</p>
              ))}
            </div>

            {node.lesson && (
              <aside className="lesson-card">
                <span>{node.lesson.title}</span>
                <p>{node.lesson.body}</p>
              </aside>
            )}

            {!node.final ? (
              <div className="choices" aria-label="Choose Caelan's action">
                <p className="choice-prompt">What do you do?</p>
                {node.choices.map((choice, index) => {
                  const available = canChoose(choice, game);
                  const changes = changeSummary(choice);
                  return (
                    <Button
                      key={choice.id}
                      className="choice-card"
                      variant="outline"
                      disabled={!available}
                      onClick={() => choose(choice)}
                    >
                      <span className="choice-number">{String(index + 1).padStart(2, '0')}</span>
                      <span className="choice-copy">
                        <strong>{choice.label}</strong>
                        <span>{choice.detail}</span>
                        <span className="choice-effects">
                          {available ? changes.join(' · ') : `Requires ${requirementText(choice)}`}
                        </span>
                      </span>
                      <ArrowRight className="choice-arrow" aria-hidden="true" />
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
                        Continue into The Inn That Waited with every consequence from this route.
                        Your {game.stats.wayfire} Wayfire remains available for future optional paths.
                      </p>
                      <Button
                        className="begin-button"
                        size="lg"
                        onClick={startChapterTwo}
                      >
                        Continue to Chapter Two
                        <ArrowRight data-icon="inline-end" />
                      </Button>
                      <Button className="restart-button" variant="ghost" size="sm" onClick={restart}>
                        Replay Chapter One
                        <RotateCcw data-icon="inline-end" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <h2>Chapter Three is ready</h2>
                      <p>
                        Continue into The Town at the Wrong Mile with every surviving consequence.
                        Your {game.stats.wayfire} Wayfire remains available for future optional paths.
                      </p>
                      <Button
                        className="begin-button"
                        size="lg"
                        onClick={startChapterThree}
                      >
                        Continue to Chapter Three
                        <ArrowRight data-icon="inline-end" />
                      </Button>
                      <Button className="restart-button" variant="ghost" size="sm" onClick={restart}>
                        Replay Chapter Two
                        <RotateCcw data-icon="inline-end" />
                      </Button>
                    </>
                  )
                ) : (
                  <>
                    <h2>Caelan will return in Chapter Four</h2>
                    <p>
                      You carry {game.stats.wayfire} Wayfire. The Mileless Bridge is turning,
                      and a thief has reached the World Nail fragment before you.
                    </p>
                    <Button className="begin-button" size="lg" onClick={restart}>
                      Replay Chapter Three
                      <RotateCcw data-icon="inline-end" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </article>
        </section>

        <aside className="character-panel" aria-label="Caelan's character sheet">
          <div className="character-heading">
            <div className="sigil" aria-hidden="true"><Swords /></div>
            <div>
              <p className="eyebrow">The Ember Oath</p>
              <h2>Caelan Vey</h2>
              <p>Oathwarden and road captain</p>
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
            {(Object.keys(game.stats) as StatKey[]).filter(
              (key) => game.chapter >= 2 || key !== 'medicine',
            ).map((key) => {
              const Icon = statIcons[key];
              return (
                <div className={`stat-row ${key === 'wayfire' ? 'currency-row' : ''}`} key={key}>
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

          <div className="relationships-panel">
            <p className="panel-title">Relationships</p>
            {(Object.keys(game.relationships) as RelationshipKey[]).map((person) => (
              <div className="relationship-row" key={person}>
                <strong>{relationshipLabels[person]}</strong>
                <span>Trust {game.relationships[person].trust}</span>
                <span>Attraction {game.relationships[person].attraction}</span>
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
              <p className="empty-note">The page is waiting for your first mark.</p>
            )}
          </div>
        </aside>
      </div>

      <Sheet open={showJournal} onOpenChange={setShowJournal}>
        <SheetContent className="journal-sheet" side="right">
          <SheetHeader>
            <SheetTitle>Caelan’s journal</SheetTitle>
            <SheetDescription>Only facts Caelan has learned appear here.</SheetDescription>
          </SheetHeader>
          <div className="journal-sections">
            <section>
              <span>Now</span>
              <h3>{node.title}</h3>
              <p>{node.objective}</p>
              <small>{node.location} · Threat {node.threat}</small>
            </section>
            <section>
              <span>Confirmed knowledge</span>
              <ul>{truths.map((truth) => <li key={truth}>{truth}</li>)}</ul>
            </section>
            <section>
              <span>People</span>
              <div className="journal-people">
                {(Object.keys(game.relationships) as RelationshipKey[]).map((person) => (
                  <p key={person}>
                    <strong>{relationshipLabels[person]}</strong>
                    Trust {game.relationships[person].trust}, Attraction {game.relationships[person].attraction}
                  </p>
                ))}
              </div>
            </section>
            <section>
              <span>Promises and injuries</span>
              <ul>{promises.map((promise) => <li key={promise}>{promise}</li>)}</ul>
            </section>
            <section>
              <span>Because you chose</span>
              <ul>{consequences.map((consequence) => <li key={consequence}>{consequence}</li>)}</ul>
            </section>
            <section>
              <span>Recent path</span>
              <ol>
                {game.history.slice(-8).map((entry, index) => (
                  <li key={`${entry}-${index}`}>{entry}</li>
                ))}
              </ol>
            </section>
            <section>
              <span>Future intimate scenes</span>
              <p>
                These scenes are optional and are not part of the first three chapters.
                Fade keeps the relationship and story consequence without explicit detail.
              </p>
              <div className="content-preference">
                <Button
                  variant={game.contentPreference.intimacy === 'fade' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setGame((current) => ({
                    ...current,
                    contentPreference: { ...current.contentPreference, intimacy: 'fade' },
                  }))}
                >
                  Fade
                </Button>
                <Button
                  variant={game.contentPreference.intimacy === 'detailed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    if (game.contentPreference.adultConfirmed) {
                      setGame((current) => ({
                        ...current,
                        contentPreference: { ...current.contentPreference, intimacy: 'detailed' },
                      }));
                    } else {
                      setShowMatureConfirm(true);
                    }
                  }}
                >
                  Detailed, adults only
                </Button>
              </div>
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
            {(Object.keys(game.stats) as StatKey[]).filter(
              (key) => game.chapter >= 2 || key !== 'medicine',
            ).map((key) => (
              <div key={key}><span>{statLabels[key]}</span><strong>{game.stats[key]}</strong></div>
            ))}
          </div>
          <div className="mobile-sheet-relationships">
            {(Object.keys(game.relationships) as RelationshipKey[]).map((person) => (
              <p key={person}>
                <strong>{relationshipLabels[person]}</strong>
                Trust {game.relationships[person].trust} · Attraction {game.relationships[person].attraction}
              </p>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={pendingReplay !== null} onOpenChange={(open) => !open && setPendingReplay(null)}>
        <AlertDialogContent className="replay-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Replay Chapter {pendingReplay}?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingReplay === 1
                ? 'This restarts Caelan’s journey and removes all Chapter Two and Chapter Three progress on this device.'
                : pendingReplay === 2
                  ? 'This restores the Chapter Two checkpoint and removes all Chapter Three progress created by the current path.'
                  : 'This restores the Chapter Three checkpoint and replaces every choice made after it.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep current path</AlertDialogCancel>
            <AlertDialogAction className="confirm-replay" onClick={confirmReplay}>
              Replay chapter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showMatureConfirm} onOpenChange={setShowMatureConfirm}>
        <AlertDialogContent className="replay-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm adult content preference</AlertDialogTitle>
            <AlertDialogDescription>
              Detailed intimate scenes are intended only for players who are at least 18 years old.
              They remain optional and can be changed back to Fade at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Fade</AlertDialogCancel>
            <AlertDialogAction
              className="confirm-replay"
              onClick={() => {
                setGame((current) => ({
                  ...current,
                  contentPreference: { intimacy: 'detailed', adultConfirmed: true },
                }));
                setShowMatureConfirm(false);
              }}
            >
              I am 18 or older
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
