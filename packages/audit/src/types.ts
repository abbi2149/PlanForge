import type { Minute } from '@planforge/model';

export interface AuditEvent {
  readonly sequence: number;
  readonly minute: Minute;
  readonly actor: string;
  readonly action: string;
  readonly entity: string;
  readonly entityId: string;
  readonly beforeDigest?: string;
  readonly afterDigest?: string;
  readonly metadata: Readonly<Record<string, string | number | boolean>>;
}

export interface AuditLog {
  readonly events: readonly AuditEvent[];
  readonly digest: string;
}

export interface AuditDifference {
  readonly sequence: number;
  readonly kind: 'missing-left' | 'missing-right' | 'changed';
  readonly left?: AuditEvent;
  readonly right?: AuditEvent;
}
