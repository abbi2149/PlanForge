import test from 'node:test';
import assert from 'node:assert/strict';
import { capable, capabilityIndices, controlLimits, controlSignals, sampleSize } from '../dist/index.js';

test('capability indices identify centered capable processes', () => {
  const study = { mean: 10, standardDeviation: 0.5, lowerSpecification: 7, upperSpecification: 13 };
  assert.equal(capabilityIndices(study).cp, 2);
  assert.equal(capable(study), true);
});

test('sampling and control helpers are bounded', () => {
  assert.equal(sampleSize(100, 1000), 10);
  const limits = controlLimits([10, 10, 10, 10]);
  assert.deepEqual(controlSignals([10, 10, 15], limits).map((signal) => signal.reason), ['above-upper-limit']);
});
