import { digestOf } from '@planforge/model';
import type { ResultStore, StoredResult } from './types.js';

export class MemoryResultStore<T> implements ResultStore<T> {
  readonly #entries = new Map<string, StoredResult<T>>();
  #sequence = 0;

  async put(key: string, value: T): Promise<StoredResult<T>> {
    if (key.length === 0) throw new RangeError('result key cannot be empty');
    const entry: StoredResult<T> = { key, digest: digestOf(value), createdSequence: ++this.#sequence, value };
    this.#entries.set(key, entry);
    return entry;
  }

  async get(key: string): Promise<StoredResult<T> | null> {
    return this.#entries.get(key) ?? null;
  }

  async list(): Promise<readonly StoredResult<T>[]> {
    return [...this.#entries.values()].sort((a, b) => a.createdSequence - b.createdSequence || a.key.localeCompare(b.key));
  }

  async delete(key: string): Promise<boolean> {
    return this.#entries.delete(key);
  }
}
