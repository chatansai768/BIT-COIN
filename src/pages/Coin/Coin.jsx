import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CoinContext } from '../../context/coinConstants';
import cryptoApi from '../../services/cryptoApi';
import PriceChart from '../../components/PriceChart/PriceChart';
import ErrorState from '../../components/Common/ErrorState';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import {
  ArrowLeft,
  Star,
  ExternalLink,
  Globe,
  TrendingUp,
  TrendingDown,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import './Coin.css';

const Coin = () => {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const { currency, isFavorite, toggleWatchlist, allCoins } = useContext(CoinContext);

  const [coinData, setCoinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [descExpanded, setDescExpanded] = useState(false);

  const favorited = isFavorite(coinId);

  useEffect(() => {
    let isMounted = true;

    const fetchCoin = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cryptoApi.getCoinDetails(coinId);
        if (!isMounted) return;
        setCoinData(data);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching coin details:', err);

        // Fallback: check if we have this coin in allCoins from markets
        const fallbackMarketCoin = allCoins.find((c) => c.id === coinId);
        if (fallbackMarketCoin) {
          // Construct minimal coinData object from market coin
          setCoinData({
            id: fallbackMarketCoin.id,
            name: fallbackMarketCoin.name,
            symbol: fallbackMarketCoin.symbol,
            image: { large: fallbackMarketCoin.image, small: fallbackMarketCoin.image },
            market_cap_rank: fallbackMarketCoin.market_cap_rank,
            description: { en: `${fallbackMarketCoin.name} is a decentralized digital asset.` },
            links: { homepage: [''], blockchain_site: [''] },
            market_data: {
              current_price: { [currency.name]: fallbackMarketCoin.current_price },
              market_cap: { [currency.name]: fallbackMarketCoin.market_cap },
              high_24h: { [currency.name]: fallbackMarketCoin.high_24h },
              low_24h: { [currency.name]: fallbackMarketCoin.low_24h },
              total_volume: { [currency.name]: fallbackMarketCoin.total_volume },
              price_change_percentage_24h: fallbackMarketCoin.price_change_percentage_24h,
              price_change_percentage_7d: 0,
              circulating_supply: fallbackMarketCoin.circulating_supply,
              total_supply: fallbackMarketCoin.total_supply,
              max_supply: fallbackMarketCoin.max_supply,
              ath: { [currency.name]: fallbackMarketCoin.ath || fallbackMarketCoin.current_price * 1.2 },
              ath_change_percentage: { [currency.name]: fallbackMarketCoin.ath_change_percentage || -15 },
              ath_date: { [currency.name]: fallbackMarketCoin.ath_date || '' },
              atl: { [currency.name]: fallbackMarketCoin.atl || fallbackMarketCoin.current_price * 0.1 },
              atl_change_percentage: { [currency.name]: fallbackMarketCoin.atl_change_percentage || 500 },
              atl_date: { [currency.name]: fallbackMarketCoin.atl_date || '' },
            },
          });
        } else {
          setError(
            err.response?.status === 429
              ? 'CoinGecko API rate limit reached. Please wait a few seconds and retry.'
              : 'Failed to retrieve coin information.'
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCoin();

    return () => {
      isMounted = false;
    };
  }, [coinId, currency.name, allCoins]);

  if (loading) {
    return (
      <div className="coin-page">
        <div className="coin-spinner-wrap">
          <div className="coin-spin"></div>
          <p>Loading coin data...</p>
        </div>
      </div>
    );
  }

  if (error && !coinData) {
    return (
      <div className="coin-page">
        <div className="coin-top-nav">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={18} />
            <span>Back to Markets</span>
          </button>
        </div>
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!coinData || !coinData.market_data) {
    return (
      <div className="coin-page">
        <div className="coin-top-nav">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={18} />
            <span>Back to Markets</span>
          </button>
        </div>
        <p className="not-found-text">Cryptocurrency data not found.</p>
      </div>
    );
  }

  const curr = currency.name;
  const currentPrice = coinData.market_data.current_price?.[curr] ?? 0;
  const change24h = coinData.market_data.price_change_percentage_24h ?? 0;
  const isPositive = change24h >= 0;
  const marketCap = coinData.market_data.market_cap?.[curr] ?? 0;
  const high24 = coinData.market_data.high_24h?.[curr] ?? 0;
  const low24 = coinData.market_data.low_24h?.[curr] ?? 0;
  const volume24 = coinData.market_data.total_volume?.[curr] ?? 0;
  const ath = coinData.market_data.ath?.[curr] ?? 0;
  const athChange = coinData.market_data.ath_change_percentage?.[curr] ?? 0;
  const atl = coinData.market_data.atl?.[curr] ?? 0;
  const atlChange = coinData.market_data.atl_change_percentage?.[curr] ?? 0;
  const circSupply = coinData.market_data.circulating_supply;
  const totalSupply = coinData.market_data.total_supply;

  // Supply percentage
  const supplyPct = totalSupply && circSupply ? Math.min(100, (circSupply / totalSupply) * 100) : null;

  // Clean description text
  const cleanDescription = coinData.description?.en
    ? coinData.description.en.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '$1')
    : '';

  return (
    <div className="coin-page">
      {/* Top back nav & favorite */}
      <div className="coin-top-nav">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
          <span>Back to Markets</span>
        </button>

        <button
          className={`favorite-action-btn ${favorited ? 'active' : ''}`}
          onClick={() => toggleWatchlist(coinData.id)}
        >
          <Star size={18} fill={favorited ? '#facc15' : 'transparent'} color={favorited ? '#facc15' : '#9ca3af'} />
          <span>{favorited ? 'In Watchlist' : 'Add to Watchlist'}</span>
        </button>
      </div>

      {/* Coin Hero Header */}
      <div className="coin-header">
        <div className="coin-title-row">
          <img
            src={coinData.image?.large || coinData.image?.small}
            alt={coinData.name}
            className="coin-detail-img"
          />
          <div className="coin-title-info">
            <div className="coin-name-wrap">
              <h1>{coinData.name}</h1>
              <span className="coin-symbol-tag">{coinData.symbol.toUpperCase()}</span>
              {coinData.market_cap_rank && (
                <span className="rank-badge">Rank #{coinData.market_cap_rank}</span>
              )}
            </div>
            <div className="coin-price-wrap">
              <span className="coin-main-price">
                {formatCurrency(currentPrice, currency.symbol)}
              </span>
              <span className={`price-badge ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {formatPercentage(change24h)} (24h)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Price Chart with Timeframes */}
      <PriceChart coinId={coinData.id} currency={currency} />

      {/* Market Statistics matching reference structure (.coin-parent and .coin-row) */}
      <div className="coin-stats-section">
        <h2 className="section-heading">Market Statistics</h2>

        <div className="coin-parent">
          <div className="coin-row">
            <p>Crypto Market Rank</p>
            <p className="coin-val">#{coinData.market_cap_rank || 'N/A'}</p>
          </div>
          <div className="coin-row">
            <p>Current Price</p>
            <p className="coin-val">{formatCurrency(currentPrice, currency.symbol)}</p>
          </div>
          <div className="coin-row">
            <p>Market Cap</p>
            <p className="coin-val">{formatCurrency(marketCap, currency.symbol, 0)}</p>
          </div>
          <div className="coin-row">
            <p>24 Hour High</p>
            <p className="coin-val pos-text">{formatCurrency(high24, currency.symbol)}</p>
          </div>
          <div className="coin-row">
            <p>24 Hour Low</p>
            <p className="coin-val neg-text">{formatCurrency(low24, currency.symbol)}</p>
          </div>
          <div className="coin-row">
            <p>24 Hour Trading Volume</p>
            <p className="coin-val">{formatCurrency(volume24, currency.symbol, 0)}</p>
          </div>
          <div className="coin-row">
            <p>All-Time High (ATH)</p>
            <p className="coin-val">
              {formatCurrency(ath, currency.symbol)}{' '}
              <span className="sub-stat neg-text">({athChange.toFixed(1)}%)</span>
            </p>
          </div>
          <div className="coin-row">
            <p>All-Time Low (ATL)</p>
            <p className="coin-val">
              {formatCurrency(atl, currency.symbol)}{' '}
              <span className="sub-stat pos-text">(+{atlChange.toFixed(0)}%)</span>
            </p>
          </div>
          <div className="coin-row">
            <p>Circulating Supply</p>
            <p className="coin-val">
              {circSupply ? circSupply.toLocaleString() : 'N/A'} {coinData.symbol.toUpperCase()}
            </p>
          </div>
          {totalSupply && (
            <div className="coin-row">
              <p>Total Supply</p>
              <p className="coin-val">
                {totalSupply.toLocaleString()} {coinData.symbol.toUpperCase()}
              </p>
            </div>
          )}
        </div>

        {/* Supply Progress Bar */}
        {supplyPct !== null && (
          <div className="supply-bar-wrap">
            <div className="supply-bar-labels">
              <span>Circulating Supply</span>
              <span>{supplyPct.toFixed(1)}%</span>
            </div>
            <div className="supply-progress-bg">
              <div className="supply-progress-fill" style={{ width: `${supplyPct}%` }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Description & Links */}
      {cleanDescription && (
        <div className="coin-about-section">
          <h2 className="section-heading">About {coinData.name}</h2>
          <div className={`about-text ${descExpanded ? 'expanded' : 'collapsed'}`}>
            <p>{cleanDescription}</p>
          </div>
          {cleanDescription.length > 300 && (
            <button
              className="toggle-desc-btn"
              onClick={() => setDescExpanded(!descExpanded)}
            >
              <span>{descExpanded ? 'Show Less' : 'Read Full Description'}</span>
              {descExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}

          {/* Official External Links */}
          {coinData.links && (
            <div className="coin-links">
              {coinData.links.homepage?.[0] && (
                <a
                  href={coinData.links.homepage[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="coin-link-pill"
                >
                  <Globe size={14} />
                  <span>Official Website</span>
                  <ExternalLink size={12} />
                </a>
              )}
              {coinData.links.blockchain_site?.[0] && (
                <a
                  href={coinData.links.blockchain_site[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="coin-link-pill"
                >
                  <Layers size={14} />
                  <span>Blockchain Explorer</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Coin;
