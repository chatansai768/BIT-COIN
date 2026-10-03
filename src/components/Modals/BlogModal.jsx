import { X, Clock } from 'lucide-react';
import './Modals.css';

const ARTICLES = [
  {
    title: 'Understanding Bitcoin Halving & Market Cycles',
    category: 'Analysis',
    readTime: '4 min read',
    snippet: 'How the 4-year block reward halving mechanism shapes long-term supply dynamics and macroeconomic liquidity trends.',
    date: 'Sep 2024',
  },
  {
    title: 'Ethereum Layer 2 Ecosystem: Arbitrum, Optimism & Base',
    category: 'Technology',
    readTime: '6 min read',
    snippet: 'A deep dive into zero-knowledge rollups, optimistic rollups, and how scaling solutions reduce gas fees while preserving decentralization.',
    date: 'Sep 2024',
  },
  {
    title: 'DeFi Risk Management: Liquidity Pools & Impermanent Loss',
    category: 'Guide',
    readTime: '5 min read',
    snippet: 'Essential practices for liquidity providers, yield farmers, and token holders navigating automated market maker (AMM) protocols.',
    date: 'Aug 2024',
  },
  {
    title: 'Reading Candlestick & Volume Charts for Beginners',
    category: 'Trading',
    readTime: '7 min read',
    snippet: 'Master key chart patterns, support and resistance levels, and volume indicators to make informed market decisions.',
    date: 'Aug 2024',
  },
];

const BlogModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content blog-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="modal-header">
          <h2>Crypto Knowledge & Insights</h2>
          <p>Educational guides, deep dives, and market analysis curated for traders and developers.</p>
        </div>

        <div className="blog-list">
          {ARTICLES.map((article, index) => (
            <div key={index} className="blog-card">
              <div className="blog-meta">
                <span className="blog-category">{article.category}</span>
                <span className="blog-time">
                  <Clock size={12} />
                  {article.readTime}
                </span>
                <span className="blog-date">{article.date}</span>
              </div>
              <h3 className="blog-title">{article.title}</h3>
              <p className="blog-snippet">{article.snippet}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogModal;

