import type { SlaEvaluation, SlaObservation, SlaPolicy } from './types.js';

export function evaluateSla(policy: SlaPolicy, observations: readonly SlaObservation[]): SlaEvaluation {
  if (observations.length === 0) {
    return { policyId: policy.id, compliant: true, onTimeBasisPoints: 10_000, averageLeadMinutes: 0, maximumLateMinutes: 0 };
  }
  const onTime = observations.filter((entry) => entry.completedMinute <= entry.promisedMinute).length;
  const onTimeBasisPoints = Math.round((onTime * 10_000) / observations.length);
  const leads = observations.map((entry) => entry.completedMinute - entry.releasedMinute);
  const lates = observations.map((entry) => Math.max(0, entry.completedMinute - entry.promisedMinute));
  const averageLeadMinutes = leads.reduce((a, b) => a + b, 0) / leads.length;
  const maximumLateMinutes = Math.max(0, ...lates);
  return {
    policyId: policy.id,
    compliant:
      onTimeBasisPoints >= policy.minimumOnTimeBasisPoints &&
      averageLeadMinutes <= policy.maximumLeadMinutes &&
      maximumLateMinutes <= policy.maximumLateMinutes,
    onTimeBasisPoints,
    averageLeadMinutes,
    maximumLateMinutes,
  };
}
