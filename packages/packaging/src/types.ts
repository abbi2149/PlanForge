import type { ItemId, Quantity } from '@planforge/model';

export interface PackageSpec {
  readonly id: string;
  readonly itemId: ItemId;
  readonly unitsPerPackage: Quantity;
  readonly packagesPerPallet: Quantity;
  readonly tareGrams: number;
  readonly maxGrossGrams: number;
}

export interface PackagePlan {
  readonly itemId: ItemId;
  readonly requiredUnits: Quantity;
  readonly fullPackages: number;
  readonly partialUnits: Quantity;
  readonly pallets: number;
}
