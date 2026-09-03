import type { Minute } from '@planforge/model';
import type { PlanningHorizon } from './types.js';

export function horizonBuckets(horizon: PlanningHorizon): readonly Minute[] {
  if (horizon.bucketMinutes <= 0 || horizon.end <= horizon.start) return [];
  const result: Minute[] = [];
  for (let minute = horizon.start as number; minute < horizon.end; minute += horizon.bucketMinutes) result.push(minute as Minute);
  return result;
}

export function bucketStart(horizon: PlanningHorizon, minute: Minute): Minute | null {
  if (minute < horizon.start || minute >= horizon.end || horizon.bucketMinutes <= 0) return null;
  const offset = Math.floor((minute - horizon.start) / horizon.bucketMinutes) * horizon.bucketMinutes;
  return (horizon.start + offset) as Minute;
}
