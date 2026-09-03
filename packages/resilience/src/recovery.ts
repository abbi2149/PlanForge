import type { Minute } from '@planforge/model';
import type { Disruption, RecoveryAction } from './types.js';

export function defaultRecoveryActions(disruption: Disruption): readonly RecoveryAction[] {
  const duration = (disruption.end - disruption.start) as Minute;
  return [
    { disruptionId: disruption.id, action: 'buffer', estimatedRecoveryMinutes: Math.ceil(duration * 0.15) as Minute, costMinor: 0 },
    { disruptionId: disruption.id, action: 'overtime', estimatedRecoveryMinutes: Math.ceil(duration * 0.5) as Minute, costMinor: duration * 200 },
    { disruptionId: disruption.id, action: 'reroute', estimatedRecoveryMinutes: Math.ceil(duration * 0.7) as Minute, costMinor: duration * 120 },
    { disruptionId: disruption.id, action: 'expedite-maintenance', estimatedRecoveryMinutes: duration, costMinor: duration * 300 },
  ];
}

export function bestRecovery(actions: readonly RecoveryAction[], valuePerRecoveredMinute = 100): RecoveryAction | null {
  return [...actions].sort((a, b) =>
    (a.costMinor - a.estimatedRecoveryMinutes * valuePerRecoveredMinute) - (b.costMinor - b.estimatedRecoveryMinutes * valuePerRecoveredMinute) ||
    a.action.localeCompare(b.action),
  )[0] ?? null;
}
