import type { DemandOrder, OrderId, Quantity } from '@planforge/model';

export function splitOrder(order: DemandOrder, lotSize: Quantity): readonly DemandOrder[] {
  if (lotSize <= 0 || order.quantity <= lotSize) return [order];
  const result: DemandOrder[] = [];
  let remaining = order.quantity;
  let sequence = 1;
  while (remaining > 0) {
    const quantity = Math.min(remaining, lotSize) as Quantity;
    result.push({ ...order, id: `${order.id}:${sequence}` as OrderId, quantity });
    remaining = (remaining - quantity) as Quantity;
    sequence += 1;
  }
  return result;
}
