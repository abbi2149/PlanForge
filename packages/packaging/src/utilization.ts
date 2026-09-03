import type { PackagePlan, PackageSpec } from './types.js';

export function packageFillBasisPoints(plan: PackagePlan, spec: PackageSpec): number {
  const packages = plan.fullPackages + (plan.partialUnits > 0 ? 1 : 0);
  if (packages === 0) return 0;
  return Math.round((plan.requiredUnits * 10_000) / (packages * spec.unitsPerPackage));
}

export function palletFillBasisPoints(plan: PackagePlan, spec: PackageSpec): number {
  const packages = plan.fullPackages + (plan.partialUnits > 0 ? 1 : 0);
  if (plan.pallets === 0) return 0;
  return Math.round((packages * 10_000) / (plan.pallets * spec.packagesPerPallet));
}
