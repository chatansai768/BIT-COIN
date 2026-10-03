import { X, Zap, Globe, LineChart, Star, Calendar, ShieldCheck } from 'lucide-react';
import './Modals.css';

const FEATURES = [
  {
    icon: Zap,
    title: 'Real-Time Market Data',
    description: 'Track live spot prices, 24h highs & lows, trading volumes, and market cap rankings for top cryptocurrencies.',
  },
  {
    icon: Globe,
    title: 'Multi-Currency Conversion',
    description: 'Switch between USD ($), EUR (€), INR (₹), and GBP (£) seamlessly with dynamic currency conversion.',
  },
  {
    icon: LineChart,
    title: 'Interactive Price Charts',
    description: 'Deep-dive into price actions with interactive Recharts area graphs across 1D, 7D, 30D, 90D, and 1Y timeframes.',
  },
  {
    icon: Star,
    title: 'Persistent Watchlist',
    description: 'Star your favorite coins to monitor them in a dedicated quick-access panel, automatically preserved in localStorage.',
  },
  {
    icon: Calendar,
    title: 'Historical Date Price Engine',
    description: 'Lookup exact cryptocurrency prices on any past date using CoinGecko historical snapshot API.',
  },
  {
    icon: ShieldCheck,
    title: 'API Rate-Limit Resilience',
    description: 'Built-in in-memory caching, request deduplication, and graceful error handling prevent 429 rate limit disruptions.',
  },
];

const FeaturesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content features-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="modal-header">
          <h2>Platform Features</h2>
          <p>Everything you need to track, analyze, and research cryptocurrency markets.</p>
        </div>

        <div className="features-grid">
          {FEATURES.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div key={index} className="feature-card">
                <div className="feature-icon-wrap">
                  <Icon size={22} className="feature-icon" />
                </div>
                <h3>{feat.title}</h3>
                <p>{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturesModal;

