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
  nodes,
  relationshipLabels,
  relationshipSummary,
  requirementText,
  sceneObjective,
  statLabels,
  type Choice,
  type ChapterNumber,
  type GameState,
  type RelationshipIntent,
  type RelationshipKey,
  type StatKey,
} from './game-data';
import { GATE_LAW_REVIEWS } from './gate-law-review';
import {
  applyChapterHandoff,
  applyPlayerChoice,
  captureDeathCause,
  captureFatalRetry,
  chapterRecoveryDisplay,
  cloneGameState,
  deathCauseText,
  previewRelationshipChanges,
  wouldBeFatal,
} from './game-transition';
import {
  currentPromiseRecords,
  deriveInjuryRecords,
  promiseStatusLabel,
  resolvedPromiseRecords,
} from './promise-records';
import {
  COVER_ART,
  deliveredArtworkSrcSet,
  type SceneArtwork,
} from './scene-art';
import {
  scrollLandingAfterTransition,
  visibleArtworkForState,
  type ScrollLanding,
} from './expanded-art';
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
  type DeathCause,
  type ImportSummary,
  type RetrySnapshot,
  type StoredSaveDocument,
  type TextSizePreference,
} from './save-system';
import { knownTruths, majorConsequences } from './story-memory';

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
const closedRelationshipIntents: RelationshipIntent[] = [
  'ended',
  'hostile',
  'platonic',
];
// Build-time target, not hostname detection: local itch previews match the upload.
const showExpectedAdvantages =
  process.env.NEXT_PUBLIC_VEILFALL_TARGET !== 'itch';

function SceneArtImage({
  art,
  className,
  fill,
  onError,
  priority,
  sizes,
}: {
  art: SceneArtwork;
  className?: string;
  fill?: boolean;
  onError?: () => void;
  priority?: boolean;
  sizes?: string;
}) {
  const image = (
    <Image
      src={art.src}
      alt={art.alt}
      className={className}
      fill={fill}
      height={fill ? undefined : 864}
      onError={onError}
      priority={priority}
      sizes={sizes}
      width={fill ? undefined : 1536}
    />
  );
  return (
    <picture key={art.src}>
      <source
        sizes={sizes}
        srcSet={deliveredArtworkSrcSet(art)}
        type="image/webp"
      />
      {image}
    </picture>
  );
}

function displayRelationship(game: GameState, person: RelationshipKey) {
  const summary = relationshipSummary(game.relationships[person]);
  if (
    !game.flags.includes('c12-relationship-distance') ||
    closedRelationshipIntents.includes(game.relationships[person].intent)
  )
    return summary;
  return `${summary}. Future left open across distance`;
}

type ChoiceEffectBadge = {
  key: string;
  text: string;
  tone: 'gain' | 'loss' | 'shift' | 'lethal' | 'stat';
};

function changeSummary(choice: Choice, state: GameState) {
  const statChanges: ChoiceEffectBadge[] = Object.entries(
    choice.changes ?? {},
  ).flatMap(([key, value]) => {
    if (!value) return [];
    const amount = Math.abs(value);
    return [
      {
        key: `stat-${key}`,
        text:
          value < 0
            ? `Cost: ${statLabels[key as StatKey]} ${amount}`
            : `Gain: ${statLabels[key as StatKey]} ${amount}`,
        tone: 'stat' as const,
      },
    ];
  });
  const groups = previewRelationshipChanges(state, choice).groups;
  return {
    statChanges,
    groups,
    lethal: wouldBeFatal(choice, state),
  };
}

