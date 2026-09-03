import type { ItemId, LotId, Minute, Quantity } from '@planforge/model';

export interface MaterialTrace {
  readonly lotId: LotId;
  readonly itemId: ItemId;
  readonly quantity: Quantity;
  readonly sourceReference: string;
}

export interface ProductionTrace {
  readonly orderId: string;
  readonly operationId: string;
  readonly minute: Minute;
  readonly inputs: readonly MaterialTrace[];
  readonly outputs: readonly MaterialTrace[];
}

export interface LotGenealogy {
  readonly lotId: LotId;
  readonly ancestors: readonly LotId[];
  readonly descendants: readonly LotId[];
}
