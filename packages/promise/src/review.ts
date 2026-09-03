import type { Minute } from '@planforge/model';
import type { PromiseQuote, PromiseReview } from './types.js';

export function reviewPromise(quote: PromiseQuote, projectedMinute: Minute): PromiseReview {
  const riskMinutes = Math.max(0, projectedMinute - quote.quotedMinute) as Minute;
  return {
    orderId: quote.orderId,
    quotedMinute: quote.quotedMinute,
    projectedMinute,
    atRisk: riskMinutes > 0,
    riskMinutes,
  };
}

export function atRiskPromises(reviews: readonly PromiseReview[]): readonly PromiseReview[] {
  return reviews.filter((review) => review.atRisk).sort((a, b) => b.riskMinutes - a.riskMinutes || a.orderId.localeCompare(b.orderId));
}
