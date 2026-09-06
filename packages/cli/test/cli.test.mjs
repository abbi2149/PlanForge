import test from 'node:test';
import assert from 'node:assert/strict';
import { CLI_HELP, formatDiagnostics, formatPlanReport, parseCliArguments, withAnalysisSection } from '../dist/index.js';

test('CLI parser accepts compile options', () => {
  const result = parseCliArguments(['compile', 'factory.json', '--dispatch', 'priority', '--compact']);
  assert.equal(result.ok, true);
  assert.deepEqual(result.value, { command: 'compile', inputPath: 'factory.json', dispatchRule: 'priority', format: 'json', pretty: false });
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
    format: 'json',
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

test('CLI parser resolves help aliases before any other argument', () => {
  for (const argv of [['help'], ['--help'], ['-h'], ['compile', 'factory.json', '--help']]) {
    const result = parseCliArguments(argv);
    assert.equal(result.ok, true);
    assert.deepEqual(result.value, { command: 'help' });
  }
});

test('CLI parser resolves version aliases', () => {
  for (const argv of [['version'], ['--version'], ['-v']]) {
    const result = parseCliArguments(argv);
    assert.equal(result.ok, true);
    assert.deepEqual(result.value, { command: 'version' });
  }
});

test('CLI parser still rejects an unknown command', () => {
  const result = parseCliArguments(['deploy', 'factory.json']);
  assert.equal(result.ok, false);
  assert.match(formatDiagnostics(result.diagnostics), /CLI_COMMAND/);
});

test('CLI help documents the help and version commands', () => {
  for (const command of ['help', 'version']) {
    assert.match(CLI_HELP, new RegExp(`planforge ${command}`));
  }
  assert.match(CLI_HELP, /--version, -v/);
});

test('CLI parser accepts every documented output format', () => {
  for (const format of ['json', 'csv', 'markdown']) {
    const result = parseCliArguments(['analyze', 'factory.json', '--format', format]);
    assert.equal(result.ok, true);
    assert.equal(result.value.format, format);
  }
});

test('CLI parser rejects an unknown or missing format', () => {
  for (const argv of [['compile', 'factory.json', '--format', 'yaml'], ['compile', 'factory.json', '--format']]) {
    const result = parseCliArguments(argv);
    assert.equal(result.ok, false);
    assert.match(formatDiagnostics(result.diagnostics), /--format must be json, csv, or markdown/);
  }
});

test('CLI parser restricts report formats to commands that build a report', () => {
  for (const command of ['validate', 'explain']) {
    const result = parseCliArguments([command, 'factory.json', '--format', 'csv']);
    assert.equal(result.ok, false);
    assert.match(formatDiagnostics(result.diagnostics), /only valid for compile and analyze/);
  }
});

test('CLI renders a plan report in each format', () => {
  const report = {
    title: 'Plan',
    plan: { name: 'North Cell', digest: 'abc' },
    sections: [{ title: 'Summary', rows: [{ operations: 2 }] }],
  };
  assert.match(formatPlanReport(report, 'markdown', true), /^# Plan/);
  assert.match(formatPlanReport(report, 'csv', true), /^section,operations\n/);
  assert.deepEqual(JSON.parse(formatPlanReport(report, 'json', true)), report);
});

test('CLI analysis section carries schedule metrics into report output', () => {
  const report = { title: 'Plan', plan: { name: 'North Cell', digest: 'abc' }, sections: [] };
  const analysis = {
    schedule: { makespan: 120, completedOrders: 2 },
    bottlenecks: ['WC-1', 'WC-2'],
    maintenanceConflicts: 0,
  };
  const [section] = withAnalysisSection(report, analysis).sections;
  assert.equal(section.title, 'Analysis');
  assert.deepEqual(section.rows, [{ makespan: 120, completedOrders: 2, bottlenecks: 'WC-1 WC-2', maintenanceConflicts: 0 }]);
});
