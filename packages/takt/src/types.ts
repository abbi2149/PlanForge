import type { Minute, Quantity } from '@planforge/model';

export interface TaktInput {
  readonly availableMinutes: Minute;
  readonly demand: Quantity;
  readonly plannedDowntimeMinutes?: Minute;
  readonly efficiencyBasisPoints?: number;
}

export interface TaktResult {
  readonly netAvailableMinutes: Minute;
  readonly effectiveMinutes: Minute;
  readonly demand: Quantity;
  readonly taktMinutes: number;
  readonly unitsPerHour: number;
}

export interface PitchResult {
  readonly packSize: Quantity;
  readonly pitchMinutes: number;
  readonly pitchesPerShift: number;
}
