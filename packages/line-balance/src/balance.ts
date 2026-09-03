import type { Minute, OperationId } from '@planforge/model';
import type { BalanceTask, LineBalance, StationAssignment } from './types.js';

export function balanceLine(tasks: readonly BalanceTask[], cycleTime: Minute): LineBalance | null {
  if (cycleTime <= 0 || tasks.some((task) => task.duration > cycleTime)) return null;
  const assigned = new Set<OperationId>();
  const remaining = new Map(tasks.map((task) => [task.operationId, task]));
  const stations: StationAssignment[] = [];
  while (remaining.size > 0) {
    let load = 0 as Minute;
    const operationIds: OperationId[] = [];
    let progress = true;
    while (progress) {
      progress = false;
      const eligible = [...remaining.values()]
        .filter((task) => task.predecessors.every((id) => assigned.has(id) || operationIds.includes(id)))
        .filter((task) => load + task.duration <= cycleTime)
        .sort((a, b) => b.duration - a.duration || a.operationId.localeCompare(b.operationId));
      const task = eligible[0];
      if (!task) break;
      operationIds.push(task.operationId);
      load = (load + task.duration) as Minute;
      remaining.delete(task.operationId);
      progress = true;
    }
    if (operationIds.length === 0) return null;
    operationIds.forEach((id) => assigned.add(id));
    stations.push({ station: stations.length + 1, operationIds, loadMinutes: load, slackMinutes: (cycleTime - load) as Minute });
  }
  const work = tasks.reduce((sum, task) => sum + task.duration, 0);
  const available = stations.length * cycleTime;
  const efficiencyBasisPoints = available === 0 ? 0 : Math.round((work * 10_000) / available);
  return { cycleTime, stations, efficiencyBasisPoints, balanceDelayBasisPoints: 10_000 - efficiencyBasisPoints };
}
