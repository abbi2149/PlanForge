import type { ItemId, Quantity } from '@planforge/model';

export interface MaterialYieldInput {
  readonly itemId: ItemId;
  readonly inputQuantity: Quantity;
  readonly goodQuantity: Quantity;
  readonly reworkQuantity: Quantity;
  readonly scrapQuantity: Quantity;
}

export interface MaterialYieldResult {
  readonly itemId: ItemId;
  readonly firstPassBasisPoints: number;
  readonly finalYieldBasisPoints: number;
  readonly scrapBasisPoints: number;
  readonly accountedQuantity: Quantity;
}
