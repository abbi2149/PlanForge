import { failure, success, type ModelResult } from '@planforge/model';
import type { ScenarioPatch } from './types.js';

function clone(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((entry) => clone(entry));
  if (value === null || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, clone(entry)]));
}

export function applyScenarioPatches<T>(base: T, patches: readonly ScenarioPatch[]): ModelResult<T> {
  const output = clone(base) as Record<string, unknown>;
  for (const patch of patches) {
    const parts = patch.path.split('.').filter(Boolean);
    if (parts.length === 0) return failure({ code: 'SCENARIO_PATH', message: 'scenario patch path cannot be empty' });
    let cursor: Record<string, unknown> = output;
    for (const part of parts.slice(0, -1)) {
      const next = cursor[part];
      if (next === null || typeof next !== 'object' || Array.isArray(next)) {
        return failure({ code: 'SCENARIO_PATH', message: `scenario path ${patch.path} cannot be traversed` });
      }
      cursor = next as Record<string, unknown>;
    }
    cursor[parts.at(-1)!] = clone(patch.value);
  }
  return success(output as T);
}
