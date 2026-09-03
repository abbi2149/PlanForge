import type { MoneyMinor, Quantity } from '@planforge/model';
import type { PurchaseOrderLine } from './types.js';

export function consolidatePurchaseLines(lines: readonly PurchaseOrderLine[]): readonly PurchaseOrderLine[] {
  const grouped = new Map<string, PurchaseOrderLine>();
  for (const line of lines) {
    const key = `${line.supplierId}\u0000${line.itemId}\u0000${line.orderMinute}\u0000${line.expectedMinute}\u0000${line.unitCostMinor}`;
    const previous = grouped.get(key);
    grouped.set(key, previous
      ? { ...line, quantity: (previous.quantity + line.quantity) as Quantity }
      : { ...line });
  }
  return [...grouped.values()].sort((a, b) => a.supplierId.localeCompare(b.supplierId) || a.itemId.localeCompare(b.itemId));
}

export function purchaseValueBySupplier(lines: readonly PurchaseOrderLine[]): Readonly<Record<string, MoneyMinor>> {
  const totals: Record<string, MoneyMinor> = {};
  for (const line of lines) {
    totals[line.supplierId] = ((totals[line.supplierId] ?? 0) + line.quantity * line.unitCostMinor) as MoneyMinor;
  }
  return Object.fromEntries(Object.entries(totals).sort(([a], [b]) => a.localeCompare(b))) as Readonly<Record<string, MoneyMinor>>;
}
