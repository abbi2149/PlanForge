import type { WorkCenterId } from '@planforge/model';
import type { PooledResource } from './types.js';

export function resourcesForCenter(resources: readonly PooledResource[], workCenterId: WorkCenterId): readonly PooledResource[] {
  return resources.filter((resource) => resource.workCenterIds.includes(workCenterId)).sort((a, b) => b.capacityUnits - a.capacityUnits || a.id.localeCompare(b.id));
}

export function resourceCoverage(resources: readonly PooledResource[], workCenterId: WorkCenterId): number {
  return resourcesForCenter(resources, workCenterId).reduce((sum, resource) => sum + resource.capacityUnits, 0);
}
