import test from 'node:test';
import assert from 'node:assert/strict';
import { MemoryResultStore, NamespacedResultStore, ReadThroughStore } from '../dist/index.js';

test('memory store preserves sequence and stable digest', async () => {
  const store = new MemoryResultStore();
  const first = await store.put('a', { value: 1 });
  const second = await store.put('b', { value: 2 });
  assert.equal(first.createdSequence, 1);
  assert.equal(second.createdSequence, 2);
  assert.equal((await store.list()).length, 2);
});

test('namespaced and read-through stores preserve logical keys', async () => {
  const primary = new MemoryResultStore();
  const cache = new MemoryResultStore();
  const namespaced = new NamespacedResultStore('plan', primary);
  await namespaced.put('x', { value: 1 });
  assert.equal((await namespaced.get('x')).key, 'x');
  const readThrough = new ReadThroughStore(primary, cache);
  await readThrough.put('plain', { value: 2 });
  assert.deepEqual((await readThrough.get('plain')).value, { value: 2 });
});
