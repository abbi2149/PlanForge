import { compileSchedule } from '@planforge/scheduler';
import { failure, success, type ModelResult } from '@planforge/model';
import { scorePlan } from './score.js';
import type { OptimizationCandidate, OptimizationInput } from './types.js';

export function optimizeDispatchRule(input: OptimizationInput): ModelResult<OptimizationCandidate> {
  const candidates: OptimizationCandidate[] = [];
  for (const dispatchRule of [...new Set(input.dispatchRules)].sort()) {
    const result = compileSchedule({ ...input.schedule, dispatchRule });
    if (!result.ok) continue;
    candidates.push({ dispatchRule, plan: result.value, score: scorePlan(result.value, input.weights).score });
  }
  if (candidates.length === 0) {
    return failure({ code: 'OPTIMIZATION_NO_CANDIDATE', message: 'no dispatch rule produced a valid schedule' });
  }
  candidates.sort((a, b) => a.score - b.score || a.dispatchRule.localeCompare(b.dispatchRule));
  return success(candidates[0]!);
}

export function rankDispatchRules(input: OptimizationInput): readonly OptimizationCandidate[] {
  const result: OptimizationCandidate[] = [];
  for (const dispatchRule of [...new Set(input.dispatchRules)].sort()) {
    const compiled = compileSchedule({ ...input.schedule, dispatchRule });
    if (compiled.ok) result.push({ dispatchRule, plan: compiled.value, score: scorePlan(compiled.value, input.weights).score });
  }
  return result.sort((a, b) => a.score - b.score || a.dispatchRule.localeCompare(b.dispatchRule));
}
