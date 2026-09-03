import type { Quantity } from '@planforge/model';
import type { StorageLocation, StoredLot } from './types.js';

export interface ZoneSummary {
  readonly zone: string;
  readonly locations: number;
  readonly capacity: Quantity;
  readonly used: Quantity;
}

export function zoneSummaries(locations: readonly StorageLocation[], lots: readonly StoredLot[]): readonly ZoneSummary[] {
  const zones = [...new Set(locations.map((location) => location.zone))].sort();
  return zones.map((zone) => {
    const zoneLocations = locations.filter((location) => location.zone === zone);
    const ids = new Set(zoneLocations.map((location) => location.id));
    return {
      zone,
      locations: zoneLocations.length,
      capacity: zoneLocations.reduce((sum, location) => sum + location.capacityUnits, 0) as Quantity,
      used: lots.filter((lot) => ids.has(lot.locationId)).reduce((sum, lot) => sum + lot.quantity, 0) as Quantity,
    };
  });
}
