import type { AuditLog } from '@planforge/audit';
import type { ProductionTrace } from '@planforge/traceability';

export interface ComplianceRule {
  readonly id: string;
  readonly kind: 'required-audit-action' | 'lot-trace-complete' | 'metadata-key';
  readonly value: string;
  readonly severity: 'warning' | 'error';
}

export interface ComplianceFinding {
  readonly ruleId: string;
  readonly severity: 'warning' | 'error';
  readonly message: string;
}

export interface ComplianceContext {
  readonly audit: AuditLog;
  readonly traces: readonly ProductionTrace[];
}

export interface ComplianceReport {
  readonly findings: readonly ComplianceFinding[];
  readonly compliant: boolean;
}
