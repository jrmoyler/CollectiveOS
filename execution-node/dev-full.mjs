import { spawn } from 'node:child_process';

const processes = [
  spawn(process.execPath, ['execution-node/server.mjs'], { stdio: 'inherit', env: process.env }),
  spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'dev'], { stdio: 'inherit', env: process.env }),
];

let closing = false;
function shutdown(code = 0) {
  if (closing) return;
  closing = true;
  for (const child of processes) {
    if (!child.killed) child.kill('SIGTERM');
  }
  setTimeout(() => process.exit(code), 250);
}

for (const child of processes) {
  child.on('exit', code => {
    if (!closing && code && code !== 0) shutdown(code);
  });
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
