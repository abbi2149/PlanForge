import type { BillOfMaterial } from '@planforge/bom';
import type { DemandPoint } from '@planforge/forecasting';
import type { DemandOrder, ItemId, Minute, Quantity } from '@planforge/model';
import type { PurchaseRequirement } from '@planforge/procurement';

export interface PlanningHorizon {
  readonly start: Minute;
  readonly end: Minute;
  readonly bucketMinutes: Minute;
}

export interface PlannedRequirement {
  readonly itemId: ItemId;
  readonly bucketStart: Minute;
  readonly gross: Quantity;
  readonly projectedAvailable: Quantity;
  readonly net: Quantity;
}

export interface MaterialPlan {
  readonly horizon: PlanningHorizon;
  readonly requirements: readonly PlannedRequirement[];
  readonly purchases: readonly PurchaseRequirement[];
}

export interface PlanningInput {
  readonly horizon: PlanningHorizon;
  readonly orders: readonly DemandOrder[];
  readonly boms: readonly BillOfMaterial[];
  readonly openingInventory: Readonly<Record<string, Quantity>>;
  readonly forecasts?: readonly DemandPoint[];
}
