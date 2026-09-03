import type { BottleneckScore } from './types.js';

export function primaryBottleneck(scores: readonly BottleneckScore[]): BottleneckScore | null {
  return [...scores].sort((a, b) => a.rank - b.rank || a.workCenterId.localeCompare(b.workCenterId))[0] ?? null;
}

export function overloadedBottlenecks(scores: readonly BottleneckScore[], thresholdBasisPoints = 10_000): readonly BottleneckScore[] {
  return scores.filter((score) => score.loadBasisPoints >= thresholdBasisPoints).sort((a, b) => b.score - a.score);
}
