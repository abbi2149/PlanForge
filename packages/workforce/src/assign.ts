import type { StaffingAssignment, StaffingRequirement, Worker, WorkerAvailability } from './types.js';
import { workerAvailable } from './availability.js';

export function assignStaffing(
  workers: readonly Worker[],
  availability: readonly WorkerAvailability[],
  requirements: readonly StaffingRequirement[],
): readonly StaffingAssignment[] {
  const result: StaffingAssignment[] = [];
  const workerSchedule = new Map<string, StaffingAssignment[]>();
  for (const requirement of [...requirements].sort((a, b) => a.start - b.start || a.workCenterId.localeCompare(b.workCenterId) || a.skillId.localeCompare(b.skillId))) {
    const eligible = workers
      .filter((worker) => worker.skills.includes(requirement.skillId) && workerAvailable(availability, worker.id, requirement.start, requirement.end))
      .sort((a, b) => b.efficiencyBasisPoints - a.efficiencyBasisPoints || a.id.localeCompare(b.id));
    let assigned = 0;
    for (const worker of eligible) {
      const clashes = (workerSchedule.get(worker.id) ?? []).some((entry) => entry.start < requirement.end && requirement.start < entry.end);
      if (clashes) continue;
      const assignment: StaffingAssignment = {
        workerId: worker.id,
        workCenterId: requirement.workCenterId,
        skillId: requirement.skillId,
        start: requirement.start,
        end: requirement.end,
      };
      result.push(assignment);
      workerSchedule.set(worker.id, [...(workerSchedule.get(worker.id) ?? []), assignment]);
      assigned += 1;
      if (assigned >= requirement.headcount) break;
    }
  }
  return result;
}
