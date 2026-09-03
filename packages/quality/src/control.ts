import { mean, standardDeviation } from '@planforge/model';

export interface ControlLimits {
  readonly center: number;
  readonly lower: number;
  readonly upper: number;
  readonly sigma: number;
}

export interface ControlSignal {
  readonly index: number;
  readonly value: number;
  readonly reason: 'below-lower-limit' | 'above-upper-limit' | 'run-above-center' | 'run-below-center';
}

export function controlLimits(values: readonly number[], sigmaWidth = 3): ControlLimits {
  if (!Number.isFinite(sigmaWidth) || sigmaWidth <= 0) throw new RangeError('sigmaWidth must be positive');
  const center = mean(values);
  const sigma = standardDeviation(values);
  return {
    center,
    lower: center - sigmaWidth * sigma,
    upper: center + sigmaWidth * sigma,
    sigma,
  };
}

export function controlSignals(
  values: readonly number[],
  limits: ControlLimits,
  runLength = 7,
): readonly ControlSignal[] {
  if (!Number.isSafeInteger(runLength) || runLength < 2) throw new RangeError('runLength must be >= 2');
  const signals: ControlSignal[] = [];
  let above = 0;
  let below = 0;
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]!;
    if (value > limits.upper) signals.push({ index, value, reason: 'above-upper-limit' });
    else if (value < limits.lower) signals.push({ index, value, reason: 'below-lower-limit' });
    if (value > limits.center) {
      above += 1;
      below = 0;
    } else if (value < limits.center) {
      below += 1;
      above = 0;
    } else {
      above = 0;
      below = 0;
    }
    if (above === runLength) signals.push({ index, value, reason: 'run-above-center' });
    if (below === runLength) signals.push({ index, value, reason: 'run-below-center' });
  }
  return signals;
}
