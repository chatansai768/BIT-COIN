import { useState, useEffect, useCallback } from 'react';
import cryptoApi from '../services/cryptoApi';
import { getWatchlist, toggleWatchlistCoin } from '../utils/storage';
import { CoinContext, CURRENCIES } from './coinConstants';

export const CoinContextProvider = ({ children }) => {
  const [allCoins, setAllCoins] = useState([]);
  const [currency, setCurrencyState] = useState(CURRENCIES.usd);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchlist, setWatchlist] = useState(() => getWatchlist());
  const [activeModal, setActiveModal] = useState(null);

  // Change currency helper
  const setCurrency = useCallback((newCurr) => {
    if (typeof newCurr === 'string') {
      const found = CURRENCIES[newCurr.toLowerCase()];
      if (found) setCurrencyState(found);
    } else if (newCurr && newCurr.name) {
      const key = newCurr.name.toLowerCase();
      setCurrencyState(CURRENCIES[key] || { name: key, symbol: newCurr.symbol || '$', label: key.toUpperCase() });
    }
  }, []);

  // Fetch market coins
  const fetchCoins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cryptoApi.getMarkets({
        vs_currency: currency.name,
        per_page: 100,
        page: 1,
        sparkline: true,
      });
      setAllCoins(data || []);
    } catch (err) {
      console.error('Failed to fetch market coins:', err);
      let errMsg = 'Failed to load cryptocurrency data.';
      if (err.response?.status === 429) {
        errMsg = 'CoinGecko API rate limit reached. Please wait a moment and click Retry.';
      } else if (!navigator.onLine) {
        errMsg = 'No internet connection. Please check your network.';
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, [currency.name]);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const data = await cryptoApi.getMarkets({
          vs_currency: currency.name,
          per_page: 100,
          page: 1,
          sparkline: true,
        });
        if (!ignore) {
          setAllCoins(data || []);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Failed to fetch market coins:', err);
          let errMsg = 'Failed to load cryptocurrency data.';
          if (err.response?.status === 429) {
            errMsg = 'CoinGecko API rate limit reached. Please wait a moment and click Retry.';
          } else if (!navigator.onLine) {
            errMsg = 'No internet connection. Please check your network.';
          }
          setError(errMsg);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [currency.name]);

  // Watchlist handlers
  const toggleWatchlist = (coinId) => {
    const updated = toggleWatchlistCoin(coinId);
    setWatchlist(updated);
  };

  const isFavorite = (coinId) => watchlist.includes(coinId);

  // Modal handlers
  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  const contextValue = {
    allCoins,
    coins: allCoins,
    currency,
    setCurrency,
    loading,
    error,
    watchlist,
    toggleWatchlist,
    isFavorite,
    refreshData: fetchCoins,
    activeModal,
    openModal,
    closeModal,
  };

  return (
    <CoinContext.Provider value={contextValue}>
      {children}
    </CoinContext.Provider>
  );
};

export default CoinContextProvider;

