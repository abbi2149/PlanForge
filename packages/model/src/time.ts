import { failure, success, type ModelResult } from './result.js';
import type { Minute } from './units.js';

export interface TimeRange {
  readonly start: Minute;
  readonly end: Minute;
}

export function timeRange(start: Minute, end: Minute): ModelResult<TimeRange> {
  if (end <= start) {
    return failure({ code: 'MODEL_INVALID_RANGE', message: 'time range end must be greater than start' });
  }
  return success({ start, end });
}

export function rangesOverlap(left: TimeRange, right: TimeRange): boolean {
  return left.start < right.end && right.start < left.end;
}

export function intersectRanges(left: TimeRange, right: TimeRange): TimeRange | null {
  const start = Math.max(left.start, right.start) as Minute;
  const end = Math.min(left.end, right.end) as Minute;
  return end > start ? { start, end } : null;
}

export function rangeDuration(range: TimeRange): Minute {
  return (range.end - range.start) as Minute;
}

export function mergeRanges(ranges: readonly TimeRange[]): readonly TimeRange[] {
  const sorted = [...ranges].sort((a, b) => a.start - b.start || a.end - b.end);
  const merged: TimeRange[] = [];
  for (const range of sorted) {
    const previous = merged.at(-1);
    if (!previous || range.start > previous.end) {
      merged.push({ ...range });
      continue;
    }
    merged[merged.length - 1] = { start: previous.start, end: Math.max(previous.end, range.end) as Minute };
  }
  return merged;
}
