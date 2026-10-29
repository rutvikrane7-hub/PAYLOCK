export const currencySymbols: Record<string, string> = {
  USD: '$',
  INR: '₹',
};

/**
 * Format a numeric amount according to the given currency.
 * No fractional digits are shown for simplicity (prices are whole numbers).
 */
export function formatAmount(amount: number, currency: string): string {
  const symbol = currencySymbols[currency] ?? '';
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${symbol}${formatted}`;
}

/**
 * Convert an amount expressed in USD to the target currency using the provided conversion rate.
 * The result is rounded to the nearest integer (the smallest currency unit).
 */
export function convertUSD(amountUSD: number, rate: number): number {
  return Math.round(amountUSD * rate);
}
