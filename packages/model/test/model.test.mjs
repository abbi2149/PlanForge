import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canonicalJson,
  digestOf,
  mean,
  median,
  percentile,
  summarizeDistribution,
  workCenterId,
  minute,
  basisPoints,
  mergeRanges,
} from '../dist/index.js';

test('canonical JSON sorts object keys recursively', () => {
  assert.equal(canonicalJson({ z: 1, a: { y: 2, b: 3 } }), '{"a":{"b":3,"y":2},"z":1}');
});

test('digest is stable across equivalent object ordering', () => {
  assert.equal(digestOf({ b: 2, a: 1 }), digestOf({ a: 1, b: 2 }));
  assert.match(digestOf({ a: 1 }), /^[0-9a-f]{64}$/);
});

test('logical identifiers and branded units reject malformed values', () => {
  assert.equal(workCenterId('CUT-1').ok, true);
  assert.equal(workCenterId(' cut ').ok, false);
  assert.equal(minute(-1).ok, false);
  assert.equal(basisPoints(10_001).ok, false);
});

test('range merging is deterministic', () => {
  assert.deepEqual(mergeRanges([{ start: 10, end: 20 }, { start: 0, end: 5 }, { start: 5, end: 12 }]), [
    { start: 0, end: 20 },
  ]);
});

test('statistics helpers summarize small distributions', () => {
  assert.equal(mean([1, 2, 3, 4]), 2.5);
  assert.equal(median([4, 1, 3, 2]), 2.5);
  assert.equal(percentile([0, 10], 90), 9);
  assert.deepEqual(summarizeDistribution([]), {
    count: 0, minimum: 0, maximum: 0, mean: 0, median: 0, p90: 0, p95: 0,
  });
});
