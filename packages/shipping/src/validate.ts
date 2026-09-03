import { failure, success, type ModelResult } from '@planforge/model';
import type { CarrierService, Shipment } from './types.js';

export function validateShipping(shipments: readonly Shipment[], services: readonly CarrierService[]): ModelResult<true> {
  const ids = new Set<string>();
  for (const shipment of shipments) {
    if (shipment.id.length === 0 || ids.has(shipment.id) || shipment.requiredMinute < shipment.readyMinute || shipment.lines.length === 0) {
      return failure({ code: 'SHIPPING_SHIPMENT', message: `invalid shipment ${shipment.id}` });
    }
    ids.add(shipment.id);
    if (shipment.lines.some((line) => line.quantity <= 0)) return failure({ code: 'SHIPPING_QUANTITY', message: `shipment ${shipment.id} has invalid quantity` });
  }
  const carriers = new Set<string>();
  for (const service of services) {
    if (service.carrier.length === 0 || carriers.has(service.carrier) || service.transitMinutes < 0 || service.costMinorPerShipment < 0) {
      return failure({ code: 'SHIPPING_CARRIER', message: `invalid carrier ${service.carrier}` });
    }
    carriers.add(service.carrier);
  }
  return success(true);
}
