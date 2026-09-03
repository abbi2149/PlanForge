import type { Quantity } from '@planforge/model';
import type { Shipment } from './types.js';

export function consolidateShipments(id: string, shipments: readonly Shipment[]): Shipment | null {
  if (shipments.length === 0) return null;
  const customer = shipments[0]!.customer;
  if (!shipments.every((shipment) => shipment.customer === customer)) return null;
  const grouped = new Map<string, number>();
  for (const line of shipments.flatMap((shipment) => shipment.lines)) grouped.set(line.itemId, (grouped.get(line.itemId) ?? 0) + line.quantity);
  return {
    id,
    customer,
    readyMinute: Math.max(...shipments.map((shipment) => shipment.readyMinute)) as Shipment['readyMinute'],
    requiredMinute: Math.min(...shipments.map((shipment) => shipment.requiredMinute)) as Shipment['requiredMinute'],
    lines: [...grouped.entries()].map(([itemId, quantity]) => ({ itemId: itemId as Shipment['lines'][number]['itemId'], quantity: quantity as Quantity })).sort((a, b) => a.itemId.localeCompare(b.itemId)),
  };
}
