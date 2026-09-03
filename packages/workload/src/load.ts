import type { WorkloadBucket, WorkloadSummary } from './types.js';

export function loadBasisPoints(bucket: WorkloadBucket): number {
  return bucket.availableMinutes === 0
    ? (bucket.requiredMinutes > 0 ? 100_000 : 0)
    : Math.round((bucket.requiredMinutes * 10_000) / bucket.availableMinutes);
}

export function summarizeWorkload(buckets: readonly WorkloadBucket[], workCenterId: WorkloadSummary['workCenterId']): WorkloadSummary {
  const relevant = buckets.filter((bucket) => bucket.workCenterId === workCenterId);
  const loads = relevant.map(loadBasisPoints);
  return {
    workCenterId,
    peakLoadBasisPoints: Math.max(0, ...loads),
    averageLoadBasisPoints: loads.length === 0 ? 0 : Math.round(loads.reduce((a, b) => a + b, 0) / loads.length),
    overloadedBuckets: loads.filter((load) => load > 10_000).length,
  };
}
