import { version } from '../package.json';
import {
  chapterDefinitions,
  initialState,
  nodes,
  normaliseRelationships,
  resolveCompletedOathFlags,
  resolveFinalRelationshipIntents,
  type ChapterNumber,
  type GameState,
  type GameStats,
  type RelationshipIntent,
  type RelationshipKey,
} from './game-data';

export const BUILD_VERSION = version;
export const SAVE_SCHEMA_VERSION = 17;
export const EXPORT_FORMAT = 'veilfall-ember-oath-save';
export const EXPORT_VERSION = 1;
export const MAX_IMPORT_BYTES = 1_000_000;

export const CURRENT_SAVE_KEY = 'veilfall.saga.v17.save';
export const BACKUP_SAVE_KEY = 'veilfall.saga.v17.pre-import-backup';
export const DAMAGED_SAVE_BACKUP_KEY = 'veilfall.saga.v17.damaged-backup';
export const READING_PREFERENCE_KEY = 'veilfall.reading.v1';
export const LEGACY_SAVE_KEYS = [
  'veilfall.saga.v16.save',
  'veilfall.saga.v15.save',
  'veilfall.saga.v14.save',
  'veilfall.saga.v13.save',
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
] as const;

export const LEGACY_CHAPTER_START_KEYS: Partial<Record<ChapterNumber, string>> =
  {
    2: 'veilfall.chapter-two.v1.start',
    3: 'veilfall.chapter-three.v1.start',
    4: 'veilfall.chapter-four.v1.start',
    5: 'veilfall.chapter-five.v1.start',
    6: 'veilfall.chapter-six.v1.start',
    7: 'veilfall.chapter-seven.v1.start',
    8: 'veilfall.chapter-eight.v1.start',
    9: 'veilfall.chapter-nine.v1.start',
    10: 'veilfall.chapter-ten.v1.start',
    11: 'veilfall.chapter-eleven.v1.start',
    12: 'veilfall.chapter-twelve.v1.start',
  };

export type TextSizePreference = 'default' | 'large' | 'extra-large';
export type CheckpointMap = Partial<Record<ChapterNumber, GameState>>;

export type StoredSaveDocument = {
  kind: 'veilfall-browser-save';
  schemaVersion: typeof SAVE_SCHEMA_VERSION;
  game: GameState;
  checkpoints: CheckpointMap;
  readingPreference: TextSizePreference;
};

export type PortableSave = {
  format: typeof EXPORT_FORMAT;
  exportVersion: typeof EXPORT_VERSION;
  saveSchemaVersion: number;
  gameTitle: 'Veilfall: The Ember Oath';
  buildVersion: string;
  exportedAt: string;
  game: GameState;
  checkpoints: CheckpointMap;
  readingPreference: TextSizePreference;
};

export type ImportSummary = {
  chapter: ChapterNumber;
  chapterLabel: string;
  completedChapters: number;
  checkpointCount: number;
  endingRecorded: boolean;
  exportedAt: string;
};

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

type ValidatedGame =
  | { ok: true; game: GameState }
  | { ok: false; error: string };
type ValidatedDocument =
  | { ok: true; document: StoredSaveDocument }
  | { ok: false; error: string };

