import { failure, success, type ModelResult } from '@planforge/model';
import type { MachineHealthObservation } from './types.js';

export function validateMachineHealth(observation: MachineHealthObservation): ModelResult<MachineHealthObservation> {
  if (observation.runtimeMinutes < 0 || observation.vibrationBasisPoints < 0 || observation.temperatureBasisPoints < 0 || observation.alarmCount < 0) {
    return failure({ code: 'MACHINE_HEALTH', message: `invalid machine health ${observation.workCenterId}` });
  }
  return success(observation);
}
