import http from 'node:http';
import net from 'node:net';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { RuntimeManager } from './runtime-manager.mjs';
import { toolRecipeMap, toolRecipes } from './tool-recipes.mjs';

const HOST = process.env.HATAALII_EXECUTION_HOST ?? '127.0.0.1';
const PORT = Number(process.env.HATAALII_EXECUTION_PORT ?? 4280);
const TOKEN = process.env.HATAALII_EXECUTION_TOKEN;
const VERSION = '2.0.0';
const STARTED_AT = Date.now();
const manager = new RuntimeManager({ recipes: toolRecipes });
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function commandExists(command) {
  const probe = process.platform === 'win32' ? 'where' : 'which';
  return spawnSync(probe, [command], { stdio: 'ignore' }).status === 0;
}

function capabilities() {
  const gpuProbe = process.platform === 'win32' ? commandExists('nvidia-smi') : commandExists('nvidia-smi') || commandExists('rocm-smi');
  return {
    docker: commandExists('docker'),
    git: commandExists('git'),
    node: commandExists('node'),
    python: commandExists('python') || commandExists('python3'),
    gpu: gpuProbe,
    blender: commandExists('blender'),
    godot: commandExists('godot') || commandExists('godot4'),
    ollama: commandExists('ollama'),
  };
}

function corsHeaders(origin = '*') {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function sendJson(res, status, value, origin) {
  const body = JSON.stringify(value);
  res.writeHead(status, {
    ...corsHeaders(origin),
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function sendError(res, status, error, origin) {
  sendJson(res, status, { error: error instanceof Error ? error.message : String(error) }, origin);
}

function isAuthorized(req, url) {
  if (!TOKEN) return true;
  const header = req.headers.authorization;
  if (header === `Bearer ${TOKEN}`) return true;
  return url.searchParams.get('access_token') === TOKEN;
}

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 1_000_000) throw new Error('Request body exceeds 1 MB');
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function embedTarget(url) {
  const match = url.pathname.match(/^\/embed\/([^/]+)(\/.*)?$/);
  if (!match) return null;
  const toolId = decodeURIComponent(match[1]);
  const tool = toolRecipeMap.get(toolId);
  const port = tool?.recipe?.uiPort ?? tool?.ports?.[0];
  if (!tool || !port) return null;
  return { toolId, port, path: `${match[2] ?? '/'}${url.search}` };
}

function proxyHttp(req, res, url, target) {
  const headers = { ...req.headers, host: `127.0.0.1:${target.port}` };
  delete headers.authorization;
  const upstream = http.request({
    hostname: '127.0.0.1',
    port: target.port,
    method: req.method,
    path: target.path,
    headers,
  }, upstreamResponse => {
    const responseHeaders = { ...upstreamResponse.headers };
    delete responseHeaders['x-frame-options'];
    delete responseHeaders['content-security-policy'];
    responseHeaders['access-control-allow-origin'] = req.headers.origin ?? '*';
    responseHeaders['cache-control'] ??= 'no-store';
    res.writeHead(upstreamResponse.statusCode ?? 502, responseHeaders);
    upstreamResponse.pipe(res);
  });
  upstream.on('error', error => sendError(res, 502, `Tool ${target.toolId} is not reachable: ${error.message}`, req.headers.origin));
  req.pipe(upstream);
}

async function apiHandler(req, res) {
  const origin = req.headers.origin ?? '*';
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? `${HOST}:${PORT}`}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders(origin));
    res.end();
    return;
  }

  if (!isAuthorized(req, url)) {
    sendError(res, 401, 'Unauthorized execution node request', origin);
    return;
  }

  const target = embedTarget(url);
  if (target) {
    proxyHttp(req, res, url, target);
    return;
  }

  try {
    if (req.method === 'GET' && url.pathname === '/health') {
      sendJson(res, 200, {
        ok: true,
        nodeId: process.env.HATAALII_NODE_ID ?? os.hostname(),
        version: VERSION,
        platform: `${process.platform}-${process.arch}`,
        uptimeSeconds: Math.round((Date.now() - STARTED_AT) / 1000),
      }, origin);
      return;
    }

    if (req.method === 'GET' && url.pathname === '/v1/capabilities') {
      sendJson(res, 200, capabilities(), origin);
      return;
    }

    if (req.method === 'GET' && url.pathname === '/v1/tools') {
      sendJson(res, 200, manager.list(), origin);
      return;
    }

    const toolMatch = url.pathname.match(/^\/v1\/tools\/([^/]+)(?:\/(install|start|stop|logs))?$/);
    if (toolMatch) {
      const toolId = decodeURIComponent(toolMatch[1]);
      const action = toolMatch[2];
      if (req.method === 'GET' && !action) return sendJson(res, 200, manager.status(toolId), origin);
      if (req.method === 'GET' && action === 'logs') return sendJson(res, 200, manager.logs(toolId), origin);
      if (req.method === 'POST' && action === 'install') return sendJson(res, 200, await manager.install(toolId), origin);
      if (req.method === 'POST' && action === 'start') return sendJson(res, 200, await manager.start(toolId), origin);
      if (req.method === 'POST' && action === 'stop') return sendJson(res, 200, await manager.stop(toolId), origin);
    }

    if (req.method === 'POST' && url.pathname === '/v1/jobs') {
      const body = await readJson(req);
      sendJson(res, 201, await manager.createJob(body), origin);
      return;
    }

    const jobMatch = url.pathname.match(/^\/v1\/jobs\/([^/]+)$/);
    if (req.method === 'GET' && jobMatch) {
      sendJson(res, 200, manager.job(decodeURIComponent(jobMatch[1])), origin);
      return;
    }

    if (req.method === 'GET' && url.pathname === '/v1/about') {
      sendJson(res, 200, { version: VERSION, dataDirectory: path.resolve(__dirname, '../.hataalii-runtime') }, origin);
      return;
    }

    sendError(res, 404, 'Execution node route not found', origin);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status = /Unknown tool|Unknown job/.test(message) ? 404 : 400;
    sendError(res, status, error, origin);
  }
}

const server = http.createServer((req, res) => {
  void apiHandler(req, res);
});

server.on('upgrade', (req, socket, head) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? `${HOST}:${PORT}`}`);
  if (!isAuthorized(req, url)) return socket.destroy();
  const target = embedTarget(url);
  if (!target) return socket.destroy();

  const upstream = net.connect(target.port, '127.0.0.1', () => {
    const headers = Object.entries(req.headers)
      .filter(([key]) => key.toLowerCase() !== 'authorization')
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
      .join('\r\n');
    upstream.write(`${req.method} ${target.path} HTTP/${req.httpVersion}\r\n${headers}\r\n\r\n`);
    if (head.length) upstream.write(head);
    socket.pipe(upstream).pipe(socket);
  });
  upstream.on('error', () => socket.destroy());
});

server.listen(PORT, HOST, () => {
  console.log(`HATAALII execution node ${VERSION} listening on http://${HOST}:${PORT}`);
  if (TOKEN) console.log('Bearer authentication enabled.');
  else console.log('Loopback mode without bearer authentication. Set HATAALII_EXECUTION_TOKEN before remote binding.');
});

const shutdown = () => server.close(() => process.exit(0));
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
