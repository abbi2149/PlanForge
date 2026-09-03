import type { ItemId, Quantity } from '@planforge/model';

export interface InventoryPolicy {
  readonly itemId: ItemId;
  readonly minimum: Quantity;
  readonly maximum: Quantity;
  readonly safety: Quantity;
  readonly reviewPeriods: number;
}

export interface InventoryPolicyStatus {
  readonly itemId: ItemId;
  readonly onHand: Quantity;
  readonly belowMinimum: boolean;
  readonly aboveMaximum: boolean;
  readonly safetyCoverageBasisPoints: number;
}
