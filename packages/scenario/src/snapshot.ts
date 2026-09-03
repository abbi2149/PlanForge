import { digestOf, type ModelResult, success } from '@planforge/model';
import { applyScenarioPatches } from './patch.js';
import type { ScenarioDefinition, ScenarioSnapshot } from './types.js';

export function createScenarioSnapshot<T>(base: T, definition: ScenarioDefinition): ModelResult<ScenarioSnapshot<T>> {
  const applied = applyScenarioPatches(base, definition.patches);
  if (!applied.ok) return applied;
  const digest = digestOf({ id: definition.id, name: definition.name, value: applied.value });
  return success({ id: definition.id, name: definition.name, digest, value: applied.value });
}
