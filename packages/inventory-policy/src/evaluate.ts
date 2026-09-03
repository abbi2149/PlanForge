import type { Quantity } from '@planforge/model';
import type { InventoryPolicy, InventoryPolicyStatus } from './types.js';

export function evaluateInventoryPolicy(policy: InventoryPolicy, onHand: Quantity): InventoryPolicyStatus {
  return {
    itemId: policy.itemId,
    onHand,
    belowMinimum: onHand < policy.minimum,
    aboveMaximum: onHand > policy.maximum,
    safetyCoverageBasisPoints: policy.safety === 0 ? 10_000 : Math.min(10_000, Math.round((onHand * 10_000) / policy.safety)),
  };
}
