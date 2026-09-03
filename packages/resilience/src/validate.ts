import { failure, success, type ModelResult } from '@planforge/model';
import type { Disruption } from './types.js';

export function validateDisruptions(disruptions: readonly Disruption[]): ModelResult<readonly Disruption[]> {
  const ids = new Set<string>();
  for (const disruption of disruptions) {
    if (disruption.id.length === 0 || ids.has(disruption.id) || disruption.end <= disruption.start) {
      return failure({ code: 'RESILIENCE_DISRUPTION', message: `invalid disruption ${disruption.id}` });
    }
    ids.add(disruption.id);
    if (disruption.severityBasisPoints < 0 || disruption.severityBasisPoints > 10_000) {
      return failure({ code: 'RESILIENCE_SEVERITY', message: `invalid severity for ${disruption.id}` });
    }
  }
  return success([...disruptions]);
}
