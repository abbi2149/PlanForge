import type { Quantity } from '@planforge/model';
import type { PitchResult, TaktResult } from './types.js';

export function calculatePitch(takt: TaktResult, packSize: Quantity): PitchResult | null {
  if (packSize <= 0) return null;
  const pitchMinutes = takt.taktMinutes * packSize;
  return {
    packSize,
    pitchMinutes,
    pitchesPerShift: pitchMinutes === 0 ? 0 : takt.effectiveMinutes / pitchMinutes,
  };
}

export function roundedPitchMinutes(takt: TaktResult, packSize: Quantity): number | null {
  const pitch = calculatePitch(takt, packSize);
  return pitch ? Math.ceil(pitch.pitchMinutes) : null;
}
