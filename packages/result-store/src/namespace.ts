import type { ResultStore, StoredResult } from './types.js';

export class NamespacedResultStore<T> implements ResultStore<T> {
  readonly #prefix: string;
  readonly #inner: ResultStore<T>;

  constructor(prefix: string, inner: ResultStore<T>) {
    if (prefix.length === 0) throw new RangeError('namespace prefix cannot be empty');
    this.#prefix = `${prefix}:`;
    this.#inner = inner;
  }

  async put(key: string, value: T): Promise<StoredResult<T>> {
    const stored = await this.#inner.put(this.#prefix + key, value);
    return { ...stored, key };
  }

  async get(key: string): Promise<StoredResult<T> | null> {
    const stored = await this.#inner.get(this.#prefix + key);
    return stored ? { ...stored, key } : null;
  }

  async list(): Promise<readonly StoredResult<T>[]> {
    return (await this.#inner.list())
      .filter((entry) => entry.key.startsWith(this.#prefix))
      .map((entry) => ({ ...entry, key: entry.key.slice(this.#prefix.length) }));
  }

  async delete(key: string): Promise<boolean> {
    return this.#inner.delete(this.#prefix + key);
  }
}
