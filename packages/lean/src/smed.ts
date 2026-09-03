import type { Minute } from '@planforge/model';
import type { SetupImprovement, SetupObservation } from './types.js';

export function improveSetup(
  observation: SetupObservation,
  convertibleBasisPoints: number,
  externalReductionBasisPoints: number,
): SetupImprovement {
  const convertible = Math.round((observation.internalMinutes * Math.max(0, convertibleBasisPoints)) / 10_000) as Minute;
  const remainingInternal = Math.max(0, observation.internalMinutes - convertible) as Minute;
  const improvedExternal = Math.round(
    ((observation.externalMinutes + convertible) * (10_000 - Math.max(0, externalReductionBasisPoints))) / 10_000,
  ) as Minute;
  const originalMinutes = (observation.internalMinutes + observation.externalMinutes) as Minute;
  const improvedMinutes = (remainingInternal + improvedExternal) as Minute;
  return {
    workCenterId: observation.workCenterId,
    originalMinutes,
    improvedMinutes,
    reductionBasisPoints:
      originalMinutes === 0 ? 0 : Math.round(((originalMinutes - improvedMinutes) * 10_000) / originalMinutes),
    convertedToExternalMinutes: convertible,
  };
}

export function bestSetupImprovement(
  observations: readonly SetupObservation[],
  convertibleBasisPoints: number,
  externalReductionBasisPoints: number,
): SetupImprovement | null {
  return observations
    .map((entry) => improveSetup(entry, convertibleBasisPoints, externalReductionBasisPoints))
    .sort((a, b) => b.reductionBasisPoints - a.reductionBasisPoints || a.workCenterId.localeCompare(b.workCenterId))[0] ?? null;
}
