import { failure, success, type ModelResult } from '@planforge/model';
import type { WorkloadBucket } from './types.js';

export function validateWorkload(buckets: readonly WorkloadBucket[]): ModelResult<readonly WorkloadBucket[]> {
  for (const bucket of buckets) {
    if (bucket.bucketEnd <= bucket.bucketStart || bucket.requiredMinutes < 0 || bucket.availableMinutes < 0) {
      return failure({ code: 'WORKLOAD_BUCKET', message: `invalid workload bucket ${bucket.workCenterId}` });
    }
  }
  return success([...buckets]);
}
