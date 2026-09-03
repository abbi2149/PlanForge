import type { SlaObservation, SlaPolicy } from './types.js';

export function slaBreaches(policy: SlaPolicy, observations: readonly SlaObservation[]): readonly SlaObservation[] {
  return observations
    .filter((entry) =>
      entry.completedMinute - entry.releasedMinute > policy.maximumLeadMinutes ||
      entry.completedMinute - entry.promisedMinute > policy.maximumLateMinutes,
    )
    .sort((a, b) => (b.completedMinute - b.promisedMinute) - (a.completedMinute - a.promisedMinute) || a.reference.localeCompare(b.reference));
}
