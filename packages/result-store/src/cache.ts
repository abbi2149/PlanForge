import type { ResultStore, StoredResult } from './types.js';

export class ReadThroughStore<T> implements ResultStore<T> {
  readonly #primary: ResultStore<T>;
  readonly #cache: ResultStore<T>;

  constructor(primary: ResultStore<T>, cache: ResultStore<T>) {
    this.#primary = primary;
    this.#cache = cache;
  }

  async put(key: string, value: T): Promise<StoredResult<T>> {
    const stored = await this.#primary.put(key, value);
    await this.#cache.put(key, value);
    return stored;
  }

  async get(key: string): Promise<StoredResult<T> | null> {
    const cached = await this.#cache.get(key);
    if (cached) return cached;
    const stored = await this.#primary.get(key);
    if (stored) await this.#cache.put(key, stored.value);
    return stored;
  }

  async list(): Promise<readonly StoredResult<T>[]> {
    return this.#primary.list();
  }

  async delete(key: string): Promise<boolean> {
    await this.#cache.delete(key);
    return this.#primary.delete(key);
  }
}
