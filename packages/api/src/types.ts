import type { BillOfMaterial } from '@planforge/bom';
import type { WorkCalendar } from '@planforge/calendar';
import type { MaterialRate, WorkCenterRate } from '@planforge/costing';
import type { DemandPoint } from '@planforge/forecasting';
import type { InventoryDemand, InventoryLot, InventoryReceipt } from '@planforge/inventory';
import type { MaintenancePolicy, MaintenanceWindow } from '@planforge/maintenance';
import type { DemandOrder, Item, Routing } from '@planforge/model';
import type { QualityProfile } from '@planforge/quality';
import type { DispatchRule } from '@planforge/scheduler';

export interface FactoryModel {
  readonly name: string;
  readonly items: readonly Item[];
  readonly orders: readonly DemandOrder[];
  readonly routings: readonly Routing[];
  readonly calendar: WorkCalendar;
  readonly boms?: readonly BillOfMaterial[];
  readonly inventoryLots?: readonly InventoryLot[];
  readonly inventoryReceipts?: readonly InventoryReceipt[];
  readonly inventoryDemands?: readonly InventoryDemand[];
  readonly maintenancePolicies?: readonly MaintenancePolicy[];
  readonly maintenanceWindows?: readonly MaintenanceWindow[];
  readonly qualityProfiles?: readonly QualityProfile[];
  readonly workCenterRates?: readonly WorkCenterRate[];
  readonly materialRates?: readonly MaterialRate[];
  readonly demandHistory?: readonly DemandPoint[];
}

export interface CompileFactoryOptions {
  readonly dispatchRule?: DispatchRule;
  readonly validateMaterials?: boolean;
  readonly includeReport?: boolean;
}