const relationshipIntents: readonly RelationshipIntent[] = [
  'unresolved',
  'interested',
  'exploring',
  'committed',
  'platonic',
  'hostile',
  'ended',
];
const relationshipKeys: readonly RelationshipKey[] = [
  'mara',
  'lysara',
  'ilyra',
  'vexa',
];
const statKeys = Object.keys(initialState.stats) as (keyof GameStats)[];
const allChoiceIds = new Set(
  Object.values(nodes).flatMap((node) =>
    node.choices.map((choice) => choice.id),
  ),
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isBoundedInteger(value: unknown, minimum: number, maximum: number) {
  return (
    typeof value === 'number' &&
    Number.isSafeInteger(value) &&
    value >= minimum &&
    value <= maximum
  );
}

function isStringArray(value: unknown, maximumItems: number) {
  return (
    Array.isArray(value) &&
    value.length <= maximumItems &&
    value.every((item) => typeof item === 'string' && item.length <= 2_000)
  );
}

export function chapterForNode(nodeId: string): ChapterNumber | null {
  if (!nodes[nodeId]) return null;
  const match = nodeId.match(/^c(\d+)-/);
  const chapter = match ? Number(match[1]) : 1;
  return isBoundedInteger(chapter, 1, chapterDefinitions.length)
    ? (chapter as ChapterNumber)
    : null;
}

export function migrateRelationships(value: Partial<GameState>) {
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

export function normaliseGameState(value: Partial<GameState>): GameState {
  const nodeId =
    value.nodeId && nodes[value.nodeId] ? value.nodeId : initialState.nodeId;
  const chapter = chapterForNode(nodeId) ?? value.chapter ?? 1;
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
  const relationships = migrateRelationships(value);
  const flags = resolveCompletedOathFlags([...(value.flags ?? [])]);
  const chapterNineRosterResolved = [
    'c9-mara-crossed-black-gate',
    'c9-mara-remained-at-gate',
    'c9-lysara-crossed-black-gate',
    'c9-lysara-remained-at-gate',
    'c9-no-mortal-partner-crossed',
  ].some((flag) => flags.includes(flag));
  if (completedChapters.includes(9) && !chapterNineRosterResolved) {
    if (
      relationships.mara.intent === 'committed' ||
      relationships.mara.intent === 'exploring'
    )
      flags.push('c9-mara-crossed-black-gate');
    else if (
      relationships.lysara.intent === 'committed' ||
      relationships.lysara.intent === 'exploring'
    )
      flags.push('c9-lysara-crossed-black-gate');
    else flags.push('c9-no-mortal-partner-crossed');
  }
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
    relationships: resolveFinalRelationshipIntents(relationships, flags),
    contentPreference: {
      ...initialState.contentPreference,
      ...value.contentPreference,
    },
    flags,
    history: (value.history ?? []).map((entry) =>
      value.flags?.includes('c12-oathscar-door-order') &&
      flags.includes('c12-door-freedom-returned') &&
      entry ===
        'You cross first. The strike hits your shield instead of the wounded, and a door-shaped scar burns across your wrist.'
        ? 'You crossed first after the opening stopped. Your shield took the strike for the wounded. The completed door promise created no scar.'
        : entry,
    ),
    defeat: value.defeat ?? null,
  };
}

function validateGameState(value: unknown, label: string): ValidatedGame {
  if (!isRecord(value))
    return { ok: false, error: `${label} is not an object.` };
  if (typeof value.nodeId !== 'string' || !nodes[value.nodeId])
    return { ok: false, error: `${label} names an unknown story node.` };
  const actualChapter = chapterForNode(value.nodeId);
  if (!isBoundedInteger(value.chapter, 1, chapterDefinitions.length))
    return { ok: false, error: `${label} has an invalid chapter number.` };
  if (actualChapter !== value.chapter)
    return {
      ok: false,
      error: `${label} chapter does not match its story node.`,
    };
  if (!isBoundedInteger(value.chapterChoices, 0, 100))
    return { ok: false, error: `${label} has an invalid decision count.` };
  if (
    !Array.isArray(value.completedChapters) ||
    value.completedChapters.length > chapterDefinitions.length ||
    new Set(value.completedChapters).size !== value.completedChapters.length ||
    !value.completedChapters.every((chapter) =>
      isBoundedInteger(chapter, 1, value.chapter as number),
    )
  )
    return { ok: false, error: `${label} has invalid completed chapters.` };
  if (!isRecord(value.stats))
    return { ok: false, error: `${label} has no valid stat block.` };
  for (const key of statKeys) {
    if (!isBoundedInteger(value.stats[key], 0, 1_000_000))
      return { ok: false, error: `${label} has an invalid ${key} value.` };
  }
  if (!isRecord(value.relationships))
    return { ok: false, error: `${label} has no valid relationship block.` };
  for (const person of relationshipKeys) {
    const score = value.relationships[person];
    if (!isRecord(score))
      return {
        ok: false,
        error: `${label} has an invalid ${person} relationship.`,
      };
    for (const key of ['trust', 'attraction', 'respect', 'friction'] as const) {
      if (!isBoundedInteger(score[key], -1_000, 1_000))
        return {
          ok: false,
          error: `${label} has an invalid ${person} ${key} value.`,
        };
    }
    if (
      typeof score.intent !== 'string' ||
      !relationshipIntents.includes(score.intent as RelationshipIntent)
    )
      return { ok: false, error: `${label} has an invalid ${person} intent.` };
  }
  if (!isRecord(value.contentPreference))
    return { ok: false, error: `${label} has no content preference.` };
  if (
    !['fade', 'detailed'].includes(String(value.contentPreference.intimacy)) ||
    typeof value.contentPreference.adultConfirmed !== 'boolean'
  )
    return { ok: false, error: `${label} has an invalid content preference.` };
  if (!isStringArray(value.flags, 10_000))
    return { ok: false, error: `${label} has invalid story flags.` };
  if (!isStringArray(value.history, 2_000))
    return { ok: false, error: `${label} has an invalid history.` };
  if (value.defeat !== null) {
    if (!isRecord(value.defeat))
      return { ok: false, error: `${label} has an invalid defeat record.` };
    if (
      typeof value.defeat.title !== 'string' ||
      typeof value.defeat.body !== 'string' ||
      typeof value.defeat.choiceId !== 'string' ||
      !allChoiceIds.has(value.defeat.choiceId)
    )
      return { ok: false, error: `${label} has an invalid defeat record.` };
  }
  return { ok: true, game: normaliseGameState(value as Partial<GameState>) };
}

function validateDocumentParts(
  gameValue: unknown,
  checkpointsValue: unknown,
  readingValue: unknown,
): ValidatedDocument {
  const gameResult = validateGameState(gameValue, 'The current game');
  if (!gameResult.ok) return gameResult;
  if (!isRecord(checkpointsValue))
    return { ok: false, error: 'The checkpoint collection is not an object.' };
  if (!['default', 'large', 'extra-large'].includes(String(readingValue)))
    return { ok: false, error: 'The reading preference is not supported.' };

  const checkpoints: CheckpointMap = {};
  for (const [key, checkpointValue] of Object.entries(checkpointsValue)) {
    const chapter = Number(key);
    if (
      !isBoundedInteger(chapter, 2, chapterDefinitions.length) ||
      String(chapter) !== key
    )
      return {
        ok: false,
        error: `Checkpoint ${key} has an invalid chapter key.`,
      };
    const result = validateGameState(checkpointValue, `Checkpoint ${chapter}`);
    if (!result.ok) return result;
    const definition = chapterDefinitions[chapter - 1];
    if (
      result.game.chapter !== chapter ||
      result.game.nodeId !== definition.entryNode ||
      result.game.chapterChoices !== 0
    )
      return {
        ok: false,
        error: `Checkpoint ${chapter} is not a clean start for ${definition.title}.`,
      };
    if (chapter > gameResult.game.chapter)
      return {
        ok: false,
        error: `Checkpoint ${chapter} is later than the current game.`,
      };
    if (!result.game.completedChapters.includes(chapter - 1))
      return {
        ok: false,
        error: `Checkpoint ${chapter} lacks the prior completion.`,
      };
    if (
      result.game.completedChapters.some(
        (completed) => !gameResult.game.completedChapters.includes(completed),
      ) ||
      result.game.flags.some((flag) => !gameResult.game.flags.includes(flag))
    )
      return {
        ok: false,
        error: `Checkpoint ${chapter} contains story results that are not in the current path.`,
      };
    const historyIsPrefix = result.game.history.every(
      (entry, index) => gameResult.game.history[index] === entry,
    );
    if (!historyIsPrefix)
      return {
        ok: false,
        error: `Checkpoint ${chapter} belongs to a different path.`,
      };
    checkpoints[chapter as ChapterNumber] = result.game;
  }
  return {
    ok: true,
    document: {
      kind: 'veilfall-browser-save',
      schemaVersion: SAVE_SCHEMA_VERSION,
      game: gameResult.game,
      checkpoints,
      readingPreference: readingValue as TextSizePreference,
    },
  };
}

export function createStoredSave(
  game: GameState,
  checkpoints: CheckpointMap,
  readingPreference: TextSizePreference,
): StoredSaveDocument {
  return {
    kind: 'veilfall-browser-save',
    schemaVersion: SAVE_SCHEMA_VERSION,
    game: normaliseGameState(game),
    checkpoints,
    readingPreference,
  };
}

export function validateStoredSave(value: unknown): ValidatedDocument {
  if (!isRecord(value))
    return { ok: false, error: 'The stored save is not an object.' };
  if (value.kind !== 'veilfall-browser-save')
    return { ok: false, error: 'The stored save has an unknown format.' };
  if (value.schemaVersion !== SAVE_SCHEMA_VERSION)
    return { ok: false, error: 'The stored save version is not supported.' };
  return validateDocumentParts(
    value.game,
    value.checkpoints,
    value.readingPreference,
  );
}

export function createPortableSave(
  document: StoredSaveDocument,
  exportedAt = new Date().toISOString(),
): PortableSave {
  return {
    format: EXPORT_FORMAT,
    exportVersion: EXPORT_VERSION,
    saveSchemaVersion: SAVE_SCHEMA_VERSION,
    gameTitle: 'Veilfall: The Ember Oath',
    buildVersion: BUILD_VERSION,
    exportedAt,
    game: document.game,
    checkpoints: document.checkpoints,
    readingPreference: document.readingPreference,
  };
}

export function parsePortableSave(
  text: string,
  byteLength = new TextEncoder().encode(text).byteLength,
):
  | { ok: true; document: StoredSaveDocument; summary: ImportSummary }
  | { ok: false; error: string } {
  if (byteLength > MAX_IMPORT_BYTES)
    return {
      ok: false,
      error: `That file is too large. Veilfall save files must be under ${Math.round(MAX_IMPORT_BYTES / 1_000_000)} MB.`,
    };
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return { ok: false, error: 'That file is not valid JSON.' };
  }
  if (!isRecord(value))
    return { ok: false, error: 'That file is not a save object.' };
  if (value.format !== EXPORT_FORMAT)
    return {
      ok: false,
      error: 'That JSON file is not a Veilfall save export.',
    };
  if (value.exportVersion !== EXPORT_VERSION)
    return {
      ok: false,
      error: 'That Veilfall export version is not supported.',
    };
  if (![16, SAVE_SCHEMA_VERSION].includes(Number(value.saveSchemaVersion)))
    return {
      ok: false,
      error: 'That save was made by an unsupported game version.',
    };
  if (
    typeof value.exportedAt !== 'string' ||
    !Number.isFinite(Date.parse(value.exportedAt))
  )
    return { ok: false, error: 'That save has an invalid export date.' };
  const result = validateDocumentParts(
    value.game,
    value.checkpoints,
    value.readingPreference,
  );
  if (!result.ok) return result;
  const definition = chapterDefinitions[result.document.game.chapter - 1];
  return {
    ok: true,
    document: result.document,
    summary: {
      chapter: result.document.game.chapter,
      chapterLabel: `Chapter ${definition.roman}: ${definition.title}`,
      completedChapters: result.document.game.completedChapters.length,
      checkpointCount: Object.keys(result.document.checkpoints).length,
      endingRecorded: result.document.game.flags.includes(
        'c12-series-complete',
      ),
      exportedAt: value.exportedAt,
    },
  };
}

