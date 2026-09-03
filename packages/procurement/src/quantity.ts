import type { Quantity } from '@planforge/model';
import type { SupplierOffer } from './types.js';

export function orderQuantity(required: Quantity, offer: SupplierOffer): Quantity {
  const minimum = Math.max(required, offer.minimumOrder);
  if (offer.orderMultiple <= 1) return minimum as Quantity;
  return (Math.ceil(minimum / offer.orderMultiple) * offer.orderMultiple) as Quantity;
}

export function excessQuantity(required: Quantity, offer: SupplierOffer): Quantity {
  return Math.max(0, orderQuantity(required, offer) - required) as Quantity;
}
