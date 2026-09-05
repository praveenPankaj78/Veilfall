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
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';
import {
  canChoose,
  initialState,
  nodes,
  requirementText,
  resolveNext,
  statLabels,
  type Choice,
  type GameState,
  type StatKey,
} from './game-data';

const CURRENT_SAVE_KEY = 'veilfall.saga.v5.save';
const LEGACY_SAVE_KEYS = [
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
    summary: 'Keep the wounded safe in Bellweather Inn and learn why the road changed.',
  },
  {
    number: 3 as const,
    title: 'The Town at the Wrong Mile',
    summary: 'Face a false arrival in Harrowfen and learn what the iron fragment can do.',
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
  rapport: 'Trust and attraction earned through attention, honesty, and shared risk.',
  oathfire: 'Magic gained from a binding promise and spent on extraordinary protection.',
  medicine: 'Strong healing supplies. The story explains who can benefit before you spend any.',
  wayfire: 'Chapter currency earned through choices you cannot undo and chapter completion.',
};

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
  const completedChapters = nodes[nodeId]?.final
    ? Array.from(new Set([...state.completedChapters, state.chapter]))
    : state.completedChapters;
  return {
    nodeId,
    chapter: state.chapter,
    chapterChoices: state.chapterChoices + 1,
    completedChapters,
    stats: nextStats,
    flags: Array.from(new Set([...state.flags, ...(choice.addFlags ?? [])])),
    history: [...state.history, choice.result],
  };
}

function changeSummary(choice: Choice) {
  return Object.entries(choice.changes ?? {})
    .filter(([, value]) => value !== 0)
    .map(([key, value]) => {
      const sign = (value ?? 0) > 0 ? '+' : '';
      return `${statLabels[key as StatKey]} ${sign}${value}`;
    });
}

export default function Home() {
  const [game, setGame] = useState<GameState>(initialState);
  const [started, setStarted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [showChapterLibrary, setShowChapterLibrary] = useState(false);
  const gameRef = useRef(game);

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
  const chapterProgress = node.final
    ? 100
    : Math.min(96, Math.round((game.chapterChoices / 15) * 100));

  function choose(choice: Choice) {
    if (!canChoose(choice, game)) return;
    setLastResult(choice.result);
    setGame((current) => applyChoice(current, choice));
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

    const savedStart = chapterStart(chapter);
    if (savedStart) loadChapterState(savedStart);
  }

  function restart() {
    replayChapter(game.chapter);
  }

  function startChapterTwo() {
    if (game.stats.wayfire < 5) return;
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
        wayfire: game.stats.wayfire - 5,
      },
      history: [...game.history, 'You spend 5 Wayfire and continue to Bellweather Inn.'],
    };
    window.localStorage.setItem(CHAPTER_START_KEYS[2]!, JSON.stringify(next));
    loadChapterState(next);
  }

  function startChapterThree() {
    if (game.stats.wayfire < 7) return;
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
        wayfire: game.stats.wayfire - 7,
      },
      history: [...game.history, 'You spend 7 Wayfire and continue to Harrowfen.'],
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
                      onClick={() => replayChapter(chapter.number)}
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

      <div className="game-grid">
        <section className="story-column" aria-live="polite">
          <div className="scene-art-wrap">
            <Image
              src={node.art === 'harrowfen'
                ? '/art/harrowfen-wrong-mile.png'
                : node.art === 'inn'
                ? '/art/bellweather-inn.png'
                : node.art === 'folded'
                  ? '/art/kings-road-folded.png'
                  : '/art/caelan-east-gate.png'}
              alt={node.art === 'harrowfen'
                ? 'Caelan faces a shifting canal town while another version of him waits at the gate'
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

          <article className="story-page" key={node.id}>
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
                {node.nextChapter ? (
                  game.chapter === 1 ? (
                    <>
                      <h2>Chapter Two is ready</h2>
                      <p>
                        You carry {game.stats.wayfire} Wayfire. Unlock The Inn That Waited
                        for 5 Wayfire and continue with every consequence from this route.
                      </p>
                      <Button
                        className="begin-button"
                        size="lg"
                        disabled={game.stats.wayfire < 5}
                        onClick={startChapterTwo}
                      >
                        Unlock Chapter Two
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
                        You carry {game.stats.wayfire} Wayfire. Unlock The Town at the Wrong Mile
                        for 7 Wayfire and bring every surviving consequence into Harrowfen.
                      </p>
                      <Button
                        className="begin-button"
                        size="lg"
                        disabled={game.stats.wayfire < 7}
                        onClick={startChapterThree}
                      >
                        Unlock Chapter Three
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
    </main>
  );
}
