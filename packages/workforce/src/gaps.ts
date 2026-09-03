import type { StaffingAssignment, StaffingGap, StaffingRequirement } from './types.js';

export function staffingGaps(
  requirements: readonly StaffingRequirement[],
  assignments: readonly StaffingAssignment[],
): readonly StaffingGap[] {
  return requirements.flatMap((requirement) => {
    const assigned = assignments.filter(
      (entry) =>
        entry.workCenterId === requirement.workCenterId &&
        entry.skillId === requirement.skillId &&
        entry.start <= requirement.start &&
        entry.end >= requirement.end,
    ).length;
    return assigned >= requirement.headcount
      ? []
      : [{
          workCenterId: requirement.workCenterId,
          skillId: requirement.skillId,
          start: requirement.start,
          end: requirement.end,
          required: requirement.headcount,
          assigned,
        }];
  });
}

export function fullyStaffed(gaps: readonly StaffingGap[]): boolean {
  return gaps.length === 0;
}
