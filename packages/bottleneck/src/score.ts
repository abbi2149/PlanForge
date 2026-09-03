import type { BottleneckObservation, BottleneckScore } from './types.js';

export function bottleneckScores(observations: readonly BottleneckObservation[]): readonly BottleneckScore[] {
  return observations
    .map((entry) => {
      const loadBasisPoints = entry.availableMinutes === 0 ? 10_000 : Math.round((entry.requiredMinutes * 10_000) / entry.availableMinutes);
      const queueBasisPoints = entry.availableMinutes === 0 ? 10_000 : Math.round((entry.queueMinutes * 10_000) / entry.availableMinutes);
      return {
        workCenterId: entry.workCenterId,
        loadBasisPoints,
        queueBasisPoints,
        score: loadBasisPoints + Math.round(queueBasisPoints / 2),
        rank: 0,
      };
    })
    .sort((a, b) => b.score - a.score || a.workCenterId.localeCompare(b.workCenterId))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}
