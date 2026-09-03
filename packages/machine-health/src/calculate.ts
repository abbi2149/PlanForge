import type { MachineHealthObservation, MachineHealthScore } from './types.js';

export function machineHealthScore(observation: MachineHealthObservation): MachineHealthScore {
  const vibrationPenalty = Math.max(0, observation.vibrationBasisPoints - 3_000);
  const temperaturePenalty = Math.max(0, observation.temperatureBasisPoints - 3_000);
  const alarmPenalty = observation.alarmCount * 500;
  const scoreBasisPoints = Math.max(0, 10_000 - vibrationPenalty - temperaturePenalty - alarmPenalty);
  const risk = scoreBasisPoints < 5_000 ? 'high' : scoreBasisPoints < 8_000 ? 'medium' : 'low';
  return { workCenterId: observation.workCenterId, scoreBasisPoints, risk, maintenanceRecommended: risk !== 'low' };
}
