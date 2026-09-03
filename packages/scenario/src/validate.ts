import { failure, success, type ModelResult } from '@planforge/model';
import type { ScenarioDefinition } from './types.js';

export function validateScenario(definition: ScenarioDefinition): ModelResult<ScenarioDefinition> {
  if (definition.name.length === 0) return failure({ code: 'SCENARIO_NAME', message: 'scenario name cannot be empty' });
  const paths = new Set<string>();
  for (const patch of definition.patches) {
    if (paths.has(patch.path)) return failure({ code: 'SCENARIO_DUPLICATE_PATH', message: `scenario repeats ${patch.path}` });
    paths.add(patch.path);
  }
  return success(definition);
}
