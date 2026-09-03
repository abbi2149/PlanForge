import type { Minute } from '@planforge/model';
import type { PooledResource, ResourcePoolSummary } from './types.js';

export function summarizeResourcePool(resources: readonly PooledResource[]): ResourcePoolSummary {
  return {
    resources: resources.length,
    totalAvailableMinutes: resources.reduce((sum, resource) => sum + resource.availableMinutes, 0) as Minute,
    totalCapacityUnits: resources.reduce((sum, resource) => sum + resource.capacityUnits, 0),
    coveredWorkCenters: [...new Set(resources.flatMap((resource) => resource.workCenterIds))].sort(),
  };
}
