import type { Minute } from '@planforge/model';
import type { BottleneckScore } from './types.js';

export function recommendedBufferMinutes(score: BottleneckScore, baseMinutes: Minute): Minute {
  const pressure = Math.max(0, score.score - 10_000);
  return Math.ceil(baseMinutes * (1 + pressure / 10_000)) as Minute;
}

export function protectiveCapacityBasisPoints(score: BottleneckScore): number {
  return Math.min(5_000, Math.max(0, score.loadBasisPoints - 8_500));
}
