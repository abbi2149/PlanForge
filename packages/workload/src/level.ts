import type { Minute } from '@planforge/model';
import type { WorkloadBucket } from './types.js';

export function levelWorkload(buckets: readonly WorkloadBucket[]): readonly WorkloadBucket[] {
  const byCenter = new Map<string, WorkloadBucket[]>();
  for (const bucket of buckets) byCenter.set(bucket.workCenterId, [...(byCenter.get(bucket.workCenterId) ?? []), bucket]);
  const output: WorkloadBucket[] = [];
  for (const entries of byCenter.values()) {
    const total = entries.reduce((sum, entry) => sum + entry.requiredMinutes, 0);
    const base = Math.floor(total / Math.max(1, entries.length));
    let remainder = total - base * entries.length;
    for (const entry of [...entries].sort((a, b) => a.bucketStart - b.bucketStart)) {
      const required = base + (remainder > 0 ? 1 : 0);
      remainder = Math.max(0, remainder - 1);
      output.push({ ...entry, requiredMinutes: required as Minute });
    }
  }
  return output.sort((a, b) => a.workCenterId.localeCompare(b.workCenterId) || a.bucketStart - b.bucketStart);
}
