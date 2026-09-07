import { failure, success, type ModelResult, type ProductionPlan } from '@planforge/model';
import {
  comparePlanStability,
  scheduleMetrics,
  DISPATCH_RULES,
  type DispatchRule,
  type ScheduleMetrics,
} from '@planforge/scheduler';
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

export interface DispatchRuleOutcome {
  readonly rule: DispatchRule;
  readonly digest: string;
  readonly metrics: ScheduleMetrics;
  readonly warningCount: number;
}

export interface DispatchRuleComparison {
  readonly baseline: DispatchRuleOutcome;
  readonly candidate: DispatchRuleOutcome;
  readonly plan: PlanComparison;
  readonly makespanDelta: number;
  readonly averageTardinessDeltaMinutes: number;
  readonly onTimeBasisPointsDelta: number;
}

function dispatchRuleOutcome(model: FactoryModel, rule: DispatchRule): ModelResult<DispatchRuleOutcome & { readonly plan: ProductionPlan }> {
  const compiled = compileFactory(model, { dispatchRule: rule, includeReport: false, validateMaterials: false });
  if (!compiled.ok) return compiled;
  const plan = compiled.value.plan;
  return success({
    rule,
    plan,
    digest: plan.digest,
    metrics: scheduleMetrics(model.orders, plan.operations),
    warningCount: plan.warnings.length,
  });
}

/**
 * Compiles one factory under two dispatch rules and reports how the candidate
 * rule moves makespan, tardiness, on-time delivery, and schedule stability.
 * Material shortages are not validated because both plans share one model.
 */
export function compareFactoryDispatchRules(
  model: FactoryModel,
  baselineRule: DispatchRule,
  candidateRule: DispatchRule,
): ModelResult<DispatchRuleComparison> {
  const baseline = dispatchRuleOutcome(model, baselineRule);
  if (!baseline.ok) return baseline;
  const candidate = dispatchRuleOutcome(model, candidateRule);
  if (!candidate.ok) return candidate;
  const { plan: baselinePlan, ...baselineOutcome } = baseline.value;
  const { plan: candidatePlan, ...candidateOutcome } = candidate.value;
  return success({
    baseline: baselineOutcome,
    candidate: candidateOutcome,
    plan: compareCompiledPlans(baselinePlan, candidatePlan),
    makespanDelta: candidateOutcome.metrics.makespan - baselineOutcome.metrics.makespan,
    averageTardinessDeltaMinutes:
      candidateOutcome.metrics.averageTardinessMinutes - baselineOutcome.metrics.averageTardinessMinutes,
    onTimeBasisPointsDelta: candidateOutcome.metrics.onTimeBasisPoints - baselineOutcome.metrics.onTimeBasisPoints,
  });
}

export interface DispatchRuleRankEntry extends DispatchRuleOutcome {
  /** One-based position in the ranking. Ties are broken by rule name, so no two entries share a rank. */
  readonly rank: number;
}

export interface DispatchRuleRanking {
  readonly entries: readonly DispatchRuleRankEntry[];
  readonly best: DispatchRule;
}

/**
 * Orders two rules best-first: keep the most orders on time, then finish late
 * orders sooner, then compress the schedule, then leave fewer warnings. The
 * rule name breaks any remaining tie so the ranking is a total order.
 */
function byRankQuality(left: DispatchRuleOutcome, right: DispatchRuleOutcome): number {
  return (
    right.metrics.onTimeBasisPoints - left.metrics.onTimeBasisPoints ||
    left.metrics.averageTardinessMinutes - right.metrics.averageTardinessMinutes ||
    left.metrics.makespan - right.metrics.makespan ||
    left.metrics.averageFlowMinutes - right.metrics.averageFlowMinutes ||
    left.warningCount - right.warningCount ||
    left.rule.localeCompare(right.rule)
  );
}

/**
 * Compiles one factory under every candidate dispatch rule and ranks the
 * outcomes best-first, so a model can be sized up in one pass instead of the
 * pairwise runs `compareFactoryDispatchRules` needs. Material shortages are not
 * validated because every plan shares one model.
 */
export function rankFactoryDispatchRules(
  model: FactoryModel,
  rules: readonly DispatchRule[] = DISPATCH_RULES,
): ModelResult<DispatchRuleRanking> {
  const candidates = [...new Set(rules)];
  if (candidates.length === 0) {
    return failure({ code: 'API_DISPATCH_RULES', message: 'at least one dispatch rule is required' });
  }
  const outcomes: DispatchRuleOutcome[] = [];
  for (const rule of candidates) {
    const outcome = dispatchRuleOutcome(model, rule);
    if (!outcome.ok) return outcome;
    const { plan: _plan, ...withoutPlan } = outcome.value;
    outcomes.push(withoutPlan);
  }
  const entries = outcomes
    .sort(byRankQuality)
    .map((outcome, index) => ({ ...outcome, rank: index + 1 }));
  return success({ entries, best: entries[0]!.rule });
}
