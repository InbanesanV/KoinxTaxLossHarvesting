/**
 * Format a number as Indian Rupee currency
 * Handles very small numbers and very large numbers appropriately
 */
export function formatINR(value: number, showSign = false): string {
  if (value === 0) return '₹0.00';

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : showSign && value > 0 ? '+' : '';

  // For very small numbers, show more decimal places
  if (absValue > 0 && absValue < 0.01) {
    const formatted = absValue.toFixed(8).replace(/0+$/, '').replace(/\.$/, '');
    return `${sign}₹${formatted}`;
  }

  // Use Indian locale formatting
  const formatted = absValue.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${sign}₹${formatted}`;
}

/**
 * Format holding balance with significant figures for very small numbers
 */
export function formatHolding(value: number): string {
  if (value === 0) return '0';

  const absValue = Math.abs(value);

  if (absValue < 0.000001) {
    return value.toExponential(4);
  }

  if (absValue < 0.01) {
    return value.toFixed(8).replace(/0+$/, '').replace(/\.$/, '');
  }

  if (absValue < 1) {
    return value.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
  }

  // Cap at 6 significant figures
  const sigFig = parseFloat(value.toPrecision(6));
  return sigFig.toLocaleString('en-IN', { maximumFractionDigits: 6 });
}

/**
 * Format price in INR
 */
export function formatPrice(value: number): string {
  if (value === 0) return '₹0.00';

  if (value < 0.001) {
    return `₹${value.toFixed(8).replace(/0+$/, '')}`;
  }

  if (value < 1) {
    return `₹${value.toFixed(6).replace(/0+$/, '')}`;
  }

  return value.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format gain/loss with color indicator
 */
export function formatGain(value: number): string {
  if (Math.abs(value) < 0.000001) {
    return value >= 0 ? `+₹${value.toExponential(4)}` : `-₹${Math.abs(value).toExponential(4)}`;
  }

  const absValue = Math.abs(value);
  const sign = value >= 0 ? '+' : '-';

  if (absValue < 0.01) {
    return `${sign}₹${absValue.toFixed(8).replace(/0+$/, '')}`;
  }

  const formatted = absValue.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${sign}₹${formatted}`;
}
