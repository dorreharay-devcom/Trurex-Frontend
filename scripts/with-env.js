#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const [, , envFile, ...command] = process.argv;

if (!envFile || command.length === 0) {
  console.error('Usage: node scripts/with-env.js <env-file> <command> [...args]');
  process.exit(1);
}

const envPath = path.resolve(process.cwd(), envFile);

if (!fs.existsSync(envPath)) {
  console.error(`Env file not found: ${envFile}`);
  process.exit(1);
}

const env = fs
  .readFileSync(envPath, 'utf8')
  .split(/\r?\n/)
  .reduce((acc, rawLine) => {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) return acc;

    const normalized = line.startsWith('export ') ? line.slice(7).trim() : line;
    const eq = normalized.indexOf('=');
    if (eq <= 0) return acc;

    const key = normalized.slice(0, eq).trim();
    const rawValue = normalized.slice(eq + 1).trim();
    const value = rawValue.replace(/^(['"])(.*)\1$/, '$2');

    acc[key] = value;
    return acc;
  }, {});

const child = spawn(command[0], command.slice(1), {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: { ...process.env, ...env },
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
