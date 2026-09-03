import { success, type ModelResult, type ProductionPlan } from '@planforge/model';
import { comparePlanStability, type DispatchRule } from '@planforge/scheduler';
import { compileFactory, type CompiledFactory } from './compile.js';
import type { FactoryModel } from './types.js';

export interface FactoryPortfolioEntry {
  readonly name: string;
  readonly compiled: CompiledFactory;
}

export interface FactoryPortfolio {
  readonly entries: readonly FactoryPortfolioEntry[];
  readonly totalMaterialCostMinor: number;
  readonly totalOperations: number;
  readonly shortageFactories: readonly string[];
}

export function compileFactoryPortfolio(
  factories: readonly FactoryModel[],
  dispatchRule?: DispatchRule,
): ModelResult<FactoryPortfolio> {
  const entries: FactoryPortfolioEntry[] = [];
  for (const factory of [...factories].sort((a, b) => a.name.localeCompare(b.name))) {
    const compiled = compileFactory(factory, {
      ...(dispatchRule === undefined ? {} : { dispatchRule }),
      includeReport: false,
      validateMaterials: false,
    });
    if (!compiled.ok) return compiled;
    entries.push({ name: factory.name, compiled: compiled.value });
  }
  return success({
    entries,
    totalMaterialCostMinor: entries.reduce((sum, entry) => sum + entry.compiled.materialCostMinor, 0),
    totalOperations: entries.reduce((sum, entry) => sum + entry.compiled.plan.operations.length, 0),
    shortageFactories: entries
      .filter((entry) => entry.compiled.materialShortages.length > 0)
      .map((entry) => entry.name)
      .sort(),
  });
}

export interface PlanComparison {
  readonly baselineDigest: string;
  readonly candidateDigest: string;
  readonly operationDelta: number;
  readonly warningDelta: number;
  readonly stability: ReturnType<typeof comparePlanStability>;
}

export function compareCompiledPlans(
  baseline: ProductionPlan,
  candidate: ProductionPlan,
): PlanComparison {
  return {
    baselineDigest: baseline.digest,
    candidateDigest: candidate.digest,
    operationDelta: candidate.operations.length - baseline.operations.length,
    warningDelta: candidate.warnings.length - baseline.warnings.length,
    stability: comparePlanStability(baseline, candidate),
  };
}