export function exportFilename(game: GameState, date = new Date()) {
  const stamp = date.toISOString().slice(0, 10);
  return `veilfall-ember-oath-chapter-${game.chapter}-save-${stamp}.json`;
}

export function readReadingPreference(storage: StorageLike) {
  try {
    const value = storage.getItem(READING_PREFERENCE_KEY);
    return ['large', 'extra-large'].includes(String(value))
      ? (value as TextSizePreference)
      : 'default';
  } catch {
    return 'default';
  }
}

export function writeReadingPreference(
  storage: StorageLike,
  value: TextSizePreference,
): { ok: true } | { ok: false; error: string } {
  try {
    storage.setItem(READING_PREFERENCE_KEY, value);
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: 'Veilfall could not save the reading preference in this browser.',
    };
  }
}

export function readStoredSave(storage: StorageLike):
  | {
      ok: true;
      document: StoredSaveDocument | null;
      migrated: boolean;
      warnings: string[];
    }
  | { ok: false; error: string; damagedRaw?: string } {
  let currentRaw: string | null;
  try {
    currentRaw = storage.getItem(CURRENT_SAVE_KEY);
  } catch {
    return {
      ok: false,
      error:
        'Browser storage is unavailable. This session can still be exported.',
    };
  }
  if (currentRaw !== null) {
    try {
      const result = validateStoredSave(JSON.parse(currentRaw));
      return result.ok
        ? { ok: true, document: result.document, migrated: false, warnings: [] }
        : { ok: false, error: result.error, damagedRaw: currentRaw };
    } catch {
      return {
        ok: false,
        error: 'The browser save is damaged. It was left untouched.',
        damagedRaw: currentRaw,
      };
    }
  }

  let legacyRaw: string | null = null;
  try {
    for (const key of LEGACY_SAVE_KEYS) {
      legacyRaw = storage.getItem(key);
      if (legacyRaw !== null) break;
    }
  } catch {
    return {
      ok: false,
      error:
        'Browser storage is unavailable. This session can still be exported.',
    };
  }
  if (legacyRaw === null)
    return { ok: true, document: null, migrated: false, warnings: [] };

  let legacyValue: unknown;
  try {
    legacyValue = JSON.parse(legacyRaw);
  } catch {
    return {
      ok: false,
      error: 'The older browser save is damaged. It was left untouched.',
      damagedRaw: legacyRaw,
    };
  }
  if (!isRecord(legacyValue) || typeof legacyValue.nodeId !== 'string')
    return {
      ok: false,
      error:
        'The older browser save has an invalid structure. It was left untouched.',
      damagedRaw: legacyRaw,
    };

  const game = normaliseGameState(legacyValue as Partial<GameState>);
  const checkpoints: CheckpointMap = {};
  const warnings: string[] = [];
  const readingPreference = readReadingPreference(storage);
  for (const definition of chapterDefinitions.slice(1)) {
    const key = LEGACY_CHAPTER_START_KEYS[definition.number];
    if (!key) continue;
    try {
      const raw = storage.getItem(key);
      if (!raw) continue;
      const checkpoint = normaliseGameState(
        JSON.parse(raw) as Partial<GameState>,
      );
      if (
        checkpoint.chapter !== definition.number ||
        checkpoint.nodeId !== definition.entryNode ||
        checkpoint.chapterChoices !== 0
      ) {
        warnings.push(
          `Chapter ${definition.roman} replay checkpoint was invalid and was not migrated.`,
        );
        continue;
      }
      const candidate = validateDocumentParts(
        game,
        { [definition.number]: checkpoint },
        readingPreference,
      );
      if (!candidate.ok) {
        warnings.push(
          `Chapter ${definition.roman} replay checkpoint did not match the current path and was not migrated.`,
        );
        continue;
      }
      checkpoints[definition.number] = checkpoint;
    } catch {
      warnings.push(
        `Chapter ${definition.roman} replay checkpoint could not be read and was left untouched.`,
      );
    }
  }
  return {
    ok: true,
    document: createStoredSave(game, checkpoints, readingPreference),
    migrated: true,
    warnings,
  };
}

