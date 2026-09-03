import { failure, success, type ModelResult } from '@planforge/model';
import type { PooledResource } from './types.js';

export function validateResourcePool(resources: readonly PooledResource[]): ModelResult<readonly PooledResource[]> {
  const ids = new Set<string>();
  for (const resource of resources) {
    if (ids.has(resource.id) || resource.workCenterIds.length === 0 || resource.availableMinutes < 0 || resource.capacityUnits <= 0) {
      return failure({ code: 'RESOURCE_POOL', message: `invalid resource ${resource.id}` });
    }
    ids.add(resource.id);
  }
  return success([...resources]);
}
