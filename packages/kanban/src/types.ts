import type { ItemId, Quantity } from '@planforge/model';

export interface KanbanPolicy {
  readonly itemId: ItemId;
  readonly demandPerPeriod: Quantity;
  readonly leadPeriods: number;
  readonly safetyBasisPoints: number;
  readonly containerQuantity: Quantity;
}

export interface KanbanCard {
  readonly id: string;
  readonly itemId: ItemId;
  readonly containerQuantity: Quantity;
  readonly status: 'available' | 'consumed' | 'replenishing';
}

export interface KanbanSizing {
  readonly itemId: ItemId;
  readonly cards: number;
  readonly protectedQuantity: Quantity;
}
