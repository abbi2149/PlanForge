import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CLI_HELP,
  formatDiagnostics,
  formatPlanReport,
  inputFileDiagnostic,
  parseCliArguments,
  withAnalysisSection,
} from '../dist/index.js';

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

test('CLI parser accepts compare with a candidate rule', () => {
  const result = parseCliArguments(['compare', 'factory.json', '--dispatch', 'priority', '--against', 'earliest-due']);
  assert.equal(result.ok, true);
  assert.deepEqual(result.value, {
    command: 'compare',
    inputPath: 'factory.json',
    dispatchRule: 'priority',
    againstRule: 'earliest-due',
    format: 'json',
    pretty: true,
  });
});

test('CLI parser requires --against for compare and rejects it elsewhere', () => {
  const missing = parseCliArguments(['compare', 'factory.json']);
  assert.equal(missing.ok, false);
  assert.match(formatDiagnostics(missing.diagnostics), /compare requires --against <rule>/);

  const misplaced = parseCliArguments(['compile', 'factory.json', '--against', 'priority']);
  assert.equal(misplaced.ok, false);
  assert.match(formatDiagnostics(misplaced.diagnostics), /--against is only valid for compare/);
});

test('CLI parser rejects an invalid candidate rule', () => {
  const result = parseCliArguments(['compare', 'factory.json', '--against', 'longest-first']);
  assert.equal(result.ok, false);
  assert.match(formatDiagnostics(result.diagnostics), /--against has an invalid rule/);
});

test('CLI parser accepts --strict-materials on planning commands', () => {
  for (const command of ['compile', 'analyze', 'explain']) {
    const result = parseCliArguments([command, 'factory.json', '--strict-materials']);
    assert.equal(result.ok, true);
    assert.equal(result.value.strictMaterials, true);
  }
});

test('CLI parser omits strictMaterials when the flag is absent', () => {
  const result = parseCliArguments(['compile', 'factory.json']);
  assert.equal(result.ok, true);
  assert.equal('strictMaterials' in result.value, false);
});

test('CLI parser rejects --strict-materials where no plan is compiled', () => {
  for (const command of ['validate', 'compare']) {
    const argv = command === 'compare' ? [command, 'factory.json', '--against', 'priority'] : [command, 'factory.json'];
    const result = parseCliArguments([...argv, '--strict-materials']);
    assert.equal(result.ok, false);
    assert.match(formatDiagnostics(result.diagnostics), /--strict-materials is only valid for compile, analyze, and explain/);
  }
});

test('CLI reports an unreadable input path as a diagnostic', () => {
  const diagnostic = inputFileDiagnostic('factory.json', Object.assign(new Error('ENOENT: no such file'), { code: 'ENOENT' }));
  assert.equal(diagnostic.code, 'CLI_INPUT_READ');
  assert.equal(diagnostic.path, 'factory.json');
  assert.match(formatDiagnostics([diagnostic]), /CLI_INPUT_READ: input cannot be read: .*\[factory\.json\]/);
});

test('CLI reports malformed JSON separately from an unreadable file', () => {
  let thrown;
  try {
    JSON.parse('{');
  } catch (error) {
    thrown = error;
  }
  const diagnostic = inputFileDiagnostic('factory.json', thrown);
  assert.equal(diagnostic.code, 'CLI_INPUT_JSON');
  assert.match(diagnostic.message, /^input is not valid JSON: /);
});

test('CLI help documents material handling and exit codes', () => {
  assert.match(CLI_HELP, /--strict-materials/);
  assert.match(CLI_HELP, /Exit codes:/);
});

test('CLI parser accepts rank without a dispatch rule', () => {
  const result = parseCliArguments(['rank', 'factory.json', '--compact']);
  assert.equal(result.ok, true);
  assert.deepEqual(result.value, { command: 'rank', inputPath: 'factory.json', format: 'json', pretty: false });
});

test('CLI parser rejects --dispatch on rank', () => {
  const result = parseCliArguments(['rank', 'factory.json', '--dispatch', 'priority']);
  assert.equal(result.ok, false);
  assert.match(formatDiagnostics(result.diagnostics), /--dispatch is not valid for rank/);
});

test('CLI parser keeps report formats away from rank', () => {
  const result = parseCliArguments(['rank', 'factory.json', '--format', 'markdown']);
  assert.equal(result.ok, false);
  assert.match(formatDiagnostics(result.diagnostics), /only valid for compile and analyze/);
});

test('CLI help documents the rank command', () => {
  assert.match(CLI_HELP, /planforge rank <factory\.json>/);
  assert.match(CLI_HELP, /Rank compiles the model under every dispatch rule/);
});
