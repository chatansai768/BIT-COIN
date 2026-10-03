/**
 * LocalStorage utilities for Watchlist / Favorites persistence
 */

const WATCHLIST_STORAGE_KEY = 'crypto_dashboard_watchlist';

/**
 * Get list of favorited coin IDs
 * @returns {string[]}
 */
export const getWatchlist = () => {
  try {
    const data = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (!data) return ['bitcoin', 'ethereum', 'solana']; // sensible initial defaults
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading watchlist from localStorage:', err);
    return ['bitcoin', 'ethereum'];
  }
};

/**
 * Save list of favorited coin IDs
 * @param {string[]} list
 */
export const saveWatchlist = (list) => {
  try {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Error saving watchlist to localStorage:', err);
  }
};

/**
 * Toggle coin in watchlist
 * @param {string} coinId
 * @returns {string[]} updated watchlist
 */
export const toggleWatchlistCoin = (coinId) => {
  const current = getWatchlist();
  let updated;
  if (current.includes(coinId)) {
    updated = current.filter((id) => id !== coinId);
  } else {
    updated = [...current, coinId];
  }
  saveWatchlist(updated);
  return updated;
};

