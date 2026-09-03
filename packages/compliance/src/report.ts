import type { ComplianceContext, ComplianceReport, ComplianceRule } from './types.js';
import { evaluateComplianceRule } from './evaluate.js';

export function buildComplianceReport(context: ComplianceContext, rules: readonly ComplianceRule[]): ComplianceReport {
  const findings = [...rules]
    .sort((a, b) => a.id.localeCompare(b.id))
    .flatMap((rule) => evaluateComplianceRule(context, rule));
  return { findings, compliant: !findings.some((finding) => finding.severity === 'error') };
}
