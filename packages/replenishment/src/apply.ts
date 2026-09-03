import type { InventoryReceipt } from '@planforge/inventory';
import type { ReplenishmentSignal } from './types.js';

export function signalToReceipt(signal: ReplenishmentSignal, referencePrefix = 'replenishment'): InventoryReceipt {
  return {
    itemId: signal.itemId,
    quantity: signal.orderQuantity,
    minute: signal.expectedMinute,
    reference: `${referencePrefix}:${signal.itemId}:${signal.atMinute}`,
  };
}
