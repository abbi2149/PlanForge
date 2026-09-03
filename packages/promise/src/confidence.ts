import type { PromiseQuote } from './types.js';

export function averagePromiseConfidence(quotes: readonly PromiseQuote[]): number {
  if (quotes.length === 0) return 0;
  return Math.round(quotes.reduce((sum, quote) => sum + quote.confidenceBasisPoints, 0) / quotes.length);
}

export function lowConfidencePromises(quotes: readonly PromiseQuote[], thresholdBasisPoints: number): readonly PromiseQuote[] {
  return quotes.filter((quote) => quote.confidenceBasisPoints < thresholdBasisPoints).sort((a, b) => a.confidenceBasisPoints - b.confidenceBasisPoints || a.orderId.localeCompare(b.orderId));
}
