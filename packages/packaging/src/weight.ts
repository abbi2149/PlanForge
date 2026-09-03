import type { PackageSpec } from './types.js';

export function packageGrossGrams(spec: PackageSpec, unitGrossGrams: number): number {
  return spec.tareGrams + spec.unitsPerPackage * unitGrossGrams;
}

export function packageWithinWeight(spec: PackageSpec, unitGrossGrams: number): boolean {
  return packageGrossGrams(spec, unitGrossGrams) <= spec.maxGrossGrams;
}
