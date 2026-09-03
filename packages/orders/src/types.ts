import type { DemandOrder, ItemId, Minute, OrderId, Quantity } from '@planforge/model';

export interface OrderLineInput {
  readonly id: OrderId;
  readonly itemId: ItemId;
  readonly quantity: Quantity;
  readonly releaseMinute: Minute;
  readonly dueMinute: Minute;
  readonly priority?: number;
  readonly customer?: string;
  readonly tags?: readonly string[];
}

export interface OrderGroup {
  readonly key: string;
  readonly orders: readonly DemandOrder[];
  readonly totalQuantity: Quantity;
}

export interface OrderWindow {
  readonly earliestRelease: Minute;
  readonly latestDue: Minute;
}
