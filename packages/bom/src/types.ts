import type { ItemId, Quantity } from '@planforge/model';

export interface BomComponent {
  readonly itemId: ItemId;
  readonly quantityPer: Quantity;
  readonly scrapBasisPoints: number;
}

export interface BillOfMaterial {
  readonly itemId: ItemId;
  readonly components: readonly BomComponent[];
}

export interface MaterialRequirement {
  readonly itemId: ItemId;
  readonly quantity: Quantity;
  readonly level: number;
  readonly parentItemId: ItemId;
}
