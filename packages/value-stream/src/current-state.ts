import type { Minute } from '@planforge/model';
import type { ValueStreamMap, ValueStreamStep } from './types.js';

export interface CurrentStateObservation {
  readonly stepId: string;
  readonly processMinutes: Minute;
  readonly queueMinutes: Minute;
  readonly transferMinutes: Minute;
  readonly inventoryUnits: number;
  readonly firstPassYieldBasisPoints: number;
}

export function currentStateMap(
  name: string,
  workCenters: Readonly<Record<string, ValueStreamStep['workCenterId']>>,
  observations: readonly CurrentStateObservation[],
): ValueStreamMap {
  const steps = [...observations]
    .map((observation): ValueStreamStep => ({
      id: observation.stepId,
      workCenterId: workCenters[observation.stepId] ?? (observation.stepId as ValueStreamStep['workCenterId']),
      processMinutes: observation.processMinutes,
      waitMinutes: (observation.queueMinutes + observation.transferMinutes) as Minute,
      inventoryUnits: observation.inventoryUnits,
      firstPassYieldBasisPoints: observation.firstPassYieldBasisPoints,
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
  return { name, steps };
}

export function totalQueueMinutes(observations: readonly CurrentStateObservation[]): Minute {
  return observations.reduce((sum, observation) => sum + observation.queueMinutes, 0) as Minute;
}

export function totalTransferMinutes(observations: readonly CurrentStateObservation[]): Minute {
  return observations.reduce((sum, observation) => sum + observation.transferMinutes, 0) as Minute;
}

export function totalObservedInventory(observations: readonly CurrentStateObservation[]): number {
  return observations.reduce((sum, observation) => sum + observation.inventoryUnits, 0);
}

export function longestWaitingStep(observations: readonly CurrentStateObservation[]): CurrentStateObservation | null {
  return [...observations]
    .sort((a, b) =>
      (b.queueMinutes + b.transferMinutes) - (a.queueMinutes + a.transferMinutes) ||
      a.stepId.localeCompare(b.stepId),
    )[0] ?? null;
}

export function lowestYieldStep(observations: readonly CurrentStateObservation[]): CurrentStateObservation | null {
  return [...observations]
    .sort((a, b) => a.firstPassYieldBasisPoints - b.firstPassYieldBasisPoints || a.stepId.localeCompare(b.stepId))[0] ?? null;
}

export function processToWaitRatio(observation: CurrentStateObservation): number {
  const wait = observation.queueMinutes + observation.transferMinutes;
  return wait === 0 ? Number.POSITIVE_INFINITY : observation.processMinutes / wait;
}

export function observationsBelowYield(
  observations: readonly CurrentStateObservation[],
  thresholdBasisPoints: number,
): readonly CurrentStateObservation[] {
  return observations
    .filter((observation) => observation.firstPassYieldBasisPoints < thresholdBasisPoints)
    .sort((a, b) => a.firstPassYieldBasisPoints - b.firstPassYieldBasisPoints || a.stepId.localeCompare(b.stepId));
}

export function observationCount(observations: readonly CurrentStateObservation[]): number {
  return observations.length;
}
