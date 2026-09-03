import { failure, success, type ModelResult } from '@planforge/model';
import type { StorageLocation, StoredLot } from './types.js';

export function validateWarehouse(locations: readonly StorageLocation[], lots: readonly StoredLot[]): ModelResult<true> {
  const ids = new Set<string>();
  for (const location of locations) {
    if (location.id.length === 0 || ids.has(location.id) || location.capacityUnits <= 0) {
      return failure({ code: 'WAREHOUSE_LOCATION', message: `invalid location ${location.id}` });
    }
    ids.add(location.id);
  }
  for (const lot of lots) {
    if (!ids.has(lot.locationId) || lot.quantity < 0) {
      return failure({ code: 'WAREHOUSE_LOT', message: `invalid stored lot ${lot.lotId}` });
    }
  }
  return success(true);
}
