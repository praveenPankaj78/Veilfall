import { readFile, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const roots = ['docs', 'app'];
const directFiles = [
  'app/adventure-revision.ts',
  'app/chapter-five.ts',
  'app/choice-economy.ts',
  'app/chapter-four.ts',
  'app/game-data.ts',
  'app/page.tsx',
  'app/story-memory.ts',
  'README.md',
];
const narratorShortcuts = [
  'You understand ',
  'You cannot know',
  'You hate the choice',
  'The scale settles inside you',
  'Your instincts search for the plan that saves everyone',
  'You cannot preserve every life, every proof, and every promise',
  'The choice is yours, and everyone can see it',
  'no law makes the choice simple',
  'Accepting power will be easier than teaching it to question you',
  'You came here wanting soldiers. The town offers work instead',
  'You feel every easy answer fail',
];
const opaqueHazardRules = [
  {
    pattern: /\bCount to \w+\.\s+On the .* beat\b/i,
    label: 'hazard timing does not say what is being counted',
  },
  {
    pattern: /\bmissing beat\b/i,
    label: 'hazard uses an unexplained missing beat',
  },
  {
    pattern: /\bread (?:its|their|the) rhythm\b/i,
    label: 'hazard replaces physical instructions with an unexplained rhythm',
  },
  {
    pattern: /\bmake a road out of timing\b/i,
    label: 'result replaces physical movement with an abstract timing metaphor',
  },
  {
    pattern: /\bdied or vanished\b/i,
    label: 'uncertain fate replaces the protagonist’s last confirmed sighting',
  },
  {
    pattern: /\bbrass throat\b/i,
    label: 'ordinary horn is described with an unexplained metaphor',
  },
  {
    pattern: /\bnarrow testimony protects its value\b/i,
    label: 'legal result is explained through an abstract judgment',
  },
  {
    pattern: /\bbinding the .* witness law\b/i,
    label: 'choice cost names a law instead of the physical rule being created',
  },
  {
    pattern: /\bVeyr may call\b/i,
    label: 'established homeland Thornweald is replaced by an unexplained name',
  },
  {
    pattern: /\bservant of the eraser\b/i,
    label: 'a direct human loss is hidden behind an unexplained enemy label',
  },
  {
    pattern: /\bspace between two closing hands\b/i,
    label: 'physical danger is replaced by an abstract travel metaphor',
  },
  {
    pattern: /\bthe two distances refuse to wait for each other\b/i,
    label:
      'a direct rescue conflict is hidden behind an abstract distance metaphor',
  },
  {
    pattern: /\bwood splits and someone cries your name\b/i,
    label: 'an endangered person’s fate is hidden behind an unnamed cry',
  },
  {
    pattern:
      /\bEvery lesson in field medicine gives you a different first patient\b/i,
    label: 'a concrete triage decision is hidden behind an abstract lesson',
  },
  {
    pattern:
      /\bHis story becomes iron, rope, and soldiers pulling in front of you\b/i,
    label: 'a visible road mechanism is replaced by an abstract transformation',
  },
  {
    pattern: /\bMaelin’s (?:cellar )?key\b/i,
    label: 'a choice assigns Maelin an item she never received',
  },
  {
    pattern: /\broad seal\b/i,
    label: 'route authority is renamed after its canonical introduction',
  },
];
const forbidden = [
  { value: String.fromCharCode(45, 45), label: 'two adjacent hyphens' },
  { value: String.fromCharCode(8212), label: 'em dash punctuation' },
  { value: 'little did you know', label: 'stock suspense phrase' },
  { value: 'a testament to', label: 'stock praise phrase' },
];
const archaicWords = [
  'thou',
  'thee',
  'thy',
  'thine',
  'hath',
  'doth',
  'dost',
  'wherefore',
  'whilst',
  'amongst',
  'shall',
  'ere',
];

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(path)));
    if (entry.isFile() && ['.md', '.ts', '.tsx'].includes(extname(entry.name)))
      files.push(path);
  }
  return files;
}

const files = [...directFiles];
for (const root of roots) files.push(...(await collect(root)));
const uniqueFiles = [...new Set(files)];
const narrationFiles = uniqueFiles.filter((file) => file.startsWith('app'));
const storySourceFiles = [
  'app/game-data.ts',
  'app/adventure-revision.ts',
  'app/chapter-four.ts',
  'app/chapter-five.ts',
  'app/chapter-six.ts',
  'app/chapter-seven.ts',
  'app/chapter-eight.ts',
  'app/story-memory.ts',
];
const maximumStorySentenceWords = 30;
const maximumRenderedParagraphWords = 180;

