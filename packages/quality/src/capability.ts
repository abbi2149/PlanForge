import type { CapabilityStudy } from './types.js';

export interface CapabilityIndices {
  readonly cp: number;
  readonly cpu: number;
  readonly cpl: number;
  readonly cpk: number;
}

export function capabilityIndices(study: CapabilityStudy): CapabilityIndices {
  if (!(study.standardDeviation > 0) || study.upperSpecification <= study.lowerSpecification) {
    return { cp: 0, cpu: 0, cpl: 0, cpk: 0 };
  }
  const sixSigma = 6 * study.standardDeviation;
  const cp = (study.upperSpecification - study.lowerSpecification) / sixSigma;
  const cpu = (study.upperSpecification - study.mean) / (3 * study.standardDeviation);
  const cpl = (study.mean - study.lowerSpecification) / (3 * study.standardDeviation);
  return { cp, cpu, cpl, cpk: Math.min(cpu, cpl) };
}

export function capable(study: CapabilityStudy, minimumCpk = 1.33): boolean {
  return capabilityIndices(study).cpk >= minimumCpk;
}
