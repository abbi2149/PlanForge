export interface Diagnostic {
  readonly code: string;
  readonly message: string;
  readonly path?: string;
  readonly details?: Readonly<Record<string, string | number | boolean>>;
}

export interface ModelSuccess<T> {
  readonly ok: true;
  readonly value: T;
  readonly diagnostics: readonly Diagnostic[];
}

export interface ModelFailure {
  readonly ok: false;
  readonly diagnostics: readonly Diagnostic[];
}

export type ModelResult<T> = ModelSuccess<T> | ModelFailure;

export function success<T>(value: T, diagnostics: readonly Diagnostic[] = []): ModelSuccess<T> {
  return { ok: true, value, diagnostics: [...diagnostics] };
}

export function failure(...diagnostics: readonly Diagnostic[]): ModelFailure {
  return { ok: false, diagnostics: [...diagnostics] };
}

export function mapResult<A, B>(result: ModelResult<A>, map: (value: A) => B): ModelResult<B> {
  if (!result.ok) return result;
  return success(map(result.value), result.diagnostics);
}

export function flatMapResult<A, B>(
  result: ModelResult<A>,
  map: (value: A) => ModelResult<B>,
): ModelResult<B> {
  if (!result.ok) return result;
  const next = map(result.value);
  return next.ok
    ? success(next.value, [...result.diagnostics, ...next.diagnostics])
    : failure(...result.diagnostics, ...next.diagnostics);
}

export function collectResults<T>(results: readonly ModelResult<T>[]): ModelResult<readonly T[]> {
  const values: T[] = [];
  const diagnostics: Diagnostic[] = [];
  for (const result of results) {
    diagnostics.push(...result.diagnostics);
    if (result.ok) values.push(result.value);
  }
  if (values.length !== results.length) return failure(...diagnostics);
  return success(values, diagnostics);
}