const failures = [];
for (const file of uniqueFiles) {
  const text = await readFile(file, 'utf8');
  for (const rule of forbidden) {
    if (text.toLowerCase().includes(rule.value.toLowerCase())) {
      failures.push(`${file}: ${rule.label}`);
    }
  }
  for (const word of archaicWords) {
    if (new RegExp(`\\b${word}\\b`, 'i').test(text)) {
      failures.push(`${file}: archaic word "${word}"`);
    }
  }
}

for (const file of narrationFiles) {
  const source = await readFile(file, 'utf8');
  for (const phrase of narratorShortcuts) {
    if (source.includes(phrase))
      failures.push(
        `${file}: narrator interprets for the player with "${phrase}"`,
      );
  }
  for (const rule of opaqueHazardRules) {
    if (rule.pattern.test(source)) failures.push(`${file}: ${rule.label}`);
  }
}

for (const file of storySourceFiles) {
  const source = await readFile(file, 'utf8');
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
  );
  const visit = (node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const sentences = node.text.split(/[.!?][”"']?(?:\s+|$)/);
      for (const sentence of sentences) {
        const words = sentence.match(/[A-Za-z]+(?:[’'][A-Za-z]+)*/g) ?? [];
        if (words.length > maximumStorySentenceWords) {
          const line =
            sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile))
              .line + 1;
          failures.push(
            `${file}:${line}: story sentence has ${words.length} words; maximum is ${maximumStorySentenceWords}`,
          );
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
}

const compilerOptions = {
  module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.ES2022,
};

async function loadStoryModule(path) {
  const source = await readFile(path, 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions }).outputText;
  const exported = {};
  vm.runInNewContext(
    compiled,
    {
      exports: exported,
      module: { exports: exported },
      console,
    },
    { filename: path.replace(/\.ts$/, '.js') },
  );
  return exported;
}

const adventureExports = await loadStoryModule('app/adventure-revision.ts');
const economyExports = await loadStoryModule('app/choice-economy.ts');
const chapterFourExports = await loadStoryModule('app/chapter-four.ts');
const chapterFiveExports = await loadStoryModule('app/chapter-five.ts');
const chapterSixExports = await loadStoryModule('app/chapter-six.ts');
const chapterSevenExports = await loadStoryModule('app/chapter-seven.ts');
const chapterEightExports = await loadStoryModule('app/chapter-eight.ts');
const gameDataSource = await readFile('app/game-data.ts', 'utf8');
const gameDataCompiled = ts.transpileModule(gameDataSource, {
  compilerOptions,
}).outputText;
const gameDataExports = {};
vm.runInNewContext(
  gameDataCompiled,
  {
    exports: gameDataExports,
    module: { exports: gameDataExports },
    console,
    require: (specifier) => {
      if (specifier === './adventure-revision') return adventureExports;
      if (specifier === './choice-economy') return economyExports;
      if (specifier === './chapter-four') return chapterFourExports;
      if (specifier === './chapter-five') return chapterFiveExports;
      if (specifier === './chapter-six') return chapterSixExports;
      if (specifier === './chapter-seven') return chapterSevenExports;
      if (specifier === './chapter-eight') return chapterEightExports;
      throw new Error(`Unexpected module in story style check: ${specifier}`);
    },
  },
  { filename: 'game-data.js' },
);

const { initialState, nodes } = gameDataExports;
const producedFlags = [
  ...new Set(
    Object.values(nodes)
      .flatMap((node) => node.choices)
      .flatMap((choice) => choice.addFlags ?? []),
  ),
];
const highStats = Object.fromEntries(
  Object.keys(initialState.stats).map((stat) => [stat, 20]),
);
const renderBase = {
  ...initialState,
  stats: highStats,
  relationships: Object.fromEntries(
    Object.entries(initialState.relationships).map(([person, relationship]) => [
      person,
      {
        ...relationship,
        trust: 9,
        attraction: 9,
        respect: 9,
        friction: 0,
        intent: 'unresolved',
      },
    ]),
  ),
};
const chapterEightRenderStates = [
  {
    ...renderBase,
    chapter: 8,
    flags: [
      'c5-freed-vaor',
      'c6-voluntary-ember-disclosure',
      'c6-red-moot-alliance',
      'c7-gained-full-army',
      'c7-original-orders-safe',
      'c8-deployed-all-forts',
    ],
  },
  {
    ...renderBase,
    chapter: 8,
    flags: [
      'c5-took-ember-by-force',
      'c6-delayed-ember-disclosure',
      'c6-red-moot-neutral',
      'c7-gained-dangerous-reputation',
      'c7-company-storm-losses',
      'c7-lost-gate-supplies',
      'c7-lost-fast-horses',
      'c8-deployed-mobile-force',
      'c8-sacrificed-first-fort',
      'c8-living-copy-of-openings',
    ],
  },
  {
    ...renderBase,
    chapter: 8,
    flags: [
      'c5-vaor-pact',
      'c6-red-moot-war',
      'c6-preserved-ancestor-voices',
      'c7-gained-chosen-company',
      'c7-front-rank-saw-original',
      'c8-deployed-strongpoints',
      'c8-accepted-ash-compact',
      'c8-ember-held-as-collateral',
      'c8-vaor-approved-contract-use',
    ],
    relationships: {
      ...renderBase.relationships,
      mara: { ...renderBase.relationships.mara, intent: 'committed' },
    },
  },
];
const renderedOutputs = new Set();

function countWords(text) {
  return (text.match(/[A-Za-z]+(?:[’'][A-Za-z]+)*/g) ?? []).length;
}

function checkRenderedParagraph(nodeId, paragraph) {
  const key = `${nodeId}\u0000${paragraph}`;
  if (renderedOutputs.has(key)) return;
  renderedOutputs.add(key);
  const paragraphWords = countWords(paragraph);
  if (paragraphWords > maximumRenderedParagraphWords) {
    failures.push(
      `${nodeId}: rendered paragraph has ${paragraphWords} words; maximum is ${maximumRenderedParagraphWords}`,
    );
  }
  for (const sentence of paragraph.split(/[.!?][”"']?(?:\s+|$)/)) {
    const sentenceWords = countWords(sentence);
    if (sentenceWords > maximumStorySentenceWords) {
      failures.push(
        `${nodeId}: rendered sentence has ${sentenceWords} words; maximum is ${maximumStorySentenceWords}`,
      );
    }
  }
}

for (const node of Object.values(nodes)) {
  const chapter = Number(node.id.match(/^c(\d+)-/)?.[1] ?? 1);
  const baseState = { ...renderBase, chapter, nodeId: node.id, flags: [] };
  const samples = [
    baseState,
    ...producedFlags.map((flag) => ({ ...baseState, flags: [flag] })),
  ];
  if (chapter === 8)
    samples.push(
      ...chapterEightRenderStates.map((state) => ({
        ...state,
        nodeId: node.id,
      })),
    );
  for (const state of samples) {
    for (const paragraph of node.body(state))
      checkRenderedParagraph(node.id, paragraph);
  }
}

for (const [nodeId, node] of Object.entries(nodes).filter(([id]) =>
  id.startsWith('c8-'),
)) {
  for (const state of chapterEightRenderStates) {
    const activeWords = node
      .body({ ...state, nodeId })
      .reduce((sum, paragraph) => sum + countWords(paragraph), 0);
    const maximum = [
      'c8-mara-watch',
      'c8-lysara-watch',
      'c8-quiet-watch',
    ].includes(nodeId)
      ? 240
      : 180;
    if (activeWords > maximum) {
      failures.push(
        `${nodeId}: rendered active block has ${activeWords} words; maximum is ${maximum}`,
      );
    }
  }
}

const pageSource = await readFile('app/page.tsx', 'utf8');
if (
  pageSource.includes('className="consequence"') ||
  pageSource.includes('<span>Consequence</span>')
) {
  failures.push(
    'app/page.tsx: choice result is separated into a receipt style consequence box',
  );
}
if (pageSource.includes('className="choice-prompt"')) {
  failures.push(
    'app/page.tsx: generic choice prompt interrupts the final story beat',
  );
}
if (!pageSource.includes('<b>Expected advantage</b>')) {
  failures.push(
    'app/page.tsx: choice benefits must be presented as expected rather than guaranteed',
  );
}
if (
  /Trust \{game\.relationships|Attraction \{game\.relationships|Future intimate scenes|Detailed, adults only/.test(
    pageSource,
  )
) {
  failures.push(
    'app/page.tsx: relationship scores or unused adult content controls remain visible to the player',
  );
}
if (!pageSource.includes('relationshipSummary(game.relationships[person])')) {
  failures.push(
    'app/page.tsx: relationships are not presented as qualitative states',
  );
}
if (
  !pageSource.includes(
    "return ilyraKnown ? ['mara', 'lysara', 'ilyra'] : ['mara', 'lysara'];",
  )
) {
  failures.push(
    'app/page.tsx: Ilyra relationship state is visible before the player meets her',
  );
}
const lessonPosition = pageSource.indexOf('{node.lesson && (');
const prosePosition = pageSource.indexOf('<div className="prose">');
if (
  lessonPosition === -1 ||
  prosePosition === -1 ||
  lessonPosition > prosePosition
) {
  failures.push(
    'app/page.tsx: essential lesson must appear before active scene prose',
  );
}
const resultPosition = pageSource.indexOf(
  '{lastResult && <p>{lastResult}</p>}',
);
if (resultPosition === -1 || resultPosition < prosePosition) {
  failures.push(
    'app/page.tsx: immediate choice result must flow into the next scene as prose',
  );
}

if (failures.length) {
  console.error('Story style check failed:');
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log(
  `Story style check passed for ${uniqueFiles.length} files and ${renderedOutputs.size} rendered scene paragraphs.`,
);
