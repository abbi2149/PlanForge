import type { ComplianceContext, ComplianceFinding, ComplianceRule } from './types.js';

export function evaluateComplianceRule(context: ComplianceContext, rule: ComplianceRule): readonly ComplianceFinding[] {
  if (rule.kind === 'required-audit-action') {
    return context.audit.events.some((event) => event.action === rule.value)
      ? []
      : [{ ruleId: rule.id, severity: rule.severity, message: `required audit action ${rule.value} is missing` }];
  }
  if (rule.kind === 'metadata-key') {
    return context.audit.events.every((event) => Object.hasOwn(event.metadata, rule.value))
      ? []
      : [{ ruleId: rule.id, severity: rule.severity, message: `audit metadata key ${rule.value} is not present on every event` }];
  }
  const lots = new Set(context.traces.flatMap((trace) => [...trace.inputs, ...trace.outputs].map((entry) => entry.lotId)));
  const produced = new Set(context.traces.flatMap((trace) => trace.outputs.map((entry) => entry.lotId)));
  const consumed = new Set(context.traces.flatMap((trace) => trace.inputs.map((entry) => entry.lotId)));
  const disconnected = [...lots].filter((lot) => !produced.has(lot) && !consumed.has(lot));
  return disconnected.length === 0
    ? []
    : [{ ruleId: rule.id, severity: rule.severity, message: `traceability contains ${disconnected.length} disconnected lots` }];
}
