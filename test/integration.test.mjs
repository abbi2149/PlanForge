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

test('CLI explain attributes every minute of an order flow time', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'planforge-test-'));
  try {
    const input = path.join(root, 'factory.json');
    await writeFile(input, JSON.stringify(factoryFixture()), 'utf8');
    const { stdout } = await exec(
      process.execPath,
      ['bin/planforge.mjs', 'explain', input, '--order', 'ORD-2', '--compact'],
      { cwd: process.cwd() },
    );
    const { explanation } = JSON.parse(stdout);
    assert.equal(explanation.orderId, 'ORD-2');
    const attributed = Object.values(explanation.minutesByCause).reduce((sum, value) => sum + value, 0);
    assert.equal(attributed, explanation.flowMinutes);
    assert.ok(explanation.chain.length > 0);
    assert.deepEqual(
      explanation.chain.map((link) => link.operationId),
      ['CUT', 'ASSEMBLE'],
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('CLI explain summarises the whole plan when no order is given', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'planforge-test-'));
  try {
    const input = path.join(root, 'factory.json');
    await writeFile(input, JSON.stringify(factoryFixture()), 'utf8');
    const { stdout } = await exec(
      process.execPath,
      ['bin/planforge.mjs', 'explain', input, '--compact'],
      { cwd: process.cwd() },
    );
    const { plan, explanation } = JSON.parse(stdout);
    assert.equal(explanation.planDigest, plan.digest);
    assert.equal(explanation.orders.length, 2);
    assert.ok(explanation.waitShareBasisPoints >= 0 && explanation.waitShareBasisPoints <= 10_000);
    assert.deepEqual(explanation.blockingOrders.map((entry) => entry.orderId), ['ORD-1']);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('CLI explain reports an unknown order as a diagnostic', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'planforge-test-'));
  try {
    const input = path.join(root, 'factory.json');
    await writeFile(input, JSON.stringify(factoryFixture()), 'utf8');
    await assert.rejects(
      exec(process.execPath, ['bin/planforge.mjs', 'explain', input, '--order', 'ORD-404'], {
        cwd: process.cwd(),
      }),
      (error) => {
        assert.match(error.stderr, /CRITICAL_PATH_UNKNOWN_ORDER/);
        return true;
      },
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('CLI prints help without reading a factory document', async () => {
  const { stdout } = await exec(process.execPath, ['bin/planforge.mjs', '--help'], { cwd: process.cwd() });
  assert.match(stdout, /^PlanForge/);
  assert.match(stdout, /planforge compile <factory\.json>/);
});

test('CLI prints the workspace version', async () => {
  const manifest = JSON.parse(await readFile('package.json', 'utf8'));
  const { stdout } = await exec(process.execPath, ['bin/planforge.mjs', '--version'], { cwd: process.cwd() });
  assert.equal(stdout, `planforge ${manifest.version}\n`);
});

test('CLI analyze renders Markdown including the analysis section', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'planforge-test-'));
  try {
    const input = path.join(root, 'factory.json');
    await writeFile(input, JSON.stringify(factoryFixture()), 'utf8');
    const { stdout } = await exec(
      process.execPath,
      ['bin/planforge.mjs', 'analyze', input, '--format', 'markdown'],
      { cwd: process.cwd() },
    );
    assert.match(stdout, /^# Production plan North Cell/);
    assert.match(stdout, /## Analysis/);
    assert.match(stdout, /makespan/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('CLI compile can write a CSV report to a file', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'planforge-test-'));
  try {
    const input = path.join(root, 'factory.json');
    const output = path.join(root, 'plan.csv');
    await writeFile(input, JSON.stringify(factoryFixture()), 'utf8');
    await exec(process.execPath, ['bin/planforge.mjs', 'compile', input, '--format', 'csv', '--output', output], {
      cwd: process.cwd(),
    });
    const lines = (await readFile(output, 'utf8')).trimEnd().split('\n');
    assert.equal(lines[0].split(',')[0], 'section');
    assert.ok(lines.some((line) => line.startsWith('Operations,')));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('CLI rejects a report format for explain', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'planforge-test-'));
  try {
    const input = path.join(root, 'factory.json');
    await writeFile(input, JSON.stringify(factoryFixture()), 'utf8');
    await assert.rejects(
      exec(process.execPath, ['bin/planforge.mjs', 'explain', input, '--format', 'csv'], { cwd: process.cwd() }),
      (error) => {
        assert.equal(error.code, 2);
        assert.match(error.stderr, /only valid for compile and analyze/);
        return true;
      },
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
