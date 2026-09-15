import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

const fromProjectRoot = (path: string) =>
  fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  root: fromProjectRoot('./itch'),
  base: './',
  publicDir: fromProjectRoot('./public'),
  resolve: {
    alias: {
      '@': fromProjectRoot('./'),
      'next/image': fromProjectRoot('./itch/next-image.tsx'),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  plugins: [
    react(),
    {
      name: 'veilfall-download-progress',
      transformIndexHtml: {
        order: 'post',
        handler(html, context) {
          if (!context.bundle) return html;
          const files = Object.values(context.bundle).filter(
            (file) => file.type === 'chunk' || file.fileName.endsWith('.css'),
          );
          for (const file of files) {
            if (
              file.type === 'chunk' &&
              (file.imports.length || file.dynamicImports.length)
            )
              throw new Error(
                'The progress loader requires one self-contained game script.',
              );
          }
          const manifest = files.map((file) => ({
            url: `./${file.fileName}`,
            bytes: Buffer.byteLength(
              file.type === 'chunk' ? file.code : file.source,
            ),
            type: file.type === 'chunk' ? 'script' : 'style',
          }));
          const loader = readFileSync(
            fromProjectRoot('./itch/loader.js'),
            'utf8',
          );
          return html
            .replace(
              /<script type="module"[^>]*src="[^"]+"[^>]*><\/script>/g,
              '',
            )
            .replace(/<link[^>]*rel="(?:stylesheet|modulepreload)"[^>]*>/g, '')
            .replace(
              '</body>',
              `<script>window.veilfallDownloads=${JSON.stringify(manifest)};</script><script>${loader}</script></body>`,
            );
        },
      },
    },
  ],
  build: {
    outDir: fromProjectRoot('./work/itch-build'),
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: false,
  },
});
