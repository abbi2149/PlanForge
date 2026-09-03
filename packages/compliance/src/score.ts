import type { ComplianceReport } from './types.js';

export function complianceScoreBasisPoints(report: ComplianceReport): number {
  if (report.findings.length === 0) return 10_000;
  const penalty = report.findings.reduce((sum, finding) => sum + (finding.severity === 'error' ? 2_000 : 500), 0);
  return Math.max(0, 10_000 - penalty);
}

export function findingCounts(report: ComplianceReport): Readonly<Record<string, number>> {
  const counts: Record<string, number> = { warning: 0, error: 0 };
  for (const finding of report.findings) counts[finding.severity] = (counts[finding.severity] ?? 0) + 1;
  return counts;
}
