import type { Quantity } from '@planforge/model';
import type { PackagePlan, PackageSpec } from './types.js';

export function packagePlan(spec: PackageSpec, requiredUnits: Quantity): PackagePlan {
  const fullPackages = Math.floor(requiredUnits / spec.unitsPerPackage);
  const partialUnits = (requiredUnits % spec.unitsPerPackage) as Quantity;
  const packages = fullPackages + (partialUnits > 0 ? 1 : 0);
  return {
    itemId: spec.itemId,
    requiredUnits,
    fullPackages,
    partialUnits,
    pallets: Math.ceil(packages / spec.packagesPerPallet),
  };
}
