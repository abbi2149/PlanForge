import type { Minute, ProductionPlan } from '@planforge/model';
import { operationExposure } from './exposure.js';
import type { Disruption, ResilienceScore } from './types.js';

export function resilienceScore(plan: ProductionPlan, disruptions: readonly Disruption[]): ResilienceScore {
  const exposures = operationExposure(plan, disruptions);
  const exposedMinutes = exposures.reduce((sum, entry) => sum + entry.overlapMinutes, 0) as Minute;
  const severityWeightedMinutes = exposures.reduce((sum, entry) => sum + (entry.overlapMinutes * entry.severityBasisPoints) / 10_000, 0);
  const planMinutes = plan.operations.reduce((sum, operation) => sum + (operation.endMinute - operation.startMinute), 0);
  const penalty = planMinutes === 0 ? 0 : Math.min(10_000, Math.round((severityWeightedMinutes * 10_000) / planMinutes));
  return {
    planDigest: plan.digest,
    affectedOperations: exposures.length,
    exposedMinutes,
    severityWeightedMinutes,
    scoreBasisPoints: 10_000 - penalty,
  };
}
