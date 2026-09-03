import type { PurchaseRequirement } from '@planforge/procurement';
import type { PlannedRequirement } from './types.js';

export function purchaseRequirements(requirements: readonly PlannedRequirement[]): readonly PurchaseRequirement[] {
  return requirements
    .filter((entry) => entry.net > 0)
    .map((entry) => ({ itemId: entry.itemId, quantity: entry.net, needByMinute: entry.bucketStart }))
    .sort((a, b) => a.needByMinute - b.needByMinute || a.itemId.localeCompare(b.itemId));
}