export function writeStoredSave(
  storage: StorageLike,
  document: StoredSaveDocument,
): { ok: true } | { ok: false; error: string } {
  try {
    storage.setItem(CURRENT_SAVE_KEY, JSON.stringify(document));
    return { ok: true };
  } catch {
    return {
      ok: false,
      error:
        'Veilfall could not write this save. Your current session is still open; export it before closing the page.',
    };
  }
}

export function replaceStoredSave(
  storage: StorageLike,
  next: StoredSaveDocument,
  current: StoredSaveDocument,
): { ok: true } | { ok: false; error: string } {
  try {
    storage.setItem(BACKUP_SAVE_KEY, JSON.stringify(current));
  } catch {
    return {
      ok: false,
      error:
        'Veilfall could not preserve a pre-import backup, so the import was cancelled.',
    };
  }
  try {
    storage.setItem(CURRENT_SAVE_KEY, JSON.stringify(next));
    return { ok: true };
  } catch {
    return {
      ok: false,
      error:
        'Veilfall could not replace the browser save. The existing save remains active and the import was cancelled.',
    };
  }
}

export function replaceDamagedStoredSave(
  storage: StorageLike,
  next: StoredSaveDocument,
  damagedRaw: string,
): { ok: true } | { ok: false; error: string } {
  try {
    storage.setItem(DAMAGED_SAVE_BACKUP_KEY, damagedRaw);
  } catch {
    return {
      ok: false,
      error:
        'Veilfall could not preserve the damaged data, so the recovery write was cancelled.',
    };
  }
  const writeResult = writeStoredSave(storage, next);
  if (!writeResult.ok)
    return {
      ok: false,
      error:
        'The damaged data was backed up, but Veilfall still could not save the current session. Export it before closing the page.',
    };
  return { ok: true };
}

export function readBackupSave(storage: StorageLike): ValidatedDocument | null {
  try {
    const raw = storage.getItem(BACKUP_SAVE_KEY);
    if (!raw) return null;
    return validateStoredSave(JSON.parse(raw));
  } catch {
    return null;
  }
}
