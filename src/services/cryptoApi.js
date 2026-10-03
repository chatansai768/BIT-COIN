import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY || '';

// In-memory cache and in-flight request deduplication map
const apiCache = new Map();
const inFlightRequests = new Map();

/**
 * Configure Axios instance with CoinGecko authentication headers
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
});

// Attach API key header if provided
apiClient.interceptors.request.use((config) => {
  if (API_KEY) {
    if (API_KEY.startsWith('CG-')) {
      // Demo API key header
      config.headers['x-cg-demo-api-key'] = API_KEY;
    } else {
      // Pro API key header
      config.headers['x-cg-pro-api-key'] = API_KEY;
    }
  }
  return config;
});

/**
 * Cached fetch wrapper with TTL and request deduplication
 * @param {string} cacheKey
 * @param {Function} fetcher
 * @param {number} ttlSeconds
 * @returns {Promise<any>}
 */
async function fetchWithCache(cacheKey, fetcher, ttlSeconds = 60) {
  const cached = apiCache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < cached.ttl * 1000) {
    return cached.data;
  }

  // Deduplicate concurrent requests
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const requestPromise = (async () => {
    try {
      const result = await fetcher();
      apiCache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
        ttl: ttlSeconds,
      });
      return result;
    } catch (error) {
      // If rate-limited (429) and we have any stale cached data, return it as fallback
      if (error.response?.status === 429 && cached) {
        console.warn(`[CryptoAPI] Rate limited (429). Serving stale cached data for ${cacheKey}`);
        return cached.data;
      }
      throw error;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, requestPromise);
  return requestPromise;
}

export const cryptoApi = {
  /**
   * Fetch top market coins
   * @param {Object} params
   * @returns {Promise<Array>}
   */
  async getMarkets({
    vs_currency = 'usd',
    per_page = 100,
    page = 1,
    sparkline = true,
  } = {}) {
    const cacheKey = `markets_${vs_currency}_${per_page}_${page}_${sparkline}`;
    return fetchWithCache(
      cacheKey,
      async () => {
        const response = await apiClient.get('/coins/markets', {
          params: {
            vs_currency,
            order: 'market_cap_desc',
            per_page,
            page,
            sparkline,
            price_change_percentage: '1h,24h,7d',
          },
        });
        return response.data;
      },
      60 // 1 minute TTL
    );
  },

  /**
   * Fetch complete coin details
   * @param {string} coinId
   * @returns {Promise<Object>}
   */
  async getCoinDetails(coinId) {
    if (!coinId) throw new Error('Coin ID is required');
    const cacheKey = `coin_details_${coinId}`;
    return fetchWithCache(
      cacheKey,
      async () => {
        const response = await apiClient.get(`/coins/${coinId}`, {
          params: {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
            sparkline: true,
          },
        });
        return response.data;
      },
      180 // 3 minutes TTL
    );
  },

  /**
   * Fetch historical market chart for price graphs
   * @param {string} coinId
   * @param {string} vs_currency
   * @param {string|number} days
   * @returns {Promise<Object>}
   */
  async getCoinMarketChart(coinId, vs_currency = 'usd', days = '7') {
    if (!coinId) throw new Error('Coin ID is required');
    const cacheKey = `chart_${coinId}_${vs_currency}_${days}`;
    return fetchWithCache(
      cacheKey,
      async () => {
        const response = await apiClient.get(`/coins/${coinId}/market_chart`, {
          params: {
            vs_currency,
            days,
          },
        });
        return response.data;
      },
      180 // 3 minutes TTL
    );
  },

  /**
   * Fetch coin data on a specific historical date (dd-mm-yyyy)
   * @param {string} coinId
   * @param {string} dateStr 'dd-mm-yyyy'
   * @returns {Promise<Object>}
   */
  async getHistoricalCoinData(coinId, dateStr) {
    if (!coinId || !dateStr) throw new Error('Coin ID and Date are required');
    const cacheKey = `history_${coinId}_${dateStr}`;
    return fetchWithCache(
      cacheKey,
      async () => {
        const response = await apiClient.get(`/coins/${coinId}/history`, {
          params: {
            date: dateStr,
            localization: false,
          },
        });
        return response.data;
      },
      3600 // 1 hour TTL (historical date data is static)
    );
  },

  /**
   * Search coins by keyword
   * @param {string} query
   * @returns {Promise<Object>}
   */
  async searchCoins(query) {
    if (!query || query.trim() === '') return { coins: [] };
    const cacheKey = `search_${query.trim().toLowerCase()}`;
    return fetchWithCache(
      cacheKey,
      async () => {
        const response = await apiClient.get('/search', {
          params: { query },
        });
        return response.data;
      },
      120 // 2 minutes TTL
    );
  },
};

export default cryptoApi;

