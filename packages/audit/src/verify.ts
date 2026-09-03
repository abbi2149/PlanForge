import { digestOf, failure, success, type ModelResult } from '@planforge/model';
import type { AuditLog } from './types.js';

export function verifyAuditLog(log: AuditLog): ModelResult<AuditLog> {
  for (let index = 0; index < log.events.length; index += 1) {
    if (log.events[index]!.sequence !== index + 1) {
      return failure({ code: 'AUDIT_SEQUENCE', message: `audit event ${index + 1} has incorrect sequence` });
    }
  }
  if (digestOf(log.events) !== log.digest) {
    return failure({ code: 'AUDIT_DIGEST', message: 'audit log digest does not match events' });
  }
  return success(log);
}
