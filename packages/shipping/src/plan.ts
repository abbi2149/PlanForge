import type { ShipmentPlan, Shipment, CarrierService } from './types.js';
import { cheapestCarrier } from './carrier.js';
import { nextDeparture } from './departure.js';

export function planShipment(shipment: Shipment, services: readonly CarrierService[]): ShipmentPlan | null {
  const service = shipment.carrier
    ? services.find((entry) => entry.carrier === shipment.carrier) ?? null
    : cheapestCarrier(shipment, services);
  if (!service) return null;
  const departMinute = nextDeparture(shipment.readyMinute, service);
  const arriveMinute = (departMinute + service.transitMinutes) as ShipmentPlan['arriveMinute'];
  return {
    shipmentId: shipment.id,
    carrier: service.carrier,
    departMinute,
    arriveMinute,
    costMinor: service.costMinorPerShipment,
    onTime: arriveMinute <= shipment.requiredMinute,
  };
}
