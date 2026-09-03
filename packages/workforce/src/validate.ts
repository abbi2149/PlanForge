import { failure, success, type ModelResult } from '@planforge/model';
import type { Skill, Worker, WorkerAvailability } from './types.js';

export function validateWorkforce(
  skills: readonly Skill[],
  workers: readonly Worker[],
  availability: readonly WorkerAvailability[],
): ModelResult<true> {
  const skillIds = new Set<string>();
  for (const skill of skills) {
    if (skillIds.has(skill.id) || skill.id.length === 0) {
      return failure({ code: 'WORKFORCE_SKILL', message: `invalid or duplicate skill ${skill.id}` });
    }
    skillIds.add(skill.id);
  }
  const workerIds = new Set<string>();
  for (const worker of workers) {
    if (workerIds.has(worker.id) || worker.id.length === 0) {
      return failure({ code: 'WORKFORCE_WORKER', message: `invalid or duplicate worker ${worker.id}` });
    }
    workerIds.add(worker.id);
    if (!Number.isInteger(worker.efficiencyBasisPoints) || worker.efficiencyBasisPoints <= 0 || worker.efficiencyBasisPoints > 20_000) {
      return failure({ code: 'WORKFORCE_EFFICIENCY', message: `worker ${worker.id} has invalid efficiency` });
    }
    const unknown = worker.skills.find((skill) => !skillIds.has(skill));
    if (unknown) return failure({ code: 'WORKFORCE_UNKNOWN_SKILL', message: `worker ${worker.id} references ${unknown}` });
  }
  for (const entry of availability) {
    if (!workerIds.has(entry.workerId) || entry.end <= entry.start) {
      return failure({ code: 'WORKFORCE_AVAILABILITY', message: `invalid availability for ${entry.workerId}` });
    }
  }
  return success(true);
}
