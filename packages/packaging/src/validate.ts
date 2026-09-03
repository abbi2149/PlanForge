import { failure, success, type ModelResult } from '@planforge/model';
import type { PackageSpec } from './types.js';

export function validatePackageSpecs(specs: readonly PackageSpec[]): ModelResult<readonly PackageSpec[]> {
  const ids = new Set<string>();
  for (const spec of specs) {
    if (spec.id.length === 0 || ids.has(spec.id) || spec.unitsPerPackage <= 0 || spec.packagesPerPallet <= 0) {
      return failure({ code: 'PACKAGING_SPEC', message: `invalid package spec ${spec.id}` });
    }
    ids.add(spec.id);
    if (spec.tareGrams < 0 || spec.maxGrossGrams <= spec.tareGrams) {
      return failure({ code: 'PACKAGING_WEIGHT', message: `invalid package weight ${spec.id}` });
    }
  }
  return success([...specs]);
}
