import { explodeBom } from '@planforge/bom';
import type { ItemId, Quantity } from '@planforge/model';
import { bucketStart } from './buckets.js';
import type { PlanningInput, PlannedRequirement } from './types.js';

export function grossRequirements(input: PlanningInput): readonly PlannedRequirement[] {
  const grouped = new Map<string, number>();
  for (const order of input.orders) {
    const bucket = bucketStart(input.horizon, order.releaseMinute);
    if (bucket === null) continue;
    for (const requirement of explodeBom(input.boms, order.itemId, order.quantity)) {
      const key = `${requirement.itemId}\u0000${bucket}`;
      grouped.set(key, (grouped.get(key) ?? 0) + requirement.quantity);
    }
  }
  return [...grouped.entries()]
    .map(([key, gross]) => {
      const [itemId, bucket] = key.split('\u0000');
      return {
        itemId: itemId as ItemId,
        bucketStart: Number(bucket) as PlannedRequirement['bucketStart'],
        gross: gross as Quantity,
        projectedAvailable: 0 as Quantity,
        net: gross as Quantity,
      };
    })
    .sort((a, b) => a.bucketStart - b.bucketStart || a.itemId.localeCompare(b.itemId));
}
