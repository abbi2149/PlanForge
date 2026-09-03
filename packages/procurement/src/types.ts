import type { ItemId, Minute, MoneyMinor, Quantity } from '@planforge/model';

export interface SupplierOffer {
  readonly supplierId: string;
  readonly itemId: ItemId;
  readonly minimumOrder: Quantity;
  readonly orderMultiple: Quantity;
  readonly leadMinutes: Minute;
  readonly unitCostMinor: MoneyMinor;
  readonly reliabilityBasisPoints: number;
}

export interface PurchaseRequirement {
  readonly itemId: ItemId;
  readonly quantity: Quantity;
  readonly needByMinute: Minute;
}

export interface PurchaseOrderLine {
  readonly supplierId: string;
  readonly itemId: ItemId;
  readonly quantity: Quantity;
  readonly orderMinute: Minute;
  readonly expectedMinute: Minute;
  readonly unitCostMinor: MoneyMinor;
}

export interface ProcurementPlan {
  readonly lines: readonly PurchaseOrderLine[];
  readonly uncovered: readonly PurchaseRequirement[];
  readonly totalCostMinor: MoneyMinor;
}
