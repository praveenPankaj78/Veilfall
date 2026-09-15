import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { setTimeout as delay } from 'node:timers/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const buildDirectory = path.join(projectRoot, 'work', 'itch-build');
const port = Number(process.env.ITCH_PREVIEW_PORT ?? 4174);
const prefix = '/veilfall-beta/';
const chunkDelay = Number(process.env.ITCH_PREVIEW_CHUNK_DELAY_MS ?? 0);
const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
]);

function send(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end(body);
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', 'http://localhost');
    if (url.pathname === '/') {
      response.writeHead(302, { Location: prefix });
      response.end();
      return;
    }

    if (!url.pathname.startsWith(prefix)) {
      send(response, 404, 'Not found');
      return;
    }

    const relativePath = decodeURIComponent(url.pathname.slice(prefix.length));
    const requestedPath = relativePath || 'index.html';
    const absolutePath = path.resolve(buildDirectory, requestedPath);
    const safeRoot = `${path.resolve(buildDirectory)}${path.sep}`;

    if (!absolutePath.startsWith(safeRoot)) {
      send(response, 403, 'Forbidden');
      return;
    }

    const file = await stat(absolutePath);
    if (!file.isFile()) {
      send(response, 404, 'Not found');
      return;
    }

    response.writeHead(200, {
      'Content-Length': file.size,
      'Content-Type':
        contentTypes.get(path.extname(absolutePath).toLowerCase()) ??
        'application/octet-stream',
    });
    if (chunkDelay > 0) {
      for await (const chunk of createReadStream(absolutePath, {
        highWaterMark: 32768,
      })) {
        if (response.destroyed) break;
        response.write(chunk);
        await delay(chunkDelay);
      }
      response.end();
    } else {
      createReadStream(absolutePath).pipe(response);
    }
  } catch (error) {
    const status = error?.code === 'ENOENT' ? 404 : 500;
    send(response, status, status === 404 ? 'Not found' : 'Preview error');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Itch-style preview: http://127.0.0.1:${port}${prefix}`);
});
