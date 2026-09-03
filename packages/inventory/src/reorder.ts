import type { ItemId, Minute, Quantity } from '@planforge/model';

export interface ReorderPolicy {
  readonly itemId: ItemId;
  readonly leadTimeMinutes: Minute;
  readonly reviewPeriodMinutes: Minute;
  readonly safetyStock: Quantity;
  readonly minimumOrderQuantity: Quantity;
  readonly orderMultiple: Quantity;
}

export interface ReorderRecommendation {
  readonly itemId: ItemId;
  readonly reorderPoint: Quantity;
  readonly targetQuantity: Quantity;
  readonly projectedAvailable: Quantity;
  readonly recommendedOrder: Quantity;
}

function roundOrder(quantity: number, minimum: Quantity, multiple: Quantity): Quantity {
  if (quantity <= 0) return 0 as Quantity;
  const bounded = Math.max(quantity, minimum);
  if (multiple <= 1) return Math.ceil(bounded) as Quantity;
  return (Math.ceil(bounded / multiple) * multiple) as Quantity;
}

export function reorderRecommendation(
  policy: ReorderPolicy,
  averageDemandPerMinute: number,
  projectedAvailable: Quantity,
): ReorderRecommendation {
  const leadDemand = Math.ceil(Math.max(0, averageDemandPerMinute) * policy.leadTimeMinutes);
  const reviewDemand = Math.ceil(Math.max(0, averageDemandPerMinute) * policy.reviewPeriodMinutes);
  const reorderPoint = (leadDemand + policy.safetyStock) as Quantity;
  const targetQuantity = (leadDemand + reviewDemand + policy.safetyStock) as Quantity;
  const shortage = Math.max(0, targetQuantity - projectedAvailable);
  return {
    itemId: policy.itemId,
    reorderPoint,
    targetQuantity,
    projectedAvailable,
    recommendedOrder:
      projectedAvailable <= reorderPoint
        ? roundOrder(shortage, policy.minimumOrderQuantity, policy.orderMultiple)
        : (0 as Quantity),
  };
}

export function validateReorderPolicy(policy: ReorderPolicy): boolean {
  return (
    policy.leadTimeMinutes >= 0 &&
    policy.reviewPeriodMinutes >= 0 &&
    policy.safetyStock >= 0 &&
    policy.minimumOrderQuantity >= 0 &&
    policy.orderMultiple > 0
  );
}
