import type { ScenarioDifference } from './types.js';

export function diffScenarioValues(left: unknown, right: unknown, path = ''): readonly ScenarioDifference[] {
  if (Object.is(left, right)) return [];
  if (Array.isArray(left) && Array.isArray(right)) {
    const length = Math.max(left.length, right.length);
    return Array.from({ length }, (_, index) => diffScenarioValues(left[index], right[index], `${path}[${index}]`)).flat();
  }
  if (left !== null && right !== null && typeof left === 'object' && typeof right === 'object') {
    const keys = [...new Set([...Object.keys(left), ...Object.keys(right)])].sort();
    return keys.flatMap((key) =>
      diffScenarioValues(
        (left as Record<string, unknown>)[key],
        (right as Record<string, unknown>)[key],
        path ? `${path}.${key}` : key,
      ),
    );
  }
  return [{ path, left, right }];
}
