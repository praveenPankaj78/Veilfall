import { readFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// Follow runtime imports, including overlays, instead of maintaining a second
// chapter file list. Type-only imports disappear during transpilation.
export function loadStory() {
  const modules = new Map();
  const sources = new Map();
  function load(file) {
    const path = resolve(file);
    if (modules.has(path)) return modules.get(path).exports;
    if (path.endsWith('.json')) {
      const value = JSON.parse(readFileSync(path, 'utf8'));
      const jsonModule = {
        exports: { ...value, default: value, __esModule: true },
      };
      modules.set(path, jsonModule);
      return jsonModule.exports;
    }
    const source = readFileSync(path, 'utf8');
    sources.set(relative(process.cwd(), path).replaceAll('\\', '/'), source);
    const storyModule = { exports: {} };
    modules.set(path, storyModule);
    const compiled = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText;
    vm.runInNewContext(
      compiled,
      {
        module: storyModule,
        exports: storyModule.exports,
        console,
        TextDecoder,
        TextEncoder,
        structuredClone,
        require(specifier) {
          if (!specifier.startsWith('.'))
            throw new Error(`Unexpected story dependency: ${specifier}`);
          return load(
            resolve(
              dirname(path),
              specifier.endsWith('.json') ? specifier : `${specifier}.ts`,
            ),
          );
        },
      },
      { filename: path },
    );
    return storyModule.exports;
  }
  const game = load('app/game-data.ts');
  const memory = load('app/story-memory.ts');
  return { game, memory, sources, load };
}
