import type { ItemId, Minute, Quantity } from '@planforge/model';

export interface ShipmentLine {
  readonly itemId: ItemId;
  readonly quantity: Quantity;
}

export interface Shipment {
  readonly id: string;
  readonly customer: string;
  readonly readyMinute: Minute;
  readonly requiredMinute: Minute;
  readonly lines: readonly ShipmentLine[];
  readonly carrier?: string;
}

export interface CarrierService {
  readonly carrier: string;
  readonly transitMinutes: Minute;
  readonly cutoffMinuteOfDay: Minute;
  readonly costMinorPerShipment: number;
}

export interface ShipmentPlan {
  readonly shipmentId: string;
  readonly carrier: string;
  readonly departMinute: Minute;
  readonly arriveMinute: Minute;
  readonly costMinor: number;
  readonly onTime: boolean;
}
