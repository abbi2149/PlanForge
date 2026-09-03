import { failure, success, type ModelResult } from '@planforge/model';
import type { ValueStreamMap } from './types.js';

export function validateValueStream(map: ValueStreamMap): ModelResult<ValueStreamMap> {
  if (map.name.length === 0 || map.steps.length === 0) {
    return failure({ code: 'VALUE_STREAM_MAP', message: 'value stream needs a name and at least one step' });
  }
  const ids = new Set<string>();
  for (const step of map.steps) {
    if (step.id.length === 0 || ids.has(step.id)) {
      return failure({ code: 'VALUE_STREAM_STEP', message: `invalid or duplicate step ${step.id}` });
    }
    ids.add(step.id);
    if (
      step.processMinutes < 0 ||
      step.waitMinutes < 0 ||
      step.inventoryUnits < 0 ||
      step.firstPassYieldBasisPoints < 0 ||
      step.firstPassYieldBasisPoints > 10_000
    ) {
      return failure({ code: 'VALUE_STREAM_STEP', message: `step ${step.id} has invalid metrics` });
    }
  }
  return success(map);
}
