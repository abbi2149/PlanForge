import test from 'node:test';
import assert from 'node:assert/strict';
import { CLI_HELP, formatDiagnostics, parseCliArguments } from '../dist/index.js';

test('CLI parser accepts compile options', () => {
  const result = parseCliArguments(['compile', 'factory.json', '--dispatch', 'priority', '--compact']);
  assert.equal(result.ok, true);
  assert.deepEqual(result.value, { command: 'compile', inputPath: 'factory.json', dispatchRule: 'priority', pretty: false });
});

test('CLI parser rejects unknown options and formats diagnostics', () => {
  const result = parseCliArguments(['compile', 'factory.json', '--wat']);
  assert.equal(result.ok, false);
  assert.match(formatDiagnostics(result.diagnostics), /CLI_ARGUMENT/);
});

test('CLI parser accepts explain with a single order', () => {
  const result = parseCliArguments(['explain', 'factory.json', '--order', 'ORD-2']);
  assert.equal(result.ok, true);
  assert.deepEqual(result.value, {
    command: 'explain',
    inputPath: 'factory.json',
    orderId: 'ORD-2',
    pretty: true,
  });
});

test('CLI parser rejects --order outside explain', () => {
  const result = parseCliArguments(['analyze', 'factory.json', '--order', 'ORD-2']);
  assert.equal(result.ok, false);
  assert.match(formatDiagnostics(result.diagnostics), /--order is only valid for explain/);
});

test('CLI parser requires a value for --order', () => {
  const result = parseCliArguments(['explain', 'factory.json', '--order']);
  assert.equal(result.ok, false);
  assert.match(formatDiagnostics(result.diagnostics), /--order requires an order id/);
});

test('CLI help documents every command', () => {
  for (const command of ['validate', 'compile', 'analyze', 'explain']) {
    assert.match(CLI_HELP, new RegExp(`planforge ${command} `));
  }
});
