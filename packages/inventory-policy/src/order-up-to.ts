import type { Quantity } from '@planforge/model';
import type { InventoryPolicy } from './types.js';

export function orderUpToQuantity(policy: InventoryPolicy, onHand: Quantity, onOrder: Quantity = 0 as Quantity): Quantity {
  const position = onHand + onOrder;
  return Math.max(0, policy.maximum - position) as Quantity;
}

export function reviewDue(period: number, policy: InventoryPolicy): boolean {
  return policy.reviewPeriods > 0 && period % policy.reviewPeriods === 0;
}
