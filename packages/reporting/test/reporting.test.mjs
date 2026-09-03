import test from 'node:test';
import assert from 'node:assert/strict';
import { rowsToCsv, reportToMarkdown, operationTimelineSection } from '../dist/index.js';
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
