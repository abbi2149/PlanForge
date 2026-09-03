import type { MachineHealthScore } from './types.js';

export function rankMachineHealth(scores: readonly MachineHealthScore[]): readonly MachineHealthScore[] {
  return [...scores].sort((a, b) => a.scoreBasisPoints - b.scoreBasisPoints || a.workCenterId.localeCompare(b.workCenterId));
}

export function machinesNeedingMaintenance(scores: readonly MachineHealthScore[]): readonly MachineHealthScore[] {
  return rankMachineHealth(scores.filter((score) => score.maintenanceRecommended));
}
