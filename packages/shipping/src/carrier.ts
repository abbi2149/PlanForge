import type { Shipment } from './types.js';
import type { CarrierService } from './types.js';

export function eligibleCarriers(shipment: Shipment, services: readonly CarrierService[]): readonly CarrierService[] {
  return services
    .filter((service) => shipment.readyMinute + service.transitMinutes <= shipment.requiredMinute)
    .sort((a, b) => a.costMinorPerShipment - b.costMinorPerShipment || a.transitMinutes - b.transitMinutes || a.carrier.localeCompare(b.carrier));
}

export function cheapestCarrier(shipment: Shipment, services: readonly CarrierService[]): CarrierService | null {
  return eligibleCarriers(shipment, services)[0] ?? null;
}
