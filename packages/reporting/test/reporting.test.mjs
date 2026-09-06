import test from 'node:test';
import assert from 'node:assert/strict';
import { rowsToCsv, reportToCsv, reportToMarkdown, operationTimelineSection } from '../dist/index.js';
import { simplePlan } from '../../../test/fixtures.mjs';

test('CSV escapes delimiters and newlines', () => {
  const csv = rowsToCsv([{ name: 'a,b', note: 'x\ny' }]);
  assert.equal(csv, 'name,note\n"a,b","x\ny"\n');
});

test('Markdown report and timeline expose public plan data', () => {
  const plan = simplePlan();
  const report = { title: 'Plan', plan: { name: plan.name, digest: plan.digest }, sections: [operationTimelineSection(plan)] };
  const markdown = reportToMarkdown(report);
  assert.match(markdown, /# Plan/);
  assert.match(markdown, /CUT-1/);
});

test('report CSV keeps every section in one document behind a section column', () => {
  const plan = simplePlan();
  const report = {
    title: 'Plan',
    plan: { name: plan.name, digest: plan.digest },
    sections: [
      { title: 'Summary', rows: [{ operations: 2 }] },
      { title: 'Empty', rows: [] },
      operationTimelineSection(plan),
    ],
  };
  const lines = reportToCsv(report).trimEnd().split('\n');
  assert.equal(lines[0].split(',')[0], 'section');
  assert.equal(lines[1].split(',')[0], 'Summary');
  assert.ok(lines.length > 2);
  assert.ok(lines.every((line) => line.split(',').length === lines[0].split(',').length));
  assert.ok(!lines.some((line) => line.startsWith('Empty,')));
});

test('report CSV is empty when no section carries rows', () => {
  assert.equal(reportToCsv({ title: 'Plan', plan: { name: 'p', digest: 'd' }, sections: [{ title: 'None', rows: [] }] }), '');
});
