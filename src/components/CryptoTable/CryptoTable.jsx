import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CoinContext } from '../../context/coinConstants';
import { formatCurrency, formatCompactNumber, formatPercentage } from '../../utils/formatters';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import './CryptoTable.css';

const CryptoTable = ({ coins, maxDisplay = null }) => {
  const { currency, toggleWatchlist, isFavorite } = useContext(CoinContext);
  const navigate = useNavigate();

  const displayedList = maxDisplay ? coins.slice(0, maxDisplay) : coins;

  const handleRowClick = (coinId) => {
    navigate(`/coin/${coinId}`);
  };

  const handleStarClick = (e, coinId) => {
    e.stopPropagation(); // prevent navigation
    toggleWatchlist(coinId);
  };

  if (!coins || coins.length === 0) {
    return (
      <div className="empty-table-state">
        <p>No cryptocurrencies match your search.</p>
      </div>
    );
  }

  return (
    <div className="crypto-table-container">
      <div className="crypto-table">
        <table>
          <thead>
            <tr>
              <th className="th-favorite"></th>
              <th className="th-rank">#</th>
              <th className="th-coin">Coins</th>
              <th className="th-price">Price</th>
              <th className="th-change">24H Change</th>
              <th className="th-marketcap">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {displayedList.map((coin, index) => {
              const favorited = isFavorite(coin.id);
              const change24h = coin.price_change_percentage_24h ?? 0;
              const isPositive = change24h >= 0;

              return (
                <tr
                  key={coin.id}
                  onClick={() => handleRowClick(coin.id)}
                  className="crypto-row"
                >
                  {/* Favorite toggle star */}
                  <td className="td-favorite" onClick={(e) => handleStarClick(e, coin.id)}>
                    <button
                      className={`star-btn ${favorited ? 'active' : ''}`}
                      aria-label={`Favorite ${coin.name}`}
                    >
                      <Star
                        size={16}
                        fill={favorited ? '#facc15' : 'transparent'}
                        color={favorited ? '#facc15' : '#6b7280'}
                      />
                    </button>
                  </td>

                  {/* Rank */}
                  <td className="td-rank">
                    {coin.market_cap_rank || index + 1}
                  </td>

                  {/* Coin Logo & Name & Symbol */}
                  <td className="td-coin">
                    <div className="coin-cell">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="coin-img"
                        loading="lazy"
                      />
                      <div className="coin-names">
                        <span className="coin-name">{coin.name}</span>
                        <span className="coin-symbol">{coin.symbol.toUpperCase()}</span>
                      </div>
                    </div>
                  </td>

                  {/* Current Price */}
                  <td className="td-price">
                    {formatCurrency(coin.current_price, currency.symbol)}
                  </td>

                  {/* 24H Change */}
                  <td className={`td-change ${isPositive ? 'positive' : 'negative'}`}>
                    <div className="change-cell">
                      {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      <span>{formatPercentage(change24h)}</span>
                    </div>
                  </td>

                  {/* Market Cap */}
                  <td className="td-marketcap">
                    <span className="marketcap-desktop">
                      {formatCurrency(coin.market_cap, currency.symbol, 0)}
                    </span>
                    <span className="marketcap-mobile">
                      {formatCompactNumber(coin.market_cap, currency.symbol)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoTable;
