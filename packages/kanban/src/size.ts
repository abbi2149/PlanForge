import type { Quantity } from '@planforge/model';
import type { KanbanPolicy, KanbanSizing } from './types.js';

export function sizeKanban(policy: KanbanPolicy): KanbanSizing {
  const leadDemand = policy.demandPerPeriod * policy.leadPeriods;
  const protectedQuantity = Math.ceil((leadDemand * (10_000 + policy.safetyBasisPoints)) / 10_000) as Quantity;
  const cards = policy.containerQuantity <= 0 ? 0 : Math.ceil(protectedQuantity / policy.containerQuantity);
  return { itemId: policy.itemId, cards, protectedQuantity };
}
