import { useContext, useState, useMemo } from 'react';
import { CoinContext } from '../../context/coinConstants';
import CryptoTable from '../../components/CryptoTable/CryptoTable';
import TableSkeleton from '../../components/Common/LoadingSkeleton';
import ErrorState from '../../components/Common/ErrorState';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { Search, Flame, TrendingUp, Star, Sparkles } from 'lucide-react';
import './Home.css';

const Home = () => {
  const { allCoins, loading, error, refreshData, currency, watchlist } = useContext(CoinContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'top10' | 'watchlist' | 'gainers'
  const [showCount, setShowCount] = useState(25);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  // Quick stats highlights
  const marketHighlights = useMemo(() => {
    if (!allCoins || allCoins.length === 0) return null;

    // Top gainer
    const sortedByGain = [...allCoins].sort(
      (a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
    );
    const topGainer = sortedByGain[0];

    // Top volume
    const sortedByVol = [...allCoins].sort(
      (a, b) => (b.total_volume || 0) - (a.total_volume || 0)
    );
    const topVolume = sortedByVol[0];

    // Bitcoin
    const btc = allCoins.find((c) => c.id === 'bitcoin') || allCoins[0];

    return { topGainer, topVolume, btc };
  }, [allCoins]);

  // Filtered coins based on search and active tab
  const filteredCoins = useMemo(() => {
    if (!allCoins) return [];

    let list = [...allCoins];

    // Apply active category filter
    if (activeFilter === 'top10') {
      list = list.slice(0, 10);
    } else if (activeFilter === 'watchlist') {
      list = list.filter((c) => watchlist.includes(c.id));
    } else if (activeFilter === 'gainers') {
      list = list.filter((c) => (c.price_change_percentage_24h || 0) > 0)
        .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0));
    }

    // Apply search query
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (coin) =>
          coin.name.toLowerCase().includes(q) ||
          coin.symbol.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allCoins, activeFilter, searchTerm, watchlist]);

  return (
    <div className="home">
      {/* Hero Section matching reference exactly */}
      <div className="hero">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>Live CoinGecko Crypto Markets</span>
        </div>

        <h1>
          Largest <br /> Crypto Marketplace
        </h1>

        <p>
          Welcome to the world's largest cryptocurrency marketplace. Sign up to explore more about cryptos.
        </p>

        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search crypto... (e.g. Bitcoin, ETH, SOL)"
              value={searchTerm}
              onChange={handleInputChange}
              list="coinlist"
            />
          </div>
          <datalist id="coinlist">
            {allCoins.slice(0, 20).map((coin) => (
              <option key={coin.id} value={coin.name} />
            ))}
          </datalist>
          <button type="submit">Search</button>
        </form>
      </div>

      {/* Quick Market Highlights Ticker */}
      {marketHighlights && !loading && (
        <div className="market-highlights">
          {marketHighlights.btc && (
            <div className="highlight-card">
              <div className="hl-top">
                <img src={marketHighlights.btc.image} alt="BTC" className="hl-img" />
                <span className="hl-label">Market Leader</span>
              </div>
              <div className="hl-name">{marketHighlights.btc.name} ({marketHighlights.btc.symbol.toUpperCase()})</div>
              <div className="hl-price-row">
                <span className="hl-price">{formatCurrency(marketHighlights.btc.current_price, currency.symbol)}</span>
                <span className={`hl-change ${(marketHighlights.btc.price_change_percentage_24h || 0) >= 0 ? 'pos' : 'neg'}`}>
                  {formatPercentage(marketHighlights.btc.price_change_percentage_24h)}
                </span>
              </div>
            </div>
          )}

          {marketHighlights.topGainer && (
            <div className="highlight-card">
              <div className="hl-top">
                <img src={marketHighlights.topGainer.image} alt="Gainer" className="hl-img" />
                <span className="hl-label">Top 24h Gainer</span>
              </div>
              <div className="hl-name">{marketHighlights.topGainer.name} ({marketHighlights.topGainer.symbol.toUpperCase()})</div>
              <div className="hl-price-row">
                <span className="hl-price">{formatCurrency(marketHighlights.topGainer.current_price, currency.symbol)}</span>
                <span className="hl-change pos">
                  <TrendingUp size={13} />
                  {formatPercentage(marketHighlights.topGainer.price_change_percentage_24h)}
                </span>
              </div>
            </div>
          )}

          {marketHighlights.topVolume && (
            <div className="highlight-card">
              <div className="hl-top">
                <img src={marketHighlights.topVolume.image} alt="Volume" className="hl-img" />
                <span className="hl-label">Top 24h Volume</span>
              </div>
              <div className="hl-name">{marketHighlights.topVolume.name} ({marketHighlights.topVolume.symbol.toUpperCase()})</div>
              <div className="hl-price-row">
                <span className="hl-price">{formatCurrency(marketHighlights.topVolume.current_price, currency.symbol)}</span>
                <span className="hl-vol">Vol: {formatCurrency(marketHighlights.topVolume.total_volume, currency.symbol, 0)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="table-controls">
        <div className="table-tabs">
          <button
            className={`tab-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Cryptos
          </button>
          <button
            className={`tab-btn ${activeFilter === 'top10' ? 'active' : ''}`}
            onClick={() => setActiveFilter('top10')}
          >
            Top 10
          </button>
          <button
            className={`tab-btn ${activeFilter === 'gainers' ? 'active' : ''}`}
            onClick={() => setActiveFilter('gainers')}
          >
            <Flame size={14} />
            Top Gainers
          </button>
          <button
            className={`tab-btn ${activeFilter === 'watchlist' ? 'active' : ''}`}
            onClick={() => setActiveFilter('watchlist')}
          >
            <Star size={14} />
            Watchlist ({watchlist.length})
          </button>
        </div>

        <div className="table-meta-count">
          Showing {Math.min(showCount, filteredCoins.length)} of {filteredCoins.length} coins
        </div>
      </div>

      {/* Main Table or Loading/Error State */}
      {loading ? (
        <div className="crypto-table-container">
          <div className="crypto-table">
            <TableSkeleton rows={10} />
          </div>
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refreshData} />
      ) : (
        <>
          <CryptoTable coins={filteredCoins} maxDisplay={showCount} />

          {/* Show more/less pagination control */}
          {filteredCoins.length > 25 && (
            <div className="table-pagination">
              {showCount < filteredCoins.length ? (
                <button
                  className="load-more-btn"
                  onClick={() => setShowCount((prev) => Math.min(prev + 25, filteredCoins.length))}
                >
                  Show More Cryptos ({filteredCoins.length - showCount} remaining)
                </button>
              ) : (
                <button
                  className="load-more-btn secondary"
                  onClick={() => setShowCount(25)}
                >
                  Show Less (Top 25)
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
