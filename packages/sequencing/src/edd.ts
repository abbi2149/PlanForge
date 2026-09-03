import type { SequenceJob } from './types.js';

export function earliestDueDate(jobs: readonly SequenceJob[]): readonly SequenceJob[] {
  return [...jobs].sort((a, b) => a.dueMinute - b.dueMinute || b.priority - a.priority || a.orderId.localeCompare(b.orderId));
}
