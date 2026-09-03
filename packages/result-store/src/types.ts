export interface StoredResult<T> {
  readonly key: string;
  readonly digest: string;
  readonly createdSequence: number;
  readonly value: T;
}

export interface ResultStore<T> {
  put(key: string, value: T): Promise<StoredResult<T>>;
  get(key: string): Promise<StoredResult<T> | null>;
  list(): Promise<readonly StoredResult<T>[]>;
  delete(key: string): Promise<boolean>;
}
