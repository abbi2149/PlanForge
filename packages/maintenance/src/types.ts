import type { MaintenanceId, Minute, ResourceId, TimeRange, WorkCenterId } from '@planforge/model';

export interface MaintenanceWindow extends TimeRange {
  readonly id: MaintenanceId;
  readonly workCenterId: WorkCenterId;
  readonly resourceId?: ResourceId;
  readonly kind: 'preventive' | 'inspection' | 'repair';
  readonly description: string;
}

export interface MaintenancePolicy {
  readonly workCenterId: WorkCenterId;
  readonly intervalMinutes: Minute;
  readonly durationMinutes: Minute;
  readonly firstDueMinute: Minute;
}

export interface MaintenanceConflict {
  readonly maintenanceId: MaintenanceId;
  readonly orderId: string;
  readonly operationId: string;
}
