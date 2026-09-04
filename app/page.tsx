'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  BookOpen,
  Flame,
  Heart,
  RotateCcw,
  Shield,
  Sparkles,
  Swords,
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
  statLabels,
  type Choice,
  type GameState,
  type StatKey,
} from './game-data';

const SAVE_KEY = 'veilfall.chapter-one.save';

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
  vitality: Heart,
  resolve: Shield,
  guile: Sparkles,
  mercy: Flame,
  cinders: Flame,
};

const statHelp: Record<StatKey, string> = {
  vitality: 'Your strength and ability to endure harm.',
  resolve: 'Your grip on courage, memory, and purpose.',
  guile: 'Your talent for lies, secrets, and careful plans.',
  mercy: 'The human ties your choices preserve or destroy.',
  cinders: 'Rare fragments of fate. Spend them to open hidden paths.',
};

function applyChoice(state: GameState, choice: Choice): GameState {
  const nextStats = { ...state.stats };
  for (const [key, value] of Object.entries(choice.changes ?? {})) {
    const stat = key as StatKey;
    nextStats[stat] = Math.max(0, nextStats[stat] + (value ?? 0));
  }
  return {
    nodeId: choice.next,
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
  const gameRef = useRef(game);

  gameRef.current = game;

  useEffect(() => {
    const saved = window.localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as GameState;
        if (parsed.nodeId && nodes[parsed.nodeId]) {
          setGame(parsed);
          setStarted(true);
        }
      } catch {
        window.localStorage.removeItem(SAVE_KEY);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded && started) {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(game));
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
            .filter((choice) => canChoose(choice, current.stats))
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
        if (!choice || !canChoose(choice, current.stats)) {
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
  const paragraphs = useMemo(() => node.body(game), [game, node]);
  const chapterProgress = Math.min(100, Math.round((game.history.length / 5) * 100));

  function choose(choice: Choice) {
    if (!canChoose(choice, game.stats)) return;
    setLastResult(choice.result);
    setGame((current) => applyChoice(current, choice));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function restart() {
    window.localStorage.removeItem(SAVE_KEY);
    setGame(initialState);
    setLastResult(null);
    setStarted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (!loaded) {
    return <main className="min-h-screen bg-[#07090b]" aria-label="Loading Veilfall" />;
  }

  if (!started) {
    return (
      <main className="cover-screen min-h-screen text-[#eee7d8]">
        <Image
          src="/art/maelin-dungeon.png"
          alt="Maelin stands chained in a flooded prison while a sealed door glows in the distance"
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
          <p className="cover-subtitle">The Crown Below</p>
          <p className="cover-intro">
            You guarded a king who died twice. Before dawn, the city will hang you
            for his murder. Something under your cell has other plans.
          </p>
          <Button className="begin-button" size="lg" onClick={() => setStarted(true)}>
            Begin chapter one
            <ArrowRight data-icon="inline-end" />
          </Button>
          <p className="play-note">About 15 minutes. Your choices are saved on this device.</p>
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
          Maelin I
        </div>
        <Button className="restart-button" variant="ghost" size="sm" onClick={restart}>
          <RotateCcw data-icon="inline-start" />
          Restart
        </Button>
      </header>

      <div className="game-grid">
        <section className="story-column" aria-live="polite">
          <div className="scene-art-wrap">
            <Image
              src="/art/maelin-dungeon.png"
              alt="A flooded prison beneath Greyhaven"
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

            {!node.final ? (
              <div className="choices" aria-label="Choose Maelin's action">
                <p className="choice-prompt">What do you do?</p>
                {node.choices.map((choice, index) => {
                  const available = canChoose(choice, game.stats);
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
                <h2>Maelin will return in Chapter Two</h2>
                <p>
                  You carry {game.stats.cinders} Cinders. Future chapters will let
                  you spend them on hidden memories, dangerous shortcuts, and
                  alternate points of view.
                </p>
                <Button className="begin-button" size="lg" onClick={restart}>
                  Try another path
                  <RotateCcw data-icon="inline-end" />
                </Button>
              </div>
            )}
          </article>
        </section>

        <aside className="character-panel" aria-label="Maelin's character sheet">
          <div className="character-heading">
            <div className="sigil" aria-hidden="true"><Swords /></div>
            <div>
              <p className="eyebrow">The broken oath</p>
              <h2>Maelin Vey</h2>
              <p>Disgraced royal oathkeeper</p>
            </div>
          </div>

          <Progress className="chapter-progress" value={chapterProgress}>
            <ProgressLabel>Chapter progress</ProgressLabel>
            <ProgressValue>{chapterProgress}%</ProgressValue>
          </Progress>

          <div className="stats-list">
            {(Object.keys(game.stats) as StatKey[]).map((key) => {
              const Icon = statIcons[key];
              return (
                <div className={`stat-row ${key === 'cinders' ? 'currency-row' : ''}`} key={key}>
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
