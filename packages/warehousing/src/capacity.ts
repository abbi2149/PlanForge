import type { Quantity } from '@planforge/model';
import type { LocationUtilization, StorageLocation, StoredLot } from './types.js';

export function locationUtilization(
  locations: readonly StorageLocation[],
  lots: readonly StoredLot[],
): readonly LocationUtilization[] {
  return [...locations]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((location) => {
      const used = lots.filter((lot) => lot.locationId === location.id).reduce((sum, lot) => sum + lot.quantity, 0) as Quantity;
      return {
        locationId: location.id,
        used,
        capacity: location.capacityUnits,
        utilizationBasisPoints:
          location.capacityUnits === 0 ? 0 : Math.min(10_000, Math.round((used * 10_000) / location.capacityUnits)),
      };
    });
}

export function freeCapacity(location: StorageLocation, lots: readonly StoredLot[]): Quantity {
  const used = lots.filter((lot) => lot.locationId === location.id).reduce((sum, lot) => sum + lot.quantity, 0);
  return Math.max(0, location.capacityUnits - used) as Quantity;
}
