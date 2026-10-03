/**
 * Currency, number, percentage, and date formatters
 */

/**
 * Format currency with appropriate decimals based on magnitude
 * @param {number|string} amount
 * @param {string} symbol
 * @param {number|null} customDecimals
 * @returns {string}
 */
export const formatCurrency = (amount, symbol = '$', customDecimals = null) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${symbol}0.00`;
  }

  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (customDecimals !== null) {
    return `${symbol}${num.toLocaleString(undefined, {
      minimumFractionDigits: customDecimals,
      maximumFractionDigits: customDecimals,
    })}`;
  }

  if (Math.abs(num) >= 1) {
    return `${symbol}${num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  } else if (Math.abs(num) >= 0.01) {
    return `${symbol}${num.toLocaleString(undefined, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    })}`;
  } else if (Math.abs(num) > 0) {
    return `${symbol}${num.toLocaleString(undefined, {
      minimumFractionDigits: 6,
      maximumFractionDigits: 8,
    })}`;
  }

  return `${symbol}0.00`;
};

/**
 * Compact representation for large amounts (Trillion, Billion, Million, Thousand)
 * @param {number|string} num
 * @param {string} symbol
 * @returns {string}
 */
export const formatCompactNumber = (num, symbol = '$') => {
  if (num === undefined || num === null || isNaN(num)) {
    return `${symbol}0`;
  }

  const value = Math.abs(typeof num === 'string' ? parseFloat(num) : num);

  if (value >= 1e12) {
    return `${symbol}${(value / 1e12).toFixed(2)}T`;
  }
  if (value >= 1e9) {
    return `${symbol}${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `${symbol}${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `${symbol}${(value / 1e3).toFixed(2)}K`;
  }

  return formatCurrency(value, symbol);
};

/**
 * Format 24h percentage change with sign (+ / -)
 * @param {number|string} value
 * @returns {string}
 */
export const formatPercentage = (value) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0.00%';
  }
  const num = typeof value === 'string' ? parseFloat(value) : value;
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};

/**
 * Format timestamp for charts according to selected days timeframe
 * @param {number} timestamp
 * @param {number|string} days
 * @returns {string}
 */
export const formatChartDate = (timestamp, days) => {
  const date = new Date(timestamp);
  const numDays = parseInt(days, 10);

  if (numDays === 1) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (numDays <= 30) {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
  return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
};

/**
 * Format full date for tooltips
 * @param {number} timestamp
 * @returns {string}
 */
export const formatFullDateTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

