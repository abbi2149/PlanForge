import type { SequenceJob } from './types.js';

export function shortestProcessingTime(jobs: readonly SequenceJob[]): readonly SequenceJob[] {
  return [...jobs].sort((a, b) => a.processingMinutes - b.processingMinutes || a.dueMinute - b.dueMinute || a.orderId.localeCompare(b.orderId));
}
