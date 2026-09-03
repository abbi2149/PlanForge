import type { ItemId, LotId, Minute, Quantity } from '@planforge/model';

export interface StorageLocation {
  readonly id: string;
  readonly zone: string;
  readonly capacityUnits: Quantity;
  readonly allowedItems?: readonly ItemId[];
}

export interface StoredLot {
  readonly lotId: LotId;
  readonly itemId: ItemId;
  readonly locationId: string;
  readonly quantity: Quantity;
  readonly storedMinute: Minute;
}

export interface WarehouseMove {
  readonly lotId: LotId;
  readonly fromLocationId: string;
  readonly toLocationId: string;
  readonly quantity: Quantity;
  readonly minute: Minute;
}

export interface LocationUtilization {
  readonly locationId: string;
  readonly used: Quantity;
  readonly capacity: Quantity;
  readonly utilizationBasisPoints: number;
}
