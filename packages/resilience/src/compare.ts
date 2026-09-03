import type { ResilienceScore } from './types.js';

export interface ResilienceDelta {
  readonly scoreBasisPoints: number;
  readonly affectedOperations: number;
  readonly exposedMinutes: number;
}

export function compareResilience(left: ResilienceScore, right: ResilienceScore): ResilienceDelta {
  return {
    scoreBasisPoints: right.scoreBasisPoints - left.scoreBasisPoints,
    affectedOperations: right.affectedOperations - left.affectedOperations,
    exposedMinutes: right.exposedMinutes - left.exposedMinutes,
  };
}
