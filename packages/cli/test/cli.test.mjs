import test from 'node:test';
import assert from 'node:assert/strict';
import { formatDiagnostics, parseCliArguments } from '../dist/index.js';

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
