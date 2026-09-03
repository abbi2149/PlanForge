import type { Quantity } from '@planforge/model';
import type { DemandBucket, DemandSignal } from './types.js';

export function bucketDemand(signals: readonly DemandSignal[], bucketMinutes: number): readonly DemandBucket[] {
  if (!Number.isSafeInteger(bucketMinutes) || bucketMinutes <= 0) return [];
  const grouped = new Map<string, { quantity: number; sources: Set<string> }>();
  for (const signal of signals) {
    const bucket = Math.floor(signal.minute / bucketMinutes);
    const key = `${signal.itemId}\u0000${bucket}`;
    const current = grouped.get(key) ?? { quantity: 0, sources: new Set<string>() };
    current.quantity += signal.quantity;
    current.sources.add(signal.source);
    grouped.set(key, current);
  }
  return [...grouped.entries()]
    .map(([key, value]) => {
      const [itemId, bucket] = key.split('\u0000');
      return {
        itemId: itemId as DemandBucket['itemId'],
        bucket: Number(bucket),
        quantity: value.quantity as Quantity,
        sources: [...value.sources].sort(),
      };
    })
    .sort((a, b) => a.itemId.localeCompare(b.itemId) || a.bucket - b.bucket);
}
