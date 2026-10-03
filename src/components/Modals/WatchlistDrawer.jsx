import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CoinContext } from '../../context/coinConstants';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { X, Star, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import './Modals.css';

const WatchlistDrawer = ({ isOpen, onClose }) => {
  const { allCoins, watchlist, toggleWatchlist, currency } = useContext(CoinContext);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const favoriteCoins = allCoins.filter((coin) => watchlist.includes(coin.id));

  const handleCoinClick = (coinId) => {
    navigate(`/coin/${coinId}`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="watchlist-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <Star size={20} fill="#facc15" color="#facc15" />
            <h2>Your Watchlist</h2>
            <span className="watchlist-count">{watchlist.length}</span>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close watchlist">
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {favoriteCoins.length === 0 ? (
            <div className="watchlist-empty">
              <Star size={44} color="#6b7280" />
              <h3>No saved favorites yet</h3>
              <p>Click the star icon next to any cryptocurrency in the market table to monitor it here.</p>
            </div>
          ) : (
            <div className="watchlist-items-list">
              {favoriteCoins.map((coin) => {
                const change = coin.price_change_percentage_24h ?? 0;
                const isPositive = change >= 0;

                return (
                  <div
                    key={coin.id}
                    className="watchlist-item"
                    onClick={() => handleCoinClick(coin.id)}
                  >
                    <div className="wl-left">
                      <img src={coin.image} alt={coin.name} className="wl-img" />
                      <div className="wl-names">
                        <span className="wl-name">{coin.name}</span>
                        <span className="wl-symbol">{coin.symbol.toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="wl-right">
                      <div className="wl-price-col">
                        <span className="wl-price">
                          {formatCurrency(coin.current_price, currency.symbol)}
                        </span>
                        <span className={`wl-change ${isPositive ? 'positive' : 'negative'}`}>
                          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {formatPercentage(change)}
                        </span>
                      </div>
                      <button
                        className="wl-remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(coin.id);
                        }}
                        title="Remove from watchlist"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {favoriteCoins.length > 0 && (
          <div className="drawer-footer">
            <p>Saved locally in your browser</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistDrawer;
