import { changeoverRule, type ChangeoverRule } from '@planforge/changeover';
import type { Minute } from '@planforge/model';
import type { SequenceJob, SequenceResult } from './types.js';

export function evaluateSequence(jobs: readonly SequenceJob[], rules: readonly ChangeoverRule[], start: Minute): SequenceResult {
  let cursor = start;
  let totalProcessing = 0;
  let totalChangeover = 0;
  let totalTardiness = 0;
  let previous: SequenceJob | undefined;
  for (const job of jobs) {
    if (previous) {
      const change = changeoverRule(rules, job.workCenterId, previous.family, job.family)?.minutes ?? 0;
      cursor = (cursor + change) as Minute;
      totalChangeover += change;
    }
    cursor = (cursor + job.processingMinutes) as Minute;
    totalProcessing += job.processingMinutes;
    totalTardiness += Math.max(0, cursor - job.dueMinute);
    previous = job;
  }
  return {
    jobs: [...jobs],
    totalProcessingMinutes: totalProcessing as Minute,
    totalChangeoverMinutes: totalChangeover as Minute,
    totalTardinessMinutes: totalTardiness as Minute,
  };
}
