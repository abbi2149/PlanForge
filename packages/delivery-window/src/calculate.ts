import type { Minute } from '@planforge/model';
import type { DeliveryCommitment, DeliveryWindow, DeliveryWindowResult } from './types.js';

export function evaluateDeliveryWindow(window: DeliveryWindow, commitment: DeliveryCommitment): DeliveryWindowResult | null {
  if (window.id !== commitment.windowId) return null;
  return {
    id: commitment.id,
    withinWindow: commitment.plannedMinute >= window.earliest && commitment.plannedMinute <= window.latest,
    earlyMinutes: Math.max(0, window.earliest - commitment.plannedMinute) as Minute,
    lateMinutes: Math.max(0, commitment.plannedMinute - window.latest) as Minute,
  };
}
