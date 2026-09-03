import type { ItemId, MoneyMinor, Quantity, WorkCenterId } from '@planforge/model';

export interface ScrapEvent {
  readonly itemId: ItemId;
  readonly workCenterId: WorkCenterId;
  readonly quantity: Quantity;
  readonly reason: string;
  readonly unitCostMinor: MoneyMinor;
}

export interface ScrapSummary {
  readonly itemId: ItemId;
  readonly quantity: Quantity;
  readonly costMinor: MoneyMinor;
  readonly reasons: Readonly<Record<string, Quantity>>;
}
