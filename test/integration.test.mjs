import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { factoryFixture } from './fixtures.mjs';

const exec = promisify(execFile);

test('CLI validates a factory JSON document', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'planforge-test-'));
  try {
    const input = path.join(root, 'factory.json');
    await writeFile(input, JSON.stringify(factoryFixture()), 'utf8');
    const { stdout } = await exec(process.execPath, ['bin/planforge.mjs', 'validate', input], { cwd: process.cwd() });
    assert.deepEqual(JSON.parse(stdout), { ok: true, name: 'North Cell' });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('CLI compile can write deterministic output to a file', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'planforge-test-'));
  try {
    const input = path.join(root, 'factory.json');
    const output = path.join(root, 'plan.json');
    await writeFile(input, JSON.stringify(factoryFixture()), 'utf8');
    await exec(process.execPath, ['bin/planforge.mjs', 'compile', input, '--output', output, '--compact'], { cwd: process.cwd() });
    const parsed = JSON.parse(await readFile(output, 'utf8'));
    assert.equal(parsed.plan.name, 'North Cell');
    assert.match(parsed.plan.digest, /^[0-9a-f]{64}$/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
