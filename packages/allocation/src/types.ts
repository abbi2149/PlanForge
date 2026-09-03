import type { ItemId, Quantity } from '@planforge/model';

export interface SupplyPool {
  readonly itemId: ItemId;
  readonly quantity: Quantity;
  readonly source: string;
  readonly priority: number;
}

export interface AllocationRequest {
  readonly requestId: string;
  readonly itemId: ItemId;
  readonly quantity: Quantity;
  readonly priority: number;
}

export interface AllocationLine {
  readonly requestId: string;
  readonly source: string;
  readonly quantity: Quantity;
}

export interface AllocationResult {
  readonly lines: readonly AllocationLine[];
  readonly unfilled: Readonly<Record<string, Quantity>>;
}
