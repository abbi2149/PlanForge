import type { CycleObservation, CycleTimeResult } from './types.js';

export function calculateCycleTime(observations: readonly CycleObservation[], workCenterId: CycleTimeResult['workCenterId']): CycleTimeResult {
  const entries = observations.filter((entry) => entry.workCenterId === workCenterId);
  const targetHits = entries.filter((entry) => entry.cycleMinutes <= entry.targetMinutes).length;
  return {
    workCenterId,
    averageMinutes: entries.length === 0 ? 0 : entries.reduce((sum, entry) => sum + entry.cycleMinutes, 0) / entries.length,
    minimumMinutes: Math.min(...entries.map((entry) => entry.cycleMinutes), 0) as CycleTimeResult['minimumMinutes'],
    maximumMinutes: Math.max(...entries.map((entry) => entry.cycleMinutes), 0) as CycleTimeResult['maximumMinutes'],
    targetAdherenceBasisPoints: entries.length === 0 ? 0 : Math.round((targetHits * 10_000) / entries.length),
  };
}
