import type { ChangeoverRule } from '@planforge/changeover';
import type { Minute } from '@planforge/model';
import { earliestDueDate } from './edd.js';
import { evaluateSequence } from './evaluate.js';
import { familyAwareSequence } from './family.js';
import { shortestProcessingTime } from './spt.js';
import type { SequenceJob, SequenceResult } from './types.js';

export function bestHeuristicSequence(jobs: readonly SequenceJob[], rules: readonly ChangeoverRule[], start: Minute): SequenceResult {
  const candidates = [earliestDueDate(jobs), shortestProcessingTime(jobs), familyAwareSequence(jobs, rules)];
  return candidates
    .map((candidate) => evaluateSequence(candidate, rules, start))
    .sort((a, b) =>
      a.totalTardinessMinutes - b.totalTardinessMinutes ||
      a.totalChangeoverMinutes - b.totalChangeoverMinutes ||
      a.jobs.map((job) => job.orderId).join('\u0000').localeCompare(b.jobs.map((job) => job.orderId).join('\u0000')),
    )[0]!;
}
