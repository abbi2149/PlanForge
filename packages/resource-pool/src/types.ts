import type { Minute, ResourceId, WorkCenterId } from '@planforge/model';

export interface PooledResource {
  readonly id: ResourceId;
  readonly workCenterIds: readonly WorkCenterId[];
  readonly availableMinutes: Minute;
  readonly capacityUnits: number;
}

export interface ResourcePoolSummary {
  readonly resources: number;
  readonly totalAvailableMinutes: Minute;
  readonly totalCapacityUnits: number;
  readonly coveredWorkCenters: readonly WorkCenterId[];
}
