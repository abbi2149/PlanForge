import type { Quantity } from '@planforge/model';
import type { DemandBucket } from './types.js';

export interface SupplyBucket {
  readonly itemId: string;
  readonly bucket: number;
  readonly quantity: Quantity;
}

export interface NetDemandBucket extends DemandBucket {
  readonly supply: Quantity;
  readonly netQuantity: Quantity;
}

export function netDemand(demand: readonly DemandBucket[], supply: readonly SupplyBucket[]): readonly NetDemandBucket[] {
  const byKey = new Map(supply.map((entry) => [`${entry.itemId}\u0000${entry.bucket}`, entry.quantity]));
  return demand.map((entry) => {
    const available = byKey.get(`${entry.itemId}\u0000${entry.bucket}`) ?? (0 as Quantity);
    return { ...entry, supply: available, netQuantity: Math.max(0, entry.quantity - available) as Quantity };
  });
}
