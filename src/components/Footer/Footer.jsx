import { useContext } from 'react';
import { CoinContext } from '../../context/coinConstants';
import { Coins } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const { openModal } = useContext(CoinContext);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <Coins size={22} className="footer-icon" />
            <span>Crypto<span className="logo-accent">Place</span></span>
          </div>
          <p className="footer-tagline">
            Real-time cryptocurrency market data, live charts, and historical insights powered by CoinGecko API.
          </p>
        </div>

        <div className="footer-links-group">
          <div className="footer-col">
            <h4>Platform</h4>
            <span onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Markets</span>
            <span onClick={() => openModal('features')}>Features</span>
            <span onClick={() => openModal('watchlist')}>Watchlist</span>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <span onClick={() => openModal('blog')}>Crypto Blog</span>
            <span onClick={() => openModal('features')}>API Docs</span>
            <a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer">CoinGecko API</a>
          </div>

          <div className="footer-col">
            <h4>Community</h4>
            <span onClick={() => openModal('auth')}>Create Account</span>
            <span onClick={() => openModal('auth')}>Sign In</span>
            <span>Newsletter</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright © {new Date().getFullYear()}, CryptoPlace — All Rights Reserved.</p>
        <p className="footer-credit">
          Data provided by CoinGecko • Built with React & Recharts
        </p>
      </div>
    </footer>
  );
};

export default Footer;
