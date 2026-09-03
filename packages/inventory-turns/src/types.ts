import type { ItemId, MoneyMinor } from '@planforge/model';

export interface InventoryValuationPoint {
  readonly itemId: ItemId;
  readonly period: number;
  readonly inventoryMinor: MoneyMinor;
  readonly costOfGoodsMinor: MoneyMinor;
}

export interface InventoryTurnResult {
  readonly itemId: ItemId;
  readonly periods: number;
  readonly averageInventoryMinor: number;
  readonly costOfGoodsMinor: MoneyMinor;
  readonly turns: number;
  readonly daysOnHand: number;
}
