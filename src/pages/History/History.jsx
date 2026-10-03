import { useContext, useState, useEffect } from 'react';
import { CoinContext } from '../../context/coinConstants';
import cryptoApi from '../../services/cryptoApi';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { History, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import './History.css';

// Reverses YYYY-MM-DD to DD-MM-YYYY for CoinGecko history API
const formatToGeckoDate = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.split('-').reverse().join('-');
};

const POPULAR_COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
];

// Calculated at module level to avoid impure calls during render
const ONE_DAY_MS = 86400000;
const YESTERDAY_DATE = new Date(Date.now() - ONE_DAY_MS);
const YESTERDAY_STR = YESTERDAY_DATE.toISOString().split('T')[0];
// CoinGecko demo API allows up to 365 days past
const MIN_DATE = new Date(Date.now() - 364 * ONE_DAY_MS);
const MIN_DATE_STR = MIN_DATE.toISOString().split('T')[0];

const HistoryPage = () => {
  const { currency, allCoins } = useContext(CoinContext);
  const [selectedCoinId, setSelectedCoinId] = useState('bitcoin');

  // Initialize date lazily to 30 days ago for immediate successful lookup
  const [date, setDate] = useState(() => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * ONE_DAY_MS);
    return thirtyDaysAgo.toISOString().split('T')[0];
  });

  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!date) return;

    let isMounted = true;
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const geckoDate = formatToGeckoDate(date);
        const data = await cryptoApi.getHistoricalCoinData(selectedCoinId, geckoDate);
        if (!isMounted) return;

        if (data?.error) {
          const errMsg = typeof data.error === 'object' && data.error?.status?.error_message
            ? data.error.status.error_message
            : 'Historical data request exceeds allowed range. Please select a date within the last 365 days.';
          setError(errMsg);
          setHistoryData(null);
          return;
        }

        setHistoryData(data);
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to fetch historical data:', err);
        const serverMsg = err.response?.data?.status?.error_message;
        setError(
          serverMsg ||
          (err.response?.status === 429
            ? 'CoinGecko API rate limit reached. Please wait a moment and try again.'
            : 'Historical data is unavailable for this date. Please select a date within the last 365 days.')
        );
        setHistoryData(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, [date, selectedCoinId]);

  // Current price today from allCoins
  const currentCoinInfo = allCoins.find((c) => c.id === selectedCoinId);
  const currentPrice = currentCoinInfo?.current_price;

  // Historical price on selected date
  const histPrice = historyData?.market_data?.current_price?.[currency.name];
  const histMarketCap = historyData?.market_data?.market_cap?.[currency.name];
  const histVolume = historyData?.market_data?.total_volume?.[currency.name];

  // ROI / Change between that date and today
  const roi =
    histPrice && currentPrice
      ? ((currentPrice - histPrice) / histPrice) * 100
      : null;

  const setPresetDate = (daysAgo) => {
    const target = new Date(Date.now() - daysAgo * ONE_DAY_MS);
    setDate(target.toISOString().split('T')[0]);
  };

  return (
    <div className="history-page">
      <div className="history-hero">
        <div className="history-badge">
          <History size={16} />
          <span>Historical Price Engine</span>
        </div>
        <h1>Cryptocurrency Historical Data</h1>
        <p>
          Pick any date in the past year to look up historical snapshot prices, market cap, and calculate ROI against today's live price.
        </p>
      </div>

      <div className="history-coin-parent">
        <div className="history-controls-card">
          <div className="controls-row">
            {/* Coin selector */}
            <div className="control-group">
              <label>Select Cryptocurrency</label>
              <select
                value={selectedCoinId}
                onChange={(e) => setSelectedCoinId(e.target.value)}
                className="coin-select"
              >
                {POPULAR_COINS.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Date picker */}
            <div className="control-group">
              <label>Select Past Date (Past 365 Days)</label>
              <input
                type="date"
                value={date}
                min={MIN_DATE_STR}
                max={YESTERDAY_STR}
                onChange={(e) => setDate(e.target.value)}
                className="date-input"
              />
            </div>
          </div>

          {/* Quick presets within 365 days */}
          <div className="presets-row">
            <span className="preset-label">Quick Presets:</span>
            <button type="button" onClick={() => setPresetDate(7)}>7 Days Ago</button>
            <button type="button" onClick={() => setPresetDate(14)}>14 Days Ago</button>
            <button type="button" onClick={() => setPresetDate(30)}>1 Month Ago</button>
            <button type="button" onClick={() => setPresetDate(90)}>3 Months Ago</button>
            <button type="button" onClick={() => setPresetDate(180)}>6 Months Ago</button>
            <button type="button" onClick={() => setPresetDate(360)}>1 Year Ago</button>
          </div>
        </div>

        {/* Results matching reference .history-coin */}
        <div className="history-coin">
          {loading ? (
            <div className="history-loading">
              <div className="coin-spin"></div>
              <p>Fetching historical snapshot from CoinGecko...</p>
            </div>
          ) : error ? (
            <div className="history-error">
              <AlertCircle size={28} className="error-icon" />
              <p>{error}</p>
            </div>
          ) : !date ? (
            <div className="coin-info">
              <h2 className="no-data">Select the date to view historical price</h2>
            </div>
          ) : histPrice ? (
            <div className="coin-info">
              <div className="history-result-header">
                {historyData.image?.small && (
                  <img src={historyData.image.small} alt={historyData.name} className="hist-coin-img" />
                )}
                <div>
                  <h1 className="coin-name">{historyData.name}</h1>
                  <span className="hist-symbol">{historyData.symbol?.toUpperCase()}</span>
                </div>
              </div>

              <div className="history-price-banner">
                <span className="hp-label">Price on {date}:</span>
                <span className="coin-price">
                  {formatCurrency(histPrice, currency.symbol)}
                </span>
              </div>

              {/* Comparison with today */}
              {currentPrice && roi !== null && (
                <div className="history-comparison-card">
                  <div className="comp-item">
                    <span className="comp-label">Today's Live Price:</span>
                    <span className="comp-val">{formatCurrency(currentPrice, currency.symbol)}</span>
                  </div>
                  <div className="comp-item">
                    <span className="comp-label">Change Since {date}:</span>
                    <span className={`comp-val ${roi >= 0 ? 'pos' : 'neg'}`}>
                      {roi >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {formatPercentage(roi)}
                    </span>
                  </div>
                </div>
              )}

              {/* Secondary historical metrics */}
              <div className="history-metrics-grid">
                {histMarketCap && (
                  <div className="metric-box">
                    <span className="metric-label">Historical Market Cap</span>
                    <span className="metric-val">{formatCurrency(histMarketCap, currency.symbol, 0)}</span>
                  </div>
                )}
                {histVolume && (
                  <div className="metric-box">
                    <span className="metric-label">Historical 24h Volume</span>
                    <span className="metric-val">{formatCurrency(histVolume, currency.symbol, 0)}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="coin-info">
              <h2 className="no-data">No price records found for this cryptocurrency on {date}.</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;

