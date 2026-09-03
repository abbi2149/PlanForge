import type { Quantity } from '@planforge/model';
import type { ReleasedOrder } from './types.js';

export function releasedWip(released: readonly ReleasedOrder[]): Quantity {
  return released.reduce((sum, entry) => sum + entry.order.quantity, 0) as Quantity;
}

export function remainingWipCapacity(maximum: Quantity, released: readonly ReleasedOrder[]): Quantity {
  return Math.max(0, maximum - releasedWip(released)) as Quantity;
}
