import { readFile, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';

const roots = ['docs'];
const directFiles = ['app/game-data.ts', 'app/page.tsx', 'README.md'];
const forbidden = [
  { value: String.fromCharCode(45, 45), label: 'two adjacent hyphens' },
  { value: String.fromCharCode(8212), label: 'em dash punctuation' },
  { value: 'little did you know', label: 'stock suspense phrase' },
  { value: 'a testament to', label: 'stock praise phrase' },
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

const failures = [];
for (const file of files) {
  const text = await readFile(file, 'utf8');
  for (const rule of forbidden) {
    if (text.toLowerCase().includes(rule.value.toLowerCase())) {
      failures.push(`${file}: ${rule.label}`);
    }
  }
}

if (failures.length) {
  console.error('Story style check failed:');
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log(`Story style check passed for ${files.length} files.`);
