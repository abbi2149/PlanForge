import type { Quantity } from '@planforge/model';
import type { DemandBucket } from './types.js';

export function smoothDemand(buckets: readonly DemandBucket[], window: number): readonly DemandBucket[] {
  if (window <= 1) return [...buckets];
  const byItem = new Map<string, DemandBucket[]>();
  for (const bucket of buckets) byItem.set(bucket.itemId, [...(byItem.get(bucket.itemId) ?? []), bucket]);
  const output: DemandBucket[] = [];
  for (const [itemId, entries] of byItem) {
    const sorted = entries.sort((a, b) => a.bucket - b.bucket);
    for (let index = 0; index < sorted.length; index += 1) {
      const sample = sorted.slice(Math.max(0, index - window + 1), index + 1);
      const quantity = Math.round(sample.reduce((sum, entry) => sum + entry.quantity, 0) / sample.length) as Quantity;
      output.push({ itemId: itemId as DemandBucket['itemId'], bucket: sorted[index]!.bucket, quantity, sources: ['smoothed'] });
    }
  }
  return output.sort((a, b) => a.itemId.localeCompare(b.itemId) || a.bucket - b.bucket);
}
