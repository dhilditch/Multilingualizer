import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { DATA_ROOT } from './lib/paths.mjs';

const requested = process.argv[2];
if (!requested) throw new Error('Usage: node customer-intelligence/capture-source.mjs <data/customer-intelligence/file.json>');
const destination = path.resolve(requested);
const allowedRoot = `${path.resolve(DATA_ROOT)}${path.sep}`;
if (!destination.startsWith(allowedRoot)) throw new Error(`Destination must be below ${DATA_ROOT}`);

let input = Buffer.alloc(0);
let expectedBytes = null;
let finished = false;

function finishIfComplete() {
  if (finished) return;
  const newline = input.indexOf(0x0a);
  if (expectedBytes === null) {
    if (newline === -1) return;
    const lengthText = input.subarray(0, newline).toString('ascii');
    if (!/^\d+$/.test(lengthText)) throw new Error('Input must start with a decimal byte length');
    expectedBytes = Number(lengthText);
    input = input.subarray(newline + 1);
  }
  if (input.length < expectedBytes) return;
  if (input.length > expectedBytes) throw new Error('Input contains bytes after the declared JSON payload');

  const payload = JSON.parse(input.toString('utf8'));
  if (!Array.isArray(payload.columns) || !Array.isArray(payload.rows)) {
    throw new Error('Input is not an SQL MCP result');
  }
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, `${JSON.stringify(payload)}\n`, { encoding: 'utf8', mode: 0o600 });
  console.log(`Saved ${payload.rows.length} private source rows to ${destination}`);
  finished = true;
  process.stdin.pause();
}

process.stdin.on('data', (chunk) => {
  input = Buffer.concat([input, chunk]);
  finishIfComplete();
});
process.stdin.on('end', () => {
  finishIfComplete();
  if (!finished) throw new Error('Input ended before the declared JSON payload was complete');
});