function stickyClearancePx() {
  const topbar = document.querySelector('.topbar');
  const strip = document.querySelector('.mobile-status-strip');
  const topbarHeight =
    topbar instanceof HTMLElement ? topbar.getBoundingClientRect().height : 0;
  let stripHeight = 0;
  if (strip instanceof HTMLElement) {
    const style = window.getComputedStyle(strip);
    if (style.position === 'sticky' && style.display !== 'none') {
      stripHeight = strip.getBoundingClientRect().height;
    }
  }
  return Math.round(topbarHeight + stripHeight + 8);
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
  const [retrySnapshot, setRetrySnapshot] = useState<RetrySnapshot | null>(
    null,
  );
  const [deathCause, setDeathCause] = useState<DeathCause | null>(null);
  const [pendingLawChoice, setPendingLawChoice] = useState<Choice | null>(
    null,
  );
  const [failedArtKey, setFailedArtKey] = useState<string | null>(null);
  const lawCardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const pendingLawChoiceRef = useRef<Choice | null>(null);
  const chooseRef = useRef<
    (
      choice: Choice,
    ) =>
      | { committed: false; review?: (typeof GATE_LAW_REVIEWS)[string] }
      | { committed: true; next: GameState }
  >(() => ({ committed: false }));
  const [showResolvedPromises, setShowResolvedPromises] = useState(false);
  const lawReviewRef = useRef<HTMLParagraphElement | null>(null);
  const mobileHeadingRef = useRef<HTMLHeadingElement>(null);
  const gameRef = useRef(game);
  const checkpointsRef = useRef<CheckpointMap>({});
  const autosaveBlockedRef = useRef(false);
  const importInputRef = useRef<HTMLInputElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const storyOpeningRef = useRef<HTMLDivElement>(null);
  const sceneHeadingRef = useRef<HTMLHeadingElement>(null);
  const [scrollRequest, setScrollRequest] = useState<{
    token: number;
    landing: ScrollLanding;
  } | null>(null);

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
          setRetrySnapshot(result.document.retry);
          setDeathCause(result.document.deathCause);
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
      createStoredSave(
        game,
        checkpointsRef.current,
        readingSize,
        retrySnapshot,
        deathCause,
      ),
    );
    if (!result.ok) {
      autosaveBlockedRef.current = true;
      setNotice({ kind: 'error', message: result.error, storageError: true });
    }
  }, [deathCause, game, loaded, readingSize, retrySnapshot, started]);

  useEffect(() => {
    if (!scrollRequest || !started) return;
    const { landing } = scrollRequest;
    let frame = 0;
    let cancelled = false;
    frame = window.requestAnimationFrame(() => {
      if (cancelled) return;
      const mobile = window.matchMedia('(max-width: 950px)').matches;
      const heading = mobile
        ? mobileHeadingRef.current
        : sceneHeadingRef.current;
      heading?.focus({ preventScroll: true });
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      const target =
        landing === 'hero'
          ? sceneRef.current
          : landing === 'romance'
            ? storyOpeningRef.current
            : storyRef.current;
      if (!target) return;
      const top =
        window.scrollY +
        target.getBoundingClientRect().top -
        stickyClearancePx();
      window.scrollTo({
        top: Math.max(0, top),
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [scrollRequest, started]);

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

        const attempt = chooseRef.current(choice);
        if (!attempt.committed) {
          if (attempt.review) {
            return {
              reviewRequired: true,
              committed: false,
              choiceId: choice.id,
              title: attempt.review.title,
              summary: attempt.review.summary,
              groups: attempt.review.groups,
              message:
                'Game state does not change until Swear this law is confirmed on screen.',
            };
          }
          throw new Error('That action is not available in the current scene');
        }
        return {
          sceneId: attempt.next.nodeId,
          result: choice.result,
          stats: attempt.next.stats,
        };
      },
    });

    return () => lifecycle.abort();
  }, []);

  const node = nodes[game.nodeId];
  const objective = useMemo(
    () => sceneObjective(node, game),
    [game, node],
  );
  const paragraphs = useMemo(() => node.body(game), [game, node]);
  const truths = useMemo(() => knownTruths(game), [game]);
  const currentPromises = useMemo(() => currentPromiseRecords(game), [game]);
  const resolvedPromises = useMemo(
    () => resolvedPromiseRecords(game),
    [game],
  );
  const injuries = useMemo(() => deriveInjuryRecords(game), [game]);
  const consequences = useMemo(() => majorConsequences(game), [game]);
  const visibleRelationships = visibleRelationshipKeys(game);
  const chapterProgressLabel = node.final
    ? 'Chapter complete'
    : `Chapter ${chapterDefinitions[game.chapter - 1].roman} of XII`;
  const currentChapter = chapterDefinitions[game.chapter - 1];
  const pendingLawReview = pendingLawChoice
    ? GATE_LAW_REVIEWS[pendingLawChoice.id]
    : null;
  const visibleArt = visibleArtworkForState(game);
  const sceneArt = visibleArt.hero;
  const romanceArt = visibleArt.romance;
  const artFailed = failedArtKey === sceneArt.src;
  const nextChapterNumber =
    node.nextChapter && game.chapter < 12
      ? ((game.chapter + 1) as Exclude<ChapterNumber, 1>)
      : null;
  const recoveryPreview = nextChapterNumber
    ? chapterRecoveryDisplay(game, nextChapterNumber)
    : null;
  const showMedicineStock = node.choices.some(
    (choice) =>
      isChoiceVisible(choice, game) &&
      ((choice.changes?.medicine ?? 0) !== 0 ||
        (choice.requires?.medicine ?? 0) > 0),
  );
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
    return createStoredSave(
      game,
      checkpointsRef.current,
      readingSize,
      retrySnapshot,
      deathCause,
    );
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
    setRetrySnapshot(pendingImport.document.retry);
    setDeathCause(pendingImport.document.deathCause);
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

  function commitChoice(choice: Choice) {
    if (game.defeat || !canChoose(choice, game)) return null;
    const before = cloneGameState(game);
    const fatal = wouldBeFatal(choice, game);
    const next = applyPlayerChoice(game, choice);
    if (next.defeat && fatal) {
      setRetrySnapshot(captureFatalRetry(before, choice));
      setDeathCause(captureDeathCause(before, choice));
    } else {
      setRetrySnapshot(null);
      setDeathCause(null);
    }
    setScrollRequest((previous) => ({
      token: (previous?.token ?? 0) + 1,
      landing: scrollLandingAfterTransition(before, next),
    }));
    setLastResult(choice.result);
    setPendingLawChoice(null);
    gameRef.current = next;
    setGame(next);
    setStarted(true);
    return next;
  }

  function choose(choice: Choice) {
    if (game.defeat || !canChoose(choice, game)) return { committed: false as const };
    if (GATE_LAW_REVIEWS[choice.id]) {
      pendingLawChoiceRef.current = choice;
      setPendingLawChoice(choice);
      window.requestAnimationFrame(() => {
        lawReviewRef.current?.focus({ preventScroll: true });
      });
      return {
        committed: false as const,
        review: GATE_LAW_REVIEWS[choice.id],
      };
    }
    const next = commitChoice(choice);
    return next
      ? { committed: true as const, next }
      : { committed: false as const };
  }
  chooseRef.current = choose;

  function confirmLawChoice() {
    const choice = pendingLawChoiceRef.current ?? pendingLawChoice;
    pendingLawChoiceRef.current = null;
    setPendingLawChoice(null);
    if (choice) commitChoice(choice);
  }

  function cancelLawChoice() {
    const choiceId =
      pendingLawChoiceRef.current?.id ?? pendingLawChoice?.id;
    pendingLawChoiceRef.current = null;
    setPendingLawChoice(null);
    window.requestAnimationFrame(() => {
      if (choiceId) lawCardRefs.current[choiceId]?.focus();
    });
  }

  function retryLastChoice() {
    if (!retrySnapshot) return;
    const restored = cloneGameState(retrySnapshot.before);
    setScrollRequest((previous) => ({
      token: (previous?.token ?? 0) + 1,
      landing: scrollLandingAfterTransition(game, restored),
    }));
    setRetrySnapshot(null);
    setDeathCause(null);
    gameRef.current = restored;
    setGame(restored);
    setLastResult(null);
  }

  function clearRetryState() {
    setRetrySnapshot(null);
    setDeathCause(null);
    setPendingLawChoice(null);
  }

  function loadChapterState(next: GameState) {
    clearRetryState();
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
    const next = applyChapterHandoff(game, 2);
    recordChapterCheckpoint(2, next);
    loadChapterState(next);
  }

  function startChapterThree() {
    const next = applyChapterHandoff(game, 3);
    recordChapterCheckpoint(3, next);
    loadChapterState(next);
  }

  function startChapterFour() {
    const next = applyChapterHandoff(game, 4);
    recordChapterCheckpoint(4, next);
    loadChapterState(next);
  }

  function startChapterFive() {
    const next = applyChapterHandoff(game, 5);
    recordChapterCheckpoint(5, next);
    loadChapterState(next);
  }

  function startChapterSix() {
    const next = applyChapterHandoff(game, 6);
    recordChapterCheckpoint(6, next);
    loadChapterState(next);
  }

  function startChapterSeven() {
    const next = applyChapterHandoff(game, 7);
    recordChapterCheckpoint(7, next);
    loadChapterState(next);
  }

  function startChapterEight() {
    const next = applyChapterHandoff(game, 8);
    recordChapterCheckpoint(8, next);
    loadChapterState(next);
  }

  function startChapterNine() {
    const next = applyChapterHandoff(game, 9);
    recordChapterCheckpoint(9, next);
    loadChapterState(next);
  }

  function startChapterTen() {
    const next = applyChapterHandoff(game, 10);
    recordChapterCheckpoint(10, next);
    loadChapterState(next);
  }

  function startChapterEleven() {
    const next = applyChapterHandoff(game, 11);
    recordChapterCheckpoint(11, next);
    loadChapterState(next);
  }

  function startChapterTwelve() {
    // Canonical Chapter XII entry remains c12-inner-gate.
    const next = applyChapterHandoff(game, 12);
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
          <SceneArtImage
            art={COVER_ART}
            className="cover-art object-cover"
            fill
            priority
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
          {chapterProgressLabel}
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
            <strong>{objective}</strong>
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
          <span>Health</span>
          <strong>{game.stats.health}</strong>
        </div>
        <div>
          <span>Resolve</span>
          <strong>{game.stats.resolve}</strong>
        </div>
        <div>
          <span>Command</span>
          <strong>{game.stats.command}</strong>
        </div>
        <div>
          <span>Oathfire</span>
          <strong>{game.stats.oathfire}</strong>
        </div>
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
            New scene: {node.title}. {objective}
          </output>
          <header className="mobile-scene-heading">
            <p className="eyebrow">{node.kicker}</p>
            <h1 ref={mobileHeadingRef} tabIndex={-1}>
              {node.title}
            </h1>
          </header>
          <div className="scene-art-wrap" ref={sceneRef}>
            {!artFailed ? (
              <SceneArtImage
                key={`${node.id}:${sceneArt.src}`}
                art={sceneArt}
                className="scene-art"
                fill
                onError={() => setFailedArtKey(sceneArt.src)}
                priority={game.chapter === 1 && game.nodeId === 'gate-yard'}
                sizes="(max-width: 950px) 92vw, calc(92vw - 27rem)"
              />
            ) : (
              <div className="scene-art-fallback" aria-hidden="true" />
            )}
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
              <div className="story-opening" ref={storyOpeningRef}>
                {lastResult && <p>{lastResult}</p>}
                {romanceArt && (
                  <figure className="romance-art">
                    <SceneArtImage
                      art={romanceArt}
                      className="scene-art"
                      fill
                      sizes="(max-width: 950px) 88vw, calc(92vw - 31rem)"
                    />
                  </figure>
                )}
              </div>
              {paragraphs.map((paragraph, index) => (
                <p key={`${node.id}-${index}`}>{paragraph}</p>
              ))}
            </div>

            <p className="scene-objective-line">
              <span>{objective}</span>
              <span className="scene-threat">Threat {node.threat}</span>
            </p>

            {!node.final ? (
              <div className="choices" aria-label="Choose Caelan's action">
                {showMedicineStock ? (
                  <p className="medicine-stock">
                    Medicine {game.stats.medicine}
                  </p>
                ) : null}
                {node.choices
                  .filter((choice) => isChoiceVisible(choice, game))
                  .map((choice, index) => {
                    const available = canChoose(choice, game);
                    const lawReview = GATE_LAW_REVIEWS[choice.id];
                    const changes = changeSummary(choice, game);
                    const lethal = wouldBeFatal(choice, game);
                    const detail = lawReview?.summary ?? choice.detail;
                    return (
                      <Button
                        key={choice.id}
                        ref={(element) => {
                          if (lawReview)
                            lawCardRefs.current[choice.id] = element;
                        }}
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
                          <span>{detail}</span>
                          {showExpectedAdvantages && choice.advantage ? (
                            <span className="choice-advantage">
                              <b>Expected advantage</b>
                              {choice.advantage}
                            </span>
                          ) : null}
                          <span
                            className={`choice-effects ${lethal ? 'choice-effects-lethal' : ''}`}
                          >
                            {!available ? (
                              <span className="choice-effect choice-effect-stat">
                                Requires {requirementText(choice)}
                              </span>
                            ) : null}
                            {changes.statChanges.map((change) => (
                              <span
                                key={change.key}
                                className={`choice-effect choice-effect-${change.tone}`}
                              >
                                {change.text}
                              </span>
                            ))}
                            {changes.groups.map((group) => (
                              <span
                                key={group.person}
                                className="choice-rel-group"
                              >
                                <span className="choice-rel-name">
                                  {group.name}:
                                </span>
                                {group.parts.map((part) => (
                                  <span
                                    key={part.dimension}
                                    className={`choice-effect choice-effect-${part.tone}`}
                                  >
                                    {part.text}
                                  </span>
                                ))}
                              </span>
                            ))}
                            {changes.lethal ? (
                              <span className="choice-effect choice-effect-lethal">
                                Lethal at current Health
                              </span>
                            ) : null}
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
                  <>
                    {recoveryPreview ? (
                      <p className="recovery-note">
                        {recoveryPreview.rest}
                        {recoveryPreview.deltas.length
                          ? ` Recovery: ${recoveryPreview.deltas.join(' · ')}.`
                          : ' Recovery: no change; a cap already held these values.'}
                      </p>
                    ) : null}
                    {game.chapter === 1 ? (
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
                        this company, surviving Oaths, and chosen limits.
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
                  )}
                  </>
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

          <p className="chapter-progress-label">{chapterProgressLabel}</p>

          <div className="mission-card">
            <div>
              <MapPin aria-hidden="true" />
              <span>Current objective</span>
            </div>
            <p>{objective}</p>
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
                <span>{displayRelationship(game, person)}</span>
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
              <p>{objective}</p>
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
                    {displayRelationship(game, person)}
                  </p>
                ))}
              </div>
            </section>
            <section>
              <span>Promises</span>
              {currentPromises.length ? (
                <ul className="promise-list">
                  {currentPromises.map((entry) => (
                    <li key={entry.id}>
                      <strong>{entry.promise}</strong>
                      <small>
                        {promiseStatusLabel(entry.status)} · {entry.beneficiary}
                      </small>
                      <span>
                        Scope: {entry.scope} Benefit: {entry.benefit} Ends:{' '}
                        {entry.endingConditions}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No binding Oath or lasting obligation is currently active.</p>
              )}
              {resolvedPromises.length ? (
                <div className="resolved-promises">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setShowResolvedPromises((open) => !open)
                    }
                  >
                    {showResolvedPromises
                      ? 'Hide settled promises'
                      : 'Show settled promises'}
                  </Button>
                  {showResolvedPromises ? (
                    <ul className="promise-list">
                      {resolvedPromises.map((entry) => (
                        <li key={entry.id}>
                          <strong>{entry.promise}</strong>
                          <small>
                            {promiseStatusLabel(entry.status)} ·{' '}
                            {entry.beneficiary}
                          </small>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </section>
            <section>
              <span>Injuries</span>
              {injuries.length ? (
                <ul>
                  {injuries.map((injury) => (
                    <li key={injury.id}>{injury.summary}</li>
                  ))}
                </ul>
              ) : (
                <p>No lasting injury is recorded.</p>
              )}
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
            <SheetDescription>{objective}</SheetDescription>
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
                {displayRelationship(game, person)}
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
            <AlertDialogDescription>
              {game.defeat?.body}
              {deathCause ? (
                <>
                  {' '}
                  {deathCauseText({
                    actionLabel: deathCause.label,
                    healthBefore: deathCause.healthBefore,
                    healthCost: deathCause.healthCost,
                  })}
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {retrySnapshot ? (
              <AlertDialogAction
                className="confirm-replay"
                onClick={retryLastChoice}
              >
                Retry the last choice
              </AlertDialogAction>
            ) : null}
            <AlertDialogAction
              className="confirm-replay"
              onClick={returnToChapterStart}
            >
              Restart this chapter
            </AlertDialogAction>
            <AlertDialogCancel onClick={restartStoryAfterDeath}>
              Restart the story
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(pendingLawReview)}
        onOpenChange={(open) => {
          if (!open && pendingLawChoiceRef.current) cancelLawChoice();
        }}
      >
        <AlertDialogContent className="law-review-dialog">
          <AlertDialogHeader>
            <p className="eyebrow" ref={lawReviewRef} tabIndex={-1}>
              Review this law
            </p>
            <AlertDialogTitle tabIndex={-1}>
              {pendingLawReview?.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingLawReview?.summary} Game state does not change until you
              swear this law.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {pendingLawReview ? (
            <dl className="law-review-groups">
              {pendingLawReview.groups.map((group) => (
                <div key={group.label}>
                  <dt>{group.label}</dt>
                  <dd>{group.body}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelLawChoice}>
              Back
            </AlertDialogCancel>
            <AlertDialogAction
              className="confirm-replay"
              onClick={confirmLawChoice}
            >
              Swear this law
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
