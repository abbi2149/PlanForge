import { digestOf, type Minute } from '@planforge/model';
import type { AuditEvent, AuditLog } from './types.js';

export function createAuditLog(events: readonly Omit<AuditEvent, 'sequence'>[]): AuditLog {
  const normalized = [...events]
    .sort((a, b) => a.minute - b.minute || a.actor.localeCompare(b.actor) || a.action.localeCompare(b.action) || a.entityId.localeCompare(b.entityId))
    .map((event, index): AuditEvent => ({ ...event, metadata: { ...event.metadata }, sequence: index + 1 }));
  return { events: normalized, digest: digestOf(normalized) };
}

export function appendAuditEvent(
  log: AuditLog,
  event: Omit<AuditEvent, 'sequence'>,
): AuditLog {
  const events = [...log.events, { ...event, metadata: { ...event.metadata }, sequence: log.events.length + 1 }];
  return { events, digest: digestOf(events) };
}

export function auditWindow(log: AuditLog, start: Minute, end: Minute): readonly AuditEvent[] {
  return log.events.filter((event) => event.minute >= start && event.minute < end);
}
