import type { WorkloadBucket } from './types.js';
import { loadBasisPoints } from './load.js';

export function overloadedBuckets(buckets: readonly WorkloadBucket[], thresholdBasisPoints = 10_000): readonly WorkloadBucket[] {
  return buckets.filter((bucket) => loadBasisPoints(bucket) > thresholdBasisPoints).sort((a, b) => loadBasisPoints(b) - loadBasisPoints(a));
}
