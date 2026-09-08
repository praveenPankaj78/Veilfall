import { readFile, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';

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
    if (entry.isFile() && ['.md', '.ts', '.tsx'].includes(extname(entry.name))) files.push(path);
  }
  return files;
}

const files = [...directFiles];
for (const root of roots) files.push(...(await collect(root)));
const uniqueFiles = [...new Set(files)];
const narrationFiles = uniqueFiles.filter((file) => file.startsWith('app'));

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
    if (source.includes(phrase)) failures.push(`${file}: narrator interprets for the player with "${phrase}"`);
  }
}

const pageSource = await readFile('app/page.tsx', 'utf8');
if (pageSource.includes('className="consequence"') || pageSource.includes('<span>Consequence</span>')) {
  failures.push('app/page.tsx: choice result is separated into a receipt style consequence box');
}
if (pageSource.includes('className="choice-prompt"')) {
  failures.push('app/page.tsx: generic choice prompt interrupts the final story beat');
}
if (!pageSource.includes('<b>Expected advantage</b>')) {
  failures.push('app/page.tsx: choice benefits must be presented as expected rather than guaranteed');
}
const lessonPosition = pageSource.indexOf('{node.lesson && (');
const prosePosition = pageSource.indexOf('<div className="prose">');
if (lessonPosition === -1 || prosePosition === -1 || lessonPosition > prosePosition) {
  failures.push('app/page.tsx: essential lesson must appear before active scene prose');
}
const resultPosition = pageSource.indexOf('{lastResult && <p>{lastResult}</p>}');
if (resultPosition === -1 || resultPosition < prosePosition) {
  failures.push('app/page.tsx: immediate choice result must flow into the next scene as prose');
}

if (failures.length) {
  console.error('Story style check failed:');
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log(`Story style check passed for ${uniqueFiles.length} files.`);
