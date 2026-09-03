import type { AuditEvent, AuditLog } from './types.js';

export interface AuditFilter {
  readonly actor?: string;
  readonly action?: string;
  readonly entity?: string;
  readonly entityId?: string;
}

export function filterAudit(log: AuditLog, filter: AuditFilter): readonly AuditEvent[] {
  return log.events.filter((event) =>
    (filter.actor === undefined || event.actor === filter.actor) &&
    (filter.action === undefined || event.action === filter.action) &&
    (filter.entity === undefined || event.entity === filter.entity) &&
    (filter.entityId === undefined || event.entityId === filter.entityId),
  );
}
